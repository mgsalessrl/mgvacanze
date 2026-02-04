import Link from 'next/link';
import { Menu, Phone, Mail, Facebook, Instagram } from 'lucide-react';

export function Navbar() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-primary text-white p-2 rounded-lg">MG</span>
            <span className="text-xl font-bold text-gray-800 hidden sm:block">Vacanze</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-primary font-medium">Home</Link>
            <Link href="/fleet" className="text-gray-600 hover:text-primary font-medium">Our Fleet</Link>
            <Link href="/servizi" className="text-gray-600 hover:text-primary font-medium">Services</Link>
            <Link href="/blog" className="text-gray-600 hover:text-primary font-medium">Blog</Link>
            <Link href="/contact" className="text-gray-600 hover:text-primary font-medium">Contact</Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center space-x-4">
             <a href="tel:+39000000000" className="hidden lg:flex items-center text-gray-600 hover:text-primary">
                <Phone className="w-4 h-4 mr-2" />
                <span>Call Us</span>
             </a>
             <Link href="/contact" className="bg-primary text-white px-5 py-2 rounded-full font-medium hover:opacity-90 transition-opacity">
                Book Now
             </Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div>
                    <div className="flex items-center space-x-2 mb-6">
                        <span className="text-xl font-bold bg-white text-gray-900 p-2 rounded-lg">MG</span>
                        <span className="text-xl font-bold">Vacanze</span>
                    </div>
                    <p className="text-gray-400 mb-6">
                        Experience the best yacht and boat rentals in the Mediterranean. Luxury, comfort, and unforgettable memories await.
                    </p>
                    <div className="flex space-x-4">
                        <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors">
                            <Facebook className="w-5 h-5" />
                        </a>
                         <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors">
                            <Instagram className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold mb-6">Quick Links</h3>
                    <ul className="space-y-4 text-gray-400">
                        <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                        <li><Link href="/servizi" className="hover:text-white transition-colors">Services</Link></li>
                        <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                        <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-bold mb-6">Contact</h3>
                    <ul className="space-y-4 text-gray-400">
                        <li className="flex items-start">
                             <Mail className="w-5 h-5 mr-3 mt-1 text-primary" />
                             <span>info@mgvacanze.com</span>
                        </li>
                        <li className="flex items-start">
                             <Phone className="w-5 h-5 mr-3 mt-1 text-primary" />
                             <span>+39 123 456 7890</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-bold mb-6">Newsletter</h3>
                    <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
                    <form className="flex">
                        <input type="email" placeholder="Your email" className="bg-gray-800 text-white px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-primary" />
                        <button className="bg-primary px-4 py-2 rounded-r-md hover:opacity-90">GO</button>
                    </form>
                </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} MG Vacanze. All rights reserved.
            </div>
        </footer>
    );
}
