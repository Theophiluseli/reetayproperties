import { createClient } from '@supabase/supabase-js';
import { Property, Booking, Review, Conversation, Message, User } from '../types';
import { MOCK_PROPERTIES, MOCK_BOOKINGS, MOCK_REVIEWS, MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_USER, MOCK_RECEPTIONIST_USER, MOCK_MANAGER_USER } from '../data/mockData';
import { notificationService } from './notificationService';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  import.meta.env.VITE_SUPABASE_URL !== 'https://placeholder.supabase.co'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// In-memory data store for local session persistence when Supabase isn't connected
let localProperties = [...MOCK_PROPERTIES];
let localBookings = [...MOCK_BOOKINGS];
let localReviews = [...MOCK_REVIEWS];
let localFavorites: string[] = ['prop-1'];
let localConversations = [...MOCK_CONVERSATIONS];
let localMessages = [...MOCK_MESSAGES];
let currentUser: User | null = MOCK_USER;

export const MOCK_ADMIN_USER: User = {
  id: 'admin_01',
  full_name: 'Platform Administrator',
  email: 'admin@reetay.com',
  avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
  role: 'admin',
  phone: '+233 20 000 0000',
  created_at: '2025-01-01'
};

export const dataService = {
  // Authentication
  async getCurrentUser(): Promise<User | null> {
    if (isSupabaseConfigured) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      return {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || 'Guest User',
        role: user.user_metadata?.role || 'guest',
        created_at: user.created_at
      };
    }
    return currentUser;
  },

  async login(email: string): Promise<User> {
    if (email.toLowerCase().includes('reception')) {
      currentUser = MOCK_RECEPTIONIST_USER;
      return MOCK_RECEPTIONIST_USER;
    }
    if (email.toLowerCase().includes('manager')) {
      currentUser = MOCK_MANAGER_USER;
      return MOCK_MANAGER_USER;
    }
    if (email.toLowerCase().includes('admin')) {
      currentUser = MOCK_ADMIN_USER;
      return MOCK_ADMIN_USER;
    }
    currentUser = {
      ...MOCK_USER,
      email: email || MOCK_USER.email,
      full_name: email ? email.split('@')[0] : MOCK_USER.full_name
    };
    return currentUser;
  },

  async receptionistLogin(email: string, pass: string): Promise<User> {
    currentUser = MOCK_RECEPTIONIST_USER;
    return MOCK_RECEPTIONIST_USER;
  },

  async managerLogin(email: string, pass: string): Promise<User> {
    currentUser = MOCK_MANAGER_USER;
    return MOCK_MANAGER_USER;
  },

  async adminLogin(email: string, pass: string): Promise<User> {
    currentUser = MOCK_ADMIN_USER;
    return MOCK_ADMIN_USER;
  },

  async createProperty(newProp: Partial<Property>): Promise<Property> {
    const created: Property = {
      id: `prop-${Date.now()}`,
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
      currency: '$',
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
    return localProperties[idx];
  },

  async togglePropertyStatus(id: string): Promise<Property | null> {
    const target = localProperties.find(p => p.id === id);
    if (!target) return null;
    target.status = target.status === 'published' ? 'draft' : 'published';
    return target;
  },

  async deleteProperty(id: string): Promise<void> {
    localProperties = localProperties.filter(p => p.id !== id);
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    currentUser = null;
  },

  // Properties / Search
  async getProperties(vertical: string = 'stays', query?: string, amenity?: string): Promise<Property[]> {
    if (isSupabaseConfigured) {
      let req = supabase.from('properties').select('*').eq('vertical', vertical);
      if (query) {
        req = req.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
      }
      const { data, error } = await req;
      if (!error && data && data.length > 0) return data as Property[];
    }

    // Local fallback search
    return localProperties.filter(p => {
      if (p.vertical !== vertical) return false;
      if (query) {
        const q = query.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchLocation = p.location.area.toLowerCase().includes(q) || p.location.city.toLowerCase().includes(q);
        if (!matchTitle && !matchLocation) return false;
      }
      if (amenity) {
        if (!p.amenities.includes(amenity)) return false;
      }
      return true;
    });
  },

  async getPropertyById(id: string): Promise<Property | null> {
    if (isSupabaseConfigured) {
      const { data } = await supabase.from('properties').select('*').eq('id', id).single();
      if (data) return data as Property;
    }
    return localProperties.find(p => p.id === id) || null;
  },

  // Bookings & Calendar Availability
  async getBookings(): Promise<Booking[]> {
    if (isSupabaseConfigured) {
      const { data } = await supabase.from('bookings').select('*, property:properties(*)');
      if (data) return data as Booking[];
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
        return true; // Overlap detected!
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
      payment_status: 'paid',
      guest_name: guestInfo?.guest_name || currentUser?.full_name || 'David Reetay',
      guest_email: guestInfo?.guest_email || currentUser?.email || 'david@reetay.com',
      guest_phone: guestInfo?.guest_phone || currentUser?.phone || '+233 24 123 4567',
      special_requests: guestInfo?.special_requests || '',
      booking_type: 'online'
    };

    localBookings = [newBooking, ...localBookings];
    notificationService.dispatchBookingNotification(newBooking, 'created');

    if (isSupabaseConfigured) {
      await supabase.from('bookings').insert({
        id: newBooking.id,
        property_id: propertyId,
        user_id: newBooking.user_id,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        total_price: totalPrice,
        status: 'upcoming',
        guest_name: newBooking.guest_name,
        guest_email: newBooking.guest_email,
        guest_phone: newBooking.guest_phone,
        special_requests: newBooking.special_requests,
        booking_type: 'online'
      });
    }

    return newBooking;
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
    notificationService.dispatchBookingNotification(newBooking, 'created');
    return newBooking;
  },

  async checkInGuest(bookingId: string): Promise<void> {
    const target = localBookings.find(b => b.id === bookingId);
    if (target) {
      target.arrival_status = 'checked_in';
      target.status = 'active';
      notificationService.dispatchBookingNotification(target, 'checked_in');
    }
  },

  async checkOutGuest(bookingId: string): Promise<void> {
    const target = localBookings.find(b => b.id === bookingId);
    if (target) {
      target.arrival_status = 'checked_out';
      target.status = 'completed';
      notificationService.dispatchBookingNotification(target, 'checked_out');
    }
  },

  async updateBookingStatus(bookingId: string, newStatus: 'upcoming' | 'active' | 'completed' | 'cancelled'): Promise<void> {
    const target = localBookings.find(b => b.id === bookingId);
    if (target) {
      target.status = newStatus;
      if (newStatus === 'upcoming' || newStatus === 'active') {
        notificationService.dispatchBookingNotification(target, 'confirmed');
      } else if (newStatus === 'completed') {
        target.arrival_status = 'checked_out';
        notificationService.dispatchBookingNotification(target, 'checked_out');
      }
    }
  },

  // Favorites
  async getFavorites(): Promise<Property[]> {
    return localProperties.filter(p => localFavorites.includes(p.id));
  },

  async toggleFavorite(propertyId: string): Promise<boolean> {
    if (localFavorites.includes(propertyId)) {
      localFavorites = localFavorites.filter(id => id !== propertyId);
      return false;
    } else {
      localFavorites.push(propertyId);
      return true;
    }
  },

  isFavorite(propertyId: string): boolean {
    return localFavorites.includes(propertyId);
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    return localReviews;
  },

  async addReview(bookingId: string, propertyId: string, rating: number, comment: string): Promise<Review> {
    const property = await this.getPropertyById(propertyId);
    const newReview: Review = {
      id: `rev-${Date.now()}`,
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

    // Update conversation preview
    const conv = localConversations.find(c => c.id === conversationId);
    if (conv) {
      conv.last_message = text;
      conv.last_message_time = msg.created_at;
    }

    return msg;
  }
};
