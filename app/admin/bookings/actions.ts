'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { sendDepositRequestEmail, sendBalanceRequestEmail, sendDepositConfirmationEmail, sendBookingCompletedEmail } from '@/lib/mail'

// Helper to get booking details
async function getBookingDetails(bookingId: number) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*, properties(*)')
    .eq('id', bookingId)
    .single()
  
  if (error || !data) throw new Error('Booking not found')
  // Force cast to any because inferred types are breaking on the join
  return data as any
}

/**
 * 1. Approve Booking & Request Deposit
 * - Updates status to 'waiting_deposit'
 * - Calculates 50% deposit
 * - Sends Email with IBAN
 */
export async function approveBookingAndRequestDeposit(bookingId: number) {
  const supabase = await createClient()
  const booking = await getBookingDetails(bookingId)

  // Calculate 50% deposit
  const depositAmount = booking.total_price * 0.5

  // Update DB
  const { error } = await (supabase
    .from('bookings') as any)
    .update({ 
      status: 'confirmed',
      deposit_status: 'pending' 
    })
    .eq('id', bookingId)

  if (error) {
    console.error("Supabase Update Error (approveBooking):", error)
    throw new Error(`Failed to update booking status: ${error.message}`)
  }

  // Send Email
  try {
    await sendDepositRequestEmail({
      to: booking.user_email, // Fixed: using correct column name
      booking: {
        id: booking.id,
        customer_name: booking.customer_name || 'Cliente',
        boat_name: booking.properties?.title || 'Barca'
      },
      amount: depositAmount
    })
  } catch (emailError) {
    console.error('Failed to send deposit email:', emailError)
    // Don't throw, we want the status update to persist. Admin can resend manually if needed (future feature)
  }

  revalidatePath(`/admin/bookings/${bookingId}`)
}

/**
 * 2. Confirm Payment (Deposit or Balance)
 * - Updates status based on type
 */
export async function confirmPayment(bookingId: number, type: 'deposit' | 'balance') {
  const supabase = await createClient()
  const booking = await getBookingDetails(bookingId) // Need booking details for email
  
  let updateData: any = {}

  if (type === 'deposit') {
    updateData = { 
        status: 'confirmed',
        deposit_status: 'paid' 
    }
  } else {
    updateData = { 
        status: 'paid',
        balance_status: 'paid' 
    }
  }

  const { error } = await (supabase
    .from('bookings') as any)
    .update(updateData)
    .eq('id', bookingId)

  if (error) {
     console.error("Supabase Update Error (confirmPayment):", error)
     throw new Error(`Failed to confirm payment: ${error.message}`)
  }

  // Send Confirmation Email
  try {
      if (type === 'deposit') {
          await sendDepositConfirmationEmail({
              to: booking.user_email,
              booking: {
                  id: booking.id,
                  customer_name: booking.customer_name || 'Cliente',
                  boat_name: booking.properties?.title || 'Barca'
              }
          });
      } else {
          await sendBookingCompletedEmail({
            to: booking.user_email,
            booking: {
                id: booking.id,
                customer_name: booking.customer_name || 'Cliente',
                boat_name: booking.properties?.title || 'Barca'
            }
        });
      }
  } catch (e) {
      console.error("Failed to send confirmation email", e);
  }

  revalidatePath(`/admin/bookings/${bookingId}`)
}

/**
 * 3. Request Balance
 * - Updates status to 'waiting_balance'
 * - Calculates remaining 50%
 * - Sends Email
 */
export async function requestBalance(bookingId: number) {
    const supabase = await createClient()
    const booking = await getBookingDetails(bookingId)
  
    // Calculate remaining 50%
    const balanceAmount = booking.total_price * 0.5 
  
    // Update DB
    const { error } = await (supabase
      .from('bookings') as any)
      .update({ 
        status: 'confirmed',
        balance_status: 'pending'
      })
      .eq('id', bookingId)
  
    if (error) {
       console.error("Supabase Update Error (requestBalance):", error)
       throw new Error(`Failed to update booking status: ${error.message}`)
    }
  
    // Send Email
    try {
      await sendBalanceRequestEmail({
        to: booking.user_email, // Fixed: using correct column name
        booking: {
          id: booking.id,
          customer_name: booking.customer_name || 'Cliente',
          boat_name: booking.properties?.title || 'Barca'
        },
        amount: balanceAmount
      })
    } catch (emailError) {
      console.error('Failed to send balance email:', emailError)
    }
  
    revalidatePath(`/admin/bookings/${bookingId}`)
  }
