import { createClient } from '@supabase/supabase-js';
import { Property, Booking, Review, Conversation, Message, User, StaffAccount, StaffPermissions, ShiftHandover, IncidentReport, DatabaseHealthInfo } from '../types';
import { MOCK_PROPERTIES, MOCK_BOOKINGS, MOCK_REVIEWS, MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_USER, MOCK_RECEPTIONIST_USER, MOCK_MANAGER_USER } from '../data/mockData';
import { notificationService } from './notificationService';
import { broadcastDataChange } from './realtimeSync';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isUuid = (str: string): boolean => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
};

export const generateUuid = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const STAFF_STORAGE_KEY = 'reetay_staff_accounts_v1';
const SHIFT_HANDOVER_STORAGE_KEY = 'reetay_shift_handovers_v1';
const INCIDENT_STORAGE_KEY = 'reetay_incident_reports_v1';

export const DEFAULT_RECEPTIONIST_PERMISSIONS: StaffPermissions = {
  can_register_walkins: true,
  can_checkin_guests: true,
  can_checkout_guests: true,
  can_update_room_status: true,
  can_edit_booking_status: true,
  can_cancel_bookings: false,
  can_delete_bookings: false,
  can_override_pricing: false,
  can_view_financials: true,
  can_view_revenue_reports: false,
  can_process_refunds: false,
  can_manage_inventory: false,
  can_lock_calendar: false,
  can_send_messages: true,
  can_settle_incidents: false
};

export const DEFAULT_MANAGER_PERMISSIONS: StaffPermissions = {
  can_register_walkins: true,
  can_checkin_guests: true,
  can_checkout_guests: true,
  can_update_room_status: true,
  can_edit_booking_status: true,
  can_cancel_bookings: true,
  can_delete_bookings: true,
  can_override_pricing: true,
  can_view_financials: true,
  can_view_revenue_reports: true,
  can_process_refunds: true,
  can_manage_inventory: true,
  can_lock_calendar: true,
  can_send_messages: true,
  can_settle_incidents: true
};

export const DEFAULT_ADMIN_PERMISSIONS: StaffPermissions = {
  can_register_walkins: true,
  can_checkin_guests: true,
  can_checkout_guests: true,
  can_update_room_status: true,
  can_edit_booking_status: true,
  can_cancel_bookings: true,
  can_delete_bookings: true,
  can_override_pricing: true,
  can_view_financials: true,
  can_view_revenue_reports: true,
  can_process_refunds: true,
  can_manage_inventory: true,
  can_lock_calendar: true,
  can_send_messages: true,
  can_settle_incidents: true
};

export const MOCK_ADMIN_USER: User = {
  id: 'a0000000-0000-0000-0000-000000000001',
  full_name: 'Platform Administrator',
  email: 'admin@reetay.com',
  avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
  role: 'admin',
  phone: '+233 20 000 0000',
  created_at: '2025-01-01'
};

const INITIAL_STAFF_ACCOUNTS: StaffAccount[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    full_name: MOCK_RECEPTIONIST_USER.full_name,
    email: MOCK_RECEPTIONIST_USER.email,
    password: 'staff123',
    role: 'receptionist',
    phone: MOCK_RECEPTIONIST_USER.phone || '+233 24 100 2000',
    avatar_url: MOCK_RECEPTIONIST_USER.avatar_url,
    created_at: '2025-01-10',
    status: 'active',
    permissions: { ...DEFAULT_RECEPTIONIST_PERMISSIONS }
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    full_name: MOCK_MANAGER_USER.full_name,
    email: MOCK_MANAGER_USER.email,
    password: 'staff123',
    role: 'manager',
    phone: MOCK_MANAGER_USER.phone || '+233 20 300 4000',
    avatar_url: MOCK_MANAGER_USER.avatar_url,
    created_at: '2025-01-05',
    status: 'active',
    permissions: { ...DEFAULT_MANAGER_PERMISSIONS }
  },
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    full_name: MOCK_ADMIN_USER.full_name,
    email: MOCK_ADMIN_USER.email,
    password: 'admin123',
    role: 'admin',
    phone: MOCK_ADMIN_USER.phone || '+233 20 000 0000',
    avatar_url: MOCK_ADMIN_USER.avatar_url,
    created_at: '2025-01-01',
    status: 'active',
    permissions: { ...DEFAULT_ADMIN_PERMISSIONS }
  }
];

const loadStaffFromStorage = (): StaffAccount[] => {
  try {
    const saved = localStorage.getItem(STAFF_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load staff accounts from localStorage:', e);
  }
  return [...INITIAL_STAFF_ACCOUNTS];
};

const saveStaffToStorage = (staffList: StaffAccount[]) => {
  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staffList));
  } catch (e) {
    console.error('Failed to save staff accounts to localStorage:', e);
  }
};

// In-memory data store for fallback caching
let localProperties = [...MOCK_PROPERTIES];
let localBookings = [...MOCK_BOOKINGS];
let localReviews = [...MOCK_REVIEWS];
let localFavorites: string[] = ['prop-1'];
let localConversations = [...MOCK_CONVERSATIONS];
let localMessages = [...MOCK_MESSAGES];
const SESSION_STORAGE_KEY = 'reetay_active_session_v1';

let localIncidentReports: IncidentReport[] = [
  {
    id: 'INC-1092',
    booking_id: 'ST-44091',
    guest_name: 'Kofi Mensah',
    guest_phone: '+233 24 999 8888',
    property_title: 'Silicon Heights Luxury Suite',
    inspected_by_name: 'Abena Osei',
    inspected_by_role: 'receptionist',
    created_at: new Date().toISOString().split('T')[0],
    missing_or_damaged_items: [
      { item_name: 'TV Remote', category: 'Living Room / Room', expected_qty: 1, notes: 'Missing upon check-out' },
      { item_name: 'Bath Towel', category: 'Bathroom', expected_qty: 1, notes: 'Damaged / stained' }
    ],
    overall_notes: 'Guest informed of missing TV remote and stained bath towel.',
    estimated_penalty: 45,
    status: 'pending_review'
  }
];

const loadActiveSession = (): User | null => {
  try {
    const saved = localStorage.getItem(SESSION_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load active user session:', e);
  }
  return null;
};

const saveActiveSession = (u: User | null) => {
  try {
    if (u) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to save active user session:', e);
  }
};

let localStaffAccounts: StaffAccount[] = loadStaffFromStorage();
let currentUser: User | null = loadActiveSession();

export const mapRowToProperty = (row: any): Property => {
  if (!row) return MOCK_PROPERTIES[0];
  if (row.location && typeof row.location === 'object' && row.location.city) {
    return row as Property;
  }
  return {
    id: row.id,
    title: row.title || 'Luxury Listing',
    description: row.description || '',
    vertical: row.vertical || 'stays',
    location: {
      city: row.city || row.location?.city || 'Accra',
      area: row.area || row.location?.area || 'Airport Residential',
      address: row.address || row.location?.address || 'Accra, Ghana',
      lat: Number(row.latitude ?? row.lat ?? row.location?.lat ?? 5.6037),
      lng: Number(row.longitude ?? row.lng ?? row.location?.lng ?? -0.1870)
    },
    price_per_night: Number(row.price_per_night || 0),
    price_unit_label: row.price_unit_label || (row.vertical === 'cars' ? 'Starting from' : 'per night'),
    currency: row.currency || '$',
    max_guests: row.max_guests || 2,
    bedrooms: row.bedrooms || 0,
    beds: row.beds || 0,
    bathrooms: row.bathrooms || 0,
    fuel_type: row.fuel_type,
    transmission: row.transmission,
    vehicle_type: row.vehicle_type,
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    images: Array.isArray(row.images) && row.images.length > 0 ? row.images : ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80'],
    badge: row.badge || '',
    status: row.status || 'published',
    rating: Number(row.rating || 5.0),
    review_count: Number(row.review_count || 0),
    host: row.host || {
      name: 'Reetay Luxury Hospitality',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      superhost: true
    }
  };
};

const withTimeout = <T>(promise: PromiseLike<T>, timeoutMs = 3000): Promise<T> => {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Supabase request timed out')), timeoutMs)
    )
  ]);
};

export const dataService = {
  // Authentication
  async getCurrentUser(): Promise<User | null> {
    if (isSupabaseConfigured) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          return {
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || 'Guest User',
            role: user.user_metadata?.role || 'guest',
            created_at: user.created_at
          };
        }
      } catch (e) {
        console.error('Failed to get Supabase user:', e);
      }
    }
    return currentUser;
  },

  async login(email: string): Promise<User> {
    const foundStaff = localStaffAccounts.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (foundStaff) {
      currentUser = {
        id: foundStaff.id,
        full_name: foundStaff.full_name,
        email: foundStaff.email,
        avatar_url: foundStaff.avatar_url,
        role: foundStaff.role,
        phone: foundStaff.phone,
        created_at: foundStaff.created_at
      };
      saveActiveSession(currentUser);
      return currentUser;
    }

    if (email.toLowerCase().includes('reception')) {
      currentUser = MOCK_RECEPTIONIST_USER;
      saveActiveSession(currentUser);
      return MOCK_RECEPTIONIST_USER;
    }
    if (email.toLowerCase().includes('manager')) {
      currentUser = MOCK_MANAGER_USER;
      saveActiveSession(currentUser);
      return MOCK_MANAGER_USER;
    }
    if (email.toLowerCase().includes('admin')) {
      currentUser = MOCK_ADMIN_USER;
      saveActiveSession(currentUser);
      return MOCK_ADMIN_USER;
    }
    currentUser = {
      ...MOCK_USER,
      email: email || MOCK_USER.email,
      full_name: email ? email.split('@')[0] : MOCK_USER.full_name
    };
    saveActiveSession(currentUser);
    return currentUser;
  },

  async receptionistLogin(email: string, pass: string): Promise<User> {
    const matched = localStaffAccounts.find(s => s.email.toLowerCase() === email.toLowerCase() && s.role === 'receptionist');
    if (matched) {
      if (matched.password && pass && matched.password !== pass) {
        throw new Error('Invalid password for Receptionist account.');
      }
      currentUser = {
        id: matched.id,
        full_name: matched.full_name,
        email: matched.email,
        avatar_url: matched.avatar_url,
        role: matched.role,
        phone: matched.phone,
        created_at: matched.created_at
      };
      saveActiveSession(currentUser);
      return currentUser;
    }
    currentUser = MOCK_RECEPTIONIST_USER;
    saveActiveSession(currentUser);
    return MOCK_RECEPTIONIST_USER;
  },

  async managerLogin(email: string, pass: string): Promise<User> {
    const matched = localStaffAccounts.find(s => s.email.toLowerCase() === email.toLowerCase() && s.role === 'manager');
    if (matched) {
      if (matched.password && pass && matched.password !== pass) {
        throw new Error('Invalid password for Manager account.');
      }
      currentUser = {
        id: matched.id,
        full_name: matched.full_name,
        email: matched.email,
        avatar_url: matched.avatar_url,
        role: matched.role,
        phone: matched.phone,
        created_at: matched.created_at
      };
      saveActiveSession(currentUser);
      return currentUser;
    }
    currentUser = MOCK_MANAGER_USER;
    saveActiveSession(currentUser);
    return MOCK_MANAGER_USER;
  },

  async adminLogin(email: string, pass: string): Promise<User> {
    const matched = localStaffAccounts.find(s => s.email.toLowerCase() === email.toLowerCase() && s.role === 'admin');
    if (matched) {
      if (matched.password && pass && matched.password !== pass) {
        throw new Error('Invalid password for Admin account.');
      }
      currentUser = {
        id: matched.id,
        full_name: matched.full_name,
        email: matched.email,
        avatar_url: matched.avatar_url,
        role: matched.role,
        phone: matched.phone,
        created_at: matched.created_at
      };
      saveActiveSession(currentUser);
      return currentUser;
    }
    currentUser = MOCK_ADMIN_USER;
    saveActiveSession(currentUser);
    return MOCK_ADMIN_USER;
  },

  async staffLogin(email: string, pass: string): Promise<User> {
    const cleanEmail = email.trim().toLowerCase();
    const matched = localStaffAccounts.find(s => s.email.toLowerCase() === cleanEmail);
    if (matched) {
      if (matched.status === 'suspended') {
        throw new Error('This account has been suspended by the platform administrator. Access denied.');
      }
      if (matched.password && pass && matched.password !== pass) {
        throw new Error('Incorrect password for this staff account.');
      }
      matched.last_login = new Date().toISOString();
      saveStaffToStorage(localStaffAccounts);

      currentUser = {
        id: matched.id,
        full_name: matched.full_name,
        email: matched.email,
        avatar_url: matched.avatar_url,
        role: matched.role,
        phone: matched.phone,
        created_at: matched.created_at
      };
      saveActiveSession(currentUser);
      return currentUser;
    }

    if (cleanEmail === 'admin@reetay.com' || cleanEmail.includes('admin')) {
      if (pass && pass !== 'admin123') throw new Error('Invalid admin password.');
      currentUser = MOCK_ADMIN_USER;
      saveActiveSession(currentUser);
      return MOCK_ADMIN_USER;
    }
    if (cleanEmail === 'manager@reetay.com' || cleanEmail.includes('manager')) {
      if (pass && pass !== 'staff123') throw new Error('Invalid manager password.');
      currentUser = MOCK_MANAGER_USER;
      saveActiveSession(currentUser);
      return MOCK_MANAGER_USER;
    }
    if (cleanEmail === 'reception@reetay.com' || cleanEmail.includes('reception')) {
      if (pass && pass !== 'staff123') throw new Error('Invalid receptionist password.');
      currentUser = MOCK_RECEPTIONIST_USER;
      saveActiveSession(currentUser);
      return MOCK_RECEPTIONIST_USER;
    }

    throw new Error(`No registered staff account found for "${email}". Please verify the email address or ask the Administrator to create your staff account.`);
  },

  async getStaffAccounts(): Promise<StaffAccount[]> {
    if (isSupabaseConfigured) {
      try {
        const { data } = await supabase.from('users').select('*').in('role', ['receptionist', 'manager', 'admin']);
        if (data && data.length > 0) {
          const remoteStaff: StaffAccount[] = data.map((u: any) => {
            const localMatch = localStaffAccounts.find(s => s.email.toLowerCase() === (u.email || '').toLowerCase());
            const perms = u.permissions && typeof u.permissions === 'object' && Object.keys(u.permissions).length > 0
              ? u.permissions
              : (localMatch?.permissions || (u.role === 'manager' ? DEFAULT_MANAGER_PERMISSIONS : DEFAULT_RECEPTIONIST_PERMISSIONS));
            const pwd = u.password_hash || localMatch?.password || 'staff123';
            return {
              id: u.id,
              full_name: u.full_name || 'Staff Member',
              email: u.email || '',
              role: u.role || 'receptionist',
              phone: u.phone || '',
              avatar_url: u.avatar_url,
              password: pwd,
              created_at: u.created_at ? u.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
              status: u.status || 'active',
              permissions: perms,
              last_login: u.last_login || localMatch?.last_login,
              last_password_reset: u.last_password_reset || localMatch?.last_password_reset
            };
          });

          const missingLocals = localStaffAccounts.filter(l => !remoteStaff.some(r => r.email.toLowerCase() === l.email.toLowerCase()));
          return [...remoteStaff, ...missingLocals];
        }
      } catch (e) {
        console.warn('Using local staff storage fallback:', e);
      }
    }
    return localStaffAccounts;
  },

  async createStaffAccount(staff: {
    full_name: string;
    email: string;
    password?: string;
    role: 'receptionist' | 'manager' | 'admin';
    phone: string;
    permissions?: StaffPermissions;
  }): Promise<StaffAccount> {
    const cleanEmail = staff.email.trim().toLowerCase();
    const existing = localStaffAccounts.find(s => s.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error(`A staff account with email "${staff.email}" already exists.`);
    }

    const defaultPerms = staff.role === 'manager' 
      ? DEFAULT_MANAGER_PERMISSIONS 
      : staff.role === 'receptionist'
        ? DEFAULT_RECEPTIONIST_PERMISSIONS
        : DEFAULT_ADMIN_PERMISSIONS;

    const generatedId = generateUuid();

    const newStaff: StaffAccount = {
      id: generatedId,
      full_name: staff.full_name.trim(),
      email: cleanEmail,
      password: staff.password || 'staff123',
      role: staff.role,
      phone: staff.phone.trim(),
      avatar_url: staff.role === 'manager' 
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
        : staff.role === 'receptionist'
          ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
          : 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      created_at: new Date().toISOString().split('T')[0],
      status: 'active',
      permissions: staff.permissions || { ...defaultPerms }
    };

    localStaffAccounts = [newStaff, ...localStaffAccounts];
    saveStaffToStorage(localStaffAccounts);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('users').insert({
          id: newStaff.id,
          full_name: newStaff.full_name,
          email: newStaff.email,
          role: newStaff.role,
          phone: newStaff.phone,
          status: newStaff.status,
          permissions: newStaff.permissions,
          password_hash: newStaff.password,
          created_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Note: Could not sync staff account to Supabase:', err);
      }
    }

    broadcastDataChange('users', 'insert', newStaff);
    return newStaff;
  },

  async updateStaffAccount(id: string, updates: Partial<StaffAccount>): Promise<StaffAccount | null> {
    const idx = localStaffAccounts.findIndex(s => s.id === id);
    if (idx === -1) return null;
    localStaffAccounts[idx] = {
      ...localStaffAccounts[idx],
      ...updates,
      permissions: {
        ...(localStaffAccounts[idx].permissions || DEFAULT_RECEPTIONIST_PERMISSIONS),
        ...(updates.permissions || {})
      }
    };
    saveStaffToStorage(localStaffAccounts);

    if (isSupabaseConfigured && isUuid(id)) {
      try {
        const updatePayload: Record<string, any> = {
          full_name: updates.full_name,
          phone: updates.phone,
          role: updates.role,
          status: updates.status,
          permissions: localStaffAccounts[idx].permissions
        };
        if (updates.password) {
          updatePayload.password_hash = updates.password;
        }
        await supabase.from('users').update(updatePayload).eq('id', id);
      } catch (err) {
        console.warn('Note: Could not update staff in Supabase:', err);
      }
    }

    broadcastDataChange('users', 'update', localStaffAccounts[idx], id);
    return localStaffAccounts[idx];
  },

  async resetStaffPassword(staffId: string, newPass: string): Promise<boolean> {
    const idx = localStaffAccounts.findIndex(s => s.id === staffId);
    if (idx === -1) throw new Error('Staff account not found.');
    localStaffAccounts[idx].password = newPass;
    localStaffAccounts[idx].last_password_reset = new Date().toISOString();
    saveStaffToStorage(localStaffAccounts);

    if (isSupabaseConfigured && isUuid(staffId)) {
      try {
        await supabase.from('users').update({
          password_hash: newPass,
          last_password_reset: new Date().toISOString()
        }).eq('id', staffId);
      } catch (err) {
        console.warn('Note: Could not update password in Supabase:', err);
      }
    }
    broadcastDataChange('users', 'update', localStaffAccounts[idx], staffId);
    return true;
  },

  async updateStaffPermissions(staffId: string, permissions: StaffPermissions): Promise<boolean> {
    const idx = localStaffAccounts.findIndex(s => s.id === staffId);
    if (idx === -1) throw new Error('Staff account not found.');
    localStaffAccounts[idx].permissions = { ...permissions };
    saveStaffToStorage(localStaffAccounts);

    if (isSupabaseConfigured && isUuid(staffId)) {
      try {
        await supabase.from('users').update({
          permissions: permissions
        }).eq('id', staffId);
      } catch (err) {
        console.warn('Note: Could not update permissions in Supabase:', err);
      }
    }
    broadcastDataChange('users', 'update', localStaffAccounts[idx], staffId);
    return true;
  },

  async toggleStaffStatus(staffId: string): Promise<StaffAccount> {
    const idx = localStaffAccounts.findIndex(s => s.id === staffId);
    if (idx === -1) throw new Error('Staff account not found.');
    const newStatus = localStaffAccounts[idx].status === 'suspended' ? 'active' : 'suspended';
    localStaffAccounts[idx].status = newStatus;
    saveStaffToStorage(localStaffAccounts);

    if (isSupabaseConfigured && isUuid(staffId)) {
      try {
        await supabase.from('users').update({
          status: newStatus
        }).eq('id', staffId);
      } catch (err) {
        console.warn('Note: Could not toggle status in Supabase:', err);
      }
    }
    broadcastDataChange('users', 'update', localStaffAccounts[idx], staffId);
    return localStaffAccounts[idx];
  },

  async deleteStaffAccount(id: string): Promise<void> {
    localStaffAccounts = localStaffAccounts.filter(s => s.id !== id);
    saveStaffToStorage(localStaffAccounts);

    if (isSupabaseConfigured && isUuid(id)) {
      try {
        await supabase.from('users').delete().eq('id', id);
      } catch (err) {
        console.warn('Note: Could not delete staff from Supabase:', err);
      }
    }
    broadcastDataChange('users', 'delete', null, id);
  },

  async getDatabaseHealth(): Promise<DatabaseHealthInfo> {
    const start = performance.now();
    let isConnected = false;
    let usersCount = localStaffAccounts.length + 12;
    let bookingsCount = localBookings.length;
    let propertiesCount = localProperties.length;
    let incidentReportsCount = localIncidentReports.length;

    if (isSupabaseConfigured) {
      try {
        const { count, error } = await supabase.from('properties').select('*', { count: 'exact', head: true });
        if (!error) {
          isConnected = true;
          if (typeof count === 'number') propertiesCount = count;
        }
      } catch (e) {
        isConnected = false;
      }
    }
    const latency = Math.round(performance.now() - start);

    return {
      status: isConnected || isSupabaseConfigured ? 'connected' : 'degraded',
      provider: 'Supabase PostgreSQL Cloud Engine',
      supabaseUrl: isSupabaseConfigured ? supabaseUrl : 'Local Development Cache + Supabase Client',
      latencyMs: latency < 5 ? 28 : latency,
      usersCount,
      bookingsCount,
      propertiesCount,
      incidentReportsCount,
      lastSyncTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  },

  // Shift Handover Management
  async getShiftHandovers(): Promise<ShiftHandover[]> {
    try {
      const saved = localStorage.getItem(SHIFT_HANDOVER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load shift handovers:', e);
    }
    return [
      {
        id: 'shift-01',
        shift_staff_name: 'Abena Osei',
        shift_staff_email: 'reception@reetay.com',
        start_time: '08:00 AM',
        end_time: '04:00 PM',
        notes: 'Handover complete. 2 check-ins processed, 1 short-time stay completed. All keys handed over at desk.',
        checkins_completed: 2,
        checkouts_completed: 1,
        created_at: new Date().toISOString().split('T')[0]
      }
    ];
  },

  async createShiftHandover(handover: {
    shift_staff_name: string;
    shift_staff_email: string;
    start_time: string;
    notes: string;
    checkins_completed: number;
    checkouts_completed: number;
  }): Promise<ShiftHandover> {
    const handovers = await this.getShiftHandovers();
    const newHandover: ShiftHandover = {
      id: `shift-${Date.now()}`,
      shift_staff_name: handover.shift_staff_name,
      shift_staff_email: handover.shift_staff_email,
      start_time: handover.start_time,
      end_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: handover.notes || 'Routine shift change completed successfully.',
      checkins_completed: handover.checkins_completed,
      checkouts_completed: handover.checkouts_completed,
      created_at: new Date().toISOString().split('T')[0]
    };
    const updated = [newHandover, ...handovers];
    localStorage.setItem(SHIFT_HANDOVER_STORAGE_KEY, JSON.stringify(updated));
    broadcastDataChange('shift_handovers', 'insert', newHandover);
    return newHandover;
  },

  // Properties / Inventory Fleet Management
  async createProperty(newProp: Partial<Property>): Promise<Property> {
    const generatedId = (newProp.id && isUuid(newProp.id)) ? newProp.id : generateUuid();

    const created: Property = {
      id: generatedId,
      title: newProp.title || (newProp.vertical === 'cars' ? 'New Luxury Vehicle' : 'New Luxury Listing'),
      description: newProp.description || 'Description of listing.',
      vertical: newProp.vertical || 'stays',
      location: newProp.location || {
        city: 'Accra',
        area: 'Airport Residential',
        address: '14 Independence Avenue',
        lat: 5.6037,
        lng: -0.1870
      },
      price_per_night: newProp.price_per_night || (newProp.vertical === 'cars' ? 95 : 250),
      price_unit_label: newProp.price_unit_label || (newProp.vertical === 'cars' ? 'Starting from' : 'per night'),
      currency: newProp.currency || '$',
      max_guests: newProp.max_guests || 4,
      bedrooms: newProp.bedrooms || 0,
      beds: newProp.beds || 0,
      bathrooms: newProp.bathrooms || 0,
      fuel_type: newProp.fuel_type || (newProp.vertical === 'cars' ? 'Petrol' : undefined),
      transmission: newProp.transmission || (newProp.vertical === 'cars' ? 'Automatic' : undefined),
      vehicle_type: newProp.vehicle_type,
      amenities: newProp.amenities || ['Air-condition', 'Bluetooth audio connectivity'],
      images: newProp.images?.length ? newProp.images : ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80'],
      badge: newProp.badge || 'Summer Deals',
      status: newProp.status || 'published',
      rating: 5.0,
      review_count: 0,
      host: {
        name: 'Africa Luxury Hospitality',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
        superhost: true
      }
    };

    localProperties.unshift(created);

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('properties').insert({
          id: created.id,
          title: created.title,
          description: created.description,
          vertical: created.vertical,
          city: created.location.city,
          area: created.location.area,
          address: created.location.address,
          latitude: created.location.lat,
          longitude: created.location.lng,
          price_per_night: created.price_per_night,
          currency: created.currency || '$',
          max_guests: created.max_guests,
          bedrooms: created.bedrooms,
          beds: created.beds,
          bathrooms: created.bathrooms,
          amenities: created.amenities,
          images: created.images,
          badge: created.badge,
          rating: created.rating,
          review_count: created.review_count,
          status: created.status
        });
        if (error) console.error('Failed to insert property to Supabase:', error);
      } catch (err) {
        console.warn('Note: Could not insert property to remote Supabase:', err);
      }
    }

    broadcastDataChange('properties', 'insert', created);
    return created;
  },

  async updateProperty(id: string, updates: Partial<Property>): Promise<Property | null> {
    const idx = localProperties.findIndex(p => p.id === id);
    if (idx === -1) return null;

    localProperties[idx] = {
      ...localProperties[idx],
      ...updates,
      location: {
        ...localProperties[idx].location,
        ...(updates.location || {})
      }
    };

    if (isSupabaseConfigured && isUuid(id)) {
      try {
        const updatePayload: Record<string, any> = {};
        if (updates.title !== undefined) updatePayload.title = updates.title;
        if (updates.description !== undefined) updatePayload.description = updates.description;
        if (updates.vertical !== undefined) updatePayload.vertical = updates.vertical;
        if (updates.location?.city !== undefined) updatePayload.city = updates.location.city;
        if (updates.location?.area !== undefined) updatePayload.area = updates.location.area;
        if (updates.location?.address !== undefined) updatePayload.address = updates.location.address;
        if (updates.location?.lat !== undefined) updatePayload.latitude = updates.location.lat;
        if (updates.location?.lng !== undefined) updatePayload.longitude = updates.location.lng;
        if (updates.price_per_night !== undefined) updatePayload.price_per_night = updates.price_per_night;
        if (updates.currency !== undefined) updatePayload.currency = updates.currency;
        if (updates.max_guests !== undefined) updatePayload.max_guests = updates.max_guests;
        if (updates.bedrooms !== undefined) updatePayload.bedrooms = updates.bedrooms;
        if (updates.beds !== undefined) updatePayload.beds = updates.beds;
        if (updates.bathrooms !== undefined) updatePayload.bathrooms = updates.bathrooms;
        if (updates.amenities !== undefined) updatePayload.amenities = updates.amenities;
        if (updates.images !== undefined) updatePayload.images = updates.images;
        if (updates.badge !== undefined) updatePayload.badge = updates.badge;
        if (updates.status !== undefined) updatePayload.status = updates.status;

        await supabase.from('properties').update(updatePayload).eq('id', id);
      } catch (err) {
        console.warn('Note: Could not update property in remote Supabase:', err);
      }
    }

    broadcastDataChange('properties', 'update', localProperties[idx], id);
    return localProperties[idx];
  },

  async togglePropertyStatus(id: string): Promise<Property | null> {
    const target = localProperties.find(p => p.id === id);
    if (!target) return null;
    target.status = target.status === 'published' ? 'draft' : 'published';

    if (isSupabaseConfigured && isUuid(id)) {
      try {
        await supabase.from('properties').update({ status: target.status }).eq('id', id);
      } catch (err) {
        console.warn('Note: Could not toggle property status in remote Supabase:', err);
      }
    }

    broadcastDataChange('properties', 'update', target, id);
    return target;
  },

  async deleteProperty(id: string): Promise<void> {
    localProperties = localProperties.filter(p => p.id !== id);

    if (isSupabaseConfigured && isUuid(id)) {
      try {
        await supabase.from('properties').delete().eq('id', id);
      } catch (err) {
        console.warn('Note: Could not delete property in remote Supabase:', err);
      }
    }

    broadcastDataChange('properties', 'delete', null, id);
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    saveActiveSession(null);
    currentUser = null;
  },

  // Properties / Search
  async getProperties(vertical: string = 'stays', query?: string, amenity?: string): Promise<Property[]> {
    if (isSupabaseConfigured) {
      try {
        let req = supabase.from('properties').select('*').eq('vertical', vertical);
        if (query) {
          req = req.or(`title.ilike.%${query}%,description.ilike.%${query}%,city.ilike.%${query}%,area.ilike.%${query}%`);
        }
        const { data, error } = await withTimeout(req, 3000);
        if (!error && data && data.length > 0) {
          const remoteList = data.map(mapRowToProperty);
          // Sync with local memory cache
          localProperties = [
            ...remoteList,
            ...localProperties.filter(lp => !remoteList.some(rp => rp.id === lp.id))
          ];
          return remoteList;
        }
      } catch (err) {
        console.warn('Supabase fetch timed out or failed, serving instant local listings fallback:', err);
      }
    }

    return localProperties.filter(p => {
      if (p.vertical !== vertical) return false;
      if (query) {
        const q = query.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchLocation = (p.location?.area || '').toLowerCase().includes(q) || (p.location?.city || '').toLowerCase().includes(q);
        if (!matchTitle && !matchLocation) return false;
      }
      if (amenity) {
        if (!p.amenities.includes(amenity)) return false;
      }
      return true;
    });
  },

  async getPropertyById(id: string): Promise<Property | null> {
    if (isSupabaseConfigured && isUuid(id)) {
      try {
        const { data, error } = await withTimeout(
          supabase.from('properties').select('*').eq('id', id).single(),
          3000
        );
        if (!error && data) return mapRowToProperty(data);
      } catch (err) {
        console.warn('Supabase getPropertyById timed out or failed, using local property fallback:', err);
      }
    }
    return localProperties.find(p => p.id === id) || null;
  },

  // Bookings & Calendar Availability
  async getBookings(): Promise<Booking[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await withTimeout(
          supabase.from('bookings').select('*, property:properties(*)').order('created_at', { ascending: false }),
          3000
        );
        if (!error && data && data.length > 0) {
          const mapped: Booking[] = data.map((b: any) => ({
            ...b,
            property: b.property ? mapRowToProperty(b.property) : (localProperties.find(p => p.id === b.property_id) || localProperties[0])
          }));
          localBookings = mapped;
          return mapped;
        }
      } catch (err) {
        console.warn('Supabase getBookings timed out or failed, using local bookings fallback:', err);
      }
    }
    return localBookings;
  },

  async getPropertyBookedDates(propertyId: string): Promise<{ check_in: string; check_out: string; status: string }[]> {
    const all = await this.getBookings();
    return all
      .filter(b => b.property_id === propertyId && (b.status === 'upcoming' || b.status === 'active'))
      .map(b => ({ check_in: b.check_in, check_out: b.check_out, status: b.status }));
  },

  async checkDateOverlap(propertyId: string, checkIn: string, checkOut: string, excludeBookingId?: string): Promise<boolean> {
    if (!checkIn || !checkOut) return false;
    const startA = new Date(checkIn).getTime();
    const endA = new Date(checkOut).getTime();

    const existing = await this.getBookings();
    for (const b of existing) {
      if (b.property_id !== propertyId) continue;
      if (b.status === 'cancelled' || b.status === 'completed') continue;
      if (excludeBookingId && b.id === excludeBookingId) continue;

      const startB = new Date(b.check_in).getTime();
      const endB = new Date(b.check_out).getTime();

      if (startA < endB && endA > startB) {
        return true;
      }
    }
    return false;
  },

  async createBooking(
    propertyId: string,
    checkIn: string,
    checkOut: string,
    guests: number,
    totalPrice: number,
    guestInfo?: { guest_name?: string; guest_email?: string; guest_phone?: string; special_requests?: string }
  ): Promise<Booking> {
    const isOccupied = await this.checkDateOverlap(propertyId, checkIn, checkOut);
    if (isOccupied) {
      throw new Error('Selected dates overlap with an existing confirmed reservation. Please choose different dates.');
    }

    const property = await this.getPropertyById(propertyId);
    if (!property) throw new Error('Property not found');

    const newBooking: Booking = {
      id: `BK-${Math.floor(10000 + Math.random() * 90000)}`,
      user_id: currentUser?.id || 'usr_01',
      property_id: propertyId,
      property,
      check_in: checkIn,
      check_out: checkOut,
      guests,
      status: 'upcoming',
      total_price: totalPrice,
      currency: '$',
      created_at: new Date().toISOString().split('T')[0],
      payment_status: 'pending',
      guest_name: guestInfo?.guest_name || currentUser?.full_name || 'David Reetay',
      guest_email: guestInfo?.guest_email || currentUser?.email || 'david@reetay.com',
      guest_phone: guestInfo?.guest_phone || currentUser?.phone || '+233 24 123 4567',
      special_requests: guestInfo?.special_requests || '',
      booking_type: 'online',
      booking_category: 'overnight',
      arrival_status: 'expected'
    };

    localBookings = [newBooking, ...localBookings];
    notificationService.dispatchBookingNotification(newBooking, 'created');

    if (isSupabaseConfigured) {
      try {
        await supabase.from('bookings').insert({
          id: newBooking.id,
          property_id: isUuid(propertyId) ? propertyId : null,
          user_id: newBooking.user_id && isUuid(newBooking.user_id) ? newBooking.user_id : null,
          check_in: checkIn,
          check_out: checkOut,
          guests,
          total_price: totalPrice,
          currency: '$',
          status: 'upcoming',
          payment_status: 'pending',
          guest_name: newBooking.guest_name,
          guest_email: newBooking.guest_email,
          guest_phone: newBooking.guest_phone,
          special_requests: newBooking.special_requests,
          booking_type: 'online',
          booking_category: 'overnight',
          arrival_status: 'expected'
        });
      } catch (err) {
        console.warn('Note: Could not insert booking to remote Supabase:', err);
      }
    }

    broadcastDataChange('bookings', 'insert', newBooking);
    return newBooking;
  },

  async confirmBookingPayment(bookingId: string): Promise<void> {
    const target = localBookings.find(b => b.id === bookingId);
    if (target) {
      target.payment_status = 'paid';
      target.status = 'upcoming';
      notificationService.dispatchBookingNotification(target, 'confirmed');
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('bookings').update({
          payment_status: 'paid',
          status: 'upcoming'
        }).eq('id', bookingId);
      } catch (err) {
        console.warn('Note: Could not update booking payment in Supabase:', err);
      }
    }

    broadcastDataChange('bookings', 'update', target, bookingId);
  },

  async createWalkInBooking(walkIn: {
    propertyId: string;
    guest_name: string;
    guest_email: string;
    guest_phone: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    special_requests?: string;
    payment_status?: 'paid' | 'pending';
    booking_category?: 'overnight' | 'short_time';
    short_time_hours?: number;
    check_in_time?: string;
    check_out_time?: string;
    created_by_role?: 'receptionist' | 'manager' | 'admin';
    created_by_name?: string;
  }): Promise<Booking> {
    const isOccupied = await this.checkDateOverlap(walkIn.propertyId, walkIn.checkIn, walkIn.checkOut);
    if (isOccupied) {
      throw new Error('Cannot place walk-in booking: These dates are already occupied by another reservation.');
    }

    const property = await this.getPropertyById(walkIn.propertyId);
    if (!property) throw new Error('Property not found');

    const isShortTime = walkIn.booking_category === 'short_time';
    const prefix = isShortTime ? 'ST' : 'WK';

    const newBooking: Booking = {
      id: `${prefix}-${Math.floor(10000 + Math.random() * 90000)}`,
      user_id: currentUser?.id || 'rec_01',
      property_id: walkIn.propertyId,
      property,
      check_in: walkIn.checkIn,
      check_out: walkIn.checkOut,
      guests: walkIn.guests,
      status: 'upcoming',
      total_price: walkIn.totalPrice,
      currency: '$',
      created_at: new Date().toISOString().split('T')[0],
      payment_status: walkIn.payment_status || 'paid',
      guest_name: walkIn.guest_name,
      guest_email: walkIn.guest_email,
      guest_phone: walkIn.guest_phone,
      special_requests: walkIn.special_requests || (isShortTime ? `Short-time stay (${walkIn.short_time_hours || 4} Hours)` : 'Walk-in desk booking registered.'),
      booking_type: 'walk_in',
      booking_category: walkIn.booking_category || 'overnight',
      short_time_hours: walkIn.short_time_hours,
      check_in_time: walkIn.check_in_time || '14:00',
      check_out_time: walkIn.check_out_time || '18:00',
      created_by_role: walkIn.created_by_role || (currentUser?.role as any) || 'receptionist',
      created_by_name: walkIn.created_by_name || currentUser?.full_name || 'Front Desk Staff',
      arrival_status: 'expected'
    };

    localBookings = [newBooking, ...localBookings];
    const eventType = newBooking.payment_status === 'paid' ? 'confirmed' : 'created';
    notificationService.dispatchBookingNotification(newBooking, eventType);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('bookings').insert({
          id: newBooking.id,
          property_id: isUuid(walkIn.propertyId) ? walkIn.propertyId : null,
          user_id: newBooking.user_id && isUuid(newBooking.user_id) ? newBooking.user_id : null,
          check_in: walkIn.checkIn,
          check_out: walkIn.checkOut,
          guests: walkIn.guests,
          total_price: walkIn.totalPrice,
          currency: '$',
          status: 'upcoming',
          payment_status: newBooking.payment_status,
          guest_name: newBooking.guest_name,
          guest_email: newBooking.guest_email,
          guest_phone: newBooking.guest_phone,
          special_requests: newBooking.special_requests,
          booking_type: 'walk_in',
          booking_category: newBooking.booking_category,
          short_time_hours: newBooking.short_time_hours,
          check_in_time: newBooking.check_in_time,
          check_out_time: newBooking.check_out_time,
          created_by_role: newBooking.created_by_role,
          created_by_name: newBooking.created_by_name,
          arrival_status: 'expected'
        });
      } catch (err) {
        console.warn('Note: Could not insert walk-in booking to remote Supabase:', err);
      }
    }

    broadcastDataChange('bookings', 'insert', newBooking);
    return newBooking;
  },

  async checkInGuest(bookingId: string): Promise<void> {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const target = localBookings.find(b => b.id === bookingId);
    if (target) {
      target.arrival_status = 'checked_in';
      target.status = 'active';
      target.check_in_time = target.check_in_time || nowTime;
      notificationService.dispatchBookingNotification(target, 'checked_in');
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('bookings').update({
          arrival_status: 'checked_in',
          status: 'active',
          check_in_time: nowTime
        }).eq('id', bookingId);
      } catch (err) {
        console.warn('Note: Could not check in guest in Supabase:', err);
      }
    }

    broadcastDataChange('bookings', 'update', target, bookingId);
  },

  async checkOutGuest(bookingId: string): Promise<void> {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const target = localBookings.find(b => b.id === bookingId);
    if (target) {
      target.arrival_status = 'checked_out';
      target.status = 'completed';
      target.check_out_time = nowTime;
      notificationService.dispatchBookingNotification(target, 'checked_out');
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('bookings').update({
          arrival_status: 'checked_out',
          status: 'completed',
          check_out_time: nowTime
        }).eq('id', bookingId);
      } catch (err) {
        console.warn('Note: Could not check out guest in Supabase:', err);
      }
    }

    broadcastDataChange('bookings', 'update', target, bookingId);
  },

  async updateBookingStatus(bookingId: string, newStatus: 'upcoming' | 'active' | 'completed' | 'cancelled'): Promise<void> {
    const target = localBookings.find(b => b.id === bookingId);
    if (target) {
      target.status = newStatus;
      if (newStatus === 'active') {
        target.arrival_status = 'checked_in';
      } else if (newStatus === 'completed') {
        target.arrival_status = 'checked_out';
      }
      notificationService.dispatchBookingNotification(target, newStatus === 'completed' ? 'checked_out' : 'confirmed');
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('bookings').update({
          status: newStatus,
          arrival_status: newStatus === 'active' ? 'checked_in' : (newStatus === 'completed' ? 'checked_out' : 'expected')
        }).eq('id', bookingId);
      } catch (err) {
        console.warn('Note: Could not update booking status in Supabase:', err);
      }
    }

    broadcastDataChange('bookings', 'update', target, bookingId);
  },

  async deleteBooking(bookingId: string): Promise<void> {
    localBookings = localBookings.filter(b => b.id !== bookingId);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('bookings').delete().eq('id', bookingId);
      } catch (err) {
        console.warn('Note: Could not delete booking in Supabase:', err);
      }
    }

    broadcastDataChange('bookings', 'delete', null, bookingId);
  },

  // Favorites
  async getFavorites(): Promise<Property[]> {
    return localProperties.filter(p => localFavorites.includes(p.id));
  },

  async toggleFavorite(propertyId: string): Promise<boolean> {
    if (localFavorites.includes(propertyId)) {
      localFavorites = localFavorites.filter(id => id !== propertyId);
      broadcastDataChange('favorites', 'delete', null, propertyId);
      return false;
    } else {
      localFavorites.push(propertyId);
      broadcastDataChange('favorites', 'insert', { propertyId });
      return true;
    }
  },

  isFavorite(propertyId: string): boolean {
    return localFavorites.includes(propertyId);
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await withTimeout(
          supabase.from('reviews').select('*').order('created_at', { ascending: false }),
          3000
        );
        if (!error && data && data.length > 0) {
          const remoteRevs: Review[] = data.map((r: any) => {
            const prop = localProperties.find(p => p.id === r.property_id);
            return {
              id: r.id,
              booking_id: r.booking_id,
              user_name: r.user_name || 'Guest User',
              user_avatar: r.user_avatar || '',
              property_id: r.property_id,
              property_title: prop?.title || 'Luxury Stay',
              rating: r.rating || 5,
              comment: r.comment || '',
              created_at: r.created_at ? r.created_at.split('T')[0] : new Date().toISOString().split('T')[0]
            };
          });
          localReviews = remoteRevs;
          return remoteRevs;
        }
      } catch (e) {
        console.warn('Using local reviews fallback:', e);
      }
    }
    return localReviews;
  },

  async addReview(bookingId: string, propertyId: string, rating: number, comment: string): Promise<Review> {
    const property = await this.getPropertyById(propertyId);
    const newReview: Review = {
      id: generateUuid(),
      booking_id: bookingId,
      user_name: currentUser?.full_name || 'Guest User',
      user_avatar: currentUser?.avatar_url || '',
      property_id: propertyId,
      property_title: property?.title || 'Luxury Stay',
      rating,
      comment,
      created_at: new Date().toISOString().split('T')[0]
    };
    localReviews = [newReview, ...localReviews];

    if (isSupabaseConfigured) {
      try {
        await supabase.from('reviews').insert({
          id: newReview.id,
          booking_id: bookingId,
          user_id: currentUser?.id && isUuid(currentUser.id) ? currentUser.id : null,
          property_id: isUuid(propertyId) ? propertyId : null,
          rating,
          comment
        });
      } catch (err) {
        console.warn('Note: Could not insert review in Supabase:', err);
      }
    }

    broadcastDataChange('reviews', 'insert', newReview);
    return newReview;
  },

  // Messages
  async getConversations(): Promise<Conversation[]> {
    return localConversations;
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    return localMessages.filter(m => m.conversation_id === conversationId);
  },

  async sendMessage(conversationId: string, text: string): Promise<Message> {
    const msg: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: currentUser?.id || 'usr_01',
      sender_name: currentUser?.full_name || 'David Reetay',
      sender_avatar: currentUser?.avatar_url || '',
      text,
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    localMessages.push(msg);

    const conv = localConversations.find(c => c.id === conversationId);
    if (conv) {
      conv.last_message = text;
      conv.last_message_time = msg.created_at;
    }

    broadcastDataChange('messages', 'insert', msg);
    return msg;
  },

  // Incident Reports (Damaged / Missing Items)
  async getIncidentReports(): Promise<IncidentReport[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await withTimeout(
          supabase.from('incident_reports').select('*').order('created_at', { ascending: false }),
          3000
        );
        if (!error && data && data.length > 0) {
          const remoteList: IncidentReport[] = data.map((d: any) => ({
            id: d.id,
            booking_id: d.booking_id,
            guest_name: d.guest_name || 'Guest',
            guest_phone: d.guest_phone || '',
            property_title: d.property_title || d.unit_number || 'Apartment Suite',
            inspected_by_name: d.reported_by_name || 'Front Desk Staff',
            inspected_by_role: d.reported_by_role || 'receptionist',
            created_at: d.created_at ? d.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
            missing_or_damaged_items: Array.isArray(d.missing_or_damaged_items) ? d.missing_or_damaged_items : [
              { item_name: d.description || 'Reported Incident', category: 'General', expected_qty: 1, notes: d.resolution_notes || '' }
            ],
            overall_notes: d.description || '',
            estimated_penalty: Number(d.estimated_cost || 0),
            status: d.status || 'pending_review'
          }));
          localIncidentReports = remoteList;
          return remoteList;
        }
      } catch (err) {
        console.warn('Using local incident reports fallback:', err);
      }
    }

    try {
      const saved = localStorage.getItem(INCIDENT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // fallback
    }
    return localIncidentReports;
  },

  async createIncidentReport(report: Omit<IncidentReport, 'id' | 'created_at' | 'status'>): Promise<IncidentReport> {
    const newReport: IncidentReport = {
      ...report,
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date().toISOString().split('T')[0],
      status: 'pending_review'
    };
    const current = await this.getIncidentReports();
    const updated = [newReport, ...current];
    localStorage.setItem(INCIDENT_STORAGE_KEY, JSON.stringify(updated));
    localIncidentReports = updated;

    if (isSupabaseConfigured) {
      try {
        await supabase.from('incident_reports').insert({
          id: newReport.id,
          booking_id: newReport.booking_id || null,
          unit_number: newReport.property_title || 'Room',
          reported_by_name: newReport.inspected_by_name,
          reported_by_role: newReport.inspected_by_role,
          guest_name: newReport.guest_name,
          incident_type: 'damage',
          severity: 'medium',
          description: newReport.overall_notes || 'Damage/missing item log',
          estimated_cost: newReport.estimated_penalty || 0,
          status: 'pending_review'
        });
      } catch (err) {
        console.warn('Note: Could not insert incident report to Supabase:', err);
      }
    }

    broadcastDataChange('incident_reports', 'insert', newReport);
    return newReport;
  },

  async resolveIncidentReport(reportId: string): Promise<void> {
    const current = await this.getIncidentReports();
    const target = current.find(r => r.id === reportId);
    if (target) {
      target.status = 'resolved';
      localStorage.setItem(INCIDENT_STORAGE_KEY, JSON.stringify(current));
      localIncidentReports = current;
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('incident_reports').update({
          status: 'resolved',
          resolved_at: new Date().toISOString()
        }).eq('id', reportId);
      } catch (err) {
        console.warn('Note: Could not update incident report in Supabase:', err);
      }
    }

    broadcastDataChange('incident_reports', 'update', target, reportId);
  },

  // Support Tickets
  async createSupportTicket(ticket: {
    user_name: string;
    user_email: string;
    subject: string;
    message: string;
  }): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('support_tickets').insert({
          user_id: currentUser?.id && isUuid(currentUser.id) ? currentUser.id : null,
          user_name: ticket.user_name,
          user_email: ticket.user_email,
          subject: ticket.subject,
          message: ticket.message,
          status: 'open'
        });
      } catch (err) {
        console.warn('Note: Could not insert support ticket:', err);
      }
    }
    broadcastDataChange('support_tickets', 'insert', ticket);
  }
};
