'use client'

import { useState } from 'react'
import { updatePassword } from './actions'
import { Loader2, AlertCircle } from 'lucide-react'

export default function ResetPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)
        
        // Client side validation
        const p1 = formData.get('password')
        const p2 = formData.get('confirmPassword')
        if (p1 !== p2) {
             setError('Le password non coincidono.')
             return
        }

        try {
            const res = await updatePassword(formData)
            if (res?.error) {
                setError(res.error)
                setLoading(false)
            }
        } catch (e) {
            setError('Errore sconosciuto.')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Logo or Brand */}
                <h2 className="mt-6 text-center text-3xl font-display font-bold tracking-tight text-gray-900">
                    Reimposta Password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Inserisci la tua nuova password per accedere al tuo account.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
                    <form action={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Nuova Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={6}
                                placeholder="Almeno 6 caratteri"
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-gold focus:ring-brand-gold sm:text-sm p-3 border outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Conferma Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                minLength={6}
                                placeholder="Ripeti la password"
                                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-gold focus:ring-brand-gold sm:text-sm p-3 border outline-none transition-all"
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
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Aggiorna Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
