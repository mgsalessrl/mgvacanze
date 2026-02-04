'use client'

import { useActionState, useState, useEffect } from 'react'
import { submitBooking, ActionState } from '@/app/actions'
import { Calendar as CalendarIcon, Users, Mail, Phone, User as UserIcon, CheckCircle, AlertCircle, Info, Lock, Plus, Minus } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { calculateCharterPrice, isValidStartDate, Quote, Discount } from '@/lib/pricing_engine'
import { format } from 'date-fns'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { useTranslation } from './I18nContext'
import { UNIVERSAL_EXTRAS, boatData } from '@/lib/boat_data'

interface BookingFormProps {
  propertyId: number
  price: number // Base price (reference only)
  maxGuests: number
  cabins?: number
  hasPremiumPackage?: boolean
  extraOptions?: any[] // Kept for compatibility but ignored in UI
  boatSlug?: string 
  forcedStartDate?: Date
  forcedEndDate?: Date
  isPackage?: boolean
  discounts?: Discount[]
}

const initialState: ActionState = {
  success: false,
  message: '',
  error: ''
}

// Default empty array for stable reference
const DEFAULT_EXTRA_OPTIONS: any[] = []

export function BookingForm({ 
    propertyId, 
    price, 
    maxGuests,
    cabins = 3,
    hasPremiumPackage = false,
    extraOptions = DEFAULT_EXTRA_OPTIONS, 
    boatSlug = 'elyvian-spirit',
    forcedStartDate,
    forcedEndDate,
    isPackage = false,
    discounts = []
}: BookingFormProps) {
  const { t } = useTranslation()
  const [state, formAction, isPending] = useActionState(submitBooking, initialState)
  
  // State for calculation
  const [range, setRange] = useState<{ from: Date | undefined; to: Date | undefined } | undefined>(
    isPackage && forcedStartDate && forcedEndDate 
      ? { from: forcedStartDate, to: forcedEndDate } 
      : undefined
  )
  
  const [guests, setGuests] = useState(1)
  const [extrasState, setExtrasState] = useState<Record<string, number>>({}) 
  const [quote, setQuote] = useState<Quote | null>(null)
  
  // Initialize mandatory extras
  useEffect(() => {
     const overrides = (boatData[boatSlug as keyof typeof boatData] as any)?.extraOverrides || {};
     setExtrasState(prev => {
         const next = { ...prev };
         let changed = false;
         Object.entries(overrides).forEach(([id, override]: [string, any]) => {
             if (override.mandatory) {
                 if (!next[id]) {
                     next[id] = 1;
                     changed = true;
                 }
             }
         });

         // FORCE FIX: Ensure skipper is selected for Easter packages
         if (isPackage || boatSlug.includes('pasqua')) {
             if (!next['skipper']) {
                 next['skipper'] = 1;
                 changed = true;
             }
         }

         return changed ? next : prev;
     });
  }, [boatSlug, isPackage]);
  
  // Extras Logic
  const getLimit = (rule: string | undefined, maxQty: number | undefined) => {
      if (!rule || rule === 'fixed') return maxQty || 1;
      if (rule === 'guests') return guests;
      if (rule === 'cabins') return cabins; 
      return 100;
  };

  const handleToggleExtra = (id: string, checked: boolean) => {
     setExtrasState(prev => {
        const next = { ...prev };
        if (checked) next[id] = 1;
        else delete next[id];
        return next;
     });
  };

  const handleUpdateQuantity = (id: string, delta: number, rule?: string, maxQty?: number) => {
     const limit = getLimit(rule, maxQty);
     setExtrasState(prev => {
         const current = prev[id] || 0;
         const nextVal = current + delta;
         if (nextVal < 0) return prev;
         if (nextVal > limit) return prev;
         
         const next = { ...prev };
         if (nextVal === 0) delete next[id];
         else next[id] = nextVal;
         return next;
     });
  };
  
  // Handlers for inputs
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  // Auth State
  const [user, setUser] = useState<any>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  // Calendar View State
  const [month, setMonth] = useState<Date>(
    isPackage && forcedStartDate ? forcedStartDate : new Date(2026, 3)
  ) // Start in April 2026

  useEffect(() => {
     // Check client side auth
     const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
     )
     supabase.auth.getUser().then(({ data }) => {
         setUser(data.user)
         if (data.user?.email) {
             setEmail(data.user.email)
         }
         setLoadingUser(false)
     })
  }, [])

  // Calculate total whenever inputs update
  useEffect(() => {
    if (!range?.from || !range?.to) {
        setQuote(null)
        return
    }

    // Convert extrasState to Array of objects for the engine
    const extrasList = Object.entries(extrasState).map(([id, qty]) => {
        const def = UNIVERSAL_EXTRAS.find(e => e.id === id);
        if (!def) return null;
        return {
            id: def.id,
            name: def.label,
            price: def.price,
            quantity: qty
        };
    }).filter(Boolean) as any[];
    
    // Calculate
    const q = calculateCharterPrice(boatSlug, range.from, range.to, extrasList, isPackage, hasPremiumPackage, discounts)
    setQuote(q)

  }, [range, extrasState, boatSlug, isPackage])

  // Intercept submit if not logged in
  const handleBookingStart = (e: React.MouseEvent) => {
      if (!user) {
          e.preventDefault()
          const currentUrl = window.location.pathname
          window.location.href = `/login?next=${encodeURIComponent(currentUrl)}`
      }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      
      {/* Title */}
      <div className="mb-6 border-b pb-4">
        <h3 className="text-xl font-display font-bold text-gray-900">{t('booking.title')}</h3>
        <p className="text-sm text-gray-500">{t('booking.subtitle')}</p>
      </div>

     {state.success ? (
        <div className="flex flex-col items-center justify-center py-6 text-center animate-fade-in">
             <div className="bg-green-100 p-4 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
             </div>
             <h4 className="text-xl font-bold text-gray-900 mb-2">{t('booking.success')}</h4>
             <p className="text-gray-600 mb-4">{state.message}</p>
             <Link href="/account" className="inline-flex items-center text-primary font-medium hover:underline">
                {t('booking.go_account')} &rarr;
             </Link>
        </div>
      ) : (
      <form action={formAction} className="space-y-6">
        <input type="hidden" name="propertyId" value={propertyId} />
        <input type="hidden" name="boatSlug" value={boatSlug} />
        <input type="hidden" name="isPackage" value={isPackage ? 'true' : 'false'} />
        <input type="hidden" name="hasPremiumPackage" value={hasPremiumPackage ? 'true' : 'false'} />
        
        {/* Date Picker or Fixed Dates */}
        {isPackage && forcedStartDate && forcedEndDate ? (
          <div className="bg-brand-gold/10 p-4 rounded-lg border border-brand-gold">
            <h4 className="font-display text-brand-dark mb-2 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-brand-gold" />
              {t('booking.fixed_dates')}
            </h4>
            <div className="text-gray-700 font-medium">
              {format(forcedStartDate, 'dd MMMM yyyy')} - {format(forcedEndDate, 'dd MMMM yyyy')}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              ({Math.round((forcedEndDate.getTime() - forcedStartDate.getTime()) / (1000 * 60 * 60 * 24))} {t('booking.nights')})
            </div>
          </div>
        ) : (
        <div className="flex flex-col items-center border rounded-lg p-2 bg-gray-50">
             <style>{`
               .rdp { --rdp-cell-size: 40px; --rdp-accent-color: #0ea5e9; }
               .rdp-day_selected { background-color: var(--rdp-accent-color); color: white; }
             `}</style>
             <DayPicker
                mode="range"
                selected={range}
                onSelect={(selectedRange) => {
                    // Fix type compatibility between DayPicker DateRange and our state
                   if (selectedRange) {
                       setRange({ from: selectedRange.from, to: selectedRange.to })
                       if (selectedRange.from) {
                           setMonth(selectedRange.from)
                       }
                   } else {
                       setRange(undefined)
                   }
                }}
                month={month}
                onMonthChange={setMonth}
                fromDate={new Date(2026, 2, 28)} // Start from March 28th 2026
                toDate={new Date(2026, 9, 3)}
                disabled={[
                    { before: new Date(2026, 2, 28) },
                    { after: new Date(2026, 9, 3) },
                    (date) => date.getDay() !== 6 // Strict Saturday
                ]}
                modifiers={{
                    // Highlight Saturdays
                    startable: (date) => isValidStartDate(date),
                    holidays: [
                        new Date(2026, 3, 5),
                        new Date(2026, 3, 6),
                        new Date(2026, 3, 25),
                        new Date(2026, 4, 1)
                    ]
                }}
                modifiersStyles={{
                    startable: { fontWeight: 'bold', color: '#0ea5e9' },
                    holidays: { color: '#b881fc', fontWeight: 'bold' }
                }}
             />
             <div className="text-xs text-gray-500 mt-2 flex gap-2">
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-sky-500 mr-1"></span> {t('booking.start_date_hint')}</span>
             </div>
        </div>
        )}

        {/* Selected Date Summary (Hidden if Package is active to avoid duplication, but keep inputs) */}
        {range?.from && range?.to && (
            <div className={`${isPackage ? 'hidden' : 'bg-sky-50'} text-sky-900 p-3 rounded-md text-sm flex items-start gap-2`}>
                <CalendarIcon className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                    {!isPackage && (
                        <>
                        <div><strong>{t('booking.checkin')}</strong> {format(range.from, 'dd/MM/yyyy')}</div>
                        <div><strong>{t('booking.checkout')}</strong> {format(range.to, 'dd/MM/yyyy')}</div>
                        </>
                    )}
                    <input type="hidden" name="startDate" value={range.from.toISOString()} />
                    <input type="hidden" name="endDate" value={range.to.toISOString()} />
                </div>
            </div>
        )}

        {/* Guest Count */}
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('boat.guests')}</label>
            <div className="relative">
                <Users className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select 
                    name="guests" 
                    value={guests} 
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                    {[...Array(maxGuests)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} {t('boat.guests')}</option>
                    ))}
                </select>
            </div>
        </div>

        {/* Customer Info */}
        <div className="space-y-4">
            
            {/* Show User Status */}
            {!loadingUser && user ? (
                 <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center justify-between text-sm">
                     <div className="flex items-center gap-2 text-blue-800">
                         <UserIcon className="w-4 h-4" />
                         <span>{t('booking.logged_as')} <strong>{user.email}</strong></span>
                     </div>
                 </div>
            ) : (
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-start gap-2 text-amber-800 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{t('booking.login_required')}</span>
                </div>
            )}

            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">{t('booking.full_name')}</label>
                 <div className="relative">
                    <UserIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        name="name" 
                        required 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder={t('booking.name')}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
                    />
                 </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.email')}</label>
                    <div className="relative">
                        <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="email" 
                            name="email" 
                            required 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            // ReadOnly if logged in? Maybe allow change but it links to user anyway? 
                            // Action uses form email but links user.id. Consistent.
                            placeholder={t('booking.email')}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                </div>
                <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.phone')}</label>
                     <div className="relative">
                        <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="tel" 
                            name="phone" 
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder={t('booking.phone')}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
                        />
                     </div>
                </div>
            </div>

            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">{t('booking.message_label')}</label>
                 <textarea 
                    name="message" 
                    rows={3}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder={t('booking.message_ph')}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
                 ></textarea>
            </div>
        </div>

        {/* Extras */}
        <div>
            <h4 className="font-medium text-gray-900 mb-3">{t('booking.extras')}</h4>
            <div className="space-y-3">
                {UNIVERSAL_EXTRAS.map((extra) => {
                    const overrides = (boatData[boatSlug as keyof typeof boatData] as any)?.extraOverrides || {};
                    let override = overrides[extra.id];
                    // Update display logic to include isPackage check
                    if ((boatSlug?.toLowerCase().includes('pasqua') || isPackage) && extra.id === 'skipper') {
                         override = { mandatory: true, price: 0 };
                    }
                    const isMandatory = override?.mandatory || false;
                    // Handle price: 0 override
                    const displayPrice = override?.price !== undefined ? override.price : extra.price;

                    return (
                    <div key={extra.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${extrasState[extra.id] || isMandatory ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`}>
                        <div className="flex items-center gap-3">
                           {extra.type === 'toggle' && (
                                <input 
                                    type="checkbox" 
                                    checked={!!extrasState[extra.id] || isMandatory}
                                    disabled={isMandatory}
                                    onChange={(e) => !isMandatory && handleToggleExtra(extra.id, e.target.checked)}
                                    className={`w-4 h-4 text-primary rounded focus:ring-primary ${isMandatory ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                                />
                           )}
                           <div className="flex flex-col">
                                <span className={`text-sm font-medium ${extrasState[extra.id] || isMandatory ? 'text-primary' : 'text-gray-700'}`}>
                                    {t(`service.name.${extra.id}`) !== `service.name.${extra.id}` ? t(`service.name.${extra.id}`) : extra.label}
                                </span>
                                <span className={`text-xs ${isMandatory && displayPrice === 0 ? 'text-green-600 font-bold' : 'text-gray-500'}`}>
                                    {isMandatory && displayPrice === 0 
                                      ? t('common.included') 
                                      : displayPrice > 0 
                                        ? `+€${displayPrice}` 
                                        : t('common.on_request')}
                                    {extra.type === 'counter' && displayPrice > 0 && t('common.per_unit')}
                                </span>
                           </div>
                        </div>

                        {extra.type === 'counter' ? (
                            <div className="flex items-center gap-2">
                                <button 
                                    type="button"
                                    onClick={() => handleUpdateQuantity(extra.id, -1, extra.maxLimitRule, extra.maxQuantity)}
                                    disabled={!extrasState[extra.id] && !isMandatory}
                                    className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-sm font-medium w-4 text-center">{extrasState[extra.id] || 0}</span>
                                <button 
                                    type="button"
                                    onClick={() => handleUpdateQuantity(extra.id, 1, extra.maxLimitRule, extra.maxQuantity)}
                                    disabled={(extrasState[extra.id] || 0) >= getLimit(extra.maxLimitRule, extra.maxQuantity)}
                                    className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="text-sm font-medium text-gray-900">
                                {extrasState[extra.id] ? <CheckCircle className="w-5 h-5 text-primary" /> : null}
                            </div>
                        )}
                    </div>
                );
                })}
            </div>
             {/* Hidden input to pass selected extras to server action */}
             <input 
                 type="hidden" 
                 name="selectedExtras" 
                 value={JSON.stringify(extrasState)} 
             />
        </div>

        {/* Quote Summary */}
        {quote && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 border border-gray-200">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>{t('booking.rental')} ({quote.details.days} {t('booking.days')}):</span>
                    <div className="flex flex-col items-end">
                        {(quote.appliedDiscounts && quote.appliedDiscounts.length > 0) || quote.appliedDiscount ? (
                            <>
                                <span className="line-through text-gray-400 text-xs">€{quote.details.weekPrice.toLocaleString()}</span>
                                <span className="text-green-600 font-bold">€{quote.basePrice.toLocaleString()}</span>
                            </>
                        ) : (
                             <span>€{quote.basePrice.toLocaleString()}</span>
                        )}
                    </div>
                </div>
                {/* List all applied discounts */}
                {quote.appliedDiscounts && quote.appliedDiscounts.length > 0 ? (
                    quote.appliedDiscounts.map((d, i) => (
                        <div key={i} className="flex justify-between text-xs text-green-600 mb-1">
                            <span>{t(`booking.${d.name.toLowerCase().replace(/ /g, '_')}`) !== `booking.${d.name.toLowerCase().replace(/ /g, '_')}` ? t(`booking.${d.name.toLowerCase().replace(/ /g, '_')}`) : d.name}</span>
                            <span>-€{d.amount.toLocaleString()}</span>
                        </div>
                    ))
                ) : quote.appliedDiscount && (
                    <div className="flex justify-between text-xs text-green-600 mb-2">
                        <span>{quote.appliedDiscount.name}</span>
                        <span>-€{quote.appliedDiscount.amount.toLocaleString()}</span>
                    </div>
                )}
                
                { quote.extrasPrice > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>{t('booking.extras_total')}:</span>
                        <span>€{quote.extrasPrice.toLocaleString()}</span>
                    </div>
                )}
                { quote.premiumPackagePrice && quote.premiumPackagePrice > 0 ? (
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>{t('booking.premium_package')}:</span>
                            <span>€{quote.premiumPackagePrice.toLocaleString()}</span>
                        </div>
                        <ul className="text-xs text-gray-400 list-disc list-inside pl-1">
                            <li>{t('booking.premium.insurance')}</li>
                            <li>{t('booking.premium.welcome')}</li>
                            <li>{t('booking.premium.cleaning')}</li>
                            <li>{t('booking.premium.bed_linen')}</li>
                            <li>{t('booking.premium.bath_linen')}</li>
                            <li>{t('booking.premium.outboard')}</li>
                            <li>{t('booking.premium.gas')}</li>
                            <li>{t('booking.premium.mooring')}</li>
                            <li>{t('booking.premium.games')}</li>
                        </ul>
                    </div>
                ) : null}
                <div className="border-t pt-2 flex justify-between font-bold text-lg text-gray-900">
                    <span>{t('booking.total')}</span>
                    <span>€{quote.totalPrice.toLocaleString()}</span>
                </div>
                {quote.details.isEaster && (
                    <p className="text-xs text-amber-600 flex items-center mt-1">
                        <Info className="w-3 h-3 mr-1" /> {t('booking.easter_rate')}
                    </p>
                )}

                {/* Excluded Costs */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t('booking.excluded_costs')}</h5>
                    <div className="space-y-1 text-sm text-gray-500">
                         <div className="flex justify-between">
                             <span>{t('booking.apa_desc')}</span>
                             <span>€{(quote.basePrice * 0.30).toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between">
                             <span>{t('booking.deposit')}</span>
                             <span>€{(boatData[boatSlug as keyof typeof boatData]?.securityDeposit || 0).toLocaleString()}</span>
                         </div>
                    </div>
                    {!quote.details.isEaster && (
                        <div className="mt-3 text-xs text-gray-400 italic space-y-1">
                            <p>{t('booking.fuel_disclaimer')}</p>
                            <p>{t('booking.deposit_disclaimer')}</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Submit Button */}
        {loadingUser ? (
             <div className="w-full py-3 bg-gray-100 text-gray-400 text-center rounded-lg">{t('booking.loading')}</div>
        ) : !user ? (
            <button
                type="button"
                onClick={handleBookingStart}
                className="w-full py-3 px-4 rounded-lg font-bold text-white bg-gray-900 hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg"
            >
                <Lock className="w-4 h-4" />
                {t('booking.login_to_book')}
            </button>
        ) : (
            <div className="space-y-3">
                <button
                    type="submit"
                    disabled={isPending || !quote}
                    className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                        isPending || !quote 
                        ? 'bg-gray-300 cursor-not-allowed' 
                        : 'bg-primary hover:bg-primary-dark shadow-lg hover:shadow-primary/30'
                    }`}
                >
                    {isPending ? t('booking.sending') : t('booking.submit')}
                </button>
                <p className="text-xs text-center text-gray-500">
                    {t('booking.privacy_agree')} <a href="https://www.iubenda.com/privacy-policy/76185838" target="_blank" className="underline hover:text-gray-700 text-brand-gold iubenda-nostyle no-brand iubenda-noiframe iubenda-embed iub-legal-only">Privacy Policy</a>
                </p>
            </div>
        )}

        {/* Feedback Messages */}
        {state.error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-start gap-2 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>{state.error === 'AUTHENTICATION_REQUIRED' ? t('booking.auth_required') : state.error}</p>
            </div>
        )}
      </form>
      )}
    </div>
  )
}
