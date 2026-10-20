import { useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';
import { cloudSync } from './cloudSync';

export interface SyncPayload {
  table: string;
  action: 'insert' | 'update' | 'delete' | 'sync' | 'sync_request';
  data?: any;
  id?: string;
  timestamp: number;
}

// Global synchronization channel names for cross-browser, cross-device sync
const SYNC_CHANNEL_NAME = 'reetay-global-sync-v2';
const SYNC_EVENT_NAME = 'REETAY_DATA_SYNC';
const DOM_SYNC_EVENT = 'reetay:data-sync';
const STORAGE_SYNC_KEY = 'reetay_cross_tab_sync_v2';

// Global Supabase channel singleton
let globalChannel: ReturnType<typeof supabase.channel> | null = null;
let isChannelSubscribed = false;

// Cross-tab BroadcastChannel singleton
let broadcastChannel: BroadcastChannel | null = null;

// Registry of cache refresh callbacks
type CacheRefreshCallback = () => void;
let cacheRefreshCallback: CacheRefreshCallback | null = null;

export const registerCacheRefresher = (cb: CacheRefreshCallback) => {
  cacheRefreshCallback = cb;
};

// Registry of snapshot callbacks (when remote cloud snapshot is received on startup)
type SnapshotCallback = (table: 'properties' | 'bookings', items: any[]) => void;
let snapshotCallback: SnapshotCallback | null = null;

export const registerSnapshotHandler = (cb: SnapshotCallback) => {
  snapshotCallback = cb;
};

// Initialize BroadcastChannel immediately in browser environment for 0ms cross-tab sync
if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
  try {
    broadcastChannel = new BroadcastChannel('reetay_broadcast_sync_channel');
    broadcastChannel.onmessage = (event: MessageEvent<SyncPayload>) => {
      if (event?.data) {
        if (cacheRefreshCallback) {
          try {
            cacheRefreshCallback();
          } catch (e) {
            console.error('Error executing cache refresh:', e);
          }
        }
        dispatchDomSyncEvent(event.data);
      }
    };
  } catch (err) {
    console.warn('BroadcastChannel could not be initialized:', err);
  }
}

// Storage event listener fallback for older browsers
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_SYNC_KEY && event.newValue) {
      try {
        const payload: SyncPayload = JSON.parse(event.newValue);
        if (cacheRefreshCallback) {
          cacheRefreshCallback();
        }
        dispatchDomSyncEvent(payload);
      } catch (e) {
        // ignore parse error
      }
    }
  });
}

// Registry of sync request callbacks (when a remote peer asks for active state)
type SyncRequestHandler = () => void;
let syncRequestHandler: SyncRequestHandler | null = null;

export const registerSyncRequestHandler = (cb: SyncRequestHandler) => {
  syncRequestHandler = cb;
};

// Window focus & visibility change listeners (instant sync when phone is unlocked or user switches back to tab)
if (typeof window !== 'undefined') {
  window.addEventListener('focus', () => {
    if (cacheRefreshCallback) {
      try {
        cacheRefreshCallback();
      } catch (e) {
        // ignore
      }
    }
    dispatchDomSyncEvent({ table: 'all', action: 'sync', timestamp: Date.now() });
  });

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        if (cacheRefreshCallback) {
          try {
            cacheRefreshCallback();
          } catch (e) {
            // ignore
          }
        }
        dispatchDomSyncEvent({ table: 'all', action: 'sync', timestamp: Date.now() });
      }
    });
  }
}

// Initialize Global Cross-Device Cloud Sync immediately in browser
if (typeof window !== 'undefined') {
  try {
    cloudSync.init(
      // On real-time mutation from any remote device anywhere in the world
      (cloudPayload) => {
        if (cacheRefreshCallback) {
          try {
            cacheRefreshCallback();
          } catch (e) {
            // ignore
          }
        }
        dispatchDomSyncEvent({
          table: cloudPayload.table,
          action: cloudPayload.action,
          data: cloudPayload.data,
          id: cloudPayload.id,
          timestamp: cloudPayload.timestamp
        });
      },
      // On initial cloud snapshot received (e.g. phone connects and pulls listings)
      (table, items) => {
        if (snapshotCallback) {
          try {
            snapshotCallback(table, items);
          } catch (e) {
            // ignore
          }
        }
        if (cacheRefreshCallback) {
          try {
            cacheRefreshCallback();
          } catch (e) {
            // ignore
          }
        }
        dispatchDomSyncEvent({
          table,
          action: 'sync',
          data: items,
          timestamp: Date.now()
        });
      },
      // On peer sync request (another device connected and requested current state)
      () => {
        if (syncRequestHandler) {
          try {
            syncRequestHandler();
          } catch (e) {
            // ignore
          }
        }
      }
    );
  } catch (err) {
    console.warn('CloudSync init error:', err);
  }
}

/**
 * Initialize the global Supabase Realtime channel for WebSocket broadcast and Postgres database events.
 */
export const initRealtimeSync = () => {
  if (globalChannel || !isSupabaseConfigured) return;

  try {
    globalChannel = supabase.channel(SYNC_CHANNEL_NAME, {
      config: {
        broadcast: {
          self: false,
          ack: false
        }
      }
    });

    // 1. Listen for instant WebSocket broadcasts from other remote devices
    globalChannel.on('broadcast', { event: SYNC_EVENT_NAME }, (payload: { payload: SyncPayload }) => {
      if (payload?.payload) {
        if (cacheRefreshCallback) {
          cacheRefreshCallback();
        }
        dispatchDomSyncEvent(payload.payload);
      }
    });

    // 2. Listen for Supabase Postgres Database changes directly
    const tables = ['properties', 'bookings', 'users', 'incident_reports', 'reviews', 'support_tickets'];
    tables.forEach((tableName) => {
      globalChannel?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        (dbPayload) => {
          const actionMap: Record<string, 'insert' | 'update' | 'delete'> = {
            INSERT: 'insert',
            UPDATE: 'update',
            DELETE: 'delete'
          };
          const syncData: SyncPayload = {
            table: tableName,
            action: actionMap[dbPayload.eventType] || 'update',
            data: dbPayload.new || dbPayload.old,
            id: (dbPayload.new as any)?.id || (dbPayload.old as any)?.id,
            timestamp: Date.now()
          };
          if (cacheRefreshCallback) {
            cacheRefreshCallback();
          }
          dispatchDomSyncEvent(syncData);
        }
      );
    });

    globalChannel.subscribe((status, err) => {
      if (status === 'SUBSCRIBED') {
        isChannelSubscribed = true;
        console.log('⚡ [RealtimeSync] WebSocket connected & subscribed to live database stream.');
      } else if (err || status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        isChannelSubscribed = false;
      }
    });
  } catch (err) {
    // Graceful fallback without throwing
  }
};

/**
 * Dispatch a local custom DOM event so React components in the current tab update immediately
 */
const dispatchDomSyncEvent = (payload: SyncPayload) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<SyncPayload>(DOM_SYNC_EVENT, { detail: payload })
    );
  }
};

/**
 * Broadcast a data change event across all open tabs, windows, and remote devices.
 */
export const broadcastDataChange = async (
  table: string,
  action: 'insert' | 'update' | 'delete' | 'sync' | 'sync_request',
  data?: any,
  id?: string
) => {
  const payload: SyncPayload = {
    table,
    action,
    data,
    id: id || data?.id,
    timestamp: Date.now()
  };

  // 1. Dispatch locally in this browser window (0ms)
  dispatchDomSyncEvent(payload);

  // 2. Broadcast across tabs and windows via BroadcastChannel (0ms)
  if (broadcastChannel) {
    try {
      broadcastChannel.postMessage(payload);
    } catch (e) {
      console.warn('BroadcastChannel postMessage failed:', e);
    }
  }

  // 3. Fallback ping via localStorage storage event
  try {
    localStorage.setItem(STORAGE_SYNC_KEY, JSON.stringify(payload));
  } catch (e) {
    // ignore
  }

  // 4. Broadcast across ALL devices, phones, tablets & computers over global cloud WebSocket (<100ms)
  try {
    cloudSync.publishEvent(table, action, data, id);
  } catch (e) {
    console.warn('Cloud sync publish error:', e);
  }

  // 5. Send via Supabase WebSocket broadcast to remote devices if connected
  if (isSupabaseConfigured && globalChannel && isChannelSubscribed) {
    try {
      await globalChannel.send({
        type: 'broadcast',
        event: SYNC_EVENT_NAME,
        payload
      });
    } catch (err) {
      // ignore offline failure
    }
  }
};

/**
 * React hook to subscribe to live data mutations for specific tables.
 * Triggers `onSync` whenever matching tables are inserted, updated, or deleted on any device.
 */
export const useRealtimeSync = (
  tables: string[],
  onSync: (payload: SyncPayload) => void
) => {
  const onSyncRef = useRef(onSync);
  useEffect(() => {
    onSyncRef.current = onSync;
  });

  const tablesKey = tables.join(',');

  useEffect(() => {
    initRealtimeSync();

    const handleSync = (event: Event) => {
      const customEvent = event as CustomEvent<SyncPayload>;
      const payload = customEvent.detail;

      if (!payload) return;

      const filterTables = tablesKey ? tablesKey.split(',') : [];
      // Match all or specific tables
      if (filterTables.length === 0 || filterTables.includes('*') || payload.table === 'all' || filterTables.includes(payload.table)) {
        onSyncRef.current(payload);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener(DOM_SYNC_EVENT, handleSync);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(DOM_SYNC_EVENT, handleSync);
      }
    };
  }, [tablesKey]);
};
