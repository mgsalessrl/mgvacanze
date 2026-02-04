"use client";

import { useTranslation } from './I18nContext';

export function ItineraryDisclaimer() {
    const { t } = useTranslation();
    
    return (
        <div className="max-w-3xl mx-auto bg-gray-50 rounded-2xl p-8 border border-gray-100 text-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <p className="text-gray-500 text-sm leading-relaxed italic font-light">
            "{t('itinerary.disclaimer')}"
          </p>
        </div>
    );
}
