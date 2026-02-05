'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr' // Usa il client browser
import { ArrowLeft, Loader2, Mail, AlertCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault() // Importante per form client-side
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string

    setLoading(true)
    setMessage(null)
    setError(null)
    
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // Costruisci l'URL per il callback client-side
      // Usiamo NEXT_PUBLIC_SITE_URL se disponibile, altrimenti window.location.origin
      const origin = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      const redirectTo = `${origin}/auth/callback?next=/account/reset-password`

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      })

      if (error) {
        // Gestione specifica per rate limit o user not found (security implications aside, utile per debug)
        if (error.status === 429) {
             setError('Troppe richieste. Riprova tra qualche minuto.')
        } else {
             setError(error.message)
        }
      } else {
        setMessage('Se l\'indirizzo email è registrato, riceverai un link per reimpostare la password.')
      }
    } catch (e) {
      setError('Si è verificato un errore imprevisto.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <Link href="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Torna al Login
          </Link>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2 font-display">Password Dimenticata</h1>
          <p className="text-gray-600 mb-8 text-sm">
            Inserisci l'indirizzo email associato al tuo account e ti invieremo un link per reimpostare la password.
          </p>

          {message ? (
            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-start">
               <Mail className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
               <p className="text-sm">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-gold focus:ring-brand-gold sm:text-sm p-3 border outline-none transition-all"
                  placeholder="nome@esempio.com"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
                   <AlertCircle size={16} />
                   {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-lg border border-transparent bg-brand-dark py-3 px-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg hover:bg-brand-dark/90 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 disabled:opacity-50 transition-all transform hover:translate-y-[-1px]"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Invia Link di Reset'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
