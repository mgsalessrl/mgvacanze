import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Inizializza la risposta base
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // 1. Aggiorna richiesta (per Server Components a valle)
          cookiesToSet.forEach(({ name, value }) => 
            request.cookies.set(name, value)
          )
          
          // 2. Aggiorna risposta (per browser)
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) => 
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: Questo triggera la gestione del refresh token e dei cookie
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Protezione Rotte
  if ((path.startsWith('/account') || path.startsWith('/admin')) && !user) {
    // Eccezione vitale: permettiamo l'accesso alla pagina di reset
    // Se l'utente sta facendo il reset password, POTREBBE non avere ancora la sessione fresca fresca dal redirect
    // O il token potrebbe essere stato appena settato ma non rinfrescato?
    if (path === '/account/reset-password') {
        return response
    }
    
    // Altra eccezione per il callback stesso, just in case
    if (path.startsWith('/auth/callback')) {
      return response
    }

    if (path !== '/login') {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('next', path)
        return NextResponse.redirect(url)
    }
  }

  // Redirect se già loggato
  if (path === '/login' && user) {
     const url = request.nextUrl.clone()
     url.pathname = '/account'
     // return NextResponse.redirect(url) // Disabilitato per evitare loop strani in fase di debug auth
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

