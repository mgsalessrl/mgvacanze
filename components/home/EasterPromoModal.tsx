"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Gift } from 'lucide-react';
import { useTranslation } from '../I18nContext';

export default function EasterPromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Check if the user has already closed the modal in this session
    // UPDATED KEY TO V3 TO RESET FOR USER
    const hasClosedModal = sessionStorage.getItem('mgvacanze_easter_popup_closed_v3');
    
    // Show modal after a short delay if not closed previously
    if (!hasClosedModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000); // 2 seconds delay
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('mgvacanze_easter_popup_closed_v3', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full relative overflow-hidden animate-fade-in-up">
        
        {/* Decorative Header Background */}
        <div className="bg-brand-gold/10 h-32 absolute top-0 left-0 w-full z-0"></div>
        
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 text-gray-500 hover:text-gray-900 bg-white/50 rounded-full p-1 transition-colors"
          aria-label="Chiudi"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative z-10 p-8 text-center pt-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-6 text-brand-gold">
             <Gift className="w-8 h-8" />
          </div>
          
          <h2 className="font-display text-3xl text-brand-dark mb-2">{t('promo.title')}</h2>
          <p className="text-brand-gold font-bold uppercase tracking-wider text-sm mb-6">{t('promo.subtitle')}</p>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
             {/* Simple HTML parsing for the bold part - or just split string. 
                 For simplicity here, I'll use dangerouslySetInnerHTML if I strictly need bold, 
                 or just render text. 
                 Let's do a replace trick for safety or just text.
             */}
             {t('promo.desc').replace(/<bold>/g, '').replace(/<\/bold>/g, '')}
          </p>

          <div className="flex flex-col gap-3">
            <Link 
              href="/#offers" 
              onClick={handleClose}
              className="w-full bg-brand-dark hover:bg-brand-gold text-white font-bold py-4 rounded transition-colors uppercase tracking-widest"
            >
              {t('promo.cta')}
            </Link>
            <button 
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-sm py-2"
            >
              {t('promo.dismiss')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
