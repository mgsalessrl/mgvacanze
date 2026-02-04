"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from './I18nContext';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Check if user has already consented
    // UPDATED KEY TO V2 TO RESET FOR USER
    const consent = localStorage.getItem('mgvacanze_cookie_consent_v2');
    if (!consent) {
        // Show banner after a slight delay
        const timer = setTimeout(() => setShowBanner(true), 1000);
        return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('mgvacanze_cookie_consent_v2', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('mgvacanze_cookie_consent_v2', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-[999] border-t border-gray-200 p-4 md:p-6 animate-fade-in-up">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-600 flex-1">
          <p className="mb-2">
            <strong>{t('cookie.privacy_title')}</strong> {t('cookie.privacy_desc')}
          </p>
          <p>
            {t('cookie.consent_desc').split('<link>')[0]}
            <Link href="/privacy-policy" className="text-brand-dark underline hover:text-brand-gold">
                Cookie Policy
            </Link>
            {t('cookie.consent_desc').split('</link>')[1]}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={handleDecline}
            className="px-4 py-2 text-sm text-gray-600 hover:text-brand-dark hover:underline transition-colors font-medium"
          >
            {t('cookie.decline')}
          </button>
          <button 
            onClick={handleAccept}
            className="px-6 py-2 bg-brand-dark text-white text-sm font-bold uppercase tracking-wider hover:bg-brand-gold transition-colors rounded-sm shadow-md"
          >
            {t('cookie.accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
