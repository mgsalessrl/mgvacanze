'use client';

import { useState } from 'react';
import { FileText, Settings, List, CheckCircle, Map } from 'lucide-react';
import { useTranslation } from './I18nContext';
import { WeeklyItinerary } from './WeeklyItinerary';

interface ExtraOption {
  name: string;
  price: number;
  type: number;
}

interface PropertyDetailsProps {
    description: string;
    technicalSpecs?: Record<string, string>;
    features?: string[];
    extraOptions?: ExtraOption[];
}

export function PropertyDetails({ description, technicalSpecs = {}, features = [], extraOptions = [] }: PropertyDetailsProps) {
    const [activeTab, setActiveTab] = useState<'details' | 'itinerary' | 'services'>('details');
    const { t } = useTranslation();

    const formatLabel = (key: string) => {
        const tKey = `spec.${key}`;
        const translated = t(tKey);
        if (translated !== tKey) return translated;
        return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="space-y-8">
            {/* Description - Moved outside tabs for better visibility and style match */}
            <div 
                className="prose prose-lg text-gray-600 max-w-none font-light" 
                dangerouslySetInnerHTML={{ __html: description }} 
            />

            {/* Tabs Header */}
            <div className="border-b border-gray-200">
                <nav className="flex -mb-px space-x-8 overflow-x-auto" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`border-b-2 py-4 px-1 text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${
                            activeTab === 'details'
                            ? 'border-brand-gold text-brand-dark'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        {t('tab.specs')}
                    </button>
                    <button
                        onClick={() => setActiveTab('itinerary')}
                        className={`border-b-2 py-4 px-1 text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${
                            activeTab === 'itinerary'
                            ? 'border-brand-gold text-brand-dark'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        {t('nav.itineraries')}
                    </button>
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`border-b-2 py-4 px-1 text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-colors ${
                            activeTab === 'services'
                            ? 'border-brand-gold text-brand-dark'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                        {t('nav.services')}
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div className="pt-4">
                {activeTab === 'details' && (
                    <div className="animate-in fade-in duration-300 space-y-12">
                         {/* Tech Specs Grid */}
                         {Object.keys(technicalSpecs).length > 0 && (
                            <div>
                                <h3 className="text-2xl font-display text-brand-dark mb-6 border-b pb-2">{t('boat.tech_specs')}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                                    {Object.entries(technicalSpecs).map(([key, value]) => (
                                        <div key={key} className="flex justify-between items-center border-b border-gray-100 pb-2">
                                            <span className="text-gray-500 font-medium">{formatLabel(key)}</span>
                                            <span className="text-gray-900">{value || '-'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                         )}
                    </div>
                )}

                {activeTab === 'itinerary' && (
                    <div className="animate-in fade-in duration-300">
                         <WeeklyItinerary />
                    </div>
                )}

                {activeTab === 'services' && (
                    <div className="animate-in fade-in duration-300">
                         {features.length > 0 ? (
                            <div>
                                <h3 className="text-xl font-display text-brand-dark mb-4">{t('boat.features_cabins')}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {features.map((feature, idx) => {
                                        // Check if feature is a known key or needs "Included" prefix logic
                                        const isKey = feature.startsWith('service.name.');
                                        const text = isKey ? `${t('common.included')}: ${t(feature as any)}` : feature;
                                        
                                        return (
                                        <div key={idx} className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-brand-gold mr-3 shrink-0" />
                                            <span className="text-gray-700">{text}</span>
                                        </div>
                                        );
                                    })}
                                </div>
                            </div>
                         ) : (
                             <p className="text-gray-500 italic text-center">Nessun servizio specificato.</p>
                         )}
                    </div>
                )}
            </div>
        </div>
    );
}
