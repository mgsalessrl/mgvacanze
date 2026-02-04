'use server';

import { sendDepositRequestEmail, sendBalanceRequestEmail, sendEmail, sendCustomQuoteEmail } from '@/lib/mail';
import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { Database } from '@/lib/database.types';

// Manual Payment Flow Replacement for Stripe
export async function sendPaymentLinkAction(formData: FormData) {
    const bookingId = formData.get('bookingId') as string;
    const email = formData.get('email') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const boatName = formData.get('boatName') as string;
    const type = formData.get('type') as 'deposit' | 'balance' | 'full';
    
    if (!bookingId || !email || !amount || !boatName) {
        return { success: false, error: 'Dati mancanti per inviare la richiesta.' };
    }

    try {
        const id = parseInt(bookingId);
        
        // Use Email Templates for Manual Transfer
        if (type === 'deposit') {
            await sendDepositRequestEmail({
                to: email,
                booking: { id: id, customer_name: 'Cliente', boat_name: boatName },
                amount: amount
            });
        } else {
            // Balance or Full
            await sendBalanceRequestEmail({
                 to: email,
                 booking: { id: id, customer_name: 'Cliente', boat_name: boatName },
                 amount: amount
             });
        }

        // Update booking status tracking (Manual Logic)
        const supabase = await createClient();
        let updateField: any = {};

        if (type === 'deposit') {
            updateField = { deposit_amount: amount, deposit_status: 'pending' };
        } else if (type === 'balance') {
            updateField = { balance_amount: amount, balance_status: 'pending' };
        }
        
        if (Object.keys(updateField).length > 0) {
            const adminSupabase = supabase as any;
            await adminSupabase.from('bookings').update(updateField).eq('id', id);
        }

        revalidatePath(`/admin/bookings/${bookingId}`);
        return { success: true, message: 'Istruzioni pagamento inviate via email!' };

    } catch (e) {
        console.error(e);
        return { success: false, error: 'Eccezione durante invio email.' };
    }
}

export async function sendDirectEmailAction(formData: FormData) {
    const bookingId = formData.get('bookingId') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    if (!email || !subject || !message) {
        return { success: false, error: 'Compila tutti i campi.' };
    }

    try {
        await sendEmail({
            to: email,
            subject: subject,
            html: `<div style="white-space: pre-wrap; font-family: sans-serif;">${message}</div>`
        });
        return { success: true, message: 'Email inviata.' };
    } catch (e) {
        return { success: false, error: 'Errore invio email.' };
    }
}

export async function createCustomQuoteAction(formData: FormData) {
    const bookingId = formData.get('bookingId') as string;
    const newPrice = parseFloat(formData.get('newPrice') as string);
    const notes = formData.get('notes') as string;

    if (!bookingId || !newPrice) return { success: false, error: 'Prezzo richiesto.' };

    const supabase = await createClient();
    const id = parseInt(bookingId);

    // Fetch original booking
    const { data: booking, error } = await supabase.from('bookings').select('*').eq('id', id).single();
    if (error || !booking) return { success: false, error: 'Prenotazione non trovata.' };

    const b = booking as any; // Cast to any to avoid strict type mismatch if properties are missing in type def

    // Get Property Name
    const { data: property } = await supabase.from('properties').select('title').eq('id', b.property_id).single();
    const p = property as any;
    const boatName = p?.title || 'Barca sconosciuta';

    const adminSupabase = supabase as any;
    const { error: insertError } = await adminSupabase.from('quotes').insert({
        boat_name: boatName,
        property_id: b.property_id,
        start_date: b.start_date,
        end_date: b.end_date,
        guests: 0, 
        customer_name: 'Cliente Booking #' + bookingId,
        customer_email: b.user_email,
        customer_phone: '',
        rental_price: newPrice,
        total_price: newPrice,
        status: 'draft',
        notes: `Preventivo custom generato da Admin per Booking #${bookingId}. Note: ${notes}`,
        booking_id: id
    });

    if (insertError) {
        return { success: false, error: insertError.message };
    }

    try {
        await sendCustomQuoteEmail({
            to: b.user_email || b.customer_email,
            booking: { 
                 id: bookingId, 
                 customer_name: b.customer_name || 'Cliente', 
                 boat_name: boatName 
            },
            newPrice: newPrice,
            notes: notes
        });
    } catch (e) {
        console.error("Mail error sending custom quote", e);
        // We don't fail the action if mail fails, but we should probably warn.
        // For now returning success but logging error.
    }

    revalidatePath(`/admin/bookings/${bookingId}`);
    return { success: true, message: 'Preventivo creato e inviato al cliente.' };
}

export async function approveBookingAndNotify(bookingId: number) {
    const supabase = await createClient();
    
    // 1. Fetch booking to get details
    const { data: bookingData, error } = await supabase
        .from('bookings')
        .select(`*, properties(title)`)
        .eq('id', bookingId)
        .single();
        
    if (error || !bookingData) return { success: false, error: 'Prenotazione non trovata' };
    const booking = bookingData as any;

    // 2. Calculate Deposit (50%)
    const depositAmount = booking.total_price * 0.50;

    // 3. Send Manual Deposit Email
    try {
        await sendDepositRequestEmail({
            to: booking.user_email || booking.customer_email,
            booking: { 
                 id: bookingId, 
                 customer_name: booking.customer_name || 'Cliente', 
                 boat_name: booking.properties?.title || 'Barca' 
            },
            amount: depositAmount
        });
    } catch(e) {
        console.error("Mail error", e);
    }

    // 4. Update Status to Waiting Deposit
    const adminSupabase = supabase as any;
    await adminSupabase.from('bookings').update({ 
        status: 'confirmed',
        deposit_amount: depositAmount,
        deposit_status: 'pending' 
    }).eq('id', bookingId);

    revalidatePath(`/admin/bookings/${bookingId}`);
    return { success: true, message: 'Prenotazione approvata e richiesta acconto (50%) inviata.' };
}

export async function sendBalanceRequest(bookingId: number) {
    const supabase = await createClient();
    
    // 1. Fetch booking
    const { data: bookingData, error } = await supabase
        .from('bookings')
        .select(`*, properties(title)`)
        .eq('id', bookingId)
        .single();
        
    if (error || !bookingData) return { success: false, error: 'Prenotazione non trovata' };
    const booking = bookingData as any;
    
    const balanceAmount = booking.total_price * 0.50;

    // 3. Email
    await sendBalanceRequestEmail({
         to: booking.user_email || booking.customer_email,
         booking: { id: bookingId, customer_name: 'Cliente', boat_name: booking.properties?.title || 'Barca' },
         amount: balanceAmount
    });

    // Update DB
    const adminSupabase = supabase as any;
    await adminSupabase.from('bookings').update({ 
        status: 'confirmed', 
        balance_status: 'pending' 
    }).eq('id', bookingId);

    revalidatePath(`/admin/bookings/${bookingId}`);
    return { success: true, message: 'Richiesta saldo inviata.' };
}
