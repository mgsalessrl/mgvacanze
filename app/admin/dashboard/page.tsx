import { createClient } from '@/lib/supabase-server'
import { format } from 'date-fns'
import { CheckCircle, Euro } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import DeleteBookingClient from './DeleteBookingClient'
import { approveBookingAndRequestDeposit, confirmPayment } from '@/app/admin/bookings/actions'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch bookings with property info
  const { data: bookingsData, error } = await supabase
    .from('bookings')
    .select(`
        *,
        properties (title)
    `)
    .order('created_at', { ascending: false })

  if (error) {
      return <div className="p-8 text-red-500">Errore caricamento prenotazioni: {error.message}</div>
  }

  const bookings = bookingsData as any[]

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Prenotazioni</h1>
        <span className="bg-white px-4 py-2 rounded-lg border text-sm font-medium text-gray-600 shadow-sm">
            Totale: {bookings?.length || 0}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-700">ID</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Barca</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Cliente</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Totale</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Stato</th>
                <th className="px-6 py-4 font-semibold text-gray-700">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings?.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 font-mono">#{booking.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {booking.properties?.title || 'Barca #' + booking.property_id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                        {booking.customer_name || booking.user_email}
                    </div>
                    <div className="text-xs text-gray-500">
                        {booking.customer_email || booking.user_email}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {format(new Date(booking.start_date), 'dd/MM/yyyy')} - <br/>
                    {format(new Date(booking.end_date), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    €{booking.total_price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                        {booking.status === 'pending' && (
                            <form action={approveBooking}>
                                <input type="hidden" name="id" value={booking.id} />
                                <button className="p-2 text-green-600 hover:bg-green-50 rounded-md" title="Approva e Invia Mail">
                                    <CheckCircle className="w-5 h-5" />
                                </button>
                            </form>
                        )}
                        {booking.status === 'confirmed' && (
                            <form action={markPaid}>
                                <input type="hidden" name="id" value={booking.id} />
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-md" title="Segna come Pagato">
                                    <Euro className="w-5 h-5" />
                                </button>
                            </form>
                        )}
                        
                        {/* Delete Button (Client Component) */}
                        <DeleteBookingClient id={booking.id} deleteAction={deleteBooking} />

                        {/* Always show details/cancel button? */}
                        <a href={`/admin/bookings/${booking.id}`} className="p-2 text-gray-600 hover:bg-gray-100 rounded-md" title="Dettaglio">
                            <span className="sr-only">Dettaglio</span>
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        </a>
                    </div>
                  </td>
                </tr>
              ))}
              {(!bookings || bookings.length === 0) && (
                <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        Nessuna prenotazione trovata.
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

function StatusBadge({ status }: { status: string }) {
    const styles = {
        pending: 'bg-amber-100 text-amber-700 border-amber-200',
        confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
        paid: 'bg-green-100 text-green-700 border-green-200',
        cancelled: 'bg-red-100 text-red-700 border-red-200',
    }
    const labels = {
        pending: 'In attesa',
        confirmed: 'Confermata',
        paid: 'Pagata',
        cancelled: 'Cancellata',
    }
    const colorClass = styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700'
    const label = labels[status as keyof typeof labels] || status

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass}`}>
            {label}
        </span>
    )
}

// Server Actions for Booking Management
async function approveBooking(formData: FormData) {
    'use server'
    const id = parseInt(formData.get('id') as string)
    // Use the robust action from bookings module that handles emails correctly
    await approveBookingAndRequestDeposit(id);
    revalidatePath('/admin/dashboard')
}

async function markPaid(formData: FormData) {
    'use server'
    const id = parseInt(formData.get('id') as string)
    // Use the robust action from bookings module
    await confirmPayment(id, 'balance'); // Assuming fully paid means balance paid
    revalidatePath('/admin/dashboard')
}

// NEW ACTION: Delete Booking
async function deleteBooking(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const supabase = await createClient()
    
    const adminSupabase = supabase as any;
    const { error } = await adminSupabase.from('bookings').delete().eq('id', parseInt(id))
    
    if (error) {
        console.error('Error deleting booking:', error)
        // Optionally handle error feedback (hard in server action without useFormState)
    }

    revalidatePath('/admin/dashboard')
}
