-- Reetay Apartments - Supabase PostgreSQL Database Schema
-- Version 1.0

-- Create custom enum types
CREATE TYPE user_role AS ENUM ('guest', 'host', 'receptionist', 'manager', 'admin');
CREATE TYPE vertical_type AS ENUM ('stays', 'cars', 'experiences');
CREATE TYPE booking_status AS ENUM ('upcoming', 'active', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'refunded');

-- 1. Users Table (Extends auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  role user_role DEFAULT 'guest',
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Properties Table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  vertical vertical_type DEFAULT 'stays' NOT NULL,
  city TEXT NOT NULL,
  area TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION DEFAULT 5.6037,
  longitude DOUBLE PRECISION DEFAULT -0.1870,
  price_per_night DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT '$' NOT NULL,
  max_guests INT DEFAULT 2 NOT NULL,
  bedrooms INT DEFAULT 1 NOT NULL,
  beds INT DEFAULT 1 NOT NULL,
  bathrooms DECIMAL(3,1) DEFAULT 1 NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  badge TEXT,
  rating DECIMAL(3,2) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Bookings Table
CREATE TABLE public.bookings (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INT DEFAULT 1 NOT NULL,
  status booking_status DEFAULT 'upcoming' NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT '$' NOT NULL,
  payment_status payment_status DEFAULT 'paid',
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  special_requests TEXT,
  booking_type VARCHAR(20) DEFAULT 'online',
  booking_category VARCHAR(20) DEFAULT 'overnight',
  short_time_hours INT,
  check_in_time VARCHAR(10),
  check_out_time VARCHAR(10),
  created_by_role VARCHAR(20) DEFAULT 'guest',
  created_by_name TEXT,
  arrival_status VARCHAR(20) DEFAULT 'expected',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Reviews Table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id TEXT REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Favorites Table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, property_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Allow public read access to properties
CREATE POLICY "Public properties read access" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Public reviews read access" ON public.reviews FOR SELECT USING (true);
