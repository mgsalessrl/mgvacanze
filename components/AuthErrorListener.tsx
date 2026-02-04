'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthErrorListenerContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const error = searchParams.get('error')
        const errorCode = searchParams.get('error_code')
        const errorDescription = searchParams.get('error_description')
        const code = searchParams.get('code')

        if (errorCode === 'otp_expired') {
            // Reindirizza alla pagina di richiesta password se il link è scaduto
            router.push('/auth/forgot-password?error=Link%20scaduto.%20Richiedi%20un%20nuovo%20link.')
        } else if (error && window.location.pathname === '/') {
            // Se c'è un errore generico e siamo sulla home, manda al login per mostrarlo
            // Evitiamo un loop se siamo già su login o altre pagine
            router.push(`/login?error=${encodeURIComponent(errorDescription || error)}`)
        } else if (code && window.location.pathname === '/') {
            // FIX: Gestione redirect Supabase non whitelisted
            // Se atterriamo sulla Home con un 'code', significa che Supabase ha fatto fallback sulla Site URL
            // invece di andare su /auth/callback. Forziamo il redirect al callback handler.
            // Aggiungiamo next=/account/reset-password per risolvere il problema specifico dell'utente.
            router.push(`/auth/callback?code=${code}&next=/account/reset-password`)
        }
    }, [searchParams, router])

    return null
}

export default function AuthErrorListener() {
    return (
        <Suspense fallback={null}>
            <AuthErrorListenerContent />
        </Suspense>
    )
}
