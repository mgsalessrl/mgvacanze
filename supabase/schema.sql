-- Create properties table matching our Seed Data
CREATE TABLE IF NOT EXISTS properties (
    id BIGINT PRIMARY KEY, -- Keeping original WordPress ID
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    
    -- Location
    city TEXT,
    address TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    
    -- Specs
    bedrooms INT,
    bathrooms INT,
    guests INT,
    area INT,
    
    -- Images
    image_url TEXT, -- Path relative to /uploads or Storage URL
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) is good practice, but for public read:
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view properties
CREATE POLICY "Public properties are viewable by everyone" 
ON properties FOR SELECT 
USING (true);

-- Policy: Only service role can insert/update (implicit if no other policies, but let's be explicit or leave it to Service Key which bypasses RLS)
-- Service Role bypasses RLS, so we don't strictly need an insert policy for it.
