import { differenceInDays, isSameDay, isWithinInterval, parse, addDays } from 'date-fns';
import { boatData, UNIVERSAL_EXTRAS } from './boat_data';

// Tipi per i prezzi
type PricePeriod = {
  start: string; // MM/DD
  end: string;   // MM/DD
  price: number;
};

type SpecialPeriod = {
  start: Date;
  end: Date;
  price?: number; // Prezzo fisso per il periodo (settimana)
  rateMultiplier?: number; // O moltiplicatore
};

// Configurazione Prezzi 2026
const SEASON_PRICES: Record<string, PricePeriod[]> = {
  'elyvian-spirit': [
    { start: '03/28', end: '04/18', price: 5500 },
    { start: '04/18', end: '05/30', price: 5000 },
    { start: '05/30', end: '06/27', price: 6300 },
    { start: '06/27', end: '07/11', price: 7200 },
    { start: '07/11', end: '08/01', price: 7800 },
    { start: '08/01', end: '08/22', price: 9200 },
    { start: '08/22', end: '09/05', price: 7800 },
    { start: '09/05', end: '09/19', price: 7200 },
    { start: '09/19', end: '10/03', price: 6300 },
  ],
  'elyvian-dream': [
    { start: '03/28', end: '04/18', price: 7100 },
    { start: '04/18', end: '05/30', price: 7600 },
    { start: '05/30', end: '06/27', price: 9500 },
    { start: '06/27', end: '07/11', price: 10300 },
    { start: '07/11', end: '08/01', price: 11600 },
    { start: '08/01', end: '08/22', price: 13200 },
    { start: '08/22', end: '09/05', price: 11600 },
    { start: '09/05', end: '09/19', price: 10300 },
    { start: '09/19', end: '10/03', price: 9500 },
  ],
  'elyvian-breeze': [
    { start: '03/28', end: '04/18', price: 9000 },
    { start: '04/18', end: '05/30', price: 12600 },
    { start: '05/30', end: '06/27', price: 13650 },
    { start: '06/27', end: '07/11', price: 18900 },
    { start: '07/11', end: '08/01', price: 20700 },
    { start: '08/01', end: '08/22', price: 22000 },
    { start: '08/22', end: '09/05', price: 20700 },
    { start: '09/05', end: '09/19', price: 18900 },
    { start: '09/19', end: '10/03', price: 13650 },
  ]
};

const EASTER_PRICES: Record<string, number> = {
    'elyvian-spirit': 6900,
    'elyvian-dream': 8900,
    'elyvian-breeze': 10900
};


export const EASTER_WEEKS = [
  { start: new Date(2026, 3, 3), end: new Date(2026, 3, 7) },  // 3-7 Aprile
  { start: new Date(2026, 3, 9), end: new Date(2026, 3, 14) } // 9-14 Aprile
];

export const isEasterWeek = (date: Date) => {
    return EASTER_WEEKS.some(week => 
        isWithinInterval(date, { start: week.start, end: week.end })
    );
};

export const isValidStartDate = (date: Date) => {
    // 1. Must be Saturday (day 6)
    if (date.getDay() !== 6) return false;

    // 2. Must be within the global season: April 1st, 2026 to October 3rd, 2026
    // We assume the year IS 2026 as per project context, but let's be safe and check the full date.
    // However, the calendar might pass dates from other years if not restricted, so we check carefully.
    
    const seasonStart = new Date(2026, 2, 28); // 28th March 2026 (Month is 0-indexed: 2 = March)
    const seasonEnd = new Date(2026, 9, 3);   // 3rd October 2026 (Month is 0-indexed: 9 = October)

    // Normalize input date to compare just the day part or ensure timestamps work correct (midnight)
    // but react-day-picker usually sends date at 00:00:00.
    
    if (date < seasonStart || date > seasonEnd) {
        return false;
    }

    return true;
};


export interface Discount {
    id: string;
    name: string;
    type: 'early_booking' | 'period' | 'fixed' | 'long_stay';
    value: number;
    unit: 'percentage' | 'currency';
    valid_from?: string;
    valid_to?: string;
    days_before_departure?: number;
    min_duration_days?: number;
}

export type Quote = {
  basePrice: number;
  extrasPrice: number;
  premiumPackagePrice?: number;
  totalPrice: number;
  originalPrice: number;
  discountedPrice: number;
  appliedDiscount?: { // Deprecated: keeping for compatibility (represents the first or biggest discount)
      name: string;
      value: number;
      amount: number;
  };
  appliedDiscounts: {
      name: string;
      value: number;
      amount: number;
  }[];
  details: {
    days: number;
    weekPrice: number;
    period: string;
    isEaster?: boolean;
    extras: { name: string; price: number; quantity: number; total: number }[];
  }
};

type Extra = {
    id?: string;
    name: string;
    price: number;
    quantity?: number;
    type?: number;
};

// ... (helpers)
function getYearDate(dateStr: string): Date {
    // Expect "MM/DD" format
    const [month, day] = dateStr.split('/').map(Number);
    // Use 2026 as the base year as per configuration context
    return new Date(2026, month - 1, day);
}

export function calculateCharterPrice(
    boatId: string, /* slug o ID */
    startDate: Date,
    endDate: Date,
    selectedExtras: Extra[] = [],
    isPackage: boolean = false,
    hasPremiumPackage: boolean = false,
    activeDiscounts: Discount[] = []
): Quote {
    let basePrice = 0;
    let isEaster = false;
    let appliedPeriodStr = '';

    // Mappa boatId frontend agli ID prezzi
    let priceKey = '';
    if (boatId.includes('elyvian-spirit') || boatId.includes('Spirit') || boatId.includes('pasqua-spirit')) priceKey = 'elyvian-spirit';
    else if (boatId.includes('elyvian-dream') || boatId.includes('Dream') || boatId.includes('pasqua-dream')) priceKey = 'elyvian-dream';
    else if (boatId.includes('elyvian-breeze') || boatId.includes('Breeze') || boatId.includes('pasqua-breeze')) priceKey = 'elyvian-breeze';

    // 1. Check Pasqua (Logica Date Fisse) - Solo se è un pacchetto (isPackage = true)
    if (isPackage) {
        if (EASTER_PRICES[priceKey]) {
            basePrice = EASTER_PRICES[priceKey];
            isEaster = true;
            appliedPeriodStr = 'Special Easter Package';
        } else {
             const prices = SEASON_PRICES[priceKey];
             if (prices && prices.length > 0) {
                 basePrice = prices[0].price; 
             }
        }
    }

    // 2. Se non è Pasqua, calcola in base ai range
    if (!isEaster && priceKey && SEASON_PRICES[priceKey]) {
        const prices = SEASON_PRICES[priceKey];
        // Trova il periodo in cui ricade la start date
        const checkDate = startDate; 
        
        const found = prices.find(p => {
             // simplified check assuming current year
             const start = getYearDate(p.start);
             const end = getYearDate(p.end);
             // Handle wrapper year case if needed, but for 2026 simple check
             return checkDate >= start && checkDate < end;
        });

        if (found) {
            basePrice = found.price;
            appliedPeriodStr = `${found.start} - ${found.end}`;
        } else {
             // Default fallback if not found
             if (prices.length > 0) basePrice = prices[0].price; // Fallback
        }
    }

    // --- DISCOUNT LOGIC START ---
    let totalDiscountAmount = 0;
    const appliedDiscountsList: { name: string; value: number; amount: number }[] = [];

    // Skip discounts for packages or Easter
    if (!isPackage && !isEaster && !boatId.toLowerCase().includes('pasqua')) {
        const now = new Date();
        
        for (const d of activeDiscounts) {
            let applicable = false;

            if (d.type === 'early_booking') {
                // Check valid_to as booking deadline
                // If valid_to is present, today must be before it.
                const isBookingDeadlineMet = d.valid_to ? now <= new Date(d.valid_to) : true;
                // If valid_from is present, today must be after it.
                const isBookingStartMet = d.valid_from ? now >= new Date(d.valid_from) : true;

                // Check advance days
                const isDaysBeforeMet = d.days_before_departure ? differenceInDays(startDate, now) >= d.days_before_departure : true;
                
                if (isBookingDeadlineMet && isBookingStartMet && isDaysBeforeMet) {
                    applicable = true;
                }
            } else if (d.type === 'period') {
                 if (d.valid_from && d.valid_to) {
                     const dStart = new Date(d.valid_from);
                     const dEnd = new Date(d.valid_to);
                     // Check if TRIP start date falls in period
                     if (startDate >= dStart && startDate <= dEnd) {
                         applicable = true;
                     }
                 }
            } else if (d.type === 'fixed') {
                 if (d.valid_to && now > new Date(d.valid_to)) applicable = false;
                 else applicable = true;
            } else if (d.type === 'long_stay') {
                 const duration = differenceInDays(endDate, startDate);
                 const minDays = d.min_duration_days || 13; // Tolerance for 14 days (sometimes 13 nights) 
                 if (duration >= minDays) {
                     applicable = true;
                 }
            }

            if (applicable) {
                let amount = 0;
                const val = Number(d.value);
                if (d.unit === 'percentage') {
                    // Calculate on Base Price
                    amount = basePrice * (val / 100);
                } else {
                     amount = val;
                }

                if (amount > 0) {
                     totalDiscountAmount += amount;
                     appliedDiscountsList.push({
                         name: d.name,
                         value: val,
                         amount: amount
                     });
                }
            }
        }
    }

    const discountedBasePrice = Math.max(0, basePrice - totalDiscountAmount);
    // --- DISCOUNT LOGIC END ---

    // Calcola Extra
    let extrasTotal = 0;
    
    // Get overrides - Create a shallow copy to avoid mutating the original boatData
    const rawOverrides = (boatData[boatId as keyof typeof boatData] as any)?.extraOverrides || {};
    const overrides = { ...rawOverrides };
    
    // FORCE FIX: If it is an Easter package, enforce skipper price 0
    // Check for 'pasqua' in slug OR if isPackage is true (handling generic slug passed with package flag)
    if (boatId.toLowerCase().includes('pasqua') || isPackage) {
        // Enforce skipper mandatory and free for Easter packages
        (overrides as any)['skipper'] = { mandatory: true, price: 0 };
    }

    const processedIds = new Set<string>();

    const extrasDetails = selectedExtras.map(e => {
        let finalPrice = e.price;
        // Apply override if ID matches
        if (e.id && overrides[e.id]) {
             if (typeof overrides[e.id].price === 'number') {
                 finalPrice = overrides[e.id].price;
             }
        }
        
        if (e.id) processedIds.add(e.id);

        const qty = e.quantity || 1;
        const total = finalPrice * qty;
        extrasTotal += total;
        return {
            name: e.name,
            price: finalPrice,
            quantity: qty,
            total: total
        };
    });

    // Check for missing mandatory extras
    Object.entries(overrides).forEach(([id, override]: [string, any]) => {
         if (override.mandatory && !processedIds.has(id)) {
              const formatExtra = UNIVERSAL_EXTRAS.find(u => u.id === id);
              if (formatExtra) {
                   const price = typeof override.price === 'number' ? override.price : formatExtra.price;
                   const qty = 1; 
                   const total = price * qty;
                   extrasTotal += total;
                   extrasDetails.push({
                       name: formatExtra.label,
                       price: price,
                       quantity: qty,
                       total: total
                   });
              }
         }
    });

    let premiumPrice = 0;
    if (hasPremiumPackage) {
        premiumPrice = 750;
    }

    const totalPrice = discountedBasePrice + extrasTotal + premiumPrice;

    return {
        basePrice: discountedBasePrice, 
        extrasPrice: extrasTotal,
        premiumPackagePrice: premiumPrice,
        totalPrice: totalPrice,
        originalPrice: basePrice + extrasTotal + premiumPrice, 
        discountedPrice: totalPrice,
        appliedDiscounts: appliedDiscountsList,
        appliedDiscount: appliedDiscountsList.length > 0 ? appliedDiscountsList[0] : undefined,
        details: {
            days: differenceInDays(endDate, startDate) || 7,
            weekPrice: basePrice,
            period: appliedPeriodStr,
            isEaster: isEaster,
            extras: extrasDetails
        }
    };
}

