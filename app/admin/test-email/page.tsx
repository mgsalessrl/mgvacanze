'use client'

import { useState } from 'react'
import { sendTestAdminEmail } from './actions'

export default function TestEmailPage() {
  const [status, setStatus] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleTest = async () => {
    setLoading(true)
    setStatus('Invio in corso...')
    try {
      const res = await sendTestAdminEmail()
      setStatus(res.success ? '✅ ' + res.message : '❌ ' + res.message)
    } catch (e) {
      setStatus('Errore imprevisto.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Test Notifica Admin</h1>
      <p className="mb-6 text-gray-600">
        Premi il pulsante per simulare l'invio della mail che l'admin riceve quando un pagamento Stripe va a buon fine.
        Se stai usando Ethereal, la mail non arriverà a 'info@mgvacanze.com' ma verrà intercettata nella dashboard di Ethereal.
      </p>
      
      <button 
        onClick={handleTest}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Invio...' : 'Simula Pagamento & Invia Email'}
      </button>

      {status && (
        <div className={`mt-4 p-4 rounded ${status.includes('❌') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
          {status}
        </div>
      )}
    </div>
  )
}
