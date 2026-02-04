"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '../I18nContext';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-brand-dark">
         {/* Placeholder for actual background image/video */}
         <Image 
            src="/uploads/2026/hero-placeholder.jpg" // We will need to ensure this exists or use a fallback
            alt="Yacht in the sea"
            fill
            className="object-cover opacity-60"
            priority
            // Fallback to a color if image missing
            style={{ backgroundColor: '#011640' }}
         />
         <div className="absolute inset-0 bg-blue-950/70 mix-blend-multiply" />
      </div>

      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight max-w-5xl mx-auto animate-fade-in-up">
          {t('hero.title')}<br />
          <span className="text-brand-gold">{t('hero.subtitle')}</span>
        </h1>
        
        <p className="max-w-3xl text-lg md:text-xl text-gray-200 mb-10 leading-relaxed font-light animate-fade-in-up delay-200 opacity-0" style={{ animationFillMode: 'forwards' }}>
          {t('hero.desc')}
        </p>

        <Link 
          href="/#fleets"
          className="inline-block border-2 border-white bg-transparent hover:bg-brand-gold hover:border-brand-gold text-white px-8 py-3 uppercase tracking-widest text-sm font-semibold transition-all duration-300 animate-fade-in-up delay-500 opacity-0"
          style={{ animationFillMode: 'forwards' }}
        >
          {t('hero.cta')}
        </Link>
      </div>
    </section>
  );
}
