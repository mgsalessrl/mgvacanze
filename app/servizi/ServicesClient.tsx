"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/components/I18nContext';

export default function ServicesPageClient() {
  const { t } = useTranslation();

  const services = [
    {
      title: t('service.week.title'),
      description: t('service.week.desc'),
      image: "/images/img_sito/servizi/dream.png"
    },
    {
      title: t('service.day.title'),
      description: t('service.day.desc'),
      image: "/images/img_sito/servizi/breeze sunset.png"
    },
    {
      title: t('service.teambielding.title'),
      description: t('service.teambielding.desc'),
      image: "/images/img_sito/servizi/pranzo .png"
    },
    {
      title: t('service.regatta.title'),
      description: t('service.regatta.desc'),
      image: "/images/img_sito/servizi/breeze.png"
    },
    {
      title: t('service.photo.title'),
      description: t('service.photo.desc'),
      image: "/images/img_sito/servizi/fotografo.png"
    },
    {
      title: t('service.wine.title'),
      description: t('service.wine.desc'),
      image: "/images/img_sito/servizi/degustazione-vini.png" 
    },
    {
      title: t('service.chef.title'),
      description: t('service.chef.desc'),
      image: "/images/img_sito/servizi/chef.png"
    },
    {
      title: t('service.yoga.title'),
      description: t('service.yoga.desc'),
      image: "/images/img_sito/servizi/yoga.png"
    },
    {
      title: "Eventi",
      description: "Organizza i tuoi eventi in una location unica, con servizi su misura per rendere ogni occasione indimenticabile.",
      image: "/images/img_sito/servizi/eventi-barca.png.png"
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero - Clean Style */}
      <div className="pt-24 pb-12 md:pt-32 md:pb-16 flex flex-col items-center justify-center text-center px-4 animate-fade-in-up max-w-[1400px] mx-auto">
        {/* Icon */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6 opacity-90">
             {/* Using 'barca (1).svg' as it is a boat icon available in public/images/img_sito/icone home/ */}
            <Image
                src="/images/img_sito/icone home/barca (1).svg"
                alt="Services Icon"
                fill
                className="object-contain"
                priority
            />
        </div>
        
        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-display font-bold text-primary mb-6">
            I nostri servizi
        </h1>
        
        {/* Subtitle */}
        <p className="text-slate-500 text-lg md:text-2xl font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Scopri quali esperienze vivere sui nostri<br className="hidden md:block"/> yacht e catamarani
        </p>

        {/* CTA Button */}
        <Link 
            href="/contact" 
            className="inline-block bg-[#bfab85] text-white px-8 py-3 text-lg font-medium hover:bg-[#a6926d] transition-colors rounded-sm shadow-sm"
        >
            Contattaci per informazioni
        </Link>
      </div>

      {/* Services Grid - Modern Floating Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-24 lg:space-y-32">
        {services.map((service, index) => (
           <div key={index} className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 lg:gap-24 group`}>
             
             {/* Image Section - Stacked on top for mobile, alternating on desktop */}
             {/* Aspect Ratio forced to 3:1 (1200x400) as requested */}
             <div className={`w-full md:w-8/12 relative aspect-[3/1] rounded-2xl overflow-hidden shadow-xl 
                transition-all duration-500 ease-out group-hover:shadow-2xl group-hover:-translate-y-1
                ${index % 2 === 1 ? 'md:order-last' : 'md:order-first'}`}>
                <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             </div>

             {/* Text Section - Narrower to 4/12 to accomodate wider images */}
             <div className="w-full md:w-4/12 flex flex-col justify-center text-center md:text-left">
                {/* Number / Decoration */}
                <div className="hidden md:flex items-center gap-4 mb-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    <span className="text-brand-gold font-display text-lg tracking-widest">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="h-[1px] w-12 bg-brand-gold"></div>
                </div>

                <h3 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-primary mb-6 leading-tight group-hover:text-brand-gold transition-colors duration-300">
                   {service.title}
                </h3>
                
                <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-light mb-8">
                   {service.description}
                </p>

                {/* Optional "Learn More" or Divider line for mobile */}
                <div className="w-16 h-[2px] bg-brand-gold mx-auto md:mx-0 rounded-full opacity-50"></div>
             </div>

           </div>
        ))}
      </section>

    </div>
  );
}
