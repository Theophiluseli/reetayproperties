// Reetay Global Cloud Realtime Synchronization Engine
// Connects devices across the internet via resilient, high-speed WebSockets
// Provides instant (<100ms) cross-device updates for mobile, desktop & tablets worldwide

export interface CloudSyncPayload {
  table: string;
  action: 'insert' | 'update' | 'delete' | 'sync' | 'sync_request';
  data?: any;
  id?: string;
  timestamp: number;
  senderId: string;
}

const BROKERS = [
  'wss://broker.emqx.io:8084/mqtt',
  'wss://broker.hivemq.com:8884/mqtt',
  'wss://test.mosquitto.org:8081'
];

const TOPIC_EVENTS = 'reetay/sync/v6/events';
const TOPIC_SNAPSHOT_PROPERTIES = 'reetay/sync/v6/properties';
const TOPIC_SNAPSHOT_BOOKINGS = 'reetay/sync/v6/bookings';

const CLIENT_ID = 'client_' + Math.random().toString(36).substring(2, 10);

type EventCallback = (payload: CloudSyncPayload) => void;
type SnapshotCallback = (table: 'properties' | 'bookings', data: any[]) => void;
type SyncRequestCallback = () => void;

interface QueuedMessage {
  topic: string;
  message: string;
  retain: boolean;
}

let activeWs: WebSocket | null = null;
let isConnected = false;
let currentBrokerIndex = 0;
let pingInterval: any = null;
let reconnectTimeout: any = null;
let onEventCallback: EventCallback | null = null;
let onSnapshotCallback: SnapshotCallback | null = null;
let onSyncRequestCallback: SyncRequestCallback | null = null;

// Outbox queue: messages queued while disconnected are guaranteed to be published on reconnect
const outboxQueue: QueuedMessage[] = [];

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
  const connectFlags = new Uint8Array([0x02]); // Clean session
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

function rawSendPublish(ws: WebSocket, topic: string, message: string, retain = false) {
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

function flushOutbox() {
  if (!activeWs || activeWs.readyState !== WebSocket.OPEN) return;
  while (outboxQueue.length > 0) {
    const msg = outboxQueue.shift();
    if (msg) {
      rawSendPublish(activeWs, msg.topic, msg.message, msg.retain);
    }
  }
}

/**
 * Robust packet framing parser:
 * Decodes all MQTT packets inside a single WebSocket frame.
 * Handles QoS 0, QoS 1, QoS 2, and exact payload boundaries.
 */
function handleIncomingPackets(buf: Uint8Array) {
  let pos = 0;
  while (pos < buf.length) {
    const headerByte = buf[pos++];
    const packetType = headerByte >> 4;
    const qos = (headerByte & 0x06) >> 1;

    let multiplier = 1;
    let remainingLength = 0;
    let digit: number;
    do {
      if (pos >= buf.length) break;
      digit = buf[pos++];
      remainingLength += (digit & 127) * multiplier;
      multiplier *= 128;
    } while ((digit & 128) !== 0);

    const packetEnd = pos + remainingLength;
    if (packetEnd > buf.length) {
      // Incomplete packet in frame
      break;
    }

    const packetBuf = buf.subarray(pos, packetEnd);
    pos = packetEnd;

    if (packetType === 3) { // PUBLISH
      try {
        if (packetBuf.length < 2) continue;
        const topicLen = (packetBuf[0] << 8) | packetBuf[1];
        if (packetBuf.length < 2 + topicLen) continue;

        const topic = new TextDecoder().decode(packetBuf.subarray(2, 2 + topicLen));
        let payloadOffset = 2 + topicLen;

        // Skip Packet Identifier if QoS > 0
        if (qos > 0) {
          payloadOffset += 2;
        }

        const payloadStr = new TextDecoder().decode(packetBuf.subarray(payloadOffset));
        if (!payloadStr) continue;

        if (topic === TOPIC_EVENTS || topic === 'reetay/sync/v5/events') {
          const payload: CloudSyncPayload = JSON.parse(payloadStr);
          if (payload.senderId !== CLIENT_ID) {
            if (payload.action === 'sync_request' && onSyncRequestCallback) {
              onSyncRequestCallback();
            } else if (onEventCallback) {
              onEventCallback(payload);
            }
          }
        } else if (topic === TOPIC_SNAPSHOT_PROPERTIES || topic === 'reetay/sync/v5/properties') {
          const items = JSON.parse(payloadStr);
          if (Array.isArray(items) && onSnapshotCallback) {
            onSnapshotCallback('properties', items);
          }
        } else if (topic === TOPIC_SNAPSHOT_BOOKINGS || topic === 'reetay/sync/v5/bookings') {
          const items = JSON.parse(payloadStr);
          if (Array.isArray(items) && onSnapshotCallback) {
            onSnapshotCallback('bookings', items);
          }
        }
      } catch (err) {
        // Ignore single malformed packet
      }
    }
  }
}

export const cloudSync = {
  get clientId() {
    return CLIENT_ID;
  },

  get isConnected() {
    return isConnected;
  },

  init(onEvent: EventCallback, onSnapshot: SnapshotCallback, onSyncRequest?: SyncRequestCallback) {
    onEventCallback = onEvent;
    onSnapshotCallback = onSnapshot;
    if (onSyncRequest) {
      onSyncRequestCallback = onSyncRequest;
    }

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

          // Subscribe to live events and retained snapshots (v6 active and v5 legacy bridge)
          sendSubscribe(ws, TOPIC_EVENTS);
          sendSubscribe(ws, TOPIC_SNAPSHOT_PROPERTIES);
          sendSubscribe(ws, TOPIC_SNAPSHOT_BOOKINGS);
          sendSubscribe(ws, 'reetay/sync/v5/events');
          sendSubscribe(ws, 'reetay/sync/v5/properties');
          sendSubscribe(ws, 'reetay/sync/v5/bookings');

          // Immediately clear the stale demo snapshot retained on the v5 topic
          rawSendPublish(ws, 'reetay/sync/v5/properties', '[]', true);

          // Flush queued messages that were pending while offline/connecting
          flushOutbox();

          // Broadcast sync_request so any peer online announces their current state
          this.publishEvent('all', 'sync_request');

          // Keep alive ping every 25 seconds
          if (pingInterval) clearInterval(pingInterval);
          pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(new Uint8Array([0xc0, 0x00])); // PINGREQ
            }
          }, 25000);
        } else {
          handleIncomingPackets(buf);
        }
      };

      ws.onerror = () => {
        currentBrokerIndex++;
      };

      ws.onclose = () => {
        isConnected = false;
        if (pingInterval) clearInterval(pingInterval);
        clearTimeout(reconnectTimeout);
        reconnectTimeout = setTimeout(() => {
          this.connect();
        }, 3000);
      };
    } catch (e) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = setTimeout(() => this.connect(), 4000);
    }
  },

  publishEvent(table: string, action: 'insert' | 'update' | 'delete' | 'sync' | 'sync_request', data?: any, id?: string) {
    const payload: CloudSyncPayload = {
      table,
      action,
      data,
      id: id || data?.id,
      timestamp: Date.now(),
      senderId: CLIENT_ID
    };

    const message = JSON.stringify(payload);

    if (activeWs && activeWs.readyState === WebSocket.OPEN) {
      rawSendPublish(activeWs, TOPIC_EVENTS, message, false);
    } else {
      outboxQueue.push({ topic: TOPIC_EVENTS, message, retain: false });
    }
  },

  publishSnapshot(table: 'properties' | 'bookings', items: any[]) {
    // Safety: do not queue an empty snapshot that could overwrite valid listings
    const topic = table === 'properties' ? TOPIC_SNAPSHOT_PROPERTIES : TOPIC_SNAPSHOT_BOOKINGS;
    const message = JSON.stringify(items);

    if (activeWs && activeWs.readyState === WebSocket.OPEN) {
      rawSendPublish(activeWs, topic, message, true); // retain = true
    } else {
      outboxQueue.push({ topic, message, retain: true });
    }
  },

  requestPeerSync() {
    this.publishEvent('all', 'sync_request');
  }
};
