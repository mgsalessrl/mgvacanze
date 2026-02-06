import { ExtraService } from './types';

export const UNIVERSAL_EXTRAS: ExtraService[] = [
    { id: 'skipper', label: 'Skipper', price: 1750, type: 'toggle', maxLimitRule: 'fixed', maxQuantity: 1 },
    { id: 'hostess', label: 'Hostess', price: 1100, type: 'toggle', maxLimitRule: 'fixed', maxQuantity: 1 },
    { id: 'chef', label: 'Chef', price: 1400, type: 'toggle', maxLimitRule: 'fixed', maxQuantity: 1 },
    { id: 'cleaning', label: 'Pulizia Finale', price: 250, type: 'toggle', maxLimitRule: 'fixed', maxQuantity: 1 },
    { id: 'tender', label: 'Tender', price: 150, type: 'toggle', maxLimitRule: 'fixed', maxQuantity: 1 },
    { id: 'seabob', label: 'Seabob', price: 300, type: 'counter', maxLimitRule: 'fixed', maxQuantity: 2 },
    { id: 'sup', label: 'SUP (Stand Up Paddle)', price: 100, type: 'counter', maxLimitRule: 'fixed', maxQuantity: 4 },
    { id: 'jetsurf', label: 'Jetsurf', price: 200, type: 'counter', maxLimitRule: 'fixed', maxQuantity: 2 },
    { id: 'donuts', label: 'Ciambella Trainabile', price: 50, type: 'toggle', maxLimitRule: 'fixed', maxQuantity: 1 },
    { id: 'wakeboard', label: 'Wakeboard', price: 50, type: 'toggle', maxLimitRule: 'fixed', maxQuantity: 1 },
    { id: 'waterski', label: 'Sci Nautico', price: 50, type: 'toggle', maxLimitRule: 'fixed', maxQuantity: 1 },
    { id: 'snorkeling', label: 'Kit Snorkeling', price: 20, type: 'counter', maxLimitRule: 'guests' },
    { id: 'safety_net', label: 'Rete di Protezione', price: 150, type: 'toggle', maxLimitRule: 'fixed', maxQuantity: 1 },
    { id: 'galley', label: 'Servizio Cambusa', price: 100, type: 'toggle', maxLimitRule: 'fixed', maxQuantity: 1 },
    { id: 'transfer', label: 'Transfer A/R', price: 200, type: 'toggle', maxLimitRule: 'fixed', maxQuantity: 1 },
    { id: 'bed_linen', label: 'Cambio Biancheria Extra', price: 30, type: 'counter', maxLimitRule: 'guests' },
    { id: 'towels', label: 'Set Asciugamani Extra', price: 15, type: 'counter', maxLimitRule: 'guests' },
    { id: 'beach_towels', label: 'Teli Mare Extra', price: 10, type: 'counter', maxLimitRule: 'guests' }
];

export const boatData = {
    'pasqua-dream': {
        slug: 'pasqua-dream',
        isEasterOffer: true,
        extraOverrides: { skipper: { mandatory: true, price: 0 } },
        title: "Pasqua in mare – Elyvian Dream",
        subtitle: "L’esperienza luxury in barca",
        stars: 5,
        location: "Italy",
        guests: 12,
        maxGuests: 12,
        hasPremiumPackage: false,
        cabins: 4,        
        securityDeposit: 3000,
        bathrooms: 4,
        description: `
        <h2 class="text-2xl font-display mb-4">Pasqua in barca con Elyvian Dream</h2>
        <p class="mb-4">Festeggia la Pasqua sul mare con un’esperienza esclusiva a bordo delle nostre barche, pensata per chi desidera relax, privacy e comfort assoluto. Un modo unico per vivere una vacanza di Pasqua elegante e indimenticabile, lontano dalla routine.</p>
        <p class="mb-4">Se sei alla ricerca di un’ esperienza unica, richiedi un preventivo, per scoprire i nostri viaggi organizzati o ricevere un programma su misura.</p>
        <h3 class="text-xl font-display mb-2">Viaggi organizzati:</h3>
        <p class="mb-4">Esplora le meraviglie del Mar Ionio e dell’Adriatico: da Polignano a Mare a Otranto, o da Gallipoli alla suggestiva Taranto sotterranea. E perché non fare un salto in Grecia, alla scoperta delle sue affascinanti isole e delle tradizioni uniche della Pasqua in Grecia?</p>
        <p class="mb-4">Ogni nostro viaggio organizzato include pranzi o cene preparati da chef locali e guide esperte che ti faranno scoprire la storia e la bellezza dei luoghi che visiterai. Un’esperienza senza stress, dove pensiamo a tutto noi.</p>
        <p class="italic text-gray-500">Richiedi un preventivo: non hai trovato l’itinerario giusto? Nessun problema! Contattaci per ricevere un preventivo personalizzato in base alle tue preferenze. Personalizza il tuo viaggio e naviga dove più ti piace.</p>
        `,
        description_en: `
        <h2 class="text-2xl font-display mb-4">Easter on boat with Elyvian Dream</h2>
        <p class="mb-4">Celebrate Easter at sea with an exclusive experience aboard our boats, designed for those who desire relaxation, privacy, and absolute comfort. A unique way to live an elegant and unforgettable Easter holiday, far from routine.</p>
        <p class="mb-4">If you are looking for a unique experience, request a quote to discover our organized trips or receive a tailor-made program.</p>
        <h3 class="text-xl font-display mb-2">Organized trips:</h3>
        <p class="mb-4">Explore the wonders of the Ionian and Adriatic Seas: from Polignano a Mare to Otranto, or from Gallipoli to the evocative underground Taranto. And why not take a trip to Greece, discovering its fascinating islands and the unique traditions of Orthodox Easter?</p>
        <p class="mb-4">Every organized trip includes lunches or dinners prepared by local chefs and expert guides who will let you discover the history and beauty of the places you visit. A stress-free experience where we take care of everything.</p>
        <p class="italic text-gray-500">Request a quote: didn't find the right itinerary? No problem! Contact us to receive a personalized quote based on your preferences. Customize your trip and sail wherever you like.</p>
        `,
        specs: {
            length: "13.97m",
            beam: "7.87m",
            draft: "1.48m",
            fuel: "2x200L",
            water: "300L",
            engine: "YANMAR 2x57cv",
            consumption: "10 lt/h",
            year: "2026",
            features: [
                 "2 Cabine equipaggio con WC",
                 "4 Cabine doppie con bagno ensuite",
                 "Dinette Trasformabile"
            ]
        },
        servicesIncluded: ["service.name.rental", "service.name.insurance", "service.name.starter_pack", "service.name.welcome"],
        servicesExtra: [],
        extraInfo: `
            <p class="mb-2"><strong>*APA</strong>: Spesa alimentare – Cambusa (da concordare in anticipo), Rifornimento carburante, Tasse ormeggio, etc.</p>
            <p><strong>**CAUZIONE</strong>: Deposito per franchigia e danni accidentali.</p>
        `,
        extraInfo_en: `
            <p class="mb-2"><strong>*APA</strong>: Food expenses – Galley (to be agreed in advance), Fuel refueling, Mooring fees, etc.</p>
            <p><strong>**SECURITY DEPOSIT</strong>: Deposit for deductible and accidental damages.</p>
        `,
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
        },
        imagesPath: "/images/img_sito/psqua dream",
        images: [
           "1316-excess14-0604-min-scaled.jpg", "1589-excess-14-1014-min-scaled.jpg", "174-excess-14-0485-min-scaled.jpg",
           "1799-excess-14-0946-min-scaled.jpg", "3454-excess-14-0514_1-scaled.jpg", "521-410-films-excess-14-catamaran-photography-2023-0825-min-scaled.jpg"
        ]
    },
    'pasqua-spirit': {
         slug: 'pasqua-spirit',
         extraOverrides: { skipper: { mandatory: true, price: 0 } },
         isEasterOffer: true,
         title: "Pasqua in mare – Elyvian Spirit",
         subtitle: "Esperienza luxury in catamarano",
         stars: 5,
         location: "Italy",
         guests: 10,
         maxGuests: 10,
         hasPremiumPackage: false,
         cabins: 3, 
         securityDeposit: 1500,
         bathrooms: 3,
         description: `
         <h2 class="text-2xl font-display mb-4">Pasqua in barca con Elyvian Spirit</h2>
         <p class="mb-4">Rendi la tua Pasqua sul mare un momento davvero speciale, scegliendo un’esperienza unica a bordo dei nostri catamarani. Relax, privacy e servizi premium si uniscono per offrirti una vacanza di Pasqua raffinata, lontano dal caos e dalla quotidianità.</p>
         <p class="mb-4">Se desideri vivere un’esperienza unica, richiedi un preventivo per scoprire i nostri viaggi organizzati o per ricevere un programma personalizzato.</p>
         `,
         description_en: `
         <h2 class="text-2xl font-display mb-4">Easter on boat with Elyvian Spirit</h2>
         <p class="mb-4">Make your Easter at sea a truly special moment by choosing a unique experience aboard our catamarans. Relaxation, privacy, and premium services combine to offer you a refined Easter holiday, far from the chaos and daily routine.</p>
         <p class="mb-4">If you wish to live a unique experience, request a quote to discover our organized trips or to receive a personalized program.</p>
         `,
         specs: {
             length: "12.18m",
             beam: "6.59m",
             draft: "1.15m",
             fuel: "2x200L",
             water: "300L",
             engine: "Yanmar 2x29cv",
             consumption: "6 lt/h",
             year: "2026",
             features: [
                 "1 Suite Armatoriale con bagno ensuite",
                 "2 Cabine doppie con bagno in condivisione",
                 "2 Cabine equipaggio con WC",
                 "Dinette Trasformabile"
             ]
         },
        servicesIncluded: ["service.name.rental", "service.name.insurance", "service.name.starter_pack", "service.name.welcome"],
         servicesExtra: [],
         extraInfo: `
             <p class="mb-2"><strong>*APA</strong>: Spesa alimentare – Cambusa, Carburante, Tasse ormeggio.</p>
             <p><strong>**CAUZIONE</strong>: Deposito per franchigia.</p>
         `,
         extraInfo_en: `
             <p class="mb-2"><strong>*APA</strong>: Food expenses – Galley, Fuel, Mooring fees.</p>
             <p><strong>**SECURITY DEPOSIT</strong>: Deposit for deductible.</p>
         `,
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
        },
        itinerary_en: {
            title: "Mini Ionian Greece Cruise – Othoni and Corfu",
            description: "Orthodox Easter lived between the Diapontia Islands and Corfu, with operational constraints for Good Friday in Kerkira.",
            steps: [
                { day: "Wednesday (Evening)", title: "Leuca", description: "Boarding, briefing and night crossing to Othoni." },
                { day: "Thursday", title: "Othoni", description: "Morning arrival, swimming at Ammos Bay. Navigation to Kassiopi (Corfu)." },
                { day: "Good Friday", title: "Kassiopi → Kerkira", description: "Arrival early afternoon for Corfu city event. Night in port." },
                { day: "Saturday", title: "Kerkira → Kassiopi", description: "Return start, NE coast stops." },
                { day: "Sunday (Orthodox Easter)", title: "Kassiopi → Erikoussa", description: "Last Greek day. Night crossing return." },
                { day: "Monday (Morning)", title: "Arrival in Leuca and disembarkation", description: "-" }
            ]
        },
         imagesPath: "/images/img_sito/pasqua spirit",
         images: [
            "1070-excess11-int-ncz7428-hdr-a3-scaled.jpg", "1399-excess11-int-ncz7463-hdr-a3-scaled.jpg",
            "1444-excess1100593-hr-1-scaled.jpg", "1603-excess11-int-ncz7608-hdr-panorama-a3-scaled.jpg", "2121-ncz9270-hdr-fullhd-scaled.jpg"
         ]
    },
    'elyvian-dream': {
        slug: 'elyvian-dream',
        extraOverrides: { skipper: { mandatory: true } },
        title: "Elyvian Dream",
        subtitle: "Catamarano di Charme e Libertà",
        stars: 5,
        location: "Italy",
        guests: 12,
        maxGuests: 12,
        hasPremiumPackage: true,
        cabins: 4,        
        securityDeposit: 3000,
        bathrooms: 4,
        description: `
        <p class="mb-4">Elyvian Dream è un catamarano di 14 metri progettato per chi desidera vivere il mare con libertà, comfort ed eleganza. Le quattro cabine matrimoniali con bagno en suite e doccia separata, offrono un’oasi di privacy e quiete, mentre gli spazi ampi e luminosi creano una vera dimora galleggiante, ideale per famiglie e gruppi di amici.</p>
        <p class="mb-4">Le linee contemporanee definiscono il suo stile: un salotto sospeso sul mare, perfetto per relax, conversazioni e tramonti indimenticabili. Ogni ambiente segue il ritmo naturale della vacanza, tra momenti lenti e contemplativi o esperienze più dinamiche.</p>
        <p class="mb-4">Silenzioso ed ecologico, Elyvian Dream è anche un catamarano a vela naviga seguendo il vento offrendo autonomia completa grazie al dissalatore di bordo che permette viaggi senza limiti.</p>
        <p class="mb-4">Non solo una vacanza, Elyvian Dream è il luogo ideale per ritiri benessere, esperienze aziendali esclusive e crociere su misura modellate sui tuoi desideri. Una residenza privata sul mare, sofisticata, accogliente e pensata per emozioni che restano.</p>
        `,
        specs: {
            length: "13.97m",
            beam: "7.87m",
            draft: "1.48m",
            fuel: "2x200L",
            water: "300L",
            engine: "Yanmar 2x 57cv",
            consumption: "10 lt/h",
            year: "2026",
            features: [
                 "2 Cabine equipaggio con WC",
                 "4 Cabine doppie con bagno ensuite",
                 "Dinette Trasformabile",
                 "Cabina marinaio: 2",
                 "Navigazione: Vela/Motore",
                 "Spese carburante: Formula Pieno/Pieno"
            ]
        },
        servicesIncluded: ["service.name.rental", "service.name.insurance", "service.name.starter_pack", "service.name.welcome"],
        servicesExtra: [],
        extraInfo: `
            <div class="mt-4 space-y-4">
            <div>
                <p class="font-bold mb-1">*APA</p>
                <ul class="list-disc pl-5 text-gray-400">
                    <li>Spesa alimentare – Cambusa (da concordare in anticipo)</li>
                    <li>Rifornimento di carburante per lo yacht e per il tender di bordo (incluso il generatore elettrico)</li>
                    <li>Le spese e tasse di ormeggio nei Marina, l’ingresso nei Parchi Marini, il costo di boe e altre voci inerenti l’ormeggio</li>
                    <li>Tasse doganali e turistiche</li>
                </ul>
            </div>
            <div>
                <p class="font-bold mb-1">**CAUZIONE</p>
                <p class="text-gray-400">Tutte le nostre barche sono coperte da assicurazione. Il deposito rappresenta la franchigia della barca stessa, che copre ogni danno accidentale causato dai passeggeri e il non adempimento dei vincoli contrattuali in essere (ad esempio il non rispetto dell’orario di restituzione della barca). Il deposito viene versato prima di iniziare la crociera e viene restituito al termine del viaggio, successivamente all’ispezione dell’imbarcazione e al check-out se non vengono riscontrati danni.</p>
            </div>
            </div>
        `,
        extraInfo_en: `
            <div class="mt-4 space-y-4">
            <div>
                <p class="font-bold mb-1">*APA</p>
                <ul class="list-disc pl-5 text-gray-400">
                    <li>Food expenses – Galley (to be agreed in advance)</li>
                    <li>Fuel refueling for the yacht and onboard tender (including electric generator)</li>
                    <li>Mooring fees and taxes in Marinas, entry to Marine Parks, cost of buoys and other mooring-related items</li>
                    <li>Customs and tourist taxes</li>
                </ul>
            </div>
            <div>
                <p class="font-bold mb-1">**SECURITY DEPOSIT</p>
                <p class="text-gray-400">All our boats are covered by insurance. The deposit represents the deductible of the boat itself, which covers any accidental damage caused by passengers and non-fulfillment of existing contractual constraints (for example failure to respect the boat return time). The deposit is paid before starting the cruise and is returned at the end of the trip, following the inspection of the boat and check-out if no damages are found.</p>
            </div>
            </div>
        `,
        imagesPath: "/images/img_sito/dream lungo",
        images: [
            "1152-excess-14-1984-min-scaled.jpg",
            "1204-excess-14-0178-min-scaled.jpg",
            "1304-excess-14-0878-min-scaled.jpg",
            "1316-excess14-0604-min-scaled.jpg",
            "1391-excess-14-0762-min-scaled.jpg",
            "1589-excess-14-1014-min-scaled.jpg",
            "1621-410-films-excess-14-catamaran-photography-2023-07620-min-scaled.jpg",
            "174-excess-14-0485-min-scaled.jpg",
            "1799-excess-14-0946-min-scaled.jpg",
            "1901-excess14-0689-min-scaled.jpg",
            "2883-excess-14-1155-scaled.jpg",
            "3752-excess-14-5801-scaled.jpg",
            "3956-excess-14-0371-scaled.jpg",
            "4503-excess-14-0294-scaled.jpg",
            "5156-excess-14-0269-scaled.jpg",
            "521-410-films-excess-14-catamaran-photography-2023-0825-min-scaled.jpg",
            "5974-excess-14-0309-scaled.jpg",
            "702-excess-14-0392-min-scaled.jpg"
        ]
    },
    'elyvian-spirit': {
         slug: 'elyvian-spirit',
         title: "Elyvian Spirit",
         subtitle: "Catamarano per vivere il mare con stile",
         stars: 5,
         location: "Italy",
         guests: 10,
         maxGuests: 10,
         hasPremiumPackage: true,
         cabins: 3,         securityDeposit: 1500,         bathrooms: 3,
         description: `
         <p class="mb-4">Elyvian Spirit è un catamarano di 11,42 metri pensato per chi vive il mare con stile, eleganza e spirito d’avventura. Unisce performance e comfort in un equilibrio perfetto, offrendo un’esperienza di charter esclusiva e sofisticata.</p>
         <p class="mb-4">Navigare a bordo di Elyvian Spirit significa immergersi nel silenzio del mare e nella libertà del vento. Il design moderno e la doppia postazione di timoneria garantiscono pieno controllo e un’ampia visione sulle vele, trasformando ogni rotta in un momento di pura emozione.</p>
         <p class="mb-4">Sotto coperta, interni luminosi, finiture ricercate e spazi ottimizzati creano un’atmosfera accogliente e raffinata. La suite armatoriale, le 2 cabine e i 2 bagni con doccia separata rendono l’imbarcazione ideale per coppie o piccoli gruppi.</p>
         <p class="mb-4">Con le vele sportive e altamente performanti (RANDA – SQUARE TOP in grigio pro-radial) Elyvian Spirit è progettata per garantire velocità, precisione e controllo assoluto; inoltre, comfort, autonomia e sostenibilità rendono la navigazione un’esperienza esclusiva! Un viaggio tailor-made in cui il tempo rallenta, l’orizzonte si apre e ogni dettaglio si trasforma in ricordo.</p>
         `,
         description_en: `
         <p class="mb-4">Elyvian Spirit is an 11.42-meter catamaran designed for those who live the sea with style, elegance, and a spirit of adventure. It combines performance and comfort in perfect balance, offering an exclusive and sophisticated charter experience.</p>
         <p class="mb-4">Sailing aboard Elyvian Spirit means immersing yourself in the silence of the sea and the freedom of the wind. The modern design and double helm station ensure full control and a wide view of the sails, transforming every route into a moment of pure emotion.</p>
         <p class="mb-4">Below deck, bright interiors, refined finishes, and optimized spaces create a welcoming and refined atmosphere. The owner's suite, the 2 cabins, and the 2 bathrooms with separate showers make the boat ideal for couples or small groups.</p>
         <p class="mb-4">With sporty and high-performance sails (SQUARE TOP MAINSAIL in pro-radial gray), Elyvian Spirit is designed to guarantee speed, precision, and absolute control; furthermore, comfort, autonomy, and sustainability make sailing an exclusive experience! A tailor-made journey where time slows down, the horizon opens up, and every detail turns into a memory.</p>
         `,
         specs: {
             length: "12.18m",
             beam: "6.59m",
             draft: "1.15m",
             fuel: "2x200L",
             water: "300L",
             engine: "Yanmar 2x29cv",
             consumption: "6 lt/h",
             year: "2026",
             features: [
                 "1 Suite Armatoriale con bagno ensuite",
                 "2 Cabine doppie con bagno in condivisione",
                 "2 Cabine equipaggio con WC",
                 "Dinette Trasformabile",
                 "Doppia timoneria: Sì",
                 "Navigazione: Vela/Motore"
             ]
         },
        servicesIncluded: ["service.name.rental", "service.name.insurance", "service.name.starter_pack", "service.name.welcome"],
         servicesExtra: [],
         extraInfo: `
            <div class="mt-4 space-y-4">
                <div>
                    <p class="font-bold mb-1">*APA</p>
                    <ul class="list-disc pl-5 text-gray-400">
                        <li>Spesa alimentare – Cambusa (da concordare in anticipo)</li>
                        <li>Rifornimento di carburante per lo yacht e per il tender di bordo (incluso il generatore elettrico)</li>
                        <li>Le spese e tasse di ormeggio nei Marina, l’ingresso nei Parchi Marini, il costo di boe e altre voci inerenti l’ormeggio</li>
                        <li>Tasse doganali e turistiche</li>
                    </ul>
                </div>
                <div>
                     <p class="font-bold mb-1">**CAUZIONE</p>
                     <p class="text-gray-400">Tutte le nostre barche sono coperte da assicurazione. Il deposito rappresenta la franchigia della barca stessa, che copre ogni danno accidentale causato dai passeggeri e il non adempimento dei vincoli contrattuali in essere (ad esempio il non rispetto dell’orario di restituzione della barca). Il deposito viene versato prima di iniziare la crociera e viene restituito al termine del viaggio, successivamente all’ispezione dell’imbarcazione e al check-out se non vengono riscontrati danni.</p>
                     <p class="mt-2 text-gray-400">Richiesta con noleggio incluso di skipper; noleggio autonomo vale la formula pieno/pieno.</p>
                </div>
            </div>
         `,
         extraInfo_en: `
            <div class="mt-4 space-y-4">
                <div>
                    <p class="font-bold mb-1">*APA</p>
                    <ul class="list-disc pl-5 text-gray-400">
                        <li>Food expenses – Galley (to be agreed in advance)</li>
                        <li>Fuel refueling for the yacht and onboard tender (including electric generator)</li>
                        <li>Mooring fees and taxes in Marinas, entry to Marine Parks, cost of buoys and other mooring-related items</li>
                        <li>Customs and tourist taxes</li>
                    </ul>
                </div>
                <div>
                     <p class="font-bold mb-1">**SECURITY DEPOSIT</p>
                     <p class="text-gray-400">All our boats are covered by insurance. The deposit represents the deductible of the boat itself, which covers any accidental damage caused by passengers and non-fulfillment of existing contractual constraints (for example failure to respect the boat return time). The deposit is paid before starting the cruise and is returned at the end of the trip, following the inspection of the boat and check-out if no damages are found.</p>
                     <p class="mt-2 text-gray-400">Request with skipper rental included; autonomous rental follows full/full formula.</p>
                </div>
            </div>
         `,
         imagesPath: "/images/img_sito/spirit lungo",
         images: [
            "1110-excess11-int-ncz7571-hdr-panorama-a3-1-scaled.jpg",
            "1603-excess11-int-ncz7608-hdr-panorama-a3-1-scaled.jpg",
            "1954-excess11-int-ncz7458-hdr-a3-1-scaled.jpg",
            "3107-excess11-int-nck4013-a3-scaled.jpg",
            "3508-excess-11-3c2t-layout-scaled.jpg",
            "3535-excess11-int-ncz7795-a3-1-scaled.jpg",
            "374-excess11-int-ncz7528-hdr-a3-1-scaled.jpg",
            "4051-excess11-int-ncz7503-hdr-a3-1-scaled.jpg",
            "4191-excess11-int-ncz7378-hdr-a3-1-scaled.jpg",
            "4191-excess11-int-ncz7378-hdr-a3-scaled.jpg",
            "49-excess11-int-ncz7753-a3-scaled.jpg",
            "5107-excess11-int-ncz7484-hdr-panorama-a3-scaled.jpg",
            "5903-excess1100295-hr-scaled.jpg",
            "6192-excess11-int-ncz7393-hdr-a3-1-scaled.jpg",
            "6192-excess11-int-ncz7393-hdr-a3-scaled.jpg",
            "6200-ncz9250-hdr-panorama-fullhd-scaled.jpg",
            "637-excess11-int-ncz7683-hdr-a3-1-scaled.jpg",
            "6484-excess1100564-hr-1-scaled.jpg",
            "7262-excess1100554-hr-scaled.jpg",
            "7302-excess11-int-nck3997-a3-scaled.jpg",
            "8304-excess11-int-ncz7763-hdr-a3-scaled.jpg",
            "8417-excess1100119-hr-scaled.jpg",
            "9884-excess11-int-ncz7398-hdr-a3-scaled.jpg"
         ]
    },
    'elyvian-breeze': {
        slug: 'elyvian-breeze',
        extraOverrides: { skipper: { mandatory: true, price: 1925 } },
        title: "Elyvian Breeze",
        subtitle: "Yacht 60FT: Potenza, Eleganza, Esclusività",
        stars: 5,
        location: "Greece",
        guests: 8,
        maxGuests: 8,
        hasPremiumPackage: true,
        cabins: 4,
        securityDeposit: 5000,
        bathrooms: 4,
        description: `
        <p class="mb-4">Elyvian Breeze è uno yacht a vela di oltre 18 metri che incarna un’eleganza senza tempo. Pensato per chi desidera un’esperienza esclusiva immersa nel silenzio del mare, offre un rifugio raffinato dove linee pure, armonia e materiali di pregio definiscono un lusso autentico.</p>
        <p class="mb-4">Salire a bordo significa entrare in una dimensione riservata: design essenziale, volumi equilibrati e interni luminosi, progettati per unire comfort e privacy. Le 3 cabine con bagno en suite interpretano al meglio l’ospitalità contemporanea grazie ad arredi ricercati e dettagli curati.</p>
        <p class="mb-4">Elyvian Breeze offre comfort senza compromessi: impianto audio, attrezzature complete, tender, SUP, elettrodomestici, oltre a una cucina perfetta per creare momenti conviviali. Gli spazi esterni – dall’ampio pozzetto alla terrazza di poppa – invitano al relax e celebrano un vero lifestyle sull’acqua.</p>
        <p class="mb-4">La navigazione è elegante, fluida e sicura: una barca agile e stabile, pensata per vivere il mare con naturalezza, in totale tranquillità. Stile raffinato, privacy ed esclusività, esperienze personalizzate e totale autonomia. Elyvian Breeze è un invito a vivere il mare con eleganza, libertà e intensità.</p>
        `,
        description_en: `
        <p class="mb-4">Elyvian Breeze is a sailing yacht of over 18 meters that embodies timeless elegance. Designed for those who desire an exclusive experience immersed in the silence of the sea, it offers a refined refuge where pure lines, harmony, and precious materials define authentic luxury.</p>
        <p class="mb-4">Boarding means entering a reserved dimension: essential design, balanced volumes, and bright interiors, designed to combine comfort and privacy. The 3 cabins with en suite bathrooms best interpret contemporary hospitality thanks to refined furnishings and careful details.</p>
        <p class="mb-4">Elyvian Breeze offers comfort without shifting: audio system, complete equipment, tender, SUP, appliances, as well as a kitchen perfect for creating convivial moments. The outdoor spaces – from the large cockpit to the stern terrace – invite relaxation and celebrate a true lifestyle on the water.</p>
        <p class="mb-4">Navigation is elegant, fluid, and safe: an agile and stable boat, designed to live the sea naturally, in total tranquility. Refined style, privacy and exclusivity, personalized experiences, and total autonomy. Elyvian Breeze is an invitation to live the sea with elegance, freedom, and intensity.</p>
        `,
        specs: {
            length: "18.26",
            beam: "5.20m",
            draft: "2.70m",
            fuel: "2x318L",
            water: "760L",
            engine: "Yanmar 150cv",
            consumption: "12 lt/h",
            year: "2025",
            features: [
                 "1 Cabina Equipaggio Doppia con Bagno completo",
                 "1 Cabina Tripla Letto matrimoniale + Letto aggiuntivo sovrapposto con bagno",
                 "1 Cabina VIP con bagno ensuite",
                 "1 Suite Armatoriale con bagno ensuite",
                 "Dinette Trasformabile"
            ]
        },
        servicesIncluded: ["service.name.rental", "service.name.insurance", "service.name.starter_pack", "service.name.welcome"],
        servicesExtra: [],
        extraInfo: `
            <div class="mt-4 space-y-4">
            <div>
                <p class="font-bold mb-1">*APA</p>
                <ul class="list-disc pl-5 text-gray-400">
                    <li>Spesa alimentare – Cambusa (da concordare in anticipo)</li>
                    <li>Rifornimento di carburante per lo yacht e per il tender di bordo (incluso il generatore elettrico)</li>
                    <li>Le spese e tasse di ormeggio nei Marina, l’ingresso nei Parchi Marini, il costo di boe e altre voci inerenti l’ormeggio</li>
                    <li>Tasse doganali e turistiche</li>
                </ul>
            </div>
            <div>
                 <p class="font-bold mb-1">**CAUZIONE</p>
                 <p class="text-gray-400">Tutte le nostre barche sono coperte da assicurazione. Il deposito rappresenta la franchigia della barca stessa, che copre ogni danno accidentale causato dai passeggeri e il non adempimento dei vincoli contrattuali in essere (ad esempio il non rispetto dell’orario di restituzione della barca). Il deposito viene versato prima di iniziare la crociera e viene restituito al termine del viaggio, successivamente all’ispezione dell’imbarcazione e al check-out se non vengono riscontrati danni.</p>
            </div>
            </div>
        `,
        extraInfo_en: `
            <div class="mt-4 space-y-4">
            <div>
                <p class="font-bold mb-1">*APA</p>
                <ul class="list-disc pl-5 text-gray-400">
                    <li>Food expenses – Galley (to be agreed in advance)</li>
                    <li>Fuel refueling for the yacht and onboard tender (including electric generator)</li>
                    <li>Mooring fees and taxes in Marinas, entry to Marine Parks, cost of buoys and other mooring-related items</li>
                    <li>Customs and tourist taxes</li>
                </ul>
            </div>
            <div>
                 <p class="font-bold mb-1">**SECURITY DEPOSIT</p>
                 <p class="text-gray-400">All our boats are covered by insurance. The deposit represents the deductible of the boat itself, which covers any accidental damage caused by passengers and non-fulfillment of existing contractual constraints (for example failure to respect the boat return time). The deposit is paid before starting the cruise and is returned at the end of the trip, following the inspection of the boat and check-out if no damages are found.</p>
            </div>
            </div>
        `,
        imagesPath: "/images/img_sito/breeze lungo",
        images: [
            "1d305ebe60962d14e94c7b74751d45fb.jpg",
            "53124270a7c3417f9d398ed9d2ddf53d-683x1024-2.jpg",
            "70b02661b3bae04f76d04ace29f54945.jpg",
            "7737f0c247ad822852eebe9e9793bbe7-1-1 (1).jpg",
            "bea739636f38f9a7a2916e1036000eca (1).jpg",
            "ca8ec5b499f96a206635c0c7a9e22e92-1 (1).jpg",
            "da4d60161bcc80a5fc84af488bd3491b.jpg",
            "WhatsApp-Image-2025-06-18-at-08.39.5215 (1).jpeg",
            "WhatsApp-Image-2025-06-18-at-08.39.5216.jpeg",
            "WhatsApp-Image-2025-06-18-at-08.39.523 (1).jpeg",
            "WhatsApp-Image-2025-06-18-at-09.39.55.jpeg",
            "WhatsApp-Image-2025-06-18-at-09.39.5510.jpeg",
            "WhatsApp-Image-2025-06-18-at-09.39.552.jpeg",
            "WhatsApp-Image-2025-06-18-at-09.39.555.jpeg"
        ]
    },
    'pasqua-breeze': {
        slug: 'pasqua-breeze',
        extraOverrides: { skipper: { mandatory: true, price: 0 } },
        isEasterOffer: true,
        title: "Pasqua in mare – Elyvian Breeze",
        subtitle: "Eleganza e sportività",
        stars: 5,
        location: "Italy",
        guests: 8,
        maxGuests: 8,
        hasPremiumPackage: false,
        cabins: 4,
        securityDeposit: 5000, 
        bathrooms: 4,
        description: `
        <h2 class="text-2xl font-display mb-4">Pasqua in barca con Elyvian Breeze</h2>
        <p class="mb-4">Vivi l'emozione di una crociera esclusiva a bordo di Elyvian Breeze. Un mix perfetto di prestazioni sportive e comfort di lusso per una Pasqua indimenticabile, tra relax e avventura.</p>
        <p class="mb-4">Se desideri vivere un’esperienza unica, richiedi un preventivo per scoprire i nostri viaggi organizzati o per ricevere un programma personalizzato.</p>
        `,
        description_en: `
        <h2 class="text-2xl font-display mb-4">Easter on boat with Elyvian Breeze</h2>
        <p class="mb-4">Experience the thrill of an exclusive cruise aboard Elyvian Breeze. A perfect mix of sporting performance and luxury comfort for an unforgettable Easter, between relaxation and adventure.</p>
        <p class="mb-4">If you wish to live a unique experience, request a quote to discover our organized trips or to receive a personalized program.</p>
        `,
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
        },
        specs: {
            length: "18.26m",
            beam: "5.20m",
            draft: "2.70m",
            fuel: "2x318L",
            water: "760L",
            engine: "Yanmar 150cv",
            consumption: "12 lt/h",
            year: "2025",
            features: [
                 "1 Cabina Equipaggio Doppia con Bagno completo",
                 "1 Cabina Tripla Letto matrimoniale + Letto aggiuntivo sovrapposto con bagno",
                 "1 Cabina VIP con bagno ensuite",
                 "1 Suite Armatoriale con bagno ensuite",
                 "Dinette Trasformabile"
            ]
        },
        servicesIncluded: ["service.name.rental", "service.name.insurance", "service.name.starter_pack", "service.name.welcome"],
        servicesExtra: [],
         extraInfo: `
            <p class="mb-2"><strong>*APA</strong>: Spesa alimentare – Cambusa, Carburante, Tasse ormeggio.</p>
            <p><strong>**CAUZIONE</strong>: Deposito cauzionale.</p>
        `,
        extraInfo_en: `
            <p class="mb-2"><strong>*APA</strong>: Food expenses – Galley, Fuel, Mooring fees.</p>
            <p><strong>**SECURITY DEPOSIT</strong>: Security deposit.</p>
        `,
        imagesPath: "/images/img_sito/breeze lungo",
        images: [
            "70b02661b3bae04f76d04ace29f54945.jpg",
            "ca8ec5b499f96a206635c0c7a9e22e92-1 (1).jpg",
            "bea739636f38f9a7a2916e1036000eca (1).jpg",
            "1d305ebe60962d14e94c7b74751d45fb.jpg",
            "53124270a7c3417f9d398ed9d2ddf53d-683x1024-2.jpg",
            "7737f0c247ad822852eebe9e9793bbe7-1-1 (1).jpg",
            "da4d60161bcc80a5fc84af488bd3491b.jpg",
            "WhatsApp-Image-2025-06-18-at-08.39.5215 (1).jpeg",
            "WhatsApp-Image-2025-06-18-at-08.39.5216.jpeg",
            "WhatsApp-Image-2025-06-18-at-08.39.523 (1).jpeg",
            "WhatsApp-Image-2025-06-18-at-09.39.55.jpeg",
            "WhatsApp-Image-2025-06-18-at-09.39.5510.jpeg",
            "WhatsApp-Image-2025-06-18-at-09.39.552.jpeg",
            "WhatsApp-Image-2025-06-18-at-09.39.555.jpeg"
        ]
    }
};
