import BoatDetailLayout from '@/components/BoatDetailLayout';
import { boatData } from '@/lib/boat_data';
import { createClient } from '@/lib/supabase-server';
import { getSeoMetadata } from '@/lib/seo-config';
import { Metadata } from 'next';

export const metadata: Metadata = getSeoMetadata('pasqua-grecia-elyvian-breeze');
export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = await createClient();
  const { data: globalExtras } = await supabase.from('extras').select('*').order('price', { ascending: false });

  const extraOptions = (globalExtras || []).map((e: any) => {
      let name = e.name;
      let price = Number(e.price);
      if (name.toLowerCase().includes('skipper')) { price = 1750; name = "Skipper (Obbligatorio)"; }
      if (name.toLowerCase().includes('pulizia')) { price = 250; }
      if (name.toLowerCase().includes('tender')) { price = 150; }
      return { name, price, type: 0 };
  });

  const data = {
    ...boatData['pasqua-breeze'],
    slug: 'elyvian-breeze',
    propertyId: 3056,
    isEasterOffer: true,
    title: "Pasqua in Grecia – Elyvian Breeze",
    extraOptions,
    packageDates: {
        start: "2026-04-08",
        end: "2026-04-13"
    },
    itinerary: {
        title: "Mini Crociera Grecia Ionica – Othoni e Corfù",
        description: "Pasqua ortodossa vissuta tra le isole Diapontie e Corfù, con vincolo operativo per il Venerdì Santo a Kerkira.",
        steps: [
            { day: "8 Aprile (Sera)", title: "Leuca", description: "Imbarco, briefing e traversata notturna verso Othoni." },
            { day: "9 Aprile", title: "Othoni", description: "Arrivo mattutino, bagni ad Ammos Bay. Navigazione verso Kassiopi (Corfù)." },
            { day: "10 Aprile", title: "Kassiopi → Kerkira", description: "Arrivo primo pomeriggio per evento Corfù città. Notte in porto." },
            { day: "11 Aprile", title: "Kerkira → Kassiopi", description: "Inizio rientro, soste costa NE." },
            { day: "12 Aprile (Pasqua Ortodossa)", title: "Kassiopi → Erikoussa", description: "Ultima giornata greca. Traversata notturna di rientro." },
            { day: "13 Aprile (Mattina)", title: "Arrivo a Leuca e sbarco", description: "-" }
        ]
    }
  };
  return <BoatDetailLayout data={data} />;
}
