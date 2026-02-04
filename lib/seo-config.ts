export const seoConfig: Record<string, { title: string; description: string }> = {
  // Routes Statiche
  '/': {
    title: 'Noleggio Catamarani e Yacht di Lusso in Italia | MG Vacanze',
    description: 'Charter di catamarani e yacht di lusso in Italia e Grecia. Vacanze nel Mediterraneo con equipaggio, servizi premium ed esperienze su misura.'
  },
  '/servizi': {
    title: 'Servizi - MG Vacanze',
    description: 'Esperienze in mare: noleggi, eventi, team building, regate, degustazioni, chef privato, yoga e servizi fotografici per momenti indimenticabili.'
  },
  '/itinerari': {
    title: 'Itinerari in yacht e catamarano - MG Vacanze',
    description: 'Noleggia yacht e catamarani e scopri itinerari in barca tra Adriatico, Ionio e Mediterraneo.'
  },

  // Flotta Weekly (Slugs da boat_data.ts)
  'elyvian-spirit': {
    title: 'Elyvian Spirit – Noleggio catamarano di lusso | MG Vacanze',
    description: 'Elyvian Spirit è il catamarano ideale per una vacanza esclusiva in mare. Servizi premium, stile ed esperienze personalizzate con MG Vacanze.'
  },
  'elyvian-dream': {
    title: 'Elyvian Dream – Noleggio Catamarano di Lusso | MG Vacanze',
    description: 'Elyvian Dream è il catamarano perfetto per una vacanza di lusso in mare. Spazi ampi, comfort e servizi esclusivi.'
  },
  'elyvian-breeze': {
    title: 'Elyvian Breeze – Catamarano di Lusso | MG Vacanze',
    description: 'Elyvian Breeze è il catamarano di lusso ideale per vivere il mare in totale libertà, comfort ed eleganza.'
  },

  // Pasqua Italia (Slugs mappati)
  'pasqua-elyvian-spirit': {
    title: 'Festeggia Pasqua in Catamarano | Elyvian Spirit– MG Vacanze',
    description: 'La settimana di Pasqua a bordo di un catamarano. Itinerari esclusivi e servizi premium con MG Vacanze. Offerta limitata.'
  },
  'pasqua-elyvian-dream': { // Maps to pasqua-dream slug usually, but we use the URL segment as key if easy, or the slug? 
                            // Strategy: The boat page receives a slug.
                            // If we rewrite /pasqua-elyvian-dream -> /boat/pasqua-dream, the page sees slug="pasqua-dream".
                            // So we need to match the SLUG here, not the URL.
                            // BUT, if we map multiple URLs to the same slug (e.g. Greece vs Italy URL to same boat data), 
                            // we lose the specific metadata unless we pass a query param or handle it differently.
                            // For simplicity, I will map the 'pasqua-dream' slug to the Italy metadata as default.
    title: 'Pasqua in Catamarano | Elyvian Dream – MG Vacanze',
    description: 'Festeggia la settimana di Pasqua in catamarano. Itinerari esclusivi e servizi su misura con MG Vacanze. Offerta limitata.'
  },
  'pasqua-elyvian-breeze': { // Maps to pasqua-breeze
    title: 'Festeggia Pasqua 2026 in Catamarano | Elyvian Breeze – MG Vacanze',
    description: 'Festeggia la Pasqua a bordo di un catamarano. Itinerari esclusivi e servizi premium con MG Vacanze. Offerta limitata.'
  },

  // Pasqua Grecia (These might not have matched slugs in boat_data, so metadata might be unused unless we add new slugs)
  'pasqua-grecia-elyvian-spirit': {
    title: 'Pasqua in Catamarano | Elyvian Spirit – MG Vacanze',
    description: 'Scopri il mare a bordo di Elyvian Spirit. Un catamarano di lusso per una vacanza esclusiva nel periodo di Pasqua.'
  },
  'pasqua-grecia-elyvian-dream': {
    title: 'Vacanze di Pasqua in Catamarano | Elyvian Dream – MG Vacanze',
    description: 'Passa le prossime vaanze di Pasqua in catamarano tra mare cristallino e relax. Elyvian Dream ti aspetta con servizi esclusivi.'
  },
  'pasqua-grecia-elyvian-breeze': {
    title: 'Vacanza in Catamarano a Pasqua | Elyvian Breeze – MG Vacanze',
    description: 'Parti per una vacanza in catamarano a Pasqua. Elyvian Breeze offre comfort premium, privacy e il mare nella sua stagione migliore.'
  }
};

// Helper per recuperare i metadati
export function getSeoMetadata(key: string) {
  return seoConfig[key] || {
    title: 'MG Vacanze | Noleggio Barche di Lusso',
    description: 'Vivi il meglio del noleggio yacht e barche nel Mediterraneo.'
  };
}
