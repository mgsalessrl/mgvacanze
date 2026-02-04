-- Add payment tracking fields to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS deposit_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS deposit_status TEXT CHECK (deposit_status IN ('pending', 'paid', 'cancelled')) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS balance_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS balance_status TEXT CHECK (balance_status IN ('pending', 'paid', 'cancelled')) DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;  -- Store Stripe PI ID if needed

-- Add quote reference to bookings if not exists
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS quote_id BIGINT REFERENCES quotes(id);

-- Update quotes table to link to booking if converted
ALTER TABLE quotes
ADD COLUMN IF NOT EXISTS booking_id BIGINT REFERENCES bookings(id);
