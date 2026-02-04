"use client";

import { Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from '@/components/I18nContext';

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-white min-h-screen">
      {/* Header / Breadcrumb - consistent with other pages ideally */}
      <div className="bg-brand-dark text-white py-16 text-center relative overflow-hidden">
        <h1 className="font-display text-4xl md:text-5xl relative z-10">{t('contact.title')}</h1>
        <p className="mt-4 text-gray-300 relative z-10">{t('contact.subtitle')}</p>
        <div className="absolute inset-0 bg-black/20 z-0"></div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Contact Info & Map */}
            <div>
                <h2 className="font-display text-3xl text-brand-dark mb-8">{t('contact.info_title')}</h2>
                <div className="space-y-8 mb-12">
                    <div className="flex items-start">
                        <div className="bg-brand-gold/10 p-4 rounded-full mr-6">
                            <MapPin className="w-6 h-6 text-brand-gold" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-brand-dark mb-1">{t('contact.where')}</h3>
                            <p className="text-gray-600">{t('contact.address')}</p>
                            <p className="text-gray-500 text-sm mt-1">{t('contact.office')}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="bg-brand-gold/10 p-4 rounded-full mr-6">
                            <Phone className="w-6 h-6 text-brand-gold" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-brand-dark mb-1">{t('contact.phone')}</h3>
                            <a href="tel:0832243574" className="text-gray-600 hover:text-brand-gold transition-colors block">
                                +39 0832 243574
                            </a>
                            <p className="text-gray-500 text-sm mt-1">{t('contact.hours')}</p>
                        </div>
                    </div>

                    <div className="flex items-start">
                        <div className="bg-brand-gold/10 p-4 rounded-full mr-6">
                            <Mail className="w-6 h-6 text-brand-gold" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-brand-dark mb-1">{t('contact.email')}</h3>
                            <a href="mailto:info@mgvacanze.com" className="text-gray-600 hover:text-brand-gold transition-colors block">
                                info@mgvacanze.com
                            </a>
                        </div>
                    </div>
                </div>

                {/* Google Maps Embed */}
                <div className="w-full h-80 bg-gray-100 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                   <iframe 
                     src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.004456386445!2d18.163353!3d40.354148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1344280145c381f7%3A0xc3c40c77647617c0!2sVia%20Fr%C3%A0%20Nicol%C3%B2%20da%20Lequile%2C%20Lecce%20LE!5e0!3m2!1sit!2sit!4v1700000000000!5m2!1sit!2sit" 
                     width="100%" 
                     height="100%" 
                     style={{ border: 0 }} 
                     allowFullScreen={true} 
                     loading="lazy" 
                     referrerPolicy="no-referrer-when-downgrade"
                   ></iframe>
                </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 p-8 md:p-12 rounded-lg">
                <h2 className="font-display text-3xl text-brand-dark mb-2">{t('contact.form_title')}</h2>
                <p className="text-gray-600 mb-8">{t('contact.form_desc')}</p>
                
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">{t('contact.first_name')} *</label>
                            <input type="text" id="firstName" className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-colors" placeholder={t('contact.first_name')} />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">{t('contact.last_name')} *</label>
                            <input type="text" id="lastName" className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-colors" placeholder={t('contact.last_name')} />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">{t('contact.email')} *</label>
                        <input type="email" id="email" className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-colors" placeholder={t('contact.email_ph')} />
                    </div>

                    <div>
                         <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">{t('contact.phone')}</label>
                         <input type="tel" id="phone" className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-colors" placeholder="+39 ..." />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">{t('contact.note')}</label>
                        <textarea id="message" rows={5} className="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-colors" placeholder={t('contact.message_ph')}></textarea>
                    </div>

                    <div className="flex items-start">
                        <input type="checkbox" id="privacy" className="mt-1 mr-3 h-4 w-4 text-brand-gold focus:ring-brand-gold border-gray-300 rounded" />
                        <label htmlFor="privacy" className="text-sm text-gray-500">
                            {t('contact.privacy_text')} <a href="#" className="underline hover:text-brand-gold">{t('contact.privacy_link')}</a>
                        </label>
                    </div>

                    <button type="submit" className="w-full bg-brand-dark text-white py-4 font-semibold uppercase tracking-widest hover:bg-brand-gold transition-colors duration-300">
                        {t('contact.send_btn')}
                    </button>
                </form>
            </div>

        </div>
      </div>
    </div>
  );
}
