import BoatDetailLayout from '@/components/BoatDetailLayout';
import { boatData } from '@/lib/boat_data';
import { createClient } from '@/lib/supabase-server';
import { getSeoMetadata } from '@/lib/seo-config';
import { Metadata } from 'next';

export const metadata: Metadata = getSeoMetadata('pasqua-elyvian-spirit');
export const dynamic = 'force-dynamic';

export default async function Page() {
  const supabase = await createClient();
  const { data: globalExtras } = await supabase.from('extras').select('*').order('price', { ascending: false });

  const extraOptions = (globalExtras || []).map((e: any) => {
      let name = e.name;
      let price = Number(e.price);
      if (name.toLowerCase().includes('skipper')) { price = 1750; name = "Skipper (Facoltativo)"; }
      if (name.toLowerCase().includes('pulizia')) { price = 250; }
      if (name.toLowerCase().includes('tender')) { price = 150; }
      return { name, price, type: 0 };
  });

  const data = {
    ...boatData['pasqua-spirit'],
    slug: 'elyvian-spirit',
    propertyId: 3038,
    isEasterOffer: true,
    title: "Pasqua in Italia – Elyvian Spirit",
    extraOptions,
    packageDates: {
        start: "2026-04-03",
        end: "2026-04-07"
    },
    itinerary: {
        title: "Crociera di Pasqua – Processione in Mare e Costa Ionica",
        description: "Esperienza unica legata alla Pasqua tarantina: partecipazione dal mare alle processioni e navigazione rilassata fino a Leuca.",
        steps: [
            { day: "Venerdì (Pomeriggio)", title: "Taranto", description: "Imbarco, uscita in Mar Grande per processione Madonna della Città Vecchia dal mare. Notte in porto." },
            { day: "Sabato", title: "Taranto → Campomarino/Torre Ovo", description: "Navigazione costiera, bagni, notte in rada." },
            { day: "Pasqua", title: "Torre Ovo → Gallipoli", description: "Ingresso nel borgo antico, passeggiata pasquale. Notte in porto." },
            { day: "Lunedì (Pasquetta)", title: "Gallipoli → Leuca", description: "Sosta a Pescoluse, arrivo a Santa Maria di Leuca. Notte in porto/rada." },
            { day: "Martedì", title: "Leuca → Taranto", description: "Rientro con navigazione mattutina, sbarco nel pomeriggio." }
        ]
    },
    itinerary_en: {
        title: "Easter Cruise – Sea Procession and Ionian Coast",
        description: "Unique experience linked to Taranto's Easter: sea participation in processions and relaxed sailing to Leuca.",
        steps: [
            { day: "Friday (Afternoon)", title: "Taranto", description: "Boarding, exit in Mar Grande for Madonna della Città Vecchia sea procession. Night in port." },
            { day: "Saturday", title: "Taranto → Campomarino/Torre Ovo", description: "Coastal navigation, swimming, night at anchor." },
            { day: "Easter Sunday", title: "Torre Ovo → Gallipoli", description: "Entrance to the ancient village, Easter walk. Night in port." },
            { day: "Easter Monday", title: "Gallipoli → Leuca", description: "Stop at Pescoluse, arrival at Santa Maria di Leuca. Night in port/anchor." },
            { day: "Tuesday", title: "Leuca → Taranto", description: "Return with morning navigation, disembarkation in the afternoon." }
        ]
    }
  };
  return <BoatDetailLayout data={data} />;
}
