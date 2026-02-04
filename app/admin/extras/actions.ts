'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getExtras() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('extras')
    .select('*')
    .order('name')
  
  if (error) {
      console.error('Error fetching extras:', error)
      return []
  }
  
  return data
}

export async function upsertExtra(formData: FormData) {
  const supabase = await createClient()

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const price = parseFloat(formData.get('price') as string)
  const type = formData.get('type') as string
  const limit_rule = formData.get('limit_rule') as string
  const max_quantity = parseInt(formData.get('max_quantity') as string)
  const mandatory_raw = formData.get('mandatory_for_boats') as string
  
  // Convert comma-separated string to array, trimming whitespace and filtering empty
  const mandatory_for_boats = mandatory_raw 
    ? mandatory_raw.split(',').map(s => s.trim()).filter(Boolean)
    : []

  if (!id || !name) {
    throw new Error('Missing required fields')
  }

  const extra = {
    id,
    name,
    price: isNaN(price) ? 0 : price,
    type,
    limit_rule,
    max_quantity: isNaN(max_quantity) ? 1 : max_quantity,
    mandatory_for_boats
  }

  const { error } = await (supabase
    .from('extras') as any)
    .upsert(extra)

  if (error) {
    console.error('Error upserting extra:', error)
    throw new Error('Failed to save extra')
  }

  revalidatePath('/admin/extras')
  redirect('/admin/extras')
}

export async function deleteExtra(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('extras')
    .delete()
    .eq('id', id)

  if (error) {
     console.error('Error deleting extra:', error)
     throw new Error('Failed to delete extra')
  }

  revalidatePath('/admin/extras')
  redirect('/admin/extras')
}

export async function toggleExtraVisibility(id: string, isVisible: boolean) {
  const supabase = await createClient()

  const { error } = await (supabase
    .from('extras') as any)
    .update({ is_visible: isVisible })
    .eq('id', id)

  if (error) {
    console.error('Error updating extra visibility:', error)
    throw new Error('Failed to update visibility')
  }

  revalidatePath('/admin/extras')
}
