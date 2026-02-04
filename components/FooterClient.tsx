"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram } from 'lucide-react';
import { useTranslation } from './I18nContext';

export default function FooterClient() {
    const { t } = useTranslation();

    return (
        <footer className="bg-brand-dark text-white pt-16 pb-8">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div>
                     <div className="relative w-48 h-12 mb-6">
                        <Image 
                            src="/images/img_sito/loghi/logo-navbar.png"
                            alt="MG Vacanze"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <p className="text-gray-400 mb-6 font-light">
                        {t('footer.desc')}
                    </p>
                    <div className="flex space-x-4">
                        <a href="https://www.facebook.com/people/MG-Vacanze/61585303166188/" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-brand-gold transition-colors">
                            <Facebook className="w-5 h-5" />
                        </a>
                         <a href="https://www.instagram.com/mg.vacanze/" target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-brand-gold transition-colors">
                            <Instagram className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-display text-white mb-6 uppercase tracking-widest">{t('footer.quick_links')}</h3>
                    <ul className="space-y-4 text-gray-400">
                        <li><Link href="/" className="hover:text-brand-gold transition-colors">{t('nav.home')}</Link></li>
                        <li><Link href="/#fleets" className="hover:text-brand-gold transition-colors">{t('footer.boats')}</Link></li>
                        <li><Link href="/servizi" className="hover:text-brand-gold transition-colors">{t('nav.services')}</Link></li>
                        <li>
                            <Link href="/terms" className="hover:text-brand-gold transition-colors">
                                {t('footer.terms')}
                            </Link>
                        </li>
                        <li>
                            <a 
                                href="https://www.iubenda.com/privacy-policy/76185838"  
                                className="hover:text-brand-gold transition-colors iubenda-nostyle no-brand iubenda-noiframe iubenda-embed iub-legal-only"
                                title="Privacy Policy"
                            >
                                {t('footer.privacy')}
                            </a>
                        </li>
                        <li>
                             <a 
                                href="https://www.iubenda.com/privacy-policy/76185838/cookie-policy" 
                                className="hover:text-brand-gold transition-colors iubenda-nostyle no-brand iubenda-noiframe iubenda-embed iub-legal-only"
                                title="Cookie Policy"
                            >
                                {t('footer.cookie')}
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-display text-white mb-6 uppercase tracking-widest">{t('nav.contact')}</h3>
                    <ul className="space-y-4 text-gray-400">
                         <li className="flex items-start">
                             <a 
                                href="https://maps.google.com/?q=Via+Frà+Nicolò+da+Lequile,+Lecce" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-brand-gold transition-colors block"
                            >
                                Via Frà Nicolò da Lequile, Lecce
                            </a>
                        </li>
                        <li>
                            <a href="tel:0832243574" className="hover:text-brand-gold transition-colors block">
                                +39 0832 243574
                            </a>
                        </li>
                        <li>
                             <a href="mailto:info@mgvacanze.com" className="hover:text-brand-gold transition-colors block">
                                info@mgvacanze.com
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="container mx-auto px-4 pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
                 &copy; {new Date().getFullYear()} MG Vacanze. {t('footer.rights')}
            </div>
        </footer>
    );
}
