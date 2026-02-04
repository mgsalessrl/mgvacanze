-- Create Extras table for standard additional services
CREATE TABLE IF NOT EXISTS extras (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Quotes table
CREATE TABLE IF NOT EXISTS quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id), -- Optional link to registered user
  
  -- Boat/Property Details
  property_id BIGINT REFERENCES properties(id),
  boat_name TEXT, -- Fallback or snapshot of name
  
  -- Booking Details
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  guests INT DEFAULT 0,
  
  -- Customer Info (Snapshot)
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  
  -- Financials
  rental_price DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  discount_type TEXT DEFAULT 'fixed', -- 'fixed' or 'percent'
  total_price DECIMAL(10, 2) NOT NULL,
  
  -- Extras Snapshot (JSONB array of selected extras)
  -- Format: [{ name: "Skipper", price: 1050, type: "standard" }, { name: "Late Check-out", price: 200, type: "adhoc" }]
  extras_snapshot JSONB DEFAULT '[]'::jsonb,
  
  -- Meta
  pdf_path TEXT, -- Path in Supabase Storage
  status TEXT DEFAULT 'draft', -- draft, sent, accepted, declined
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Extras: Admins full access, others read-only
CREATE POLICY "Admins can insert extras" ON extras FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
CREATE POLICY "Admins can update extras" ON extras FOR UPDATE USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
CREATE POLICY "Admins can delete extras" ON extras FOR DELETE USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
CREATE POLICY "Anyone can read extras" ON extras FOR SELECT USING (true);


-- Quotes: Admins full access
CREATE POLICY "Admins can do everything with quotes" ON quotes USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- Users can view their own quotes
CREATE POLICY "Users can view own quotes" ON quotes FOR SELECT USING (
  auth.uid() = user_id
);
