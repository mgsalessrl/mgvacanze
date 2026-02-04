-- Upgrades for Phase 3/4

-- 1. Extras Table Upgrade
ALTER TABLE extras ALTER COLUMN id TYPE text USING id::text;

ALTER TABLE extras 
ADD COLUMN IF NOT EXISTS type text DEFAULT 'toggle',
ADD COLUMN IF NOT EXISTS limit_rule text DEFAULT 'fixed', -- fixed, guests, cabins
ADD COLUMN IF NOT EXISTS max_quantity int DEFAULT 1,
ADD COLUMN IF NOT EXISTS mandatory_for_boats text[] DEFAULT '{}', -- Array of boat slugs
ADD COLUMN IF NOT EXISTS seasonal_prices jsonb DEFAULT '{}'; -- For future use

-- Fix types for existing columns if needed (price is numeric?)

-- 2. Bookings Table Upgrade
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS total_price numeric,
ADD COLUMN IF NOT EXISTS extras_snapshot jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';

-- 3. Seed Data (Upsert to avoid duplicates)
INSERT INTO extras (id, name, price, type, limit_rule, max_quantity) VALUES
('skipper', 'Skipper', 1750, 'toggle', 'fixed', 1),
('hostess', 'Hostess', 1100, 'toggle', 'fixed', 1),
('chef', 'Chef', 1400, 'toggle', 'fixed', 1),
('cleaning', 'Pulizia Finale', 250, 'toggle', 'fixed', 1),
('tender', 'Tender', 150, 'toggle', 'fixed', 1),
('seabob', 'Seabob', 300, 'counter', 'fixed', 2),
('sup', 'SUP (Stand Up Paddle)', 100, 'counter', 'fixed', 4),
('jetsurf', 'Jetsurf', 200, 'counter', 'fixed', 2),
('donuts', 'Ciambella Trainabile', 50, 'toggle', 'fixed', 1),
('wakeboard', 'Wakeboard', 50, 'toggle', 'fixed', 1),
('waterski', 'Sci Nautico', 50, 'toggle', 'fixed', 1),
('snorkeling', 'Kit Snorkeling', 20, 'counter', 'guests', 12),
('safety_net', 'Rete di Protezione', 150, 'toggle', 'fixed', 1),
('galley', 'Servizio Cambusa', 100, 'toggle', 'fixed', 1),
('transfer', 'Transfer A/R', 200, 'toggle', 'fixed', 1),
('bed_linen', 'Cambio Biancheria Extra', 30, 'counter', 'guests', 12),
('towels', 'Set Asciugamani Extra', 15, 'counter', 'guests', 12),
('beach_towels', 'Teli Mare Extra', 10, 'counter', 'guests', 12)
ON CONFLICT (id) DO UPDATE SET 
price = EXCLUDED.price,
type = EXCLUDED.type,
limit_rule = EXCLUDED.limit_rule,
max_quantity = EXCLUDED.max_quantity;

-- Remove unwanted extras from DB if they were inserted
DELETE FROM extras WHERE id IN ('early_checkin', 'late_checkout');
