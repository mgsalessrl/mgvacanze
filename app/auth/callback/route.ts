import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { type EmailOtpType } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  let next = requestUrl.searchParams.get('next') ?? '/account'
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null
  
  // Se è un recupero password, forziamo il redirect alla pagina di reset
  if (type === 'recovery') {
    next = '/account/reset-password'
  }
  
  const redirectUrl = new URL(requestUrl.origin + next)
  const errorUrl = new URL(requestUrl.origin + '/login')

  // Create SSR Supabase client with cookies for server-side auth exchange
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from Server Component — safe to ignore with middleware
          }
        },
      },
    }
  )

  // PRIORITY 1: Exchange auth code server-side (signup confirmation, magic link)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('Auth callback exchange error:', error.message)
      // PKCE verifier missing = user opened link on different browser/device
      // The email IS already confirmed by Supabase, so redirect to /auth/confirm
      // for a client-side fallback attempt, or to login with a helpful message
      if (error.message?.includes('code verifier') || error.message?.includes('PKCE')) {
        const confirmUrl = new URL(requestUrl.origin + '/auth/confirm')
        confirmUrl.searchParams.set('code', code)
        confirmUrl.searchParams.set('next', next)
        return NextResponse.redirect(confirmUrl)
      }
      errorUrl.searchParams.set('error', 'confirmation_failed')
      errorUrl.searchParams.set('error_description', error.message)
      return NextResponse.redirect(errorUrl)
    }
    return NextResponse.redirect(redirectUrl)
  }

  // PRIORITY 2: Verify OTP token_hash (recovery flow)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })
    if (error) {
      console.error('Auth callback OTP error:', error.message)
      errorUrl.searchParams.set('error', 'confirmation_failed')
      errorUrl.searchParams.set('error_description', error.message)
      return NextResponse.redirect(errorUrl)
    }
    return NextResponse.redirect(redirectUrl)
  }

  // FALLBACK: If there's an error_description in the URL, redirect to /auth/confirm for display
  if (requestUrl.searchParams.get('error_description')) {
    const confirmUrl = new URL(requestUrl.origin + '/auth/confirm')
    confirmUrl.searchParams.set('error_description', requestUrl.searchParams.get('error_description')!)
    return NextResponse.redirect(confirmUrl)
  }

  // No code or token_hash — redirect to login
  errorUrl.searchParams.set('error', 'missing_auth_params')
  return NextResponse.redirect(errorUrl)
}
