"use client";

import { useState } from 'react';
import { WeeklyItinerary } from './WeeklyItinerary';
import { LightboxGallery } from '@/components/LightboxGallery';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Users, Bed, Bath, Anchor, Fuel, Droplet, Gauge, Calendar } from 'lucide-react';
import { BookingForm } from './BookingForm'; // Use main BookingForm
import { useTranslation } from './I18nContext';
import { ItineraryTimeline, ItineraryDocs } from './ItineraryTimeline';

interface BoatData {
    isEasterOffer?: boolean; 
    propertyId?: number;
    slug?: string;
    packageDates?: { start: string; end: string; };
    itinerary?: ItineraryDocs;
    title: string;
    subtitle: string;
    subtitle_en?: string;
    stars: number;
    location: string;
    guests: number;
    cabins: number;
    bathrooms: number;
    description: string; // HTML string
    description_en?: string;
    specs: {
        length: string;
        beam: string;
        draft: string;
        fuel: string;
        water: string;
        engine: string;
        consumption: string;
        year: string;
        features: string[];
    };
    servicesIncluded: string[];
    servicesExtra: string[];
    extraInfo?: string; // HTML string
    extraInfo_en?: string;
    imagesPath: string;
    images: string[];
    heroImagePosition?: string;
    itinerary_en?: ItineraryDocs;
    extraOptions?: any[];
    discounts?: any[];
    hasPremiumPackage?: boolean;
}

const parseDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
};

export default function BoatDetailLayout({ data }: { data: BoatData }) {
  const mainImage = data.images.length > 0 ? `${data.imagesPath}/${data.images[0]}` : '/placeholder.jpg';
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState<'details' | 'itinerary' | 'services'>('details');

  const isEn = language === 'en';
  
  const subtitle = (isEn && data.subtitle_en) ? data.subtitle_en : data.subtitle;
  const description = (isEn && data.description_en) ? data.description_en : data.description;
  const extraInfo = (isEn && data.extraInfo_en) ? data.extraInfo_en : data.extraInfo;
  const itinerary = (isEn && data.itinerary_en) ? data.itinerary_en : data.itinerary;

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero / Header Image */}
      <div className="relative h-[40vh] md:h-[60vh] w-full bg-gray-900 overflow-hidden">
        <Image 
          src={mainImage}
          alt={data.title}
          fill
          className="object-cover opacity-80 scale-105 animate-fade-in"
          style={{ 
            animationDuration: '2s',
            objectPosition: data.heroImagePosition || 'center'
          }}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 container mx-auto animate-fade-in-up delay-200">
            <h1 className="text-4xl md:text-6xl font-display text-white mb-2">{data.title}</h1>
            <p className="text-xl text-brand-gold uppercase tracking-widest mb-6">{subtitle}</p>
            <div className="flex items-center space-x-6 text-white text-sm md:text-base">
                <div className="flex items-center text-yellow-400">
                     {[...Array(data.stars)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                {/* Location removed */}
                <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" /> {data.guests} {t('boat.guests')}
                </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
            {/* ITINERARY TIMELINE - TOP PRIORITY VISIBILITY */}
            {itinerary && (
                <div className="bg-white p-6 rounded-xl border-2 border-brand-gold/20 shadow-sm mb-10">
                     <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                         <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-brand-gold" />
                         </div>
                         <div>
                            <h3 className="text-xl font-display text-brand-dark">{t('boat.itinerary_title') || 'Programma di Viaggio'}</h3>
                            <p className="text-sm text-gray-500">Itinerario esclusivo per questa offerta</p>
                         </div>
                     </div>
                     <ItineraryTimeline data={itinerary} />
                </div>
            )}

            {/* Description */}
            <div className="prose prose-lg text-gray-600 max-w-none font-light" dangerouslySetInnerHTML={{ __html: description }}></div>

            {/* Technical Specs Table */}
            { !data.isEasterOffer ? (
                <div className="mt-12">
                     <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
                        <button 
                            onClick={() => setActiveTab('details')}
                            className={`px-6 py-4 font-bold text-sm uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${activeTab === 'details' ? 'border-brand-gold text-brand-dark' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            {t('boat.detail_tab') || 'Scheda Tecnica'}
                        </button>
                        <button 
                            onClick={() => setActiveTab('itinerary')}
                            className={`px-6 py-4 font-bold text-sm uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${activeTab === 'itinerary' ? 'border-brand-gold text-brand-dark' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            {t('boat.itinerary_tab') || 'Itinerari'}
                        </button>
                        <button 
                            onClick={() => setActiveTab('services')}
                            className={`px-6 py-4 font-bold text-sm uppercase tracking-widest border-b-2 transition-colors whitespace-nowrap ${activeTab === 'services' ? 'border-brand-gold text-brand-dark' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            {t('boat.services_tab') || 'Servizi'}
                        </button>
                     </div>

                     {activeTab === 'details' && (
                        <div className="space-y-12 animate-fade-in">
                            {/* Technical Specs Table */}
                            <div>
                                <h3 className="text-2xl font-display text-brand-dark mb-6 border-b pb-2">{t('boat.tech_specs')}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm md:text-base">
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 font-medium">{t('spec.length')}</span>
                                        <span className="text-gray-900">{data.specs.length}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 font-medium">{t('spec.beam')}</span>
                                        <span className="text-gray-900">{data.specs.beam}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 font-medium">{t('spec.draft')}</span>
                                        <span className="text-gray-900">{data.specs.draft}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 font-medium">{t('spec.year')}</span>
                                        <span className="text-gray-900">{data.specs.year}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 font-medium">{t('spec.engine')}</span>
                                        <span className="text-gray-900">{data.specs.engine}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 font-medium">{t('spec.consumption')}</span>
                                        <span className="text-gray-900">{data.specs.consumption}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 font-medium">{t('spec.fuel')}</span>
                                        <span className="text-gray-900">{data.specs.fuel}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-500 font-medium">{t('spec.water')}</span>
                                        <span className="text-gray-900">{data.specs.water}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Features List */}
                            <div>
                                <h3 className="text-2xl font-display text-brand-dark mb-6 border-b pb-2">{t('boat.features_cabins')}</h3>
                                <ul className="space-y-3">
                                    {data.specs.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start text-gray-700">
                                            <span className="text-brand-gold mr-3">✓</span> {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                     )}

                     {activeTab === 'itinerary' && (
                        <div className="animate-fade-in">
                            <WeeklyItinerary />
                        </div>
                     )}
                     
                     {activeTab === 'services' && (
                        <div className="animate-fade-in">
                                 {/* Services */}
                             <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xl font-display text-brand-dark mb-4">{t('boat.services_included')}</h3>
                                    <ul className="space-y-2 text-gray-600 text-sm">
                                        {data.servicesIncluded.map((s, i) => (
                                            <li key={i}>• {
                                                s.toLowerCase().includes('noleggio') ? t('service.name.rental') :
                                                s.toLowerCase().includes('assicurazione') ? t('service.name.insurance') :
                                                s.toLowerCase().includes('dotazione') ? t('service.name.starter_pack') :
                                                s.toLowerCase().includes('cocktail') ? t('service.name.welcome') :
                                                s
                                            }</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                     <h3 className="text-xl font-display text-brand-dark mb-4">{t('boat.services_extra')}</h3>
                                     <ul className="space-y-2 text-gray-600 text-sm">
                                        {data.servicesExtra.map((s, i) => {
                                            let translated = s;
                                            if (s.toLowerCase().includes('skipper')) translated = s.replace(/Skipper/i, t('service.name.skipper'));
                                            else if (s.toLowerCase().includes('hostess')) translated = s.replace(/Hostess/i, t('service.name.hostess'));
                                            else if (s.toLowerCase().includes('pulizia')) translated = s.replace(/Pulizia finale/i, t('service.name.cleaning'));
                                            else if (s.toLowerCase().includes('tender')) translated = s.replace(/Tender/i, t('service.name.tender'));
                                            else if (s.toLowerCase().includes('apa')) translated = s.replace(/APA/i, t('service.name.apa'));
                                            else if (s.toLowerCase().includes('cauzione')) translated = s.replace(/Cauzione/i, t('service.name.deposit'));
                                            
                                            return <li key={i}>• {translated}</li>
                                        })}
                                    </ul>
                                     {extraInfo && <div className="mt-4 text-xs text-gray-500 space-y-1" dangerouslySetInnerHTML={{__html: extraInfo}}></div>}
                                </div>
                             </div>
                        </div>
                     )}
                </div>
            ) : (
                <div className="space-y-12">
                    {/* Technical Specs Table */}
                    <div>
                        <h3 className="text-2xl font-display text-brand-dark mb-6 border-b pb-2">{t('boat.tech_specs')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm md:text-base">
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-500 font-medium">{t('spec.length')}</span>
                                <span className="text-gray-900">{data.specs.length}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-500 font-medium">{t('spec.beam')}</span>
                                <span className="text-gray-900">{data.specs.beam}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-500 font-medium">{t('spec.draft')}</span>
                                <span className="text-gray-900">{data.specs.draft}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-500 font-medium">{t('spec.year')}</span>
                                <span className="text-gray-900">{data.specs.year}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-500 font-medium">{t('spec.engine')}</span>
                                <span className="text-gray-900">{data.specs.engine}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-500 font-medium">{t('spec.consumption')}</span>
                                <span className="text-gray-900">{data.specs.consumption}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-500 font-medium">{t('spec.fuel')}</span>
                                <span className="text-gray-900">{data.specs.fuel}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-gray-500 font-medium">{t('spec.water')}</span>
                                <span className="text-gray-900">{data.specs.water}</span>
                            </div>
                        </div>
                    </div>

                    {/* Features List */}
                    <div>
                        <h3 className="text-2xl font-display text-brand-dark mb-6 border-b pb-2">{t('boat.features_cabins')}</h3>
                        <ul className="space-y-3">
                            {data.specs.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start text-gray-700">
                                    <span className="text-brand-gold mr-3">✓</span> {feature}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-display text-brand-dark mb-4">{t('boat.services_included')}</h3>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                {data.servicesIncluded.map((s, i) => (
                                    <li key={i}>• {
                                        s.toLowerCase().includes('noleggio') ? t('service.name.rental') :
                                        s.toLowerCase().includes('assicurazione') ? t('service.name.insurance') :
                                        s.toLowerCase().includes('dotazione') ? t('service.name.starter_pack') :
                                        s.toLowerCase().includes('cocktail') ? t('service.name.welcome') :
                                        s
                                    }</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            ) }

             {/* Gallery Preview (Simple Grid) -> Lightbox Gallery */}
             <div>
                <h3 className="text-2xl font-display text-brand-dark mb-6">{t('boat.gallery')}</h3>
                <LightboxGallery 
                    images={data.images.map(img => `${data.imagesPath}/${img}`)} 
                    title={data.title} 
                />
             </div>

             {/* Disclaimer Itinerari */}
             <div className="mt-8 p-6 bg-gray-50 border border-gray-100 rounded-lg">
                <p className="text-sm text-gray-500 italic text-center leading-relaxed">
                    "{t('itinerary.disclaimer')}"
                </p>
             </div>

        </div>

        {/* Sidebar / Booking Form */}
        <div className="lg:col-span-1">
            <div className="sticky top-24">
                 <BookingForm 
                    propertyId={data.propertyId || 0}
                    boatSlug={data.slug}
                    price={0}
                    maxGuests={data.guests}
                    cabins={data.cabins}
                    hasPremiumPackage={data.hasPremiumPackage}
                    isPackage={data.isEasterOffer}
                    extraOptions={data.extraOptions}
                    discounts={data.discounts || []}
                    forcedStartDate={data.packageDates ? parseDate(data.packageDates.start) : undefined}
                    forcedEndDate={data.packageDates ? parseDate(data.packageDates.end) : undefined}
                 />
                 <div className="mt-8 text-center pt-8 border-t border-gray-200">
                    <p className="text-gray-500 text-sm mb-2">{t('boat.questions')}</p>
                    <a href="tel:+390832243574" className="text-xl font-bold text-brand-dark hover:text-brand-gold block">+39 0832 243574</a>
                    <a href="mailto:info@mgvacanze.com" className="text-sm text-gray-600 hover:text-brand-gold">info@mgvacanze.com</a>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
