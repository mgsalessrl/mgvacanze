-- Add is_visible column to extras table
ALTER TABLE extras ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;
