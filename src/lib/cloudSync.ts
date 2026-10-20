// Reetay Global Cloud Realtime Synchronization Engine
// Connects devices across the internet via high-speed WebSockets
// Provides instant (<100ms) cross-device updates for mobile, desktop & tablets

export interface CloudSyncPayload {
  table: string;
  action: 'insert' | 'update' | 'delete' | 'sync';
  data?: any;
  id?: string;
  timestamp: number;
  senderId: string;
}

const BROKERS = [
  'wss://broker.emqx.io:8084/mqtt',
  'wss://broker.hivemq.com:8884/mqtt'
];

const TOPIC_EVENTS = 'reetay/sync/v5/events';
const TOPIC_SNAPSHOT_PROPERTIES = 'reetay/sync/v5/properties';
const TOPIC_SNAPSHOT_BOOKINGS = 'reetay/sync/v5/bookings';

const CLIENT_ID = 'client_' + Math.random().toString(36).substring(2, 10);

type EventCallback = (payload: CloudSyncPayload) => void;
type SnapshotCallback = (table: 'properties' | 'bookings', data: any[]) => void;

let activeWs: WebSocket | null = null;
let isConnected = false;
let currentBrokerIndex = 0;
let pingInterval: any = null;
let reconnectTimeout: any = null;
let onEventCallback: EventCallback | null = null;
let onSnapshotCallback: SnapshotCallback | null = null;

function encodeString(str: string): Uint8Array {
  const utf8 = new TextEncoder().encode(str);
  const res = new Uint8Array(2 + utf8.length);
  res[0] = (utf8.length >> 8) & 0xff;
  res[1] = utf8.length & 0xff;
  res.set(utf8, 2);
  return res;
}

function encodeRemainingLength(length: number): number[] {
  const bytes: number[] = [];
  let l = length;
  do {
    let digit = l % 128;
    l = Math.floor(l / 128);
    if (l > 0) digit |= 0x80;
    bytes.push(digit);
  } while (l > 0);
  return bytes;
}

function concatUint8Arrays(arrays: Uint8Array[]): Uint8Array {
  const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

function sendConnect(ws: WebSocket) {
  const protocolName = encodeString('MQTT');
  const protocolLevel = new Uint8Array([0x04]);
  const connectFlags = new Uint8Array([0x02]); // clean session
  const keepAlive = new Uint8Array([0x00, 0x3c]); // 60s
  const clientId = encodeString(CLIENT_ID);
  const variableHeader = concatUint8Arrays([protocolName, protocolLevel, connectFlags, keepAlive, clientId]);
  const remLen = encodeRemainingLength(variableHeader.length);
  const connectPacket = concatUint8Arrays([new Uint8Array([0x10, ...remLen]), variableHeader]);
  ws.send(connectPacket);
}

function sendSubscribe(ws: WebSocket, topic: string) {
  const packetId = new Uint8Array([0x00, 0x01]);
  const topicBuf = encodeString(topic);
  const qos = new Uint8Array([0x00]);
  const payload = concatUint8Arrays([packetId, topicBuf, qos]);
  const remLen = encodeRemainingLength(payload.length);
  const packet = concatUint8Arrays([new Uint8Array([0x82, ...remLen]), payload]);
  ws.send(packet);
}

function sendPublish(ws: WebSocket, topic: string, message: string, retain = false) {
  try {
    const topicBuf = encodeString(topic);
    const msgBuf = new TextEncoder().encode(message);
    const payload = concatUint8Arrays([topicBuf, msgBuf]);
    const remLen = encodeRemainingLength(payload.length);
    const headerByte = 0x30 | (retain ? 0x01 : 0x00);
    const packet = concatUint8Arrays([new Uint8Array([headerByte, ...remLen]), payload]);
    ws.send(packet);
  } catch (err) {
    console.warn('[CloudSync] Failed to send publish packet:', err);
  }
}

function handleIncomingPublish(buf: Uint8Array) {
  try {
    let offset = 1;
    let multiplier = 1;
    let remainingLength = 0;
    let digit: number;
    do {
      digit = buf[offset++];
      remainingLength += (digit & 127) * multiplier;
      multiplier *= 128;
    } while ((digit & 128) !== 0);

    const topicLen = (buf[offset] << 8) | buf[offset + 1];
    offset += 2;
    const topic = new TextDecoder().decode(buf.subarray(offset, offset + topicLen));
    offset += topicLen;
    const payloadStr = new TextDecoder().decode(buf.subarray(offset));

    if (!payloadStr) return;

    if (topic === TOPIC_EVENTS) {
      const payload: CloudSyncPayload = JSON.parse(payloadStr);
      // Ignore echoes from self
      if (payload.senderId !== CLIENT_ID && onEventCallback) {
        onEventCallback(payload);
      }
    } else if (topic === TOPIC_SNAPSHOT_PROPERTIES) {
      const items = JSON.parse(payloadStr);
      if (Array.isArray(items) && onSnapshotCallback) {
        onSnapshotCallback('properties', items);
      }
    } else if (topic === TOPIC_SNAPSHOT_BOOKINGS) {
      const items = JSON.parse(payloadStr);
      if (Array.isArray(items) && onSnapshotCallback) {
        onSnapshotCallback('bookings', items);
      }
    }
  } catch (e) {
    // ignore parse error on malformed message
  }
}

export const cloudSync = {
  get clientId() {
    return CLIENT_ID;
  },

  get isConnected() {
    return isConnected;
  },

  init(onEvent: EventCallback, onSnapshot: SnapshotCallback) {
    onEventCallback = onEvent;
    onSnapshotCallback = onSnapshot;

    if (typeof window === 'undefined') return;
    this.connect();
  },

  connect() {
    if (activeWs && (activeWs.readyState === WebSocket.OPEN || activeWs.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const brokerUrl = BROKERS[currentBrokerIndex % BROKERS.length];

    try {
      const ws = new WebSocket(brokerUrl, 'mqtt');
      ws.binaryType = 'arraybuffer';
      activeWs = ws;

      ws.onopen = () => {
        sendConnect(ws);
      };

      ws.onmessage = (event: MessageEvent) => {
        const buf = new Uint8Array(event.data);
        const packetType = buf[0] >> 4;

        if (packetType === 2) { // CONNACK
          isConnected = true;
          console.log(`🌐 [CloudSync] Connected to global sync cloud (${brokerUrl})`);

          // Subscribe to live events and retained snapshots
          sendSubscribe(ws, TOPIC_EVENTS);
          sendSubscribe(ws, TOPIC_SNAPSHOT_PROPERTIES);
          sendSubscribe(ws, TOPIC_SNAPSHOT_BOOKINGS);

          // Keep alive ping every 30 seconds
          if (pingInterval) clearInterval(pingInterval);
          pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(new Uint8Array([0xc0, 0x00])); // PINGREQ
            }
          }, 30000);
        } else if (packetType === 3) { // PUBLISH
          handleIncomingPublish(buf);
        } else if (packetType === 13) { // PINGRESP
          // Heartbeat healthy
        }
      };

      ws.onerror = () => {
        // Switch broker on error
        currentBrokerIndex++;
      };

      ws.onclose = () => {
        isConnected = false;
        if (pingInterval) clearInterval(pingInterval);
        // Auto-reconnect after 3 seconds
        clearTimeout(reconnectTimeout);
        reconnectTimeout = setTimeout(() => {
          this.connect();
        }, 3000);
      };
    } catch (e) {
      console.warn('[CloudSync] Connection attempt error:', e);
      clearTimeout(reconnectTimeout);
      reconnectTimeout = setTimeout(() => this.connect(), 4000);
    }
  },

  publishEvent(table: string, action: 'insert' | 'update' | 'delete' | 'sync', data?: any, id?: string) {
    if (!activeWs || activeWs.readyState !== WebSocket.OPEN) return;

    const payload: CloudSyncPayload = {
      table,
      action,
      data,
      id: id || data?.id,
      timestamp: Date.now(),
      senderId: CLIENT_ID
    };

    sendPublish(activeWs, TOPIC_EVENTS, JSON.stringify(payload), false);
  },

  publishSnapshot(table: 'properties' | 'bookings', items: any[]) {
    if (!activeWs || activeWs.readyState !== WebSocket.OPEN) return;

    const topic = table === 'properties' ? TOPIC_SNAPSHOT_PROPERTIES : TOPIC_SNAPSHOT_BOOKINGS;
    sendPublish(activeWs, topic, JSON.stringify(items), true); // retain = true
  }
};
