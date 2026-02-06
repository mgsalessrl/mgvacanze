import BoatDetailLayout from '@/components/BoatDetailLayout';
import { boatData } from '@/lib/boat_data';
import { getSeoMetadata } from '@/lib/seo-config';
import { Metadata } from 'next';

export const metadata: Metadata = getSeoMetadata('elyvian-breeze');

export default function Page() {
  return <BoatDetailLayout data={boatData['elyvian-breeze']} />;
}
