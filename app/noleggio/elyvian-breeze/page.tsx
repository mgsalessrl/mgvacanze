import BoatDetailLayout from '@/components/BoatDetailLayout';
import { boatData } from '@/lib/boat_data';

export default function Page() {
  return <BoatDetailLayout data={boatData['elyvian-breeze']} />;
}
