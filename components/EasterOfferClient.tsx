"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Anchor } from 'lucide-react';
import { useTranslation } from '@/components/I18nContext';
import EasterBookingForm from '@/components/EasterBookingForm';
import { LightboxGallery } from '@/components/LightboxGallery';

// This is a CLIENT component that renders the offer content with translations
// It receives the data from the Server Component
export default function EasterOfferClient({ data, slug }: { data: any, slug: string }) {
  const { t, language } = useTranslation();

  const description = language === 'en' ? (data.description_en || data.description) : data.description;
  const discountText = language === 'en' ? (data.discountText_en || data.discountText) : data.discountText;

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
           <Link href="/#offers" className="flex items-center text-gray-600 hover:text-brand-dark">
               <ArrowLeft className="w-5 h-5 mr-2" />
               {t('easter.back_offers')}
           </Link>
           <h1 className="font-display text-xl text-brand-dark hidden md:block">{data.title}</h1>
           <div className="w-10"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
                {/* Hero Image */}
                <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
                    <Image 
                        src={`${data.imagesPath}/${data.images?.[0] || 'placeholder.jpg'}`} 
                        alt={data.title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 text-white">
                        <h2 className="text-3xl font-display mb-2">{data.title}</h2>
                        <p className="text-white/90">{data.subtitle}</p>
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 prose max-w-none text-gray-600"
                     dangerouslySetInnerHTML={{ __html: description || '' }}
                />

                {/* Itinerary / Program */}
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-display text-xl mb-6 flex items-center gap-2">
                        <Anchor className="w-5 h-5 text-brand-gold" />
                        {t('easter.included')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.servicesIncluded?.map((s: string, i: number) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                                <span className="text-sm font-medium text-gray-700">{s}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gallery Grid */}
                 <div className="mt-8">
                    <h3 className="font-display text-xl mb-6 flex items-center gap-2">
                        {t('common.gallery')}
                    </h3>
                    <LightboxGallery 
                        images={data.images && data.images.length > 0 
                            ? data.images.slice(1).map((img: string) => `${data.imagesPath}/${img}`) 
                            : []
                        } 
                        title={data.title} 
                    />
                 </div>
            </div>

            {/* Sidebar Booking */}
            <div className="lg:col-span-1">
                <div className="sticky top-24">
                     <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                        <div className="text-center mb-6">
                            <p className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-2">{t('easter.special_price')}</p>
                            <div className="text-3xl font-display text-brand-dark">
                                {slug.includes('spirit') ? '€ 6.000' : slug.includes('dream') ? '€ 8.000' : '€ 10.000'} <span className="text-sm font-sans text-gray-400 font-normal">{t('easter.per_week')}</span>
                            </div>
                        </div>

                        {/* Booking Form with specifics */}
                        <div className="space-y-4">
                             {/* Replaced hardcoded list with Booking Form that handles it, or keep it translated? 
                                 EasterBookingForm handles date selection visually.
                                 Let's include the available dates info again but translated.
                             */}
                             <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800">
                                <p className="font-bold mb-1">{t('easter.available_dates')}</p>
                                <ul className="list-disc pl-4 space-y-1">
                                    <li>{t('easter.catholic')}: 3 Aprile - 7 Aprile</li>
                                    <li>{t('easter.orthodox')}: 9 Aprile - 14 Aprile</li>
                                </ul>
                             </div>

                             <EasterBookingForm 
                                boatName={data.title}
                                boatSlug={slug}
                                extras={data.servicesExtra}
                             />
                        </div>
                     </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
