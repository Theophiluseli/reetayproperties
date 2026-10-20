import { Property, Booking, Review, Conversation, Message, User } from '../types';

export const MOCK_USER: User = {
  id: 'usr_01',
  full_name: 'David Reetay',
  email: 'david@reetay.com',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  role: 'guest',
  phone: '+233 24 123 4567',
  created_at: '2025-01-15'
};

export const MOCK_RECEPTIONIST_USER: User = {
  id: 'rec_01',
  full_name: 'Abena Osei (Front Desk Receptionist)',
  email: 'reception@reetay.com',
  avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  role: 'receptionist',
  phone: '+233 24 999 1111',
  created_at: '2025-02-01'
};

export const MOCK_MANAGER_USER: User = {
  id: 'mgt_01',
  full_name: 'Philip (Operations Manager)',
  email: 'manager@reetay.com',
  avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  role: 'manager',
  phone: '+233 20 888 2222',
  created_at: '2025-01-10'
};

// All demo properties permanently cleared - only real admin-listed inventory appears
export const MOCK_PROPERTIES: Property[] = [];

// Active bookings array (clean calendar for new guest bookings)
export const MOCK_BOOKINGS: Booking[] = [];

// Reviews array
export const MOCK_REVIEWS: Review[] = [];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Reetay Admin & Support Desk',
    subtitle: 'Direct Customer Support',
    last_message: 'Welcome to Reetay Properties. How can we assist you today?',
    last_message_time: '10:45 AM',
    unread_count: 0,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
  }
];

export const MOCK_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    conversation_id: 'conv-1',
    sender_id: 'admin_01',
    sender_name: 'Reetay Concierge',
    sender_avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    text: 'Welcome to Reetay Properties. Our concierge desk is at your service 24/7.',
    created_at: '10:00 AM',
    is_admin: true
  }
];

export const AMENITY_CHIPS = [
  'Air Conditioning',
  'Private Swimming Pool',
  'Fully Equipped Kitchen',
  'Extra Pillows & Blankets',
  'Refrigerator',
  'Microwave',
  'Electric Stove',
  'High-Speed WiFi',
  '24/7 Security',
  'Generator Power Backup',
  'Free Parking',
  'Smart TV & Netflix',
  'Washer & Dryer'
];

export const CAR_AMENITY_CHIPS = [
  'GPS',
  'Air-condition',
  'Bluetooth audio connectivity',
  'USB / Type-C charging ports',
  'Spacious seating & clean interiors',
  'Automatic Transmission',
  'Chauffeur Included',
  'Unlimited Mileage',
  'Leather Seats',
  'Child Safety Seat',
  'Backup Camera'
];

export const DEFAULT_PICKUP_LOCATIONS = [
  'Accra',
  'Kumasi',
  'Sunyani',
  'Takoradi',
  'Tamale',
  'Kotoka Airport VIP',
  'East Legon',
  'Airport Residential'
];

export const DEFAULT_DROPOFF_LOCATIONS = [
  'Cape Coast',
  'Ho',
  'Wa',
  'Sunyani',
  'Accra',
  'Kumasi',
  'Takoradi',
  'Tamale'
];
