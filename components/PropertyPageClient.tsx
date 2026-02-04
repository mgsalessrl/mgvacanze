"use client";

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Users, ArrowLeft } from 'lucide-react';
import { LightboxGallery } from '@/components/LightboxGallery';
import { PropertyDetails } from '@/components/PropertyDetails';
import { BookingForm } from '@/components/BookingForm';
import { Property } from '@/lib/types';
import { useTranslation } from '@/components/I18nContext';
import { Discount } from '@/lib/pricing_engine';

interface PropertyPageClientProps {
  property: Property;
  boatSlug?: string;
  discounts?: Discount[];
}

export default function PropertyPageClient({ property, boatSlug, discounts = [] }: PropertyPageClientProps) {
  const { t, language } = useTranslation();
  const imageUrl = property.image?.startsWith('/') 
    ? property.image 
    : (property.image ? `/uploads/${property.image}` : '/placeholder.jpg');

  const description = language === 'en' ? (property.description_en || property.description) : property.description;

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans">
      {/* Header / Nav */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('common.back_search')}
            </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pt-8 animate-fade-in-up">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Header Info */}
                <div>
                   <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">{property.title}</h1>
                   {/* Location removed */}
                </div>

                {/* Main Image */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-sm bg-gray-200" suppressHydrationWarning>
                     {property.image ? (
                        <Image
                            src={imageUrl}
                            alt={property.title}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                            priority
                            suppressHydrationWarning={true}
                        />
                     ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">{t('common.no_image')}</div>
                     )}
                </div>

                {/* Gallery Grid -> LightboxGallery */}
                {property.images && property.images.length > 0 && (
                  <div className="mt-8">
                     <h3 className="text-2xl font-display text-gray-900 mb-4">{t('common.gallery')}</h3>
                     <LightboxGallery images={property.images} title={property.title} />
                  </div>
                )}

                {/* Specs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-col items-center justify-center p-2 text-center">
                        <Users className="w-6 h-6 text-primary mb-2" />
                        <span className="text-sm font-semibold">{property.specs.guests} {t('boat.guests')}</span>
                    </div>
                     <div className="flex flex-col items-center justify-center p-2 text-center">
                        {/* Assuming Bed icon was used, imported properly? Re-using standard icons or text */}
                        <span className="text-xl font-bold text-primary mb-1">{property.specs.bedrooms}</span>
                        <span className="text-sm font-semibold">{t('boat.cabins')}</span>
                    </div>
                     <div className="flex flex-col items-center justify-center p-2 text-center">
                        <span className="text-xl font-bold text-primary mb-1">{property.specs.bathrooms}</span>
                        <span className="text-sm font-semibold">{t('boat.bathrooms')}</span>
                    </div>
                </div>

                <PropertyDetails 
                    description={description} 
                    technicalSpecs={property.technical_specs}
                    features={property.features}
                    extraOptions={property.extra_options}
                />
                
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
                        propertyId={property.id} 
                        price={property.price} 
                        maxGuests={property.specs.guests}
                        cabins={property.specs.bedrooms}
                        hasPremiumPackage={['elyvian-breeze', 'elyvian-spirit', 'elyvian-dream'].includes(boatSlug || '')}
                        boatSlug={boatSlug}
                        discounts={discounts}
                    />
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
