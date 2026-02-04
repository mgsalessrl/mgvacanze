import Link from 'next/link';
import Image from 'next/image';
import { Mail, Facebook, Instagram, Phone } from 'lucide-react';
import { createClient } from '@/lib/supabase-server';
import NavbarClient from './NavbarClient';

export async function Navbar() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user || null;

  let role = 'user';
  if (user) {
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
    if (profile) {
        role = (profile as any).role;
    }
  }

  return <NavbarClient user={user} role={role} />;
}

export function Footer() {
    return (
        <footer className="bg-brand-dark text-white pt-16 pb-8">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div>
                     <div className="relative w-48 h-12 mb-6 grayscale brightness-0 invert opacity-80">
                        <Image 
                            src="/images/img_sito/logo-firma-prova-400x100-1.png"
                            alt="MG Vacanze"
                            fill
                            sizes="200px"
                            className="object-contain"
                        />
                    </div>
                    <p className="text-gray-400 mb-6 font-light">
                        Vivi il mare con eleganza e autenticità. Charter esclusivi nel Mediterraneo.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-brand-gold transition-colors">
                            <Facebook className="w-5 h-5" />
                        </a>
                         <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-brand-gold transition-colors">
                            <Instagram className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-display text-white mb-6 uppercase tracking-widest">Link Rapidi</h3>
                    <ul className="space-y-4 text-gray-400">
                        <li><Link href="/" className="hover:text-brand-gold transition-colors">Home</Link></li>
                        <li><Link href="/fleet" className="hover:text-brand-gold transition-colors">Imbarcazioni</Link></li>
                        <li><Link href="/servizi" className="hover:text-brand-gold transition-colors">Servizi</Link></li>
                        <li><Link href="/contact" className="hover:text-brand-gold transition-colors">Contattaci</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-display text-white mb-6 uppercase tracking-widest">Contatti</h3>
                    <ul className="space-y-4 text-gray-400">
                        <li className="flex items-start">
                             <Mail className="w-5 h-5 mr-3 mt-1 text-brand-gold" />
                             <span>info@mgvacanze.com</span>
                        </li>
                        <li className="flex items-start">
                             <Phone className="w-5 h-5 mr-3 mt-1 text-brand-gold" />
                             <span>+39 0832 243574</span>
                        </li>
                         <li className="flex items-start">
                             <span className="w-5 mr-3 text-brand-gold">📍</span>
                             <span>Via Frà Nicolò da Lequile, Lecce</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-display text-white mb-6 uppercase tracking-widest">Newsletter</h3>
                    <p className="text-gray-400 mb-4 font-light">Iscriviti per ricevere aggiornamenti e offerte esclusive.</p>
                    <form className="flex">
                        <input type="email" placeholder="Email" className="bg-white/10 text-white px-4 py-2 rounded-l-sm w-full focus:outline-none focus:ring-1 focus:ring-brand-gold border-none placeholder-gray-500" />
                        <button className="bg-brand-gold text-white px-4 py-2 rounded-r-sm hover:opacity-90 transition-opacity">OK</button>
                    </form>
                </div>
            </div>
            <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} MG Vacanze. All rights reserved.
            </div>
        </footer>
    );
}
