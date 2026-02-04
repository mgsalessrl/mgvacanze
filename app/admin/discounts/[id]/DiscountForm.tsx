'use client'

import { useState } from 'react'
import { upsertDiscount, deleteDiscount } from '../actions'
import { Save, Trash2, Calendar, Clock, Tag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type Discount = {
  id: string
  name: string
  type: string
  value: number
  unit: string
  valid_from: string | null
  valid_to: string | null
  days_before_departure: number | null
  min_duration_days?: number | null
}

export default function DiscountForm({ discount, isNew }: { discount: Discount | null, isNew: boolean }) {
  const [type, setType] = useState<string>(discount?.type || 'fixed')
  const [unit, setUnit] = useState<string>(discount?.unit || 'percentage')

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/discounts" className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition">
          <ArrowLeft size={24} />
        </Link>
        <div>
            <h1 className="text-2xl font-bold text-gray-800">
            {isNew ? 'Create New Discount' : 'Edit Discount'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
                {isNew ? 'Configure a new price rule' : `Managing ${discount?.name}`}
            </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form action={upsertDiscount} className="p-8 space-y-8">
          
          {/* Hidden ID */}
          <input type="hidden" name="id" value={isNew ? 'new' : discount?.id} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Name */}
            <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Internal Name <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    name="name"
                    defaultValue={discount?.name || ''}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition hover:border-gray-400"
                    placeholder="e.g., Early Booking 2026"
                />
            </div>

            {/* Type */}
             <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Logic</label>
                <div className="grid grid-cols-3 gap-3">
                    <button
                        type="button"
                        onClick={() => setType('early_booking')}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition ${type === 'early_booking' ? 'bg-purple-50 border-purple-300 text-purple-700' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                        <Clock size={20} className="mb-1" />
                        <span className="text-xs font-medium">Early Bird</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('period')}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition ${type === 'period' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                        <Calendar size={20} className="mb-1" />
                        <span className="text-xs font-medium">Period</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('fixed')}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition ${type === 'fixed' ? 'bg-gray-100 border-gray-300 text-gray-800' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                        <Tag size={20} className="mb-1" />
                        <span className="text-xs font-medium">Flat/Manual</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('long_stay')}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border transition ${type === 'long_stay' ? 'bg-orange-50 border-orange-300 text-orange-700' : 'border-gray-200 hover:bg-gray-50'}`}
                    >
                        <Clock size={20} className="mb-1" />
                        <span className="text-xs font-medium">Long Stay</span>
                    </button>
                </div>
                <input type="hidden" name="type" value={type} />
            </div>

            {/* Value & Unit */}
            <div className={`col-span-2 md:col-span-1 ${type === 'fixed' ? 'row-span-2 self-start' : ''}`}> 
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Value <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                    <div className="relative flex-grow">
                        <span className="absolute left-4 top-3.5 text-gray-500">
                           {unit === 'currency' ? '€' : '%'}
                        </span>
                        <input
                            type="number"
                            name="value"
                            defaultValue={discount?.value ?? ''}
                            required
                            step="0.01"
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition hover:border-gray-400"
                        />
                    </div>
                    <select
                        name="unit"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value="percentage">% Perc</option>
                        <option value="currency">€ Euro</option>
                    </select>
                </div>
            </div>

             {/* Conditional: Early Booking */}
             {type === 'early_booking' && (
                 <div className="col-span-2 md:col-span-1 animate-fade-in bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <label className="block text-sm font-semibold text-purple-900 mb-2">
                        Days Before Departure
                    </label>
                    <input
                        type="number"
                        name="days_before_departure"
                        defaultValue={discount?.days_before_departure || 90}
                        required
                        min="1"
                        className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                    <p className="text-xs text-purple-700 mt-2">
                        Discount applies if booked at least associated days before trip start.
                    </p>
                </div>
             )}

             {/* Conditional: Period */}
             {type === 'period' && (
                 <div className="col-span-2 animate-fade-in bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <label className="block text-sm font-semibold text-blue-900 mb-2">
                        Valid Travel Dates
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-xs text-blue-700 block mb-1">From</span>
                            <input
                                type="date"
                                name="valid_from"
                                defaultValue={discount?.valid_from?.split('T')[0] || ''}
                                required
                                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <span className="text-xs text-blue-700 block mb-1">To</span>
                            <input
                                type="date"
                                name="valid_to"
                                defaultValue={discount?.valid_to?.split('T')[0] || ''}
                                required
                                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                    </div>
                    <p className="text-xs text-blue-700 mt-2">
                        Discount applies to charters falling within this period.
                    </p>
                </div>
             )}

             {/* Conditional: Long Stay */}
             {type === 'long_stay' && (
                 <div className="col-span-2 md:col-span-1 animate-fade-in bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <label className="block text-sm font-semibold text-orange-900 mb-2">
                        Minimum Duration (Days)
                    </label>
                    <input
                        type="number"
                        name="min_duration_days"
                        defaultValue={discount?.min_duration_days || 14}
                        required
                        min="1"
                        className="w-full px-4 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                    <p className="text-xs text-orange-700 mt-2">
                        Discount applies if booking duration is equal or greater than this.
                    </p>
                </div>
             )}

             {/* Conditional: Fixed / Expiry */}
             {type === 'fixed' && (
                 <div className="col-span-2 md:col-span-1 animate-fade-in bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Booking Deadline (Expires On)
                    </label>
                    <input
                        type="date"
                        name="valid_to"
                        defaultValue={discount?.valid_to?.split('T')[0] || ''}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 outline-none placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-600 mt-2">
                        Optional: Set a date when this discount stops working. Ideal for "Book by X" promos.
                    </p>
                </div>
             )}

          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
             {/* Delete Button (only if not new) */}
             {!isNew ? (
                 <button 
                    formAction={async (formData) => {
                         // We wrap this because deleteDiscount is a server action 
                         // and we are in a client component, but can still pass it to formAction
                        await deleteDiscount(discount!.id)
                    }}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition font-medium"
                    type="submit"
                    title="Delete permanently"
                 >
                    <Trash2 size={18} />
                    Delete
                 </button>
             ) : (
                 <div />
             )}

             <div className="flex gap-3">
                 <Link 
                    href="/admin/discounts"
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
