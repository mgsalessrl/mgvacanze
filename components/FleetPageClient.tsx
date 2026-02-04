"use client";

import { useState } from 'react';
import { Property } from '@/lib/types';
import PropertyCard from '@/components/PropertyCard';
import { Filter } from 'lucide-react';
import { useTranslation } from '@/components/I18nContext';

interface FleetPageClientProps {
  initialProperties: Property[];
}

export default function FleetPageClient({ initialProperties }: FleetPageClientProps) {
  const { t } = useTranslation();
  // Filter logic can be moved here later, for now just UI extraction
  const properties = initialProperties; 

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-brand-dark text-white py-16">
        <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-display font-bold mb-4 text-brand-gold">{t('fleet.title')}</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto font-light">
                {t('fleet.desc')}
            </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-64 flex-shrink-0">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-brand-dark font-display text-lg">{t('fleet.filters')}</h3>
                        <Filter className="w-4 h-4 text-brand-gold" />
                    </div>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="text-sm font-semibold text-brand-dark mb-2 block">{t('fleet.boat_type')}</label>
                            <div className="space-y-2">
                                <label className="flex items-center text-sm text-gray-600 hover:text-brand-gold cursor-pointer transition-colors">
                                    <input type="checkbox" className="mr-2 rounded text-brand-dark focus:ring-brand-gold" /> {t('fleet.type_catamaran')}
                                </label>
                                <label className="flex items-center text-sm text-gray-600 hover:text-brand-gold cursor-pointer transition-colors">
                                    <input type="checkbox" className="mr-2 rounded text-brand-dark focus:ring-brand-gold" /> {t('fleet.type_sailboat')}
                                </label>
                                <label className="flex items-center text-sm text-gray-600 hover:text-brand-gold cursor-pointer transition-colors">
                                    <input type="checkbox" className="mr-2 rounded text-brand-dark focus:ring-brand-gold" /> {t('fleet.type_motor_yacht')}
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-brand-dark mb-2 block">{t('boat.guests')}</label>
                             <select className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50 text-gray-700 focus:outline-none focus:border-brand-gold">
                                <option>{t('fleet.any')}</option>
                                <option>Fino a 6</option>
                                <option>Fino a 8</option>
                                <option>Fino a 10</option>
                                <option>12+</option>
                             </select>
                        </div>
                        
                        <button className="w-full bg-brand-dark text-white py-2 rounded-md font-medium text-sm hover:bg-brand-gold hover:text-brand-dark transition-colors">
                            {t('fleet.apply_filters')}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Grid */}
            <div className="flex-grow">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-brand-dark font-display">{properties.length} {t('fleet.available_yachts')}</h2>
                    <select className="border border-gray-200 rounded-md p-2 text-sm bg-white text-gray-700 focus:outline-none focus:border-brand-gold">
                        <option>{t('fleet.sort_feature')}</option>
                        <option>{t('fleet.sort_price_asc')}</option>
                        <option>{t('fleet.sort_price_desc')}</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
