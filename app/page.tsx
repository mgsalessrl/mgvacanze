"use client";

import Image from "next/image";
import Link from "next/link";
import { Ship, Anchor, Sun, Star, Shield, ChevronRight } from "lucide-react";
import { useTranslation } from "@/components/I18nContext";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative h-screen w-full">
        <Image
          src="/images/img_sito/home/home-1.jpg"
          alt="MG Vacanze Hero"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-blue-950/70 mix-blend-multiply" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
          <p className="text-sm md:text-base font-bold tracking-widest uppercase mb-4">{t('hero.eyebrow')}</p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl mb-6 tracking-wide drop-shadow-lg uppercase">
            {t('hero.title')}<br />{t('hero.subtitle')}
          </h1>
          <p className="text-lg md:text-xl font-light mb-8 max-w-4xl drop-shadow-md">
            {t('hero.desc')}
          </p>
          <Link
            href="#fleets"
            className="border border-white hover:bg-white hover:text-brand-dark transition-all text-white px-8 py-3 uppercase tracking-widest text-sm font-semibold shadow-lg"
          >
            {t('hero.cta')}
          </Link>
        </div>
      </section>

      {/* 2. VISION SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="mb-8 flex justify-center text-brand-gold">
             <Anchor className="w-8 h-8 md:w-12 md:h-12" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-brand-dark mb-8 uppercase tracking-wide">
            {t('vision.title')}
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg md:text-xl font-light">
            {t('vision.desc')}
          </p>
        </div>
      </section>

      {/* 3. FEATURES SECTION */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* Comfort */}
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <Sun className="w-8 h-8 text-brand-gold" />
              </div>
              <h3 className="font-display text-xl text-brand-dark mb-4 uppercase">{t('feature.comfort.title')}</h3>
              <p className="text-gray-500 font-light px-4">
                {t('feature.comfort.desc')}
              </p>
            </div>
            {/* Eleganza */}
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <Star className="w-8 h-8 text-brand-gold" />
              </div>
              <h3 className="font-display text-xl text-brand-dark mb-4 uppercase">{t('feature.elegance.title')}</h3>
              <p className="text-gray-500 font-light px-4">
                {t('feature.elegance.desc')}
              </p>
            </div>
            {/* Professionalità */}
            <div className="flex flex-col items-center group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-brand-gold" />
              </div>
              <h3 className="font-display text-xl text-brand-dark mb-4 uppercase">{t('feature.pro.title')}</h3>
              <p className="text-gray-500 font-light px-4">
                {t('feature.pro.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EASTER PACKAGES SECTION */}
      <section id="offers" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
             <span className="text-brand-gold text-sm font-bold uppercase tracking-widest mb-2 block">{t('easter_home.eyebrow')}</span>
             <h2 className="font-display text-4xl text-brand-dark mb-6">{t('easter_home.title')}</h2>
             <p className="text-gray-500 max-w-2xl mx-auto">
                {t('easter_home.desc')}
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group relative h-[500px] overflow-hidden rounded-lg shadow-lg">
                <Image 
                    src="/images/img_sito/home/pasquainmare-1.jpg"
                    alt="Pasqua in mare 1"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                    <h3 className="font-display text-2xl mb-2">{t('easter_home.card1.title')}</h3>
                    <p className="text-white/80 text-sm mb-4">{t('easter_home.card1.desc')}</p>
                </div>
            </div>

             {/* Card 2 (Central Info) */}
            <div className="bg-brand-dark text-white p-8 md:p-12 rounded-lg shadow-lg flex flex-col justify-center text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Anchor className="w-32 h-32" />
                </div>
                <h3 className="font-display text-2xl mb-6 text-brand-gold">{t('easter_home.card2.title')}</h3>
                
                <div className="space-y-6 mb-8">
                    {/* PASQUA ITALIA (3-7 APR) */}
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-sm uppercase tracking-wider text-gray-400 mb-1">{t('easter_home.card2.catholic')}</p>
                        <p className="font-bold text-lg">{t('easter_home.card2.dates1')}</p>
                        <div className="flex flex-col gap-1 mt-2">
                             <Link href="/noleggio/pasqua-elyvian-dream" className="text-brand-gold text-sm font-bold hover:underline">Elyvian Dream &rarr;</Link>
                             <Link href="/noleggio/pasqua-elyvian-spirit" className="text-brand-gold text-sm font-bold hover:underline">Elyvian Spirit &rarr;</Link>
                             <Link href="/noleggio/pasqua-elyvian-breeze" className="text-brand-gold text-sm font-bold hover:underline">Elyvian Breeze &rarr;</Link>
                        </div>
                    </div>
                    {/* PASQUA GRECIA (8-13 APR) */}
                    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-sm uppercase tracking-wider text-gray-400 mb-1">{t('easter_home.card2.orthodox')}</p>
                        <p className="font-bold text-lg">8 Aprile - 13 Aprile 2026</p>
                         <div className="flex flex-col gap-1 mt-2">
                             <Link href="/noleggio/pasqua-grecia-elyvian-dream" className="text-brand-gold text-sm font-bold hover:underline">Elyvian Dream &rarr;</Link>
                             <Link href="/noleggio/pasqua-grecia-elyvian-spirit" className="text-brand-gold text-sm font-bold hover:underline">Elyvian Spirit &rarr;</Link>
                             <Link href="/noleggio/pasqua-grecia-elyvian-breeze" className="text-brand-gold text-sm font-bold hover:underline">Elyvian Breeze &rarr;</Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card 3 */}
            <div className="group relative h-[500px] overflow-hidden rounded-lg shadow-lg">
                 <Image 
                    src="/images/img_sito/home/pasquainmare-3.jpg"
                    alt="Pasqua in mare 3"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                 <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                    <h3 className="font-display text-2xl mb-2">{t('easter_home.card3.title')}</h3>
                    <p className="text-white/80 text-sm mb-4">{t('easter_home.card3.desc')}</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GUEST EXPERIENCE / FLEET TEASER */}
      <section id="fleets" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl md:text-5xl text-brand-dark text-center mb-16">
                {t('fleet.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Boat 1 - Spirit */}
                <Link href="/noleggio-catamarano/elyvian-spirit" className="group block">
                     <div className="relative h-[400px] md:h-[500px] overflow-hidden mb-6 rounded-sm shadow-md">
                         <Image 
                            src="/images/img_sito/home/elvyanspirithome.jpg"
                            alt="Elyvian Spirit"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-6 py-3">
                            <h3 className="font-display text-xl text-brand-dark">Elyvian Spirit</h3>
                        </div>
                    </div>
                </Link>

                {/* Boat 2 - Breeze */}
                <Link href="/noleggio-yacht/elyvian-breeze" className="group block">
                    <div className="relative h-[400px] md:h-[500px] overflow-hidden mb-6 rounded-sm shadow-md">
                         <Image 
                            src="/images/img_sito/home/elyvianbreezehome.jpg"
                            alt="Elyvian Breeze"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-6 py-3">
                            <h3 className="font-display text-xl text-brand-dark">Elyvian Breeze</h3>
                        </div>
                    </div>
                </Link>

                 {/* Boat 3 - Dream */}
                 <Link href="/noleggio-catamarano/elyvian-dream" className="group block">
                     <div className="relative h-[400px] md:h-[500px] overflow-hidden mb-6 rounded-sm shadow-md">
                         <Image 
                            src="/images/img_sito/home/elvyandreamhome.jpg"
                            alt="Elyvian Dream"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-6 py-3">
                            <h3 className="font-display text-xl text-brand-dark">Elyvian Dream</h3>
                        </div>
                    </div>
                </Link>
            </div>
            
            <div className="text-center mt-12">
            </div>
        </div>
      </section>

    </main>
  );
}
