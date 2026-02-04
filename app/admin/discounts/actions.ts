'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function upsertDiscount(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string // 'new' or valid uuid
  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const value = parseFloat(formData.get('value') as string)
  const unit = formData.get('unit') as string
  
  // Conditional fields
  const valid_from_raw = formData.get('valid_from') as string
  const valid_to_raw = formData.get('valid_to') as string
  const days_before_raw = formData.get('days_before_departure') as string
  const min_duration_days_raw = formData.get('min_duration_days') as string

  if (!name || isNaN(value)) {
    throw new Error('Missing required fields')
  }

  const discountPayload: any = {
    name,
    type,
    value,
    unit,
    // clear incompatible fields based on type just in case
    valid_from: type === 'period' && valid_from_raw ? valid_from_raw : null,
    // Allow valid_to for all types (Start/End of period OR Expiry of offer)
    valid_to: valid_to_raw ? valid_to_raw : null,
    days_before_departure: type === 'early_booking' && days_before_raw ? parseInt(days_before_raw) : null,
    min_duration_days: type === 'long_stay' && min_duration_days_raw ? parseInt(min_duration_days_raw) : null,
  }

  let error;
  
  if (id === 'new') {
      // Create new
      const { error: insertError } = await supabase
        .from('discounts')
        .insert(discountPayload)
      error = insertError
  } else {
      // Update existing
      discountPayload.id = id
      const { error: updateError } = await supabase
        .from('discounts')
        .upsert(discountPayload)
      error = updateError
  }

  if (error) {
    console.error('Error upserting discount:', error)
    throw new Error('Failed to save discount')
  }

  revalidatePath('/admin/discounts')
  redirect('/admin/discounts')
}

export async function deleteDiscount(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('discounts')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting discount:', error)
    throw new Error('Failed to delete discount')
  }

  revalidatePath('/admin/discounts')
  redirect('/admin/discounts')
}
