-- Create discounts table
CREATE TABLE IF NOT EXISTS discounts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    type text NOT NULL CHECK (type IN ('early_booking', 'period', 'fixed')),
    value numeric NOT NULL DEFAULT 0,
    unit text NOT NULL DEFAULT 'percentage' CHECK (unit IN ('percentage', 'currency')),
    valid_from date,
    valid_to date,
    days_before_departure integer,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;

-- Public read access (needed for booking engine)
CREATE POLICY "Allow public read access to discounts"
    ON discounts FOR SELECT
    USING (true);

-- Authenticated/Admin write access
CREATE POLICY "Allow admin full access to discounts"
    ON discounts FOR ALL
    USING (auth.role() = 'authenticated');
