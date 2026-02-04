"use client";

import { useActionState, useState } from 'react';
import { Mail, Phone, Calendar, User, CheckCircle, AlertCircle } from 'lucide-react';
import { submitBooking, ActionState } from '@/app/actions';

interface EasterBookingFormProps {
  boatName: string;
  boatSlug: string;
  extras?: string[]; // strings like "Skipper: €1750..."
  propertyId?: number; // Optional because might be loaded async or inferred
}

const initialState: ActionState = {
    success: false,
    message: '',
    error: ''
}

import { useTranslation } from '@/components/I18nContext';

export default function EasterBookingForm({ boatName, boatSlug, extras = [], propertyId }: EasterBookingFormProps) {
  const { t } = useTranslation();
  const [state, formAction, isPending] = useActionState(submitBooking, initialState);
  
  const [selectedWeek, setSelectedWeek] = useState<string>('');
  
  // We maintain selected extras. However, submitBooking expects JSON object array.
  // We will map string simple selection to objects.
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());

  // Fixed Easter weeks
  const weeks = [
    { 
        id: 'week1', 
        label: `${t('easter.catholic')}: 3 Apr - 7 Apr 2026`, 
        startDate: '2026-04-03', 
        endDate: '2026-04-07' 
    },
    { 
        id: 'week2', 
        label: `${t('easter.orthodox')}: 9 Apr - 14 Apr 2026`, 
        startDate: '2026-04-09', 
        endDate: '2026-04-14' 
    }
  ];

  const handleExtraToggle = (extra: string) => {
    const newExtras = new Set(selectedExtras);
    if (newExtras.has(extra)) {
      newExtras.delete(extra);
    } else {
      newExtras.add(extra);
    }
    setSelectedExtras(newExtras);
  };

  const currentWeek = weeks.find(w => w.id === selectedWeek);

  // If propertyId not provided, we try to infer from boatSlug map (hardcoded safety)
  // This is a client-side fallback to avoid "submitBooking" failing if parent didn't pass ID.
  const getPropertyId = () => {
      if (propertyId) return propertyId;
      if (boatSlug.includes('dream')) return 1927;
      if (boatSlug.includes('spirit')) return 3038;
      if (boatSlug.includes('breeze')) return 3056;
      return 0;
  }
  
  const finalPropertyId = getPropertyId();

  if (state.success) {
    return (
      <div className="bg-brand-gold/10 p-8 rounded-xl border border-brand-gold text-center">
        <CheckCircle className="w-16 h-16 text-brand-gold mx-auto mb-4" />
        <h3 className="text-2xl font-display text-brand-dark mb-2">{t('easter.success_title')}</h3>
        <p className="text-gray-600">{state.message || t('easter.success_msg')}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 text-sm text-brand-dark underline hover:text-brand-gold"
        >
          {t('easter.new_request')}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="bg-brand-dark -mx-8 -mt-8 px-8 py-6 mb-8 rounded-t-xl">
         <h3 className="text-2xl font-display text-white mb-1">{t('boat.request_quote')}</h3>
         <p className="text-gray-300 text-sm">{t('boat.special_offer')} - {boatName}</p>
      </div>
      
      <form action={formAction} className="space-y-6">
        <input type="hidden" name="boatSlug" value={boatSlug} />
        <input type="hidden" name="propertyId" value={finalPropertyId} />
        <input type="hidden" name="guests" value={10} /> {/* Default max guests or similar */}
        
        {/* Dates */}
        {currentWeek ? (
            <>
                <input type="hidden" name="startDate" value={currentWeek.startDate} />
                <input type="hidden" name="endDate" value={currentWeek.endDate} />
            </>
        ) : (
            // Fallback hidden inputs to ensure form doesn't crash but validator will catch it
             <>
                <input type="hidden" name="startDate" value="" />
                <input type="hidden" name="endDate" value="" />
            </>
        )}

        {/* Selected Extras JSON */}
        <input 
            type="hidden" 
            name="selectedExtras" 
            value={JSON.stringify(Array.from(selectedExtras).map(e => ({ name: e, price: 0 })))} 
        />
        
        {/* Customer Info */}
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{t('booking.name')}</label>
                <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input type="text" name="name" required placeholder={t('boat.name_placeholder')} className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-brand-gold focus:border-brand-gold" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{t('booking.email')}</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input type="email" name="email" required placeholder="email@example.com" className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-brand-gold focus:border-brand-gold" />
                </div>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{t('booking.phone')}</label>
                <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input type="tel" name="phone" required placeholder={t('boat.phone_placeholder')} className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-brand-gold focus:border-brand-gold" />
                </div>
            </div>
        </div>

        {/* Week Selector */}
        <div>
          <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
             <Calendar className="w-4 h-4 inline mr-2 text-brand-gold" /> {t('easter.select_period')}
          </label>
          <div className="space-y-3">
            {weeks.map((week) => (
              <label 
                key={week.id} 
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedWeek === week.id 
                    ? 'border-brand-gold bg-brand-gold/5 ring-1 ring-brand-gold' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    name="weekSlot" // Just for UI
                    value={week.id}
                    checked={selectedWeek === week.id}
                    onChange={(e) => setSelectedWeek(e.target.value)}
                    className="w-4 h-4 text-brand-gold focus:ring-brand-gold border-gray-300"
                    required
                  />
                  <span className="ml-3 font-medium text-gray-800">{week.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Extras */}
        {extras.length > 0 && (
            <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
                    {t('easter.extra_services')}
                </label>
                <div className="space-y-2">
                    {extras.map((extra, idx) => (
                        <label key={idx} className="flex items-start cursor-pointer">
                             <input 
                                type="checkbox" 
                                checked={selectedExtras.has(extra)}
                                onChange={() => handleExtraToggle(extra)}
                                className="mt-1 w-4 h-4 text-brand-gold rounded focus:ring-brand-gold border-gray-300" 
                             />
                             <span className="ml-3 text-sm text-gray-600">
                                {extra /* Assuming extra text is already translated or pass simple keys and translate here */}
                             </span>
                        </label>
                    ))}
                </div>
            </div>
        )}

        {state.error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {state.error}
            </div>
        )}

        <button 
          type="submit" 
          disabled={isPending || !selectedWeek}
          className="w-full bg-brand-gold text-brand-dark py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-white hover:border hover:border-brand-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isPending ? t('booking.sending') : t('boat.request_quote')}
        </button>

      </form>
    </div>
  );
}
