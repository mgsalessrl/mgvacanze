'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
    // In a real app we might return to state, but for simplicity we redirect with error param or throw
    // modifying this to return error to component is harder with just server action form action attribute
    // We will just redirect to /login?error=...
  }

  revalidatePath('/', 'layout')
  
  // Checking for redirect URL if we want to support it later, 
  // currently redirecting to account or dashboard based on role would be ideal but 
  // let's stick to Home or Dashboard.
  // The requirement says "Redirect to Home or Referrer".
  // We can't access referrer easily here without passing it.
  // Standard User flow -> /account or /
  // Admin flow -> /admin/dashboard
  
  // We can check role here or just redirect to /account which can show different things or just /
  redirect('/')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string
  const phone = formData.get('phone') as string

  if (password !== confirmPassword) {
    redirect('/login?error=' + encodeURIComponent("Le password non corrispondono") + '&mode=signup')
  }

  const supabase = await createClient()

  // Save phone and role in user_metadata
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        data: {
            phone: phone,
            role: 'user'
        }
    }
  })

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message) + '&mode=signup')
  }

  // If email confirmation is enabled, the user won't have a session yet.
  // We redirect to login with a success message instructing them to check email.
  redirect('/login?message=check_email&mode=login')
}
