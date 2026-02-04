import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { Plus, Edit, Calendar, Clock, Tag } from 'lucide-react'

// Define type locally
type Discount = {
  id: string
  name: string
  type: string
  value: number
  unit: string
  valid_from: string | null
  valid_to: string | null
  days_before_departure: number | null
  min_duration_days: number | null
}

export default async function DiscountsPage() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('discounts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return <div className="p-6 text-red-600">Error loading discounts: {error.message}</div>
  }

  const discounts = data as any[] as Discount[]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Discounts Management</h1>
        <Link 
          href="/admin/discounts/new" 
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <Plus size={18} />
          Add New Discount
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conditions</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {discounts?.map((discount) => (
                <tr key={discount.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{discount.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${discount.type === 'early_booking' ? 'bg-purple-100 text-purple-800' : 
                          discount.type === 'period' ? 'bg-blue-100 text-blue-800' : 
                          discount.type === 'long_stay' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    `}>
                        {discount.type === 'early_booking' && <Clock size={12} />}
                        {discount.type === 'period' && <Calendar size={12} />}
                        {discount.type === 'long_stay' && <Calendar size={12} />} 
                        {discount.type === 'fixed' && <Tag size={12} />}
                        {discount.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-semibold">
                    {discount.unit === 'currency' ? '€' : ''} {discount.value} {discount.unit === 'percentage' ? '%' : ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                    {discount.type === 'period' && discount.valid_from && (
                        <span>{new Date(discount.valid_from).toLocaleDateString()} - {new Date(discount.valid_to!).toLocaleDateString()}</span>
                    )}
                    {discount.type === 'early_booking' && (
                        <span>Min {discount.days_before_departure} days before</span>
                    )}
                    {discount.type === 'long_stay' && (
                        <span>Min {discount.min_duration_days || '?'} days stay</span>
                    )}
                    {discount.type === 'fixed' && <span>Always active</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link href={`/admin/discounts/${discount.id}`} className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1 font-medium">
                      <Edit size={16} /> Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {discounts?.length === 0 && (
                  <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                          No discounts found. Create your first discount!
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
