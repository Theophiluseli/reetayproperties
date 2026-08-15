export type VerticalType = 'stays' | 'cars' | 'experiences';

export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role: 'guest' | 'host' | 'receptionist' | 'manager' | 'admin';
  phone?: string;
  created_at: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  vertical: VerticalType;
  location: {
    city: string;
    area: string;
    address: string;
    lat: number;
    lng: number;
    dropoff_location?: string;
  };
  price_per_night: number;
  price_unit_label?: string; // e.g. "Starting from", "per night", "per day"
  currency: string;
  max_guests: number; // or passengers count
  bedrooms: number;
  beds: number;
  bathrooms: number;
  fuel_type?: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
  transmission?: 'Automatic' | 'Manual';
  vehicle_type?: 'Sedan' | 'SUV' | 'Van' | 'Minibus' | 'Luxury' | 'Crossover';
  pickup_locations?: string[];
  dropoff_locations?: string[];
  amenities: string[];
  images: string[];
  house_rules?: string[];
  badge?: string;
  status: 'published' | 'draft';
  rating: number;
  review_count: number;
  host: {
    name: string;
    avatar: string;
    superhost: boolean;
  };
}

export interface Booking {
  id: string;
  user_id: string;
  property_id: string;
  property: Property;
  check_in: string;
  check_out: string;
  guests: number;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  total_price: number;
  currency: string;
  created_at: string;
  payment_status: 'paid' | 'pending' | 'refunded';
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  special_requests?: string;
  booking_type?: 'online' | 'walk_in';
  booking_category?: 'overnight' | 'short_time';
  short_time_hours?: number;
  check_in_time?: string;
  check_out_time?: string;
  created_by_role?: 'guest' | 'receptionist' | 'manager' | 'admin';
  created_by_name?: string;
  arrival_status?: 'expected' | 'checked_in' | 'checked_out';
}

export interface Review {
  id: string;
  booking_id: string;
  user_name: string;
  user_avatar: string;
  property_id: string;
  property_title: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  text: string;
  created_at: string;
  is_admin?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  subtitle: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  avatar: string;
}

export interface FilterState {
  destination: string;
  pickupLocation?: string;
  dropoffLocation?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  minPrice: number;
  maxPrice: number;
  selectedAmenities: string[];
  vertical: VerticalType;
}
