import BoatDetailLayout from '@/components/BoatDetailLayout';
import { boatData } from '@/lib/boat_data';
import { createClient } from '@/lib/supabase-server';

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
    title: "Pasqua in Italia – Elyvian Breeze",
    heroImagePosition: 'bottom-center',
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
    }
  };
  return <BoatDetailLayout data={data} />;
}
