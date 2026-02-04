import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import BookingActions from './BookingActions'

// Local components for UI
const Badge = ({ status }: { status: string }) => {
    let color = 'bg-gray-100 text-gray-800'
    if (status === 'confirmed' || status === 'fully_paid' || status === 'deposit_paid' || status === 'paid') color = 'bg-green-100 text-green-800'
    if (status === 'pending' || status === 'waiting_deposit') color = 'bg-yellow-100 text-yellow-800'
    if (status === 'cancelled') color = 'bg-red-100 text-red-800'
    
    // Normalization
    const label = status.replace(/_/g, ' ')
    
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color} capitalize`}>
            {label}
        </span>
    )
}

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: booking, error } = await supabase
    .from('bookings')
    .select(`
        *,
        properties (id, title, image_url)
    `)
    .eq('id', id)
    .single() as any
    
  if (error) {
     return <div className="p-8 text-red-500">Error loading booking: {error.message}</div>
  }


  // Fetch quotes separately to avoid relationship ambiguity issues temporarily
  const { data: quotes } = await supabase
      .from('quotes')
      .select('id, total_price, status, created_at')
      .eq('booking_id', id)
      .order('created_at', { ascending: false })
  
  if (!booking) {
    notFound()
  }
  
  // Attach quotes to booking object for compatibility with existing code
  (booking as any).quotes = quotes || [];

  // Helper formats
  const formatDate = (d: string) => format(new Date(d), 'PPP', { locale: it });
  const formatMoney = (m: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(m);

  const pendingDeposit = booking.total_price * 0.50;
  const pendingBalance = booking.total_price * 0.50;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
           <Link href="/admin/dashboard" className="text-sm text-gray-500 hover:underline mb-2 block">← Torna alla Dashboard</Link>
           <h1 className="text-3xl font-bold text-gray-900">Prenotazione #{booking.id}</h1>
           <p className="text-gray-500">Creata il {formatDate(booking.created_at)}</p>
        </div>
        <div className="px-4 py-2 bg-gray-100 rounded-lg font-medium text-gray-700 capitalize">
            {booking.status}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Client & Boat Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Cliente</h3>
                    <div className="space-y-1">
                        <p className="font-medium text-lg">{booking.customer_name || 'N/A'}</p>
                        <p className="text-gray-600">{booking.user_email}</p>
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Barca</h3>
                    <div className="space-y-1">
                        <p className="font-medium text-lg">{booking.properties?.title || 'Unknown Boat'}</p>
                        <p className="text-gray-600">ID: {booking.property_id}</p>
                    </div>
                </div>
            </div>

            {/* Dates & Financials */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                 <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Dettagli Viaggio & Costi</h3>
                 <div className="grid md:grid-cols-2 gap-8">
                    <div>
                         <p className="text-sm text-gray-500">Check-in</p>
                         <p className="font-medium">{formatDate(booking.start_date)}</p>
                    </div>
                    <div>
                         <p className="text-sm text-gray-500">Check-out</p>
                         <p className="font-medium">{formatDate(booking.end_date)}</p>
                    </div>
                 </div>
                 <hr className="my-6 border-gray-100"/>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center text-lg font-bold">
                        <span>Totale Prenotazione</span>
                        <span>{formatMoney(booking.total_price || 0)}</span>
                    </div>
                    
                    {/* Payment Status Tracking */}
                    <div className="grid grid-cols-2 gap-4 mt-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                            <span className="text-sm text-gray-500 block">Acconto (Stima 50%)</span>
                            <span className="font-medium block">{formatMoney(booking.deposit_amount || pendingDeposit)}</span>
                            <Badge status={booking.deposit_status || 'pending'} />
                        </div>
                        <div>
                            <span className="text-sm text-gray-500 block">Saldo</span>
                            <span className="font-medium block">{formatMoney(booking.balance_amount || pendingBalance)}</span>
                            <Badge status={booking.balance_status || 'pending'} />
                        </div>
                    </div>
                 </div>
            </div>

             {/* Recent Quotes */}
             {booking.quotes && booking.quotes.length > 0 && (
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Preventivi Collegati</h3>
                    <ul className="space-y-3">
                        {booking.quotes.map((q: any) => (
                            <li key={q.id} className="flex justify-between border-b pb-2 last:border-0">
                                <span>Ref #{q.id} - {formatDate(q.created_at)}</span>
                                <span className="font-mono">{formatMoney(q.total_price)} ({q.status})</span>
                            </li>
                        ))}
                    </ul>
                 </div>
             )}
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-8">
            <BookingActions 
              bookingId={booking.id} 
              status={booking.status} 
              depositStatus={booking.deposit_status || 'pending'}
              balanceStatus={booking.balance_status || 'pending'} 
            />

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Crea Controproposta (Custom Quote)</h3>
                <p className="text-xs text-gray-500">Invia un nuovo prezzo al cliente con coordinate IBAN.</p>
                
                <form action={async (formData) => {
                  "use server";
                  // Dynamically import the action to avoid circular dependencies if any
                  const { createCustomQuoteAction } = await import('./actions');
                  await createCustomQuoteAction(formData);
                }} className="space-y-3">
                    <input type="hidden" name="bookingId" value={booking.id} />
                    
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Nuovo Prezzo Totale (€)</label>
                        <input 
                            type="number" 
                            name="newPrice" 
                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                            placeholder="Es. 2500"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Note per il cliente</label>
                        <textarea 
                            name="notes" 
                            rows={3}
                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                            placeholder="Spiega il motivo del nuovo prezzo..."
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-sm font-medium transition-colors"
                    >
                        Invia Proposta & IBAN
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  )
}

