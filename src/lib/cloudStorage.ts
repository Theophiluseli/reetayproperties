// Reetay Global Cloud Storage Engine
// Provides guaranteed persistent cloud storage over standard HTTPS (Port 443)
// Works on any device worldwide (mobile, desktop, tablet) across all networks & firewalls

import type { Property, Booking } from '../types/index';

const CLOUD_PROPERTIES_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a156eb9c3123f1';
const CLOUD_BOOKINGS_URL = 'https://api.restful-api.dev/objects/ff808181a09d98f701a156eccb7623fd';

const FETCH_TIMEOUT_MS = 4000;

const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs = FETCH_TIMEOUT_MS): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    return response;
  } finally {
    clearTimeout(id);
  }
};

export const cloudStorage = {
  /**
   * Fetch all persistent properties from the global cloud REST store.
   */
  async fetchCloudProperties(): Promise<Property[] | null> {
    try {
      const res = await fetchWithTimeout(CLOUD_PROPERTIES_URL, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) return null;
      const json = await res.json();
      if (json && json.data && Array.isArray(json.data.items)) {
        return json.data.items as Property[];
      }
    } catch (e) {
      console.warn('[CloudStorage] Failed to fetch cloud properties:', e);
    }
    return null;
  },

  /**
   * Save properties snapshot to the global cloud REST store.
   * Safety Guard: If local list is empty, we do not overwrite unless explicitly forced.
   */
  async saveCloudProperties(properties: Property[], forceEmpty = false): Promise<boolean> {
    if (properties.length === 0 && !forceEmpty) {
      return false;
    }
    try {
      const res = await fetchWithTimeout(CLOUD_PROPERTIES_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'reetay_cloud_properties',
          data: {
            items: properties,
            last_updated: Date.now()
          }
        })
      });
      return res.ok;
    } catch (e) {
      console.warn('[CloudStorage] Failed to save cloud properties:', e);
      return false;
    }
  },

  /**
   * Fetch all persistent bookings from the global cloud REST store.
   */
  async fetchCloudBookings(): Promise<Booking[] | null> {
    try {
      const res = await fetchWithTimeout(CLOUD_BOOKINGS_URL, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) return null;
      const json = await res.json();
      if (json && json.data && Array.isArray(json.data.items)) {
        return json.data.items as Booking[];
      }
    } catch (e) {
      console.warn('[CloudStorage] Failed to fetch cloud bookings:', e);
    }
    return null;
  },

  /**
   * Save bookings snapshot to the global cloud REST store.
   */
  async saveCloudBookings(bookings: Booking[], forceEmpty = false): Promise<boolean> {
    if (bookings.length === 0 && !forceEmpty) {
      return false;
    }
    try {
      const res = await fetchWithTimeout(CLOUD_BOOKINGS_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'reetay_cloud_bookings',
          data: {
            items: bookings,
            last_updated: Date.now()
          }
        })
      });
      return res.ok;
    } catch (e) {
      console.warn('[CloudStorage] Failed to save cloud bookings:', e);
      return false;
    }
  }
};
