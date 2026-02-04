import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { Plus, Edit } from 'lucide-react'
import ExtraVisibilityToggle from './ExtraVisibilityToggle'

// Define a local type since generated types might be outdated
type Extra = {
  id: string
  name: string
  price: number
  type: string
  limit_rule: string
  max_quantity: number
  mandatory_for_boats: string[] | null
  is_visible?: boolean
}

export default async function ExtrasPage() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('extras')
    .select('*')
    .order('name')

  if (error) {
    return <div className="p-6 text-red-600">Error loading extras: {error.message}</div>
  }

  // Cast data to our updated type
  const extras = data as any[] as Extra[]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Extras Management</h1>
        <Link 
          href="/admin/extras/new" 
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          <Plus size={18} />
          Add New Extra
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name / ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rule</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Visible</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {extras?.map((extra) => (
                <tr key={extra.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{extra.name}</div>
                      <div className="text-xs text-gray-400 font-mono">{extra.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">€ {extra.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 capitalize">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        extra.type === 'toggle' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'
                    }`}>
                        {extra.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 capitalize">{extra.limit_rule}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <ExtraVisibilityToggle id={extra.id} initialIsVisible={extra.is_visible !== false} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link href={`/admin/extras/${extra.id}`} className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1 font-medium">
                      <Edit size={16} /> Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {extras?.length === 0 && (
                  <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                          No extras found. Create your first extra service!
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
