'use server'

import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password) {
    return { error: 'La password è obbligatoria' }
  }

  if (password !== confirmPassword) {
    return { error: 'Le password non coincidono' }
  }

  const supabase = await createClient()

  // Controllo sessione
  // Usiamo getUser() invece di getSession() per essere sicuri che il token sia valido lato server
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (!user || userError) {
      console.error('UpdatePassword: User not found or error.', userError)
      return { error: 'Sessione scaduta. Riprova il login tramite il link email.' }
  }

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    console.error('Update Password Error:', error)
    return { error: error.message }
  }

  redirect('/account')
}
