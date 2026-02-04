-- Add min_duration_days column for Long Stay discounts
ALTER TABLE discounts ADD COLUMN IF NOT EXISTS min_duration_days integer;

-- Update the type check constraint to include 'long_stay'
ALTER TABLE discounts DROP CONSTRAINT IF EXISTS discounts_type_check;

ALTER TABLE discounts ADD CONSTRAINT discounts_type_check 
    CHECK (type IN ('early_booking', 'period', 'fixed', 'long_stay'));
