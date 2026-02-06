import BoatDetailLayout from '@/components/BoatDetailLayout';
import { boatData } from '@/lib/boat_data';
import { createClient } from '@/lib/supabase-server';
import { getSeoMetadata } from '@/lib/seo-config';
import { Metadata } from 'next';

export const metadata: Metadata = getSeoMetadata('pasqua-grecia-elyvian-spirit');
export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = await createClient();
  const { data: globalExtras } = await supabase.from('extras').select('*').eq('is_visible', true).order('name');

  const extraOptions = (globalExtras || []);

  const data = {
    ...boatData['pasqua-spirit'],
    slug: 'elyvian-spirit',
    propertyId: 3038,
    isEasterOffer: true,
    title: "Pasqua in Grecia – Elyvian Spirit",
    extraOptions,
    packageDates: {
        start: "2026-04-08",
        end: "2026-04-13"
    },
    itinerary: {
        title: "Mini Crociera Grecia Ionica – Othoni e Corfù",
        description: "Pasqua ortodossa vissuta tra le isole Diapontie e Corfù, con vincolo operativo per il Venerdì Santo a Kerkira.",
        steps: [
            { day: "Mercoledì (Sera)", title: "Leuca", description: "Imbarco, briefing e traversata notturna verso Othoni." },
            { day: "Giovedì", title: "Othoni", description: "Arrivo mattutino, bagni ad Ammos Bay. Navigazione verso Kassiopi (Corfù)." },
            { day: "Venerdì (Santo)", title: "Kassiopi → Kerkira", description: "Arrivo primo pomeriggio per evento Corfù città. Notte in porto." },
            { day: "Sabato", title: "Kerkira → Kassiopi", description: "Inizio rientro, soste costa NE." },
            { day: "Domenica (Pasqua Ortodossa)", title: "Kassiopi → Erikoussa", description: "Ultima giornata greca. Traversata notturna di rientro." },
            { day: "Lunedì (Mattina)", title: "Arrivo a Leuca e sbarco", description: "-" }
        ]
    }
  };
  return <BoatDetailLayout data={data} />;
}
