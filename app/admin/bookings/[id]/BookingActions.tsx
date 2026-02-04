'use client'

import { useState } from 'react'
import { approveBookingAndRequestDeposit, confirmPayment, requestBalance } from '../actions'
import { Loader2, CheckCircle, Wallet, Mail } from 'lucide-react'

interface BookingActionsProps {
  bookingId: number
  status: string
  depositStatus?: string
  balanceStatus?: string
}

export default function BookingActions({ bookingId, status, depositStatus, balanceStatus }: BookingActionsProps) {
  const [loading, setLoading] = useState(false)

  const handleAction = async (actionFn: () => Promise<void>) => {
    if(!confirm('Sei sicuro di voler procedere con questa azione?')) return
    
    setLoading(true)
    try {
      await actionFn()
      // Router refresh is handled by the server action revalidatePath
    } catch (error) {
      console.error(error)
      alert('Si è verificato un errore')
    } finally {
      setLoading(false)
    }
  }

  // Final State
  if (status === 'paid' || (depositStatus === 'paid' && balanceStatus === 'paid')) {
      return (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mb-2" />
              <h3 className="text-lg font-bold text-green-800">Prenotazione Completata</h3>
              <p className="text-green-600">Il saldo è stato incassato. La prenotazione è confermata.</p>
          </div>
      )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
         Azioni di Gestione
         {loading && <Loader2 className="w-4 h-4 animate-spin text-gray-500" />}
      </h3>
      
      <div className="space-y-4">
        {/* Step 1: Approve & Ask for Deposit */}
        {status === 'pending' && (
             <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800 mb-3">La prenotazione è in attesa. Accettala per inviare la richiesta di caparra (50%).</p>
                <button
                    onClick={() => handleAction(() => approveBookingAndRequestDeposit(bookingId))}
                    disabled={loading}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center gap-2"
                >
                    <CheckCircle className="w-4 h-4" />
                    Accetta e Richiedi Caparra
                </button>
             </div>
        )}

        {/* Step 2: Confirm Deposit */}
        {status === 'confirmed' && depositStatus === 'pending' && (
             <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <p className="text-sm text-amber-800 mb-3">In attesa del bonifico di caparra. Conferma solo quando i fondi sono sul conto.</p>
                <button
                    onClick={() => handleAction(() => confirmPayment(bookingId, 'deposit'))}
                    disabled={loading}
                    className="w-full py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg flex items-center justify-center gap-2"
                >
                    <Wallet className="w-4 h-4" />
                    Conferma Incasso Caparra
                </button>
             </div>
        )}

        {/* Step 3: Manage Balance (Request & Confirm) */}
        {status === 'confirmed' && depositStatus === 'paid' && balanceStatus === 'pending' && (
             <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 space-y-3">
                <p className="text-sm text-purple-800">
                    Caparra incassata. Puoi inviare la richiesta di saldo o confermare l'incasso finale.
                </p>
                
                <button
                    onClick={() => handleAction(() => requestBalance(bookingId))}
                    disabled={loading}
                    className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg flex items-center justify-center gap-2"
                >
                    <Mail className="w-4 h-4" />
                    Invia (o Reinvia) Richiesta Saldo
                </button>

                <div className="border-t border-purple-200 my-2 pt-2">
                    <p className="text-xs text-purple-800 mb-2">Hai già ricevuto il bonifico del saldo?</p>
                    <button
                        onClick={() => handleAction(() => confirmPayment(bookingId, 'balance'))}
                        disabled={loading}
                        className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center justify-center gap-2"
                    >
                        <Wallet className="w-4 h-4" />
                        Conferma Incasso Saldo & Chiudi
                    </button>
                </div>
             </div>
        )}

      </div>
    </div>
  )
}
