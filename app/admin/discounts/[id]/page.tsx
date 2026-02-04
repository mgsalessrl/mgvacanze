import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import DiscountForm from './DiscountForm'

// Define local type
type Discount = {
  id: string
  name: string
  type: string
  value: number
  unit: string
  valid_from: string | null
  valid_to: string | null
  days_before_departure: number | null
}

export default async function DiscountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === 'new'
  let discount: Discount | null = null

  if (!isNew) {
    const supabase = await createClient()
    const { data } = await supabase.from('discounts').select('*').eq('id', id).single()
    if (!data) {
         return notFound()
    }
    discount = data as any as Discount
  }

  return <DiscountForm discount={discount} isNew={isNew} />
}
