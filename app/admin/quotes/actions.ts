'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { generateQuotePDF } from '@/lib/pdf-generator'
import { sendEmail } from '@/lib/mail'
import { calculateCharterPrice } from '@/lib/pricing_engine'

export async function getSuggestedPrice(boatName: string, startDate: string, endDate: string) {
  if (!boatName || !startDate || !endDate) return null

  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    // map boatName to slug or ID used in pricing_engine
    const boatSlug = boatName.toLowerCase().replace(/ /g, '-')
    
    // FETCH ACTIVE DISCOUNTS
    const supabase = await createClient()
    const { data: discounts } = await supabase.from('discounts').select('*')
    const activeDiscounts = (discounts || []) as any[]

    const quote = calculateCharterPrice(boatSlug, start, end, [], false, false, activeDiscounts)
    
    return {
        price: quote.basePrice, // This is technically the discounted base price in current engine logic if applied to base??
        // Wait, look at pricing_engine.ts:
        // discount is applied to basePrice. 
        // return object structure:
        // basePrice: discountedBasePrice
        // originalPrice: originalBasePrice
        // appliedDiscount: ...
        
        finalPrice: quote.basePrice, 
        originalPrice: quote.originalPrice,
        discount: quote.appliedDiscount
    }
  } catch (error) {
    console.error('Pricing Error:', error)
    return null
  }
}

export async function createQuote(formData: FormData) {
  const supabase = await createClient()

  // 1. Extract Data
  const customer_name = formData.get('customer_name') as string
  const customer_email = formData.get('customer_email') as string
  const customer_phone = formData.get('customer_phone') as string
  const boat_name = formData.get('boat_name') as string
  const property_id = formData.get('property_id') ? parseInt(formData.get('property_id') as string) : null
  const start_date = formData.get('start_date') as string
  const end_date = formData.get('end_date') as string
  const guests = parseInt(formData.get('guests') as string) || 0
  const rental_price = parseFloat(formData.get('rental_price') as string) || 0
  const discount = parseFloat(formData.get('discount') as string) || 0
  const discount_type = (formData.get('discount_type') as 'fixed' | 'percent') || 'fixed'
  
  // Parse Extras JSON
  const extrasJson = formData.get('extras_json') as string
  const extras = extrasJson ? JSON.parse(extrasJson) : []
  
  // Calculate Totals
  const extrasTotal = extras.reduce((sum: number, ex: any) => sum + (Number(ex.price) || 0), 0)
  
  let discountValue = 0
  if (discount_type === 'percent') {
    discountValue = (rental_price * discount) / 100
  } else {
    discountValue = discount
  }
  
  const total_price = rental_price + extrasTotal - discountValue

  // 2. Generate PDF
  const quoteData = {
    customer_name,
    start_date,
    end_date,
    boat_name,
    guests,
    rental_price,
    discount,
    discount_type,
    extras,
    total_price,
    quote_number: `PREV-${Date.now().toString().slice(-6)}`
  }

  const pdfBytes = await generateQuotePDF(quoteData)
  const pdfBuffer = Buffer.from(pdfBytes)

  // 3. Save to DB
  /* 
    Requires 'quotes' table to exist.
    Snapshotting all details so we don't lose history if prices change.
  */
  const { data: quoteRecord, error: dbError } = await (supabase
    .from('quotes') as any)
    .insert({
      // Quote Details
      property_id, // can be null if custom boat name
      boat_name,
      start_date,
      end_date,
      guests,
      customer_name,
      customer_email,
      customer_phone,
      rental_price,
      discount_amount: discountValue,
      discount_type,
      total_price,
      extras_snapshot: extras,
      status: 'sent'
    } as any)
    .select()
    .single()

  if (dbError) {
    console.error('DB Insert Error:', dbError)
    throw new Error('Errore durante il salvataggio del preventivo: ' + dbError.message)
  }

  // 4. Send Email
  try {
    const periodStr = `${new Date(start_date).toLocaleDateString('it-IT')} - ${new Date(end_date).toLocaleDateString('it-IT')}`
    
    await sendEmail({
      to: customer_email,
      subject: `Il tuo Preventivo MG Vacanze: ${boat_name}`,
      html: `
        <h1>Ciao ${customer_name},</h1>
        <p>Grazie per averci contattato. In allegato trovi il preventivo personalizzato per la tua vacanza.</p>
        <p><strong>Barca:</strong> ${boat_name}<br>
        <strong>Periodo:</strong> ${periodStr}<br>
        <strong>Totale:</strong> € ${total_price.toFixed(2)}</p>
        <p>Restiamo a disposizione per qualsiasi chiarimento.</p>
        <p>Un cordiale saluto,<br>Il team di MG Vacanze</p>
      `,
      attachments: [
        {
          filename: `Preventivo_${quoteData.quote_number}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    })
  } catch (emailError) {
    console.error("Email Sending Error:", emailError)
  }

  revalidatePath('/admin/quotes')
  return { success: true, quoteId: quoteRecord.id }
}
