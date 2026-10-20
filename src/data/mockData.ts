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

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'The Reetay Grand Penthouse & Skyline Suite',
    description: 'Experience ultra-luxury living in the heart of Airport Residential Area. Features floor-to-ceiling panoramic glass windows, private infinity plunge pool, automated smart home control, high-speed WiFi, and 24/7 executive concierge service.',
    vertical: 'stays',
    location: {
      city: 'Accra',
      area: 'Airport Residential',
      address: '14 Independence Avenue, Accra',
      lat: 5.6037,
      lng: -0.1870
    },
    price_per_night: 420,
    currency: '$',
    max_guests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 3.5,
    amenities: [
      'Private Swimming Pool',
      'Air Conditioning',
      'Fully Equipped Kitchen',
      'High-Speed WiFi',
      '24/7 Security & Concierge',
      'Gym & Spa Access',
      'Generator Power Backup',
      'Free Underground Parking',
      'Balcony View'
    ],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80'
    ],
    status: 'published',
    rating: 4.95,
    review_count: 38,
    host: {
      name: 'Reetay Luxury Hospitality',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      superhost: true
    }
  },
  {
    id: 'prop-2',
    title: 'Cantonments Garden Villa with Private Pool',
    description: 'Serene luxury sanctuary nested in Cantonments diplomatic precinct. Lush tropical courtyard, heated private pool, Italian marble flooring, and gourmet chef kitchen.',
    vertical: 'stays',
    location: {
      city: 'Accra',
      area: 'Cantonments',
      address: '7 Cantonments Crescent, Accra',
      lat: 5.5800,
      lng: -0.1700
    },
    price_per_night: 350,
    currency: '$',
    max_guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    amenities: [
      'Air Conditioning',
      'Private Swimming Pool',
      'Fully Equipped Kitchen',
      'Refrigerator',
      'Microwave',
      'Smart TV & Netflix',
      'Washer & Dryer',
      'Generator Power Backup'
    ],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Popular',
    status: 'published',
    rating: 4.88,
    review_count: 24,
    host: {
      name: 'Elena Vance',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      superhost: true
    }
  },
  {
    id: 'prop-3',
    title: 'Labone Modern Glass Loft & Terrace',
    description: 'Architect-designed split-level loft in vibrant Labone. Walkable to Accra’s finest dining and coffee bars. Rooftop lounge terrace with sunset ocean views.',
    vertical: 'stays',
    location: {
      city: 'Accra',
      area: 'Labone',
      address: '22 Nyaniba Link, Labone',
      lat: 5.5650,
      lng: -0.1750
    },
    price_per_night: 220,
    currency: '$',
    max_guests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1.5,
    amenities: [
      'Air Conditioning',
      'Extra Pillows & Blankets',
      'Electric Stove',
      'High-Speed WiFi',
      'Workstation Laptop Desk',
      'Balcony View',
      'Elevator Access'
    ],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'New Listing',
    status: 'published',
    rating: 4.92,
    review_count: 15,
    host: {
      name: 'Marcus Quaye',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      superhost: false
    }
  },
  {
    id: 'prop-4',
    title: 'East Legon Executive Sanctuary Apartment',
    description: 'Chic 3-bedroom serviced apartment with modern minimalist aesthetic, designer furniture, high-speed fiber internet, and dedicated butler service.',
    vertical: 'stays',
    location: {
      city: 'Accra',
      area: 'East Legon',
      address: '45 Lagos Avenue, East Legon',
      lat: 5.6350,
      lng: -0.1600
    },
    price_per_night: 280,
    currency: '$',
    max_guests: 5,
    bedrooms: 3,
    beds: 3,
    bathrooms: 3,
    amenities: [
      'Air Conditioning',
      'Fully Equipped Kitchen',
      'Refrigerator',
      'Microwave',
      'Electric Stove',
      'Free Parking',
      'Security System',
      'Generator Power Backup'
    ],
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Top Rated',
    status: 'published',
    rating: 4.97,
    review_count: 42,
    host: {
      name: 'Reetay Luxury Hospitality',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      superhost: true
    }
  },
  {
    id: 'prop-5',
    title: 'Aburi Mountain Ocean-View Villa',
    description: 'Perched in the cool hilltops of Aburi, just 30 minutes drive from Accra. Enjoy panoramic green mountain views, crisp fresh air, fire pit, and private botanical garden.',
    vertical: 'stays',
    location: {
      city: 'Aburi',
      area: 'Aburi Hills',
      address: 'Aburi Botanical Crest, Aburi',
      lat: 5.8480,
      lng: -0.1740
    },
    price_per_night: 310,
    currency: '$',
    max_guests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 3,
    amenities: [
      'Private Swimming Pool',
      'Fire Pit & BBQ Grill',
      'Extra Pillows & Blankets',
      'Fully Equipped Kitchen',
      'High-Speed WiFi',
      'Free Parking'
    ],
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Weekend Getaway',
    status: 'published',
    rating: 4.90,
    review_count: 19,
    host: {
      name: 'Philip',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      superhost: true
    }
  },
  {
    id: 'car-1',
    title: 'Airport Drop-offs',
    description: 'Executive airport transfer service with premium van. High comfort, luggage space, and professional driver.',
    vertical: 'cars',
    location: {
      city: 'Accra',
      area: 'Kotoka Int. Airport',
      address: 'Kotoka International Airport, VIP Arrivals',
      lat: 5.6037,
      lng: -0.1870
    },
    price_per_night: 40,
    price_unit_label: 'Starting from',
    currency: '$',
    max_guests: 6,
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    vehicle_type: 'Van',
    amenities: [
      'GPS',
      'Air-condition',
      'Bluetooth audio connectivity',
      'Spacious seating & clean interiors'
    ],
    images: [
      '/images/cars/airport_dropoff.jpg'
    ],
    status: 'published',
    rating: 5.0,
    review_count: 12,
    host: {
      name: 'Africa Luxury Fleet',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      superhost: true
    }
  },
  {
    id: 'car-2',
    title: 'Toyota Coaster - Comfortable Group Transport',
    description: 'Ideal for group tours, executive delegation, and family transfers across Accra and beyond.',
    vertical: 'cars',
    location: {
      city: 'Accra',
      area: 'Airport Residential',
      address: 'Liberation Road, Accra',
      lat: 5.6040,
      lng: -0.1860
    },
    price_per_night: 20,
    price_unit_label: 'Starting from',
    currency: '$',
    max_guests: 6,
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    vehicle_type: 'Minibus',
    amenities: [
      'GPS',
      'Air-condition',
      'Bluetooth audio connectivity',
      'Spacious seating & clean interiors'
    ],
    images: [
      '/images/cars/toyota_coaster.jpg'
    ],
    status: 'published',
    rating: 4.9,
    review_count: 8,
    host: {
      name: 'Africa Luxury Fleet',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      superhost: true
    }
  },
  {
    id: 'car-3',
    title: 'Hyundai Santa Fe - Spacious Comfort & Style',
    description: 'Modern luxury SUV offering superior handling, leather interior, and dynamic safety features.',
    vertical: 'cars',
    location: {
      city: 'Accra',
      area: 'Cantonments',
      address: '5 Circular Road, Cantonments',
      lat: 5.5800,
      lng: -0.1700
    },
    price_per_night: 120,
    price_unit_label: 'Starting from',
    currency: '$',
    max_guests: 6,
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    vehicle_type: 'SUV',
    amenities: [
      'GPS',
      'Air-condition',
      'Bluetooth audio connectivity',
      'USB / Type-C charging ports'
    ],
    images: [
      '/images/cars/hyundai_santa_fe.jpg'
    ],
    status: 'published',
    rating: 4.95,
    review_count: 15,
    host: {
      name: 'Africa Luxury Fleet',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      superhost: true
    }
  },
  {
    id: 'car-4',
    title: 'Hyundai Sonata - Elegant Comfort & Style',
    description: 'Sleek executive sedan with premium sound system, climate control, and smooth highway ride.',
    vertical: 'cars',
    location: {
      city: 'Accra',
      area: 'East Legon',
      address: 'Lagos Avenue, East Legon',
      lat: 5.6350,
      lng: -0.1600
    },
    price_per_night: 120,
    price_unit_label: 'Starting from',
    currency: '$',
    max_guests: 6,
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    vehicle_type: 'Sedan',
    amenities: [
      'GPS',
      'Air-condition',
      'Bluetooth audio connectivity',
      'Spacious seating & clean interiors'
    ],
    images: [
      '/images/cars/hyundai_sonata.jpg'
    ],
    status: 'published',
    rating: 4.88,
    review_count: 19,
    host: {
      name: 'Africa Luxury Fleet',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      superhost: true
    }
  },
  {
    id: 'car-5',
    title: 'Land Cruiser - Rugged Power & Premium Luxury',
    description: 'Flagship 4x4 SUV built for all-terrain comfort. Tinted windows, luxury leather lounge seats, and power sunroof.',
    vertical: 'cars',
    location: {
      city: 'Accra',
      area: 'Airport Residential',
      address: '14 Independence Avenue',
      lat: 5.6037,
      lng: -0.1870
    },
    price_per_night: 220,
    price_unit_label: 'Starting from',
    currency: '$',
    max_guests: 5,
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    vehicle_type: 'SUV',
    amenities: [
      'GPS',
      'Air-condition',
      'Bluetooth audio connectivity',
      'Spacious seating & clean interiors'
    ],
    images: [
      '/images/cars/land_cruiser.jpg'
    ],
    status: 'published',
    rating: 5.0,
    review_count: 32,
    host: {
      name: 'Africa Luxury Fleet',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      superhost: true
    }
  },
  {
    id: 'car-6',
    title: 'Toyota Yaris - Compact & City-Ready',
    description: 'Fuel-efficient, easy to park, and extremely comfortable for city commutes and quick business trips.',
    vertical: 'cars',
    location: {
      city: 'Accra',
      area: 'Osu',
      address: 'Oxford Street, Osu',
      lat: 5.5560,
      lng: -0.1800
    },
    price_per_night: 75,
    price_unit_label: 'Starting from',
    currency: '$',
    max_guests: 5,
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    vehicle_type: 'Sedan',
    amenities: [
      'Air-condition',
      'Bluetooth audio connectivity',
      'USB / Type-C charging ports',
      'Spacious seating & clean interiors'
    ],
    images: [
      '/images/cars/toyota_yaris.jpg'
    ],
    status: 'published',
    rating: 4.85,
    review_count: 14,
    host: {
      name: 'Africa Luxury Fleet',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      superhost: true
    }
  },
  {
    id: 'car-7',
    title: 'Mitsubishi Eclipse cross - Reliable & Great Handling',
    description: 'Sporty crossover SUV featuring panoramic roof, modern touchscreen cockpit, and dynamic AWD.',
    vertical: 'cars',
    location: {
      city: 'Accra',
      area: 'Labone',
      address: 'Nyaniba Link, Labone',
      lat: 5.5650,
      lng: -0.1750
    },
    price_per_night: 75,
    price_unit_label: 'Starting from',
    currency: '$',
    max_guests: 5,
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    vehicle_type: 'Crossover',
    amenities: [
      'GPS',
      'Air-condition',
      'Bluetooth audio connectivity',
      'USB / Type-C charging ports'
    ],
    images: [
      '/images/cars/mitsubishi_eclipse.jpg'
    ],
    status: 'published',
    rating: 4.92,
    review_count: 11,
    host: {
      name: 'Africa Luxury Fleet',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      superhost: true
    }
  },
  {
    id: 'car-8',
    title: 'Toyota Corolla 2023 - Comfort Meets Efficiency',
    description: 'Brand-new Toyota Corolla with Apple CarPlay, Android Auto, backup camera, and ultra-smooth ride.',
    vertical: 'cars',
    location: {
      city: 'Accra',
      area: 'Roman Ridge',
      address: 'Roman Ridge Expressway',
      lat: 5.6100,
      lng: -0.1900
    },
    price_per_night: 95,
    price_unit_label: 'Starting from',
    currency: '$',
    max_guests: 5,
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    vehicle_type: 'Sedan',
    amenities: [
      'GPS',
      'Air-condition',
      'Bluetooth audio connectivity',
      'Spacious seating & clean interiors'
    ],
    images: [
      '/images/cars/toyota_corolla.jpg'
    ],
    status: 'published',
    rating: 4.97,
    review_count: 22,
    host: {
      name: 'Africa Luxury Fleet',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      superhost: true
    }
  },
  {
    id: 'car-9',
    title: 'Toyota Highlander - Premium Space & Comfort',
    description: 'Executive 7-seater SUV with premium leather lounge, triple-zone climate control, and powerful V6 engine.',
    vertical: 'cars',
    location: {
      city: 'Accra',
      area: 'Airport Residential',
      address: 'Kotoka VIP Drive, Airport Residential',
      lat: 5.6037,
      lng: -0.1870
    },
    price_per_night: 180,
    price_unit_label: 'Starting from',
    currency: '$',
    max_guests: 5,
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    vehicle_type: 'SUV',
    amenities: [
      'GPS',
      'Air-condition',
      'Bluetooth audio connectivity',
      'USB / Type-C charging ports'
    ],
    images: [
      '/images/cars/toyota_highlander.jpg'
    ],
    status: 'published',
    rating: 5.0,
    review_count: 1,
    host: {
      name: 'Africa Luxury Fleet',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      superhost: true
    }
  },
  {
    id: 'car-10',
    title: 'Toyota Hiace Van - Spacious Transport & Group Travel',
    description: 'Heavy-duty passenger van for executive group travel, event shuttles, and airport VIP pick-ups.',
    vertical: 'cars',
    location: {
      city: 'Accra',
      area: 'Airport Residential',
      address: 'Airport Commercial Area, Accra',
      lat: 5.6045,
      lng: -0.1855
    },
    price_per_night: 180,
    price_unit_label: 'Starting from',
    currency: '$',
    max_guests: 5,
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
    fuel_type: 'Petrol',
    transmission: 'Automatic',
    vehicle_type: 'Van',
    amenities: [
      'GPS',
      'Air-condition',
      'Bluetooth audio connectivity',
      'Spacious seating & clean interiors'
    ],
    images: [
      '/images/cars/toyota_hiace_van.jpg'
    ],
    status: 'published',
    rating: 4.95,
    review_count: 18,
    host: {
      name: 'Africa Luxury Fleet',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      superhost: true
    }
  },
  {
    id: 'exp-1',
    title: 'VIP Private Helicopter Tour over Accra Coastline & Kakum Canopy',
    description: 'Soar high above the glittering Accra coastline, Jamestown Lighthouse, and lush rainforest canopy in a state-of-the-art Eurocopter. Includes champagne toast and private photographer.',
    vertical: 'experiences',
    location: {
      city: 'Accra',
      area: 'Airport Helipad',
      address: 'Airport Aviation Hangar 3',
      lat: 5.6050,
      lng: -0.1850
    },
    price_per_night: 750,
    currency: '$',
    max_guests: 3,
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
    amenities: [
      'Helicopter Flight',
      'Private Photographer',
      'Champagne Toast',
      'Hotel Pickup'
    ],
    images: [
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80'
    ],
    badge: 'Exclusive',
    status: 'published',
    rating: 4.98,
    review_count: 29,
    host: {
      name: 'Reetay Experiences',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      superhost: true
    }
  }
];

// Active bookings array (clean calendar for new guest bookings)
export const MOCK_BOOKINGS: Booking[] = [];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    booking_id: 'BK-77410',
    user_name: 'David Reetay',
    user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    property_id: 'prop-2',
    property_title: 'Cantonments Garden Villa with Private Pool',
    rating: 5,
    comment: 'Exceptional stay! The pool was spotless and private. Reetay hospitality team handled our airport transfers and check-in effortlessly. Highly recommended!',
    created_at: '2026-07-05'
  }
];

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
