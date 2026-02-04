import Image from 'next/image';
import { Metadata } from 'next';
import { LightboxGallery } from '@/components/LightboxGallery';
import { getSeoMetadata } from '@/lib/seo-config';
import { ItineraryDisclaimer } from '@/components/ItineraryDisclaimer';

export const metadata: Metadata = getSeoMetadata('/itinerari');

const itineraries = [
  {
    title: 'Versante Adriatico',
    route: 'Leuca – Otranto – Castro - Cala dell’Acquaviva - Porto Badisco o Torre Sant’Andrea - Brindisi – Torre Guaceto - Polignano a Mare – Monopoli',
    image: '/images/foto itinerari/otranto.jpg',
    alt: 'Costa Adriatica e Otranto',
  },
  {
    title: 'Versante Ionico Sud',
    route: 'Leuca – Pescoluse – Gallipoli - Porto Cesareo - Campomarino di Maruggio – Taranto - Torre Ovo',
    image: '/images/foto itinerari/gallipoli.jpg',
    alt: 'Gallipoli e Ionico Sud',
  },
  {
    title: 'Versante Ionico Nord / Isole',
    route: 'Taranto e le Isole Cheradi – Campomarino di Maruggio - Porto Cesareo e Isola dei Conigli – Torre Lapillo e Porto Selvaggio – Gallipoli – S.Pietro in Bevagna',
    image: '/images/foto itinerari/porto cesareo.jpg',
    alt: 'Porto Cesareo e Isole',
  },
  {
    title: 'Grecia Classica',
    route: 'Leuca – Othonoi – Erikousa – Mathraki – Corfù – Agios Stefanos',
    image: '/images/foto itinerari/corfu.jpg',
    alt: 'Corfù e Grecia Classica',
  },
  {
    title: 'Grecia Avventura',
    route: 'Leuca – Othonoi - Erikousa – Paxos – Lakka – Sivota',
    image: '/images/foto itinerari/pasos.jpg',
    alt: 'Paxos e Grecia Avventura',
  },
];

const galleryImages = [
  { src: '/images/foto itinerari/alberobello1.jpg', caption: 'Alberobello' },
  { src: '/images/foto itinerari/atene.jpg', caption: 'Atene' },
  { src: '/images/foto itinerari/corfu.jpg', caption: 'Corfù' },
  { src: '/images/foto itinerari/gallipoli.jpg', caption: 'Gallipoli' },
  { src: '/images/foto itinerari/grecia (2).jpg', caption: 'Grecia' },
  { src: '/images/foto itinerari/grecia.jpg', caption: 'Grecia' },
  { src: '/images/foto itinerari/lecce1.jpg', caption: 'Lecce' },
  { src: '/images/foto itinerari/lecce2.jpg', caption: 'Lecce' },
  { src: '/images/foto itinerari/leuca1.jpg', caption: 'Santa Maria di Leuca' },
  { src: '/images/foto itinerari/monopoli1.jpg', caption: 'Monopoli' },
  { src: '/images/foto itinerari/mykonos.jpg', caption: 'Mykonos' },
  { src: '/images/foto itinerari/otranto.jpg', caption: 'Otranto' },
  { src: '/images/foto itinerari/pasos.jpg', caption: 'Paxos' },
  { src: '/images/foto itinerari/polignanoamare.jpg', caption: 'Polignano a Mare' },
  { src: '/images/foto itinerari/porto cesareo.jpg', caption: 'Porto Cesareo' },
  { src: '/images/foto itinerari/portocesreotramonto.jpg', caption: 'Tramonto a Porto Cesareo' },
  { src: '/images/foto itinerari/tarantomarepiccolo.jpg', caption: 'Taranto (Mar Piccolo)' },
  { src: '/images/foto itinerari/torrelapillo.jpg', caption: 'Torre Lapillo' },
];

export default function ItinerariesPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full">
        <Image
          src="/images/foto itinerari/leuca1.jpg"
          alt="Santa Maria di Leuca"
          fill
          className="object-cover animate-fade-in"
          priority
        />
        <div className="absolute inset-0 bg-brand-dark/40" />
        <div className="absolute inset-0 flex items-center justify-center animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-display text-white font-bold tracking-wide drop-shadow-lg">
            I Nostri Itinerari
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        {/* Intro Text */}
        <div className="max-w-4xl mx-auto text-center mb-20 space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light">
            I nostri itinerari si sviluppano lungo coste altamente scenografiche, dove natura e storia si incontrano. 
            Il <span className="text-brand-gold font-medium">versante Adriatico</span> è caratterizzato da grotte marine, falesie e torri federiciane, sentinelle di pietra affacciate sul mare, testimonianza di un passato che continua a dialogare con il presente.
          </p>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light">
            Il <span className="text-brand-gold font-medium">versante Ionico</span> regala invece grandi spiagge, atmosfere mediterranee e acque turchesi, ideali per una navigazione rilassata e immersa nei colori del Sud.
          </p>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-light">
            La navigazione offre una piacevole alternanza tra rade ridossate e porti attrezzati, rendendo la vacanza perfetta sia per chi ama sostare in rada sia per chi preferisce il comfort del porto.
          </p>
        </div>

        {/* Itinerary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {itineraries.map((item, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-2"
            >
              <div className="relative h-72 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-display text-white font-bold drop-shadow-md tracking-wide">
                    {item.title}
                  </h3>
                  <div className="h-1 w-12 bg-brand-gold mt-3 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery Section */}
        <div className="mb-20 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-display text-brand-dark mb-4 drop-shadow-sm">Galleria Fotografica</h2>
                <div className="w-24 h-1 bg-brand-gold mx-auto" />
            </div>
            <LightboxGallery images={galleryImages} title="Scorci unici tra Puglia e Grecia" />
        </div>

        {/* Disclaimer */}
        <ItineraryDisclaimer />
      </div>
    </div>
  );
}
