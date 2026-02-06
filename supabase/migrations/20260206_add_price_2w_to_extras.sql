-- MOD 2a: Add biweekly discount price for optional extras
-- Run manually on Supabase Dashboard → SQL Editor

ALTER TABLE extras ADD COLUMN IF NOT EXISTS price_2w DECIMAL(10,2) DEFAULT NULL;
COMMENT ON COLUMN extras.price_2w IS 'Prezzo scontato per extra opzionale su noleggio 2+ settimane. NULL = stesso prezzo di price.';
