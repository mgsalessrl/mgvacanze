-- FIX: Aggiunta colonna user_id mancante e ricreazione policies

-- 1. Aggiungi colonne mancanti alla tabella bookings se non esistono
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'user_id') THEN
        ALTER TABLE public.bookings ADD COLUMN user_id uuid references auth.users(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'total_price') THEN
        ALTER TABLE public.bookings ADD COLUMN total_price decimal(10, 2) not null default 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'extra_services') THEN
        ALTER TABLE public.bookings ADD COLUMN extra_services jsonb default '[]'::jsonb;
    END IF;
END $$;

-- 2. Ricrea le policies per bookings (per assicurarsi che funzionino ora che la colonna esiste)
DROP POLICY IF EXISTS "Anyone can create a booking" ON public.bookings;
CREATE POLICY "Anyone can create a booking" 
  ON public.bookings FOR INSERT 
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
CREATE POLICY "Users can view own bookings"
  ON public.bookings FOR SELECT
  USING ( 
    auth.uid() = user_id 
    OR 
    (auth.jwt() ->> 'email') = user_email 
  );

DROP POLICY IF EXISTS "Admins can do everything on bookings" ON public.bookings;
CREATE POLICY "Admins can do everything on bookings"
  ON public.bookings FOR ALL
  USING ( 
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 3. Aggiungi colonne mancanti alla tabella properties (sicurezza)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'specs') THEN
        ALTER TABLE public.properties ADD COLUMN specs jsonb default '{}'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'features') THEN
        ALTER TABLE public.properties ADD COLUMN features jsonb default '[]'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'images') THEN
        ALTER TABLE public.properties ADD COLUMN images jsonb default '[]'::jsonb;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'extra_options') THEN
        ALTER TABLE public.properties ADD COLUMN extra_options jsonb default '[]'::jsonb;
    END IF;
END $$;
