-- =====================================================
-- DENTAL WEBSITE DATABASE SCHEMA - COMPLETE VERSION
-- =====================================================
-- This schema is optimized for Supabase SQL Editor
-- Run this in your Supabase SQL Editor to set up the database
--
-- IMPORTANT: This will add missing columns to existing tables
-- Safe to run multiple times (uses IF NOT EXISTS and ALTER TABLE IF NOT EXISTS)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Create user_profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(20),
  date_of_birth DATE,
  address TEXT,
  emergency_contact VARCHAR(255),
  medical_history TEXT,
  allergies TEXT,
  avatar_url TEXT
);

-- Create services table first (needed for sample data)
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  duration VARCHAR(100) NOT NULL,
  benefit TEXT NOT NULL,
  image_url TEXT,
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  category VARCHAR(100) NOT NULL
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  service VARCHAR(255) NOT NULL,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL, -- Now stores time ranges like "09:00:00-12:00:00"
  appointment_date TIMESTAMP WITH TIME ZONE,
  duration INTEGER DEFAULT 60, -- Duration in minutes
  price INTEGER, -- Price in cents
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid', 'refunded')),
  payment_amount INTEGER DEFAULT 0, -- Amount paid in cents
  notes TEXT, -- Internal notes for staff
  reminder_sent BOOLEAN DEFAULT FALSE,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT
);

-- Create contact_forms table
CREATE TABLE IF NOT EXISTS contact_forms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'replied', 'resolved'))
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  quote TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  source VARCHAR(100) DEFAULT 'website'
);

-- Create appointment_history table for tracking changes
CREATE TABLE IF NOT EXISTS appointment_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(50) NOT NULL, -- 'created', 'updated', 'confirmed', 'cancelled', etc.
  old_status VARCHAR(20),
  new_status VARCHAR(20),
  notes TEXT,
  changed_by VARCHAR(100) -- 'patient', 'staff', 'system'
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'appointment_confirmed', 'reminder', 'cancelled', etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivery_method VARCHAR(20) DEFAULT 'in_app' CHECK (delivery_method IN ('in_app', 'email', 'sms', 'push'))
);

-- Create availability_slots table for scheduling
CREATE TABLE IF NOT EXISTS availability_slots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  max_appointments INTEGER DEFAULT 1,
  current_appointments INTEGER DEFAULT 0,
  notes TEXT
);

-- =====================================================
-- ADD MISSING COLUMNS TO EXISTING TABLES
-- =====================================================

-- Add missing columns to appointments table if they don't exist
DO $$
BEGIN
    -- Check if appointments table exists first
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'appointments') THEN
        -- Add appointment_date column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'appointment_date') THEN
            ALTER TABLE appointments ADD COLUMN appointment_date TIMESTAMP WITH TIME ZONE;
        END IF;

        -- Add duration column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'duration') THEN
            ALTER TABLE appointments ADD COLUMN duration INTEGER DEFAULT 60;
        END IF;

        -- Add price column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'price') THEN
            ALTER TABLE appointments ADD COLUMN price INTEGER;
        END IF;

        -- Add status column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'status') THEN
            ALTER TABLE appointments ADD COLUMN status VARCHAR(20) DEFAULT 'pending';
        END IF;

        -- Add priority column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'priority') THEN
            ALTER TABLE appointments ADD COLUMN priority VARCHAR(10) DEFAULT 'normal';
        END IF;

        -- Add payment_status column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'payment_status') THEN
            ALTER TABLE appointments ADD COLUMN payment_status VARCHAR(20) DEFAULT 'unpaid';
        END IF;

        -- Add payment_amount column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'payment_amount') THEN
            ALTER TABLE appointments ADD COLUMN payment_amount INTEGER DEFAULT 0;
        END IF;

        -- Add notes column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'notes') THEN
            ALTER TABLE appointments ADD COLUMN notes TEXT;
        END IF;

        -- Add reminder_sent column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'reminder_sent') THEN
            ALTER TABLE appointments ADD COLUMN reminder_sent BOOLEAN DEFAULT FALSE;
        END IF;

        -- Add confirmed_at column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'confirmed_at') THEN
            ALTER TABLE appointments ADD COLUMN confirmed_at TIMESTAMP WITH TIME ZONE;
        END IF;

        -- Add completed_at column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'completed_at') THEN
            ALTER TABLE appointments ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;
        END IF;

        -- Add cancelled_at column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'cancelled_at') THEN
            ALTER TABLE appointments ADD COLUMN cancelled_at TIMESTAMP WITH TIME ZONE;
        END IF;

        -- Add cancellation_reason column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'cancellation_reason') THEN
            ALTER TABLE appointments ADD COLUMN cancellation_reason TEXT;
        END IF;
    END IF;
END $$;

-- Add constraints to the new columns
DO $$
BEGIN
    -- Check if appointments table exists first
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'appointments') THEN
        -- Add status constraint if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'appointments_status_check') THEN
            ALTER TABLE appointments ADD CONSTRAINT appointments_status_check CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'));
        END IF;

        -- Add priority constraint if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'appointments_priority_check') THEN
            ALTER TABLE appointments ADD CONSTRAINT appointments_priority_check CHECK (priority IN ('low', 'normal', 'high', 'urgent'));
        END IF;

        -- Add payment_status constraint if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name = 'appointments_payment_status_check') THEN
            ALTER TABLE appointments ADD CONSTRAINT appointments_payment_status_check CHECK (payment_status IN ('unpaid', 'partial', 'paid', 'refunded'));
        END IF;
    END IF;
END $$;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User profiles indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Appointments indexes
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(preferred_date);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at);
CREATE INDEX IF NOT EXISTS idx_appointments_payment_status ON appointments(payment_status);
CREATE INDEX IF NOT EXISTS idx_appointments_priority ON appointments(priority);
CREATE INDEX IF NOT EXISTS idx_appointments_service ON appointments(service);

-- Contact forms indexes
CREATE INDEX IF NOT EXISTS idx_contact_forms_status ON contact_forms(status);
CREATE INDEX IF NOT EXISTS idx_contact_forms_created_at ON contact_forms(created_at);

-- Testimonials indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured, is_approved);

-- Services indexes
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_popular ON services(is_popular);

-- Newsletter indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(is_active);

-- Appointment history indexes
CREATE INDEX IF NOT EXISTS idx_appointment_history_appointment_id ON appointment_history(appointment_id);
CREATE INDEX IF NOT EXISTS idx_appointment_history_user_id ON appointment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_appointment_history_created_at ON appointment_history(created_at);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_appointment_id ON notifications(appointment_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Availability slots indexes
CREATE INDEX IF NOT EXISTS idx_availability_slots_date ON availability_slots(date);
CREATE INDEX IF NOT EXISTS idx_availability_slots_available ON availability_slots(is_available);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- User profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Appointments policies
DROP POLICY IF EXISTS "Users can view own appointments" ON appointments;
CREATE POLICY "Users can view own appointments" ON appointments
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Anyone can create appointments" ON appointments;
CREATE POLICY "Anyone can create appointments" ON appointments
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update own appointments" ON appointments;
CREATE POLICY "Users can update own appointments" ON appointments
  FOR UPDATE USING (auth.uid() = user_id);

-- Contact forms policies
DROP POLICY IF EXISTS "Anyone can create contact forms" ON contact_forms;
CREATE POLICY "Anyone can create contact forms" ON contact_forms
  FOR INSERT WITH CHECK (true);

-- Newsletter policies
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Services policies (public read access)
DROP POLICY IF EXISTS "Anyone can view services" ON services;
CREATE POLICY "Anyone can view services" ON services
  FOR SELECT USING (is_active = true);

-- Testimonials policies (public read access)
DROP POLICY IF EXISTS "Anyone can view approved testimonials" ON testimonials;
CREATE POLICY "Anyone can view approved testimonials" ON testimonials
  FOR SELECT USING (is_approved = true);

-- Appointment history policies
DROP POLICY IF EXISTS "Users can view own appointment history" ON appointment_history;
CREATE POLICY "Users can view own appointment history" ON appointment_history
  FOR SELECT USING (auth.uid() = user_id);

-- Notifications policies
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Availability slots policies (public read access)
DROP POLICY IF EXISTS "Anyone can view availability slots" ON availability_slots;
CREATE POLICY "Anyone can view availability slots" ON availability_slots
  FOR SELECT USING (is_available = true);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample services
INSERT INTO services (title, description, price, duration, benefit, category, is_popular, is_active) VALUES
('General Checkup', 'Comprehensive dental examination and cleaning', 150000, '45 minutes', 'Maintain optimal oral health with regular checkups', 'general', true, true),
('Teeth Whitening', 'Professional teeth whitening treatment for a brighter smile', 800000, '60 minutes', 'Get a brighter, more confident smile', 'cosmetic', true, true),
('Root Canal Treatment', 'Advanced endodontic treatment to save infected teeth', 1500000, '90 minutes', 'Save your natural tooth and eliminate pain', 'endodontic', false, true),
('Dental Implants', 'Permanent tooth replacement solution', 5000000, '120 minutes', 'Restore your smile with permanent, natural-looking teeth', 'surgical', false, true),
('Orthodontic Consultation', 'Assessment for braces and alignment treatment', 100000, '30 minutes', 'Get a personalized treatment plan for straighter teeth', 'orthodontic', false, true),
('Emergency Treatment', 'Immediate care for dental emergencies', 300000, '60 minutes', 'Quick relief from dental pain and emergencies', 'emergency', false, true)
ON CONFLICT DO NOTHING;

-- Insert sample testimonials
INSERT INTO testimonials (name, title, quote, rating, is_featured, is_approved) VALUES
('Priya Sharma', 'Software Engineer', 'Dr. Smith and the team provided exceptional care during my root canal treatment. The process was painless and the results exceeded my expectations!', 5, true, true),
('Rajesh Kumar', 'Business Owner', 'I was nervous about getting dental implants, but the staff made me feel comfortable throughout the entire process. My new smile looks amazing!', 5, true, true),
('Anita Patel', 'Teacher', 'The teeth whitening treatment gave me the confidence to smile again. Professional service and great results!', 5, false, true),
('Vikram Singh', 'Marketing Manager', 'Regular checkups here have kept my teeth healthy for years. Highly recommend this dental practice!', 5, true, true),
('Meera Reddy', 'Designer', 'The orthodontic treatment straightened my teeth perfectly. The team was supportive throughout the journey.', 5, false, true),
('Arjun Gupta', 'Student', 'Emergency treatment when I had severe tooth pain. They saw me immediately and provided excellent care.', 5, true, true)
ON CONFLICT DO NOTHING;

-- Success message
SELECT 'Database schema created successfully! All tables, indexes, policies, and sample data have been set up.' as message;
