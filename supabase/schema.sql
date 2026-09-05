-- Reetay Apartments - Supabase PostgreSQL Database Schema & Migration
-- Version 2.0 (Enterprise RBAC, Password Management & Multi-Vertical Fleet)

-- 1. Create custom enum types safely
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('guest', 'host', 'receptionist', 'manager', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE vertical_type AS ENUM ('stays', 'cars', 'experiences');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('upcoming', 'active', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Users Table (Stores Guest Profiles & Staff Accounts with granular RBAC)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'guest',
  phone TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'suspended', 'inactive'
  permissions JSONB DEFAULT '{}'::jsonb, -- Granular RBAC permissions
  last_login TIMESTAMP WITH TIME ZONE,
  last_password_reset TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Idempotent Column Additions for Existing Users Table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_password_reset TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- 3. Properties Table (Stays, Vehicles & Experiences)
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
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
  status TEXT DEFAULT 'published', -- 'published', 'draft'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS badge TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 5.0;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS review_count INT DEFAULT 0;

-- 4. Bookings Table (Reservations, Short-Time Stays & Front Desk Walk-ins)
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
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

-- Idempotent Column Additions for Existing Bookings Table
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_type VARCHAR(20) DEFAULT 'online';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_category VARCHAR(20) DEFAULT 'overnight';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS short_time_hours INT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS check_in_time VARCHAR(10);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS check_out_time VARCHAR(10);
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS created_by_role VARCHAR(20) DEFAULT 'guest';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS created_by_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS arrival_status VARCHAR(20) DEFAULT 'expected';

-- 5. Incident Reports Table (Damaged / Missing Items & Housekeeping Turnover Logs)
CREATE TABLE IF NOT EXISTS public.incident_reports (
  id TEXT PRIMARY KEY,
  booking_id TEXT REFERENCES public.bookings(id) ON DELETE SET NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  unit_number TEXT NOT NULL,
  reported_by_name TEXT NOT NULL,
  reported_by_role TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  incident_type TEXT NOT NULL, -- 'damage', 'missing_item', 'maintenance', 'noise', 'cleanliness'
  severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  description TEXT NOT NULL,
  estimated_cost DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending_review' NOT NULL, -- 'pending_review', 'resolved', 'investigating'
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- 6. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id TEXT REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Support Tickets Table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Enable Row Level Security (RLS) across all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- 9. Complete Row Level Security (RLS) Policies

-- Users Policies
DROP POLICY IF EXISTS "Allow all users read access" ON public.users;
CREATE POLICY "Allow all users read access" ON public.users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all users insert access" ON public.users;
CREATE POLICY "Allow all users insert access" ON public.users FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all users update access" ON public.users;
CREATE POLICY "Allow all users update access" ON public.users FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all users delete access" ON public.users;
CREATE POLICY "Allow all users delete access" ON public.users FOR DELETE USING (true);

-- Properties Policies
DROP POLICY IF EXISTS "Allow all properties read access" ON public.properties;
CREATE POLICY "Allow all properties read access" ON public.properties FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all properties insert access" ON public.properties;
CREATE POLICY "Allow all properties insert access" ON public.properties FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all properties update access" ON public.properties;
CREATE POLICY "Allow all properties update access" ON public.properties FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all properties delete access" ON public.properties;
CREATE POLICY "Allow all properties delete access" ON public.properties FOR DELETE USING (true);

-- Bookings Policies
DROP POLICY IF EXISTS "Allow all bookings read access" ON public.bookings;
CREATE POLICY "Allow all bookings read access" ON public.bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all bookings insert access" ON public.bookings;
CREATE POLICY "Allow all bookings insert access" ON public.bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all bookings update access" ON public.bookings;
CREATE POLICY "Allow all bookings update access" ON public.bookings FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all bookings delete access" ON public.bookings;
CREATE POLICY "Allow all bookings delete access" ON public.bookings FOR DELETE USING (true);

-- Incident Reports Policies
DROP POLICY IF EXISTS "Allow all incident reports read access" ON public.incident_reports;
CREATE POLICY "Allow all incident reports read access" ON public.incident_reports FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all incident reports insert access" ON public.incident_reports;
CREATE POLICY "Allow all incident reports insert access" ON public.incident_reports FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all incident reports update access" ON public.incident_reports;
CREATE POLICY "Allow all incident reports update access" ON public.incident_reports FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all incident reports delete access" ON public.incident_reports;
CREATE POLICY "Allow all incident reports delete access" ON public.incident_reports FOR DELETE USING (true);

-- Reviews Policies
DROP POLICY IF EXISTS "Allow all reviews read access" ON public.reviews;
CREATE POLICY "Allow all reviews read access" ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all reviews insert access" ON public.reviews;
CREATE POLICY "Allow all reviews insert access" ON public.reviews FOR INSERT WITH CHECK (true);

-- Support Tickets Policies
DROP POLICY IF EXISTS "Allow all support tickets read access" ON public.support_tickets;
CREATE POLICY "Allow all support tickets read access" ON public.support_tickets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow all support tickets insert access" ON public.support_tickets;
CREATE POLICY "Allow all support tickets insert access" ON public.support_tickets FOR INSERT WITH CHECK (true);

-- 10. Seed Staff Accounts with Default Credentials and RBAC Permissions
INSERT INTO public.users (
  id,
  full_name,
  email,
  password_hash,
  role,
  phone,
  status,
  permissions
) VALUES 
(
  'a0000000-0000-0000-0000-000000000001',
  'Platform Administrator',
  'admin@reetay.com',
  'admin123',
  'admin',
  '+233 24 000 0001',
  'active',
  '{
    "can_register_walkins": true,
    "can_checkin_guests": true,
    "can_checkout_guests": true,
    "can_update_room_status": true,
    "can_edit_booking_status": true,
    "can_cancel_bookings": true,
    "can_delete_bookings": true,
    "can_override_pricing": true,
    "can_view_financials": true,
    "can_view_revenue_reports": true,
    "can_process_refunds": true,
    "can_manage_inventory": true,
    "can_lock_calendar": true,
    "can_send_messages": true,
    "can_settle_incidents": true
  }'::jsonb
),
(
  'a0000000-0000-0000-0000-000000000002',
  'Kwame Mensah',
  'manager@reetay.com',
  'staff123',
  'manager',
  '+233 24 555 0101',
  'active',
  '{
    "can_register_walkins": true,
    "can_checkin_guests": true,
    "can_checkout_guests": true,
    "can_update_room_status": true,
    "can_edit_booking_status": true,
    "can_cancel_bookings": true,
    "can_delete_bookings": true,
    "can_override_pricing": true,
    "can_view_financials": true,
    "can_view_revenue_reports": true,
    "can_process_refunds": true,
    "can_manage_inventory": true,
    "can_lock_calendar": true,
    "can_send_messages": true,
    "can_settle_incidents": true
  }'::jsonb
),
(
  'a0000000-0000-0000-0000-000000000003',
  'Abena Osei',
  'reception@reetay.com',
  'staff123',
  'receptionist',
  '+233 50 123 4567',
  'active',
  '{
    "can_register_walkins": true,
    "can_checkin_guests": true,
    "can_checkout_guests": true,
    "can_update_room_status": true,
    "can_edit_booking_status": true,
    "can_cancel_bookings": true,
    "can_delete_bookings": false,
    "can_override_pricing": false,
    "can_view_financials": true,
    "can_view_revenue_reports": false,
    "can_process_refunds": false,
    "can_manage_inventory": false,
    "can_lock_calendar": false,
    "can_send_messages": true,
    "can_settle_incidents": false
  }'::jsonb
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  status = EXCLUDED.status,
  permissions = EXCLUDED.permissions;

-- 11. Enable Full Replica Identity for Complete Realtime Payloads
ALTER TABLE public.properties REPLICA IDENTITY FULL;
ALTER TABLE public.bookings REPLICA IDENTITY FULL;
ALTER TABLE public.users REPLICA IDENTITY FULL;
ALTER TABLE public.incident_reports REPLICA IDENTITY FULL;
ALTER TABLE public.reviews REPLICA IDENTITY FULL;
ALTER TABLE public.support_tickets REPLICA IDENTITY FULL;

-- 12. Add Tables to Supabase Realtime Publication for Live WebSockets Streaming
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.properties;
EXCEPTION WHEN duplicate_object THEN null; WHEN undefined_object THEN null; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
EXCEPTION WHEN duplicate_object THEN null; WHEN undefined_object THEN null; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
EXCEPTION WHEN duplicate_object THEN null; WHEN undefined_object THEN null; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.incident_reports;
EXCEPTION WHEN duplicate_object THEN null; WHEN undefined_object THEN null; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
EXCEPTION WHEN duplicate_object THEN null; WHEN undefined_object THEN null; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.support_tickets;
EXCEPTION WHEN duplicate_object THEN null; WHEN undefined_object THEN null; END $$;

