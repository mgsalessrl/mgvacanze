-- FIX: Add missing columns to bookings table to match application logic
-- Run this in the Supabase SQL Editor

ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_name text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_email text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_phone text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS guests int;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS message text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_status text default 'unpaid';

-- Ensure user_email is present as well since admin dashboard might use it
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS user_email text;

-- Add checking constraints if needed, or rely on application logic
-- Update RLS to ensure new columns are accessible (Insert policy covers new columns implicitly)

-- Grant access to new columns for service role (default is owner anyway)
