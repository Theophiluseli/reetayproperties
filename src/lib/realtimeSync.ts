import { useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';

export interface SyncPayload {
  table: string;
  action: 'insert' | 'update' | 'delete' | 'sync';
  data?: any;
  id?: string;
  timestamp: number;
}

// Global synchronization channel name for cross-browser, cross-device sync
const SYNC_CHANNEL_NAME = 'reetay-global-sync-v1';
const SYNC_EVENT_NAME = 'REETAY_DATA_SYNC';
const DOM_SYNC_EVENT = 'reetay:data-sync';

// Global channel singleton
let globalChannel: ReturnType<typeof supabase.channel> | null = null;
let isChannelSubscribed = false;

/**
 * Initialize the global Supabase Realtime channel for WebSocket broadcast and Postgres database events.
 */
export const initRealtimeSync = () => {
  if (globalChannel || !isSupabaseConfigured) return;

  try {
    globalChannel = supabase.channel(SYNC_CHANNEL_NAME, {
      config: {
        broadcast: {
          self: false, // Don't echo broadcast back to the sender in same tab
          ack: true
        }
      }
    });

    // 1. Listen for instant WebSocket broadcasts from any active browser or device
    globalChannel.on('broadcast', { event: SYNC_EVENT_NAME }, (payload: { payload: SyncPayload }) => {
      if (payload?.payload) {
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
          dispatchDomSyncEvent(syncData);
        }
      );
    });

    globalChannel.subscribe((status, err) => {
      if (status === 'SUBSCRIBED') {
        isChannelSubscribed = true;
        console.log('⚡ [RealtimeSync] WebSocket connected & subscribed to live database stream.');
      } else if (err) {
        console.warn('⚠️ [RealtimeSync] WebSocket subscription issue:', err);
      }
    });
  } catch (err) {
    console.error('Failed to initialize Realtime sync:', err);
  }
};

/**
 * Dispatch a local custom DOM event so React components can update immediately
 */
const dispatchDomSyncEvent = (payload: SyncPayload) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<SyncPayload>(DOM_SYNC_EVENT, { detail: payload })
    );
  }
};

/**
 * Broadcast a data change event across all open browsers, mobile devices, and tabs.
 */
export const broadcastDataChange = async (
  table: string,
  action: 'insert' | 'update' | 'delete' | 'sync',
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

  // Dispatch locally in this browser window
  dispatchDomSyncEvent(payload);

  // Send via Supabase WebSocket broadcast to all other devices & browsers
  if (isSupabaseConfigured && globalChannel) {
    try {
      await globalChannel.send({
        type: 'broadcast',
        event: SYNC_EVENT_NAME,
        payload
      });
    } catch (err) {
      console.warn('Failed to send broadcast payload:', err);
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
  useEffect(() => {
    initRealtimeSync();

    const handleSync = (event: Event) => {
      const customEvent = event as CustomEvent<SyncPayload>;
      const payload = customEvent.detail;

      if (!payload) return;

      // Match all or specific tables
      if (tables.length === 0 || tables.includes('*') || tables.includes(payload.table)) {
        onSync(payload);
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
  }, [tables.join(','), onSync]);
};
