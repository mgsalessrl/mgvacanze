-- Migration to ensure pending booking statuses are supported
-- Since the status column is TEXT, we don't strictly need to add enum values if it's not an ENUM type.
-- But we can add a comment or check constraint if we wanted strictness.
-- For this task, we assume status is TEXT.

-- Optional: Add payment_status column if it doesn't exist
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid';

-- Optional: Update existing 'pending' bookings to have 'unpaid' payment_status
UPDATE bookings SET payment_status = 'unpaid' WHERE payment_status IS NULL;
