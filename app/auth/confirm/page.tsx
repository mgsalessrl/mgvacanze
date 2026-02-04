'use client'

import { useEffect, useState, Suspense } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

function AuthConfirmContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [status, setStatus] = useState('Verifica in corso...')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const handleAuth = async () => {
             const code = searchParams.get('code')
             const token_hash = searchParams.get('token_hash')
             const type = searchParams.get('type')
             const next = searchParams.get('next') || '/account'
             const errorDescription = searchParams.get('error_description')

             if (errorDescription) {
                 setError(errorDescription)
                 return
             }

             if (!code && !token_hash) {
                 // Se non c'è codice, controlliamo se abbiamo già una sessione
                 // Magari siamo arrivati qui per sbaglio o via magic link gestito automaticamente
                 const supabase = createBrowserClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                 )
                 const { data } = await supabase.auth.getSession()
                 if (data.session) {
                     router.push(next)
                 } else {
                     setError('Nessun codice di autorizzazione trovato.')
                 }
                 return
             }

             setStatus('Scambio credenziali...')
             
             const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
             )

             // Scambio il codice per la sessione LATO CLIENT.
             
             // PRIORITY 1: Verify via Token Hash (Recovery flow) - No PKCE needed
             if (token_hash && type) {
                 setStatus('Verifica Token...')
                 const { data, error } = await supabase.auth.verifyOtp({ token_hash, type: type as any })
                 if (error) {
                     setError('Errore OTP: ' + error.message)
                 } else {
                     finishLogin()
                 }
                 return
             }

             // PRIORITY 2: Exchange Code (PKCE flow)
             if (code) {
                setStatus('Scambio Codice...')
                const { data, error } = await supabase.auth.exchangeCodeForSession(code)

                if (error) {
                    console.error('Auth Error:', error)
                    
                    // FALLBACK PER PKCE MISSING:
                    // Se manca il verifier, significa che il flow è iniziato server-side o su altro device.
                    // Se abbiamo "code", è probabile che Supabase ci abbia rediretto qui consumando il token_hash.
                    // NON C'È MOLTO CHE POSSIAMO FARE QUI se non chiedere all'utente di richiedere un nuovo link 
                    // MA possiamo provare a catturare l'errore specifico.
                    if (error.name === 'AuthPKCECodeVerifierMissingError') {
                         setError('Sessione scaduta o dispositivo diverso. Richiedi un nuovo link di reset password.')
                    } else {
                         setError(error.message)
                    }
                } else if (data.session) {
                    finishLogin()
                }
             }

             function finishLogin() {
                 setStatus('Login effettuato. Reindirizzamento...')
                 router.refresh() 
                 router.replace(next) 
             }
        }

        handleAuth()
    }, [searchParams, router])

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <h2 className="text-red-600 font-bold mb-4 text-xl">Errore di Autenticazione</h2>
                    <p className="text-gray-700 mb-6">{error}</p>
                    <button 
                        onClick={() => router.push('/login')}
                        className="bg-brand-dark text-white px-4 py-2 rounded hover:bg-black transition-colors"
                    >
                        Torna al Login
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <Loader2 className="w-10 h-10 animate-spin text-brand-gold mb-4" />
            <p className="text-gray-600 font-medium animate-pulse">{status}</p>
        </div>
    )
}

export default function AuthConfirmPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="w-10 h-10 animate-spin" /></div>}>
            <AuthConfirmContent />
        </Suspense>
    )
}
