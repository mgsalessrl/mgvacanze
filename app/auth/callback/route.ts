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
  
  // Clean URL for redirect (remove sensitive params)
  const redirectUrl = new URL(requestUrl.origin + next)
  
  // Ensure we don't carry over auth params
  // Note: searchParams is an iterator, so we can't delete while iterating easily if we want to be safe, 
  // but creating a new URL ensures we start clean if we only append what we want. 
  // Actually, 'next' might have query params? 
  // Usually 'next' is just a path. If it has params, we usually append them.
  // Let's stick to the simpler redirectUrl construction:
  // We utilize the 'next' parameter as the path.
  
  const errorUrl = new URL(requestUrl.origin + '/login')

  // MODIFICA RADICALE CLIENT-SIDE FIX:
  // Invece di scambiare il token qui (che fallisce coi cookie in redirect),
  // passiamo la palla a una pagina client-side che farà il lavoro sporco.
  
  const confirmUrl = new URL(requestUrl.origin + '/auth/confirm')
  
  if (code) confirmUrl.searchParams.set('code', code)
  if (next) confirmUrl.searchParams.set('next', next)
  if (token_hash) confirmUrl.searchParams.set('token_hash', token_hash)
  if (type) confirmUrl.searchParams.set('type', type)
  if (requestUrl.searchParams.get('error_description')) {
      confirmUrl.searchParams.set('error_description', requestUrl.searchParams.get('error_description')!)
  }

  return NextResponse.redirect(confirmUrl)

  /* CODICE PRECEDENTE DISABILITATO PER DEBUG COOKIE LOCALHOST
  const cookieStore = await cookies()
  ...
  */
}
