"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Phone, User, LogIn, UserPlus } from 'lucide-react';
import { User as UserType } from '@supabase/supabase-js';
import { useTranslation } from './I18nContext';

// Define the shape of props
interface NavbarClientProps {
  user: UserType | null;
  role?: string;
}

export default function NavbarClient({ user, role = 'user' }: NavbarClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRentalDropdownOpen, setIsRentalDropdownOpen] = useState(false);
  const { t, language, setLanguage } = useTranslation();

  const dashboardLink = role === 'admin' ? '/admin/dashboard' : '/account';

  return (
    <header className="bg-brand-dark shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-24 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative block w-48 h-12 z-50">
          <Image 
            src="/images/img_sito/loghi/logo-navbar.png"
            alt="MG Vacanze"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 200px"
          />
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-white hover:text-brand-gold font-display text-lg tracking-wide uppercase transition-colors">{t('nav.home')}</Link>
            
            {/* Noleggio Settimanale Dropdown */}
            <div className="relative group">
                <button className="text-white hover:text-brand-gold font-display text-lg tracking-wide uppercase transition-colors flex items-center focus:outline-none py-4">
                    {t('nav.week_rental')}
                </button>
                <div className="absolute left-0 mt-0 w-56 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform z-50">
                    <Link href="/noleggio-yacht/elyvian-breeze" className="block px-4 py-3 text-gray-800 hover:bg-gray-100 hover:text-brand-gold">Elyvian Breeze</Link>
                    <Link href="/noleggio-catamarano/elyvian-spirit" className="block px-4 py-3 text-gray-800 hover:bg-gray-100 hover:text-brand-gold">Elyvian Spirit</Link>
                    <Link href="/noleggio-catamarano/elyvian-dream" className="block px-4 py-3 text-gray-800 hover:bg-gray-100 hover:text-brand-gold">Elyvian Dream</Link>
                </div>
            </div>

            <Link href="/itinerari" className="text-white hover:text-brand-gold font-display text-lg tracking-wide uppercase transition-colors">{t('nav.itineraries')}</Link>

            <Link href="/servizi" className="text-white hover:text-brand-gold font-display text-lg tracking-wide uppercase transition-colors">{t('nav.services')}</Link>
            <Link href="/contact" className="text-white hover:text-brand-gold font-display text-lg tracking-wide uppercase transition-colors">{t('nav.contact')}</Link>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-6">
             {/* Language Selector */}
             <div className="hidden lg:flex items-center space-x-1 text-white text-sm font-medium">
                <button 
                  onClick={() => setLanguage('it')} 
                  className={`hover:text-brand-gold transition-colors ${language === 'it' ? 'font-bold text-brand-gold' : 'opacity-70'}`}
                >IT</button>
                <span className="text-gray-500">|</span>
                <button 
                   onClick={() => setLanguage('en')}
                   className={`hover:text-brand-gold transition-colors ${language === 'en' ? 'font-bold text-brand-gold' : 'opacity-70'}`}
                >EN</button>
             </div>
             
             {user ? (
                <Link href={dashboardLink} className="flex items-center gap-2 text-white hover:text-brand-gold transition-colors" title="Area Riservata">
                    <User className="w-6 h-6" />
                    <span className="hidden lg:inline font-medium uppercase text-sm">{t('nav.dashboard')}</span>
                </Link>
             ) : (
                <div className="flex items-center gap-4">
                    <Link href="/login" className="flex items-center text-white hover:text-brand-gold transition-colors font-medium text-sm uppercase">
                        <LogIn className="w-4 h-4 mr-1" /> {t('nav.login')}
                    </Link>
                    <Link href="/login?mode=signup" className="hidden lg:flex items-center bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-sm transition-colors font-medium text-sm uppercase">
                        <UserPlus className="w-4 h-4 mr-1" /> {t('nav.register')}
                    </Link>
                </div>
             )}

             <Link href="/contact" className="bg-brand-gold text-white px-6 py-2 rounded-sm font-medium uppercase tracking-wider hover:opacity-90 transition-opacity text-sm hidden lg:block">
                {t('nav.book_now')}
             </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white z-50 p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
           {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>

        {/* Mobile Menu Overlay */}
        <div className={`fixed inset-0 bg-brand-dark/95 backdrop-blur-sm z-40 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden flex flex-col pt-28 px-6`}>
            
            <nav className="flex flex-col space-y-6 text-center">
                <Link href="/" className="text-white hover:text-brand-gold font-display text-2xl uppercase" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                
                {/* Mobile Dropdown */}
                <div className="flex flex-col items-center">
                    <button 
                        onClick={() => setIsRentalDropdownOpen(!isRentalDropdownOpen)}
                        className="text-white hover:text-brand-gold font-display text-2xl uppercase flex items-center gap-2"
                    >
                        Noleggio Settimanale
                    </button>
                    {isRentalDropdownOpen && (
                        <div className="flex flex-col mt-4 space-y-4 bg-white/5 w-full py-4 rounded-lg">
                             <Link href="/noleggio-yacht/elyvian-breeze" className="text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Elyvian Breeze</Link>
                             <Link href="/noleggio-catamarano/elyvian-spirit" className="text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Elyvian Spirit</Link>
                             <Link href="/noleggio-catamarano/elyvian-dream" className="text-gray-300 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Elyvian Dream</Link>
                        </div>
                    )}
                </div>

                <Link href="/itinerari" className="text-white hover:text-brand-gold font-display text-2xl uppercase" onClick={() => setIsMobileMenuOpen(false)}>Itinerari</Link>

                <Link href="/servizi" className="text-white hover:text-brand-gold font-display text-2xl uppercase" onClick={() => setIsMobileMenuOpen(false)}>Servizi</Link>
                <Link href="/contact" className="text-white hover:text-brand-gold font-display text-2xl uppercase" onClick={() => setIsMobileMenuOpen(false)}>Contattaci</Link>
                
                <div className="h-px bg-white/10 w-full my-4"></div>

                {user ? (
                     <Link href={dashboardLink} className="text-white hover:text-brand-gold font-display text-xl uppercase flex items-center justify-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <User className="w-6 h-6" /> {t('nav.dashboard')}
                    </Link>
                ) : (
                    <div className="flex flex-col gap-4">
                         <Link href="/login" className="text-white hover:text-brand-gold font-display text-xl uppercase" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.login')}</Link>
                         <Link href="/login?mode=signup" className="text-white hover:text-brand-gold font-display text-xl uppercase" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.register')}</Link>
                    </div>
                )}
            </nav>

        </div>

      </div>
    </header>
  );
}
