import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { format } from 'date-fns'
import { LogOut, Ship, XCircle } from 'lucide-react'
import { cancelBooking } from '@/app/actions'

export default async function UserAccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: bookingsData } = await supabase
    .from('bookings')
    .select('*, properties(title, image_url)')
    .eq('user_id', user!.id) // RLS handles this too, but explicit check is good
    .order('created_at', { ascending: false })

  const bookings = bookingsData as any[]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-display font-bold text-gray-900">Il Mio Account</h1>
                <p className="text-gray-500 mt-1">Benvenuto, {user?.email}</p>
            </div>
            <form action="/auth/signout" method="post">
                 <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium">
                    <LogOut className="w-4 h-4" /> Esci
                 </button>
            </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="font-semibold text-gray-800">Le tue Prenotazioni</h2>
            </div>
            
            {!bookings || bookings.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                    <Ship className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-lg">Non hai ancora effettuato prenotazioni.</p>
                    <Link href="/#fleets" className="mt-4 inline-block text-primary hover:underline">
                        Scopri la nostra flotta
                    </Link>
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row gap-6">
                            {/* Image */}
                            <div className="w-full md:w-32 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                                {booking.properties?.image_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img 
                                        src={booking.properties.image_url.startsWith('/') || booking.properties.image_url.startsWith('http') 
                                            ? booking.properties.image_url 
                                            : `/uploads/${booking.properties.image_url}`} 
                                        alt="" 
                                        className="w-full h-full object-cover" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                        <Ship className="w-8 h-8" />
                                    </div>
                                )}
                            </div>
                            
                            {/* Info */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg text-gray-900">
                                        {booking.properties?.title || `Prenotazione #${booking.id}`}
                                    </h3>
                                    <div className="flex flex-col items-end gap-1">
                                        <StatusBadge status={booking.status} />
                                        <PaymentStatusBadge booking={booking} />
                                    </div>
                                </div>
                                <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-gray-600">
                                    <div>
                                        <span className="block text-xs uppercase text-gray-400">Date</span>
                                        {format(new Date(booking.start_date), 'dd/MM/yyyy')} — {format(new Date(booking.end_date), 'dd/MM/yyyy')}
                                    </div>
                                    <div>
                                        <span className="block text-xs uppercase text-gray-400">Totale</span>
                                        <span className="font-semibold text-gray-900">€{booking.total_price.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                {booking.status !== 'cancelled' && booking.status !== 'paid' && (
                                    <div className="mt-4 flex justify-end">
                                        <form action={cancelBooking.bind(null, booking.id)}>
                                            <button 
                                                className="text-xs text-red-600 hover:text-red-800 hover:underline flex items-center gap-1 p-2 rounded hover:bg-red-50 transition-colors"
                                                title="Annulla la richiesta"
                                            >
                                                <XCircle className="w-3 h-3" /> Annulla Richiesta
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        pending: 'bg-amber-50 text-amber-700 border-amber-200',
        confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
        paid: 'bg-green-50 text-green-700 border-green-200',
        cancelled: 'bg-gray-50 text-gray-600 border-gray-200',
    }
    const labels = {
        pending: 'In attesa di conferma',
        confirmed: 'Confermata',
        paid: 'Pagata',
        cancelled: 'Cancellata',
    }
    const colorClass = styles[status as keyof typeof styles] || 'bg-gray-50'
    const label = labels[status as keyof typeof labels] || status
    
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
            {label}
        </span>
    )
}

function PaymentStatusBadge({ booking }: { booking: any }) {
    if (booking.status !== 'confirmed' && booking.status !== 'paid') return null;

    // Se tutto pagato (o status='paid')
    if (booking.status === 'paid' || (booking.deposit_status === 'paid' && booking.balance_status === 'paid')) {
        return (
             <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                Pagamento Completato
            </span>
        )
    }

    // Se caparra pagata ma saldo in attesa
    if (booking.deposit_status === 'paid' && booking.balance_status === 'pending') {
        return (
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Caparra Pagata - Attesa Saldo
            </span>
        )
    }

    // Se caparra pagata (e saldo non ancora richiesto o null)
    if (booking.deposit_status === 'paid') {
         return (
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Caparra Pagata
            </span>
        )
    }

    // Se caparra in attesa
    if (booking.deposit_status === 'pending') {
        return (
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Attesa Bonifico Caparra
            </span>
        )
    }
    
     // Se saldo in attesa (ovvero caparra pagata o non richiesta esplicitamente ma siamo in confirmed)
    if (booking.balance_status === 'pending') {
          return (
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Attesa Saldo
            </span>
        )
    }

    // Default per stati intermedi o non definiti
    return null;
}
