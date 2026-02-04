'use server'

import { createClient } from '@/lib/supabase-server'
import { calculateCharterPrice } from '@/lib/pricing_engine'
import { UNIVERSAL_EXTRAS } from '@/lib/boat_data'
import { sendNewBookingNotification, sendCancellationNotification } from '@/lib/mail'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient as createGlobalClient } from '@supabase/supabase-js'


export type ActionState = {
  success?: boolean;
  message?: string;
  error?: string;
}

export async function submitBooking(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()

  // 0. Check Authentication
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
       return { error: 'AUTHENTICATION_REQUIRED' } 
  }

  const propertyId = formData.get('propertyId')
  const boatSlug = formData.get('boatSlug') as string
  const startDateStr = formData.get('startDate') as string
  const endDateStr = formData.get('endDate') as string
  const guests = Number(formData.get('guests'))
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const message = formData.get('message') as string
  const selectedExtrasJson = formData.get('selectedExtras') as string

  if (!propertyId || !startDateStr || !endDateStr) {
      return { error: 'Please fill in all required fields.' }
  }

  // 1. Recalculate Price on Server Side for Security
  const startDate = new Date(startDateStr)
  const endDate = new Date(endDateStr)
  
  // Parse extras
  let selectedExtrasArray: any[] = []
  try {
      const parsed = JSON.parse(selectedExtrasJson || '{}')
      if (Array.isArray(parsed)) {
          selectedExtrasArray = parsed // Legacy fallback
      } else {
          // Transform Record to Array
           selectedExtrasArray = Object.entries(parsed).map(([id, quantity]) => {
              const def = UNIVERSAL_EXTRAS.find(e => e.id === id)
              if (!def) return null
              return {
                  id: def.id,
                  name: def.label,
                  price: def.price,
                  quantity: quantity as number
              }
          }).filter(e => e !== null) as any[]
      }
  } catch (e) {
      console.error("Error parsing extras", e)
      return { error: 'Invalid extras data' }
  }

  const isPackage = formData.get('isPackage') === 'true'
  const hasPremiumPackage = formData.get('hasPremiumPackage') === 'true'

  // Fetch active discounts to ensure server-side price matches client-side with discounts
  const { data: activeDiscounts } = await supabase.from('discounts').select('*');

  const quote = calculateCharterPrice(boatSlug || '', startDate, endDate, selectedExtrasArray, isPackage, hasPremiumPackage, (activeDiscounts || []) as any[])

  if (quote.totalPrice <= 0) {
      return { error: 'Invalid price calculation. Please check dates.' }
  }

  // 2. Prepare Data for Supabase
  const bookingData: any = {
        property_id: Number(propertyId),
        user_id: user.id, // Linked to authenticated user
        user_email: email || user.email,     // Maintain for compatibility
        customer_email: email || user.email, // Standard column
        customer_name: name || '',
        customer_phone: phone || '',
        message: message || '',
        guests: guests || 1,

        start_date: startDateStr,
        end_date: endDateStr,
        total_price: quote.totalPrice,
        status: 'pending',
        payment_status: 'unpaid',
        extra_services: selectedExtrasArray, // Store the array of extras
  };

  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData] as any)
    .select()

  if (error) {
    console.error('Supabase booking error:', error)
    return { error: 'Failed to save booking. Please try again.' }
  }

  // Notify Admin
  if (data && data[0]) {
      try {
          await sendNewBookingNotification({ booking: data[0] })
      } catch (mailError) {
          console.error("Failed to send admin notification:", mailError)
          // We do not block the success response if email fails
      }
  }

  return { success: true, message: 'Richiesta inviata con successo! Ti contatteremo presto.' }
}

export async function cancelBooking(bookingId: number) {
  const supabase = await createClient()
  
  // Verify User
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
      redirect('/login')
  }

  // Use Admin Client to bypass RLS for UPDATE (which might be restricted)
  const adminSupabase = createGlobalClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Update Status
  const { data, error } = await adminSupabase
    .from('bookings')
    .update({ status: 'cancelled' }) 
    .eq('id', bookingId)
    .eq('user_id', user.id) // Security: Double-check ownership
    .select()
    .single()

  if (error) {
      console.error('Error cancelling booking:', error)
      throw new Error('Failed to cancel booking')
  }

  // Notify Admin
  if (data) {
      try {
          await sendCancellationNotification({ booking: data })
      } catch (e) {
         console.error("Failed to send cancellation email", e)
      }
  }

  revalidatePath('/account') // Refresh the page
}

