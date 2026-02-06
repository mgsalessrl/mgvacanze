import BoatDetailLayout from '@/components/BoatDetailLayout';
import { boatData } from '@/lib/boat_data';
import { createClient } from '@/lib/supabase-server';
import { getSeoMetadata } from '@/lib/seo-config';
import { Metadata } from 'next';

export const metadata: Metadata = getSeoMetadata('elyvian-spirit');
export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = await createClient();
  const [{ data: extras }, { data: discounts }] = await Promise.all([
    supabase.from('extras').select('*').eq('is_visible', true).order('name'),
    supabase.from('discounts').select('*')
  ]);

  return <BoatDetailLayout data={{ ...boatData['elyvian-spirit'], extraOptions: extras || [], discounts: discounts || [] }} />;
}
