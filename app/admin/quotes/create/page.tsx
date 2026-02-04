import { createClient } from '@/lib/supabase-server'
import { boatData } from '@/lib/boat_data'
import QuoteForm from './QuoteForm'
import { getExtras } from '../../extras/actions' // Reuse if possible or just fetch here

export default async function CreateQuotePage() {
  // Fetch Extras from DB
  const extras = await getExtras().catch(() => [])

  // Parse Boat Data
  // boatData is an object { 'slug': { title: ... } }
  // We want an array of { id: slug, name: title }
  const boats = Object.entries(boatData).map(([slug, data]) => ({
    id: slug,
    name: (data as any).title || slug
  }))

  return (
    <div className="p-8 pb-20">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nuovo Preventivo</h1>
        <p className="text-gray-500 mt-2">Compila i dati per generare e inviare un preventivo in PDF.</p>
      </div>
      
      <QuoteForm standardExtras={extras} boats={boats} />
    </div>
  )
}
