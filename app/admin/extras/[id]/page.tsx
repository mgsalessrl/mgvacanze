import { createClient } from '@/lib/supabase-server'
import { upsertExtra, deleteExtra } from '../actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2, Info } from 'lucide-react'

// Define local type
type Extra = {
  id: string
  name: string
  price: number
  type: string
  limit_rule: string
  max_quantity: number
  mandatory_for_boats: string[] | null
}

export default async function ExtraFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const isNew = id === 'new'
  let extra: Extra | null = null

  if (!isNew) {
    const supabase = await createClient()
    const { data } = await supabase.from('extras').select('*').eq('id', id).single()
    if (!data) {
         return notFound()
    }
    extra = data as any as Extra
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/extras" className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition">
          <ArrowLeft size={24} />
        </Link>
        <div>
            <h1 className="text-2xl font-bold text-gray-800">
            {isNew ? 'Create New Extra' : 'Edit Extra'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
                {isNew ? 'Add a new selectable service to the booking system' : `Managing ${extra?.name}`}
            </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form action={upsertExtra} className="p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* ID - Readonly if editing */}
            <div className="col-span-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ID (Slug) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="id"
                defaultValue={extra?.id || ''}
                readOnly={!isNew}
                required={isNew}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                    !isNew 
                        ? 'bg-gray-50 text-gray-500 border-gray-200 cursor-not-allowed' 
                        : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="e.g., wifi_modem"
              />
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <Info size={12} /> Unique identifier used in database. Cannot be changed.
              </p>
            </div>

            {/* Name */}
            <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Display Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="name"
                    defaultValue={extra?.name || ''}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition hover:border-gray-400"
                    placeholder="e.g., High Speed WiFi"
                />
            </div>

            {/* Price */}
            <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (€) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <span className="absolute left-4 top-3.5 text-gray-500">€</span>
                    <input
                        type="number"
                        name="price"
                        defaultValue={extra?.price ?? 0}
                        required
                        step="0.01"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition hover:border-gray-400"
                    />
                </div>
            </div>

            {/* Type */}
             <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                <select
                    name="type"
                    defaultValue={extra?.type || 'toggle'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition hover:border-gray-400 bg-white"
                >
                    <option value="toggle">Toggle (Yes/No)</option>
                    <option value="counter">Counter (Quantity)</option>
                </select>
            </div>

             {/* Limit Rule */}
             <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Limit Rule</label>
                <select
                    name="limit_rule"
                    defaultValue={extra?.limit_rule || 'fixed'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition hover:border-gray-400 bg-white"
                >
                    <option value="fixed">Fixed (Once per booking)</option>
                    <option value="guests">Per Guest (Multiply by guest count)</option>
                    <option value="cabins">Per Cabin (Multiply by cabins)</option>
                </select>
            </div>

             {/* Max Quantity */}
             <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Quantity</label>
                <input
                    type="number"
                    name="max_quantity"
                    defaultValue={extra?.max_quantity || 1}
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition hover:border-gray-400"
                />
                 <p className="text-xs text-gray-500 mt-2">
                     Maximum number allowed. Set to 1 for generic toggles.
                 </p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mandatory For Boats
            </label>
            <textarea
                name="mandatory_for_boats"
                defaultValue={extra?.mandatory_for_boats?.join(', ') || ''}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition hover:border-gray-400 font-mono text-sm"
                placeholder="elyvian-dream, elyvian-spirit"
            />
            <p className="text-xs text-gray-500 mt-2">
                Enter boat slugs separated by commas. This extra will be automatically added and locked for these boats.
            </p>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
             {/* Delete Button (only if not new) */}
             {!isNew ? (
                 <button 
                    formAction={async (formData) => {
                        'use server'
                        await deleteExtra(id)
                    }}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition font-medium"
                    type="submit"
                    title="Delete this extra permantently"
                 >
                    <Trash2 size={18} />
                    Delete
                 </button>
             ) : (
                 <div />
             )}

             <div className="flex gap-3">
                 <Link 
                    href="/admin/extras"
                    className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition"
                 >
                     Cancel
                 </Link>
                 <button 
                    type="submit" 
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
                 >
                    <Save size={18} />
                    Save Changes
                 </button>
             </div>
          </div>
        </form>
      </div>
    </div>
  )
}
