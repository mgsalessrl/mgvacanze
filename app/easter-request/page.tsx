'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { sendEasterRequest } from './actions'
import { Loader2, Phone, Mail, CheckCircle, ChevronRight, Anchor, MapPin, Users, Calendar } from 'lucide-react'

// Removed BOATS constant as requested

export default function EasterRequestPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setResult(null)
    try {
      const res = await sendEasterRequest(formData)
      setResult(res)
    } catch (e) {
      setResult({ error: 'Connection error. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (result?.success) {
      return (
          <div className="min-h-screen bg-white flex flex-col pt-24 pb-12 items-center justify-center p-4">
              <div className="text-center max-w-lg">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">Request Sent!</h1>
                  <p className="text-gray-600 mb-8 text-lg">
                      Thank you for contacting us. Our team will process your request for the Easter holidays and respond as soon as possible.
                  </p>
                  <Link href="/" className="inline-flex items-center text-brand-dark hover:text-brand-gold font-medium uppercase tracking-wide">
                      Back to Home <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
       {/* Hero/Header hidden mostly as per requirement "Replicate Page" usually means landing style */}
       <div className="relative h-[40vh] min-h-[400px]">
           <Image 
                src="/images/img_sito/home/home-1.jpg"
                alt="Pasqua in Barca"
                fill
                className="object-cover brightness-75"
                priority
           />
           <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-black/30">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full mb-6 border border-white/20">
                    <Anchor className="text-white w-8 h-8" />
                </div>
                <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 shadow-sm">
                    Easter at Sea
                </h1>
                <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl">
                    Experience an exclusive journey aboard our fleet.
                </p>
           </div>
       </div>

       <div className="flex-grow container mx-auto px-4 py-16 -mt-20 relative z-10">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            
            {/* Left Content / Info */}
            <div className="md:w-5/12 bg-brand-dark text-white p-10 flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-2xl font-display font-bold mb-6 text-brand-gold">Why choose MG Vacanze?</h2>
                    <ul className="space-y-6 text-gray-300">
                        <li className="flex gap-4">
                            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-brand-gold">1</span>
                            <span>Exclusive proprietary fleet, curated in every detail.</span>
                        </li>
                        <li className="flex gap-4">
                            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-brand-gold">2</span>
                            <span>Customized itineraries in Salento and Ionian Greece.</span>
                        </li>
                        <li className="flex gap-4">
                            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 text-brand-gold">3</span>
                            <span>Dedicated 24/7 assistance during your holiday.</span>
                        </li>
                    </ul>
                </div>

                <div className="mt-12 relative z-10">
                    <p className="text-sm text-gray-400 uppercase tracking-widest mb-4">Direct Contacts</p>
                    <div className="flex items-center gap-3 mb-2">
                        <Phone className="w-5 h-5 text-brand-gold" />
                        <a href="tel:+390832243574" className="hover:text-white transition-colors">+39 0832 243574</a>
                    </div>
                     <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-brand-gold" />
                        <a href="mailto:info@mgvacanze.com" className="hover:text-white transition-colors">info@mgvacanze.com</a>
                    </div>
                </div>
                
                {/* Decorative Circles */}
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-brand-gold/10 rounded-full blur-2xl"></div>
                <div className="absolute top-10 left-10 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            </div>

            {/* Right Form */}
            <div className="md:w-7/12 p-10">
                <div className="mb-8">
                     <h2 className="text-2xl font-bold text-gray-900 font-display">Request Information</h2>
                     <p className="text-gray-500 mt-2 text-sm">
                         Fill out the form below to receive a personalized quote for the Easter period. No obligation.
                     </p>
                </div>

                <form action={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="name" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Full Name *</label>
                            <input type="text" id="name" name="name" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition-all" placeholder="John Doe" />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Phone *</label>
                            <input type="tel" id="phone" name="phone" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition-all" placeholder="+39 333 ..." />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                         <div>
                            <label htmlFor="email" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Email *</label>
                            <input type="email" id="email" name="email" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition-all" placeholder="john@example.com" />
                        </div>
                         <div>
                            <label htmlFor="postalCode" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Postal Code</label>
                            <input type="text" id="postalCode" name="postalCode" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition-all" placeholder="12345" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                         <div>
                            <label htmlFor="guests" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Number of Guests</label>
                            <div className="relative">
                                <Users className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                <input type="number" id="guests" name="guests" min="1" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition-all" placeholder="4" />
                            </div>
                        </div>
                         <div>
                            <label htmlFor="preferredSea" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Preferred Sea</label>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                                <select 
                                    id="preferredSea" 
                                    name="preferredSea"
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition-all appearance-none cursor-pointer text-gray-700"
                                >
                                    <option value="">Select preferences...</option>
                                    <option value="Adriatico">Adriatic Sea</option>
                                    <option value="Ionio">Ionian Sea</option>
                                    <option value="Mediterraneo">Mediterranean Sea</option>
                                </select>
                                <div className="absolute right-4 top-4 w-2 h-2 border-r-2 border-b-2 border-gray-400 rotate-45 pointer-events-none"></div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="dates" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Preferred Dates</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                            <input type="text" id="dates" name="dates" className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition-all" placeholder="e.g., April 10-15" />
                        </div>
                    </div>


                    <div>
                        <label htmlFor="message" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Message / Request Details</label>
                        <textarea 
                            id="message" 
                            name="message" 
                            rows={3} 
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-brand-gold/50 focus:border-brand-gold outline-none transition-all resize-none"
                            placeholder="I would like to know if a skipper is available..."
                        ></textarea>
                    </div>

                    {result?.error && (
                        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                            {result.error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-brand-dark text-white py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-brand-dark/90 transition-all transform hover:translate-y-[-1px] shadow-lg flex justify-center items-center"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Send Request'}
                    </button>
                    
                    <p className="text-xs text-gray-400 text-center mt-4">
                        By sending this form you accept our <Link href="/privacy-policy" className="underline hover:text-gray-600">Privacy Policy</Link>.
                    </p>
                </form>
            </div>
          </div>
       </div>

       {/* Footer Lite */}
       <footer className="bg-white border-t py-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} MG Vacanze S.r.l. - P.IVA 04831550751</p>
       </footer>
    </div>
  )
}
