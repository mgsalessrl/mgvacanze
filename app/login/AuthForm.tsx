'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useTranslation } from '@/components/I18nContext'

export default function AuthForm() {
    const { t } = useTranslation()
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const message = searchParams.get('message')
    const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login'
    
    const [mode, setMode] = useState<'login' | 'signup'>(initialMode)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        try {
            if (mode === 'login') {
                await login(formData)
            } else {
                await signup(formData)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
            <div className="flex mb-8 border-b">
                <button
                    onClick={() => setMode('login')}
                    className={`flex-1 pb-4 text-sm font-medium transition-colors relative ${
                        mode === 'login' ? 'text-brand-dark' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    {t('auth.login_tab')}
                    {mode === 'login' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-gold animate-in fade-in zoom-in duration-300" />
                    )}
                </button>
                <button
                    onClick={() => setMode('signup')}
                    className={`flex-1 pb-4 text-sm font-medium transition-colors relative ${
                        mode === 'signup' ? 'text-brand-dark' : 'text-gray-400 hover:text-gray-600'
                    }`}
                >
                    {t('auth.signup_tab')}
                    {mode === 'signup' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-gold animate-in fade-in zoom-in duration-300" />
                    )}
                </button>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-display text-brand-dark mb-2">
                    {mode === 'login' ? t('auth.welcome_back') : t('auth.create_account')}
                </h2>
                <p className="text-gray-500 text-sm">
                    {mode === 'login' ? t('auth.login_desc') : t('auth.signup_desc')}
                </p>
            </div>

            {message === 'check_email' && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-md text-sm flex flex-col items-center text-center">
                    <p className="font-bold mb-1">{t('auth.success_title')}</p>
                    <p>{t('auth.success_msg')}</p>
                </div>
            )}

            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t('auth.email_label')}</label>
                    <input 
                        id="email"
                        name="email" 
                        type="email" 
                        autoComplete="email"
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all"
                        placeholder={t('auth.email_placeholder')}
                    />
                </div>

                {mode === 'signup' && (
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">{t('auth.phone_label')}</label>
                        <input 
                            id="phone"
                            name="phone" 
                            type="tel" 
                            autoComplete="tel"
                            required 
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all"
                            placeholder={t('auth.phone_placeholder')}
                        />
                    </div>
                )}

                <div className="relative">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">{t('auth.password_label')}</label>
                    <input 
                        id="password"
                        name="password" 
                        type={showPassword ? "text" : "password"}
                        autoComplete={mode === 'login' ? "current-password" : "new-password"}
                        required 
                        className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all pr-10"
                        placeholder={t('auth.password_placeholder')}
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {mode === 'signup' && (
                     <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">{t('auth.confirm_password_label')}</label>
                        <input 
                            id="confirmPassword"
                            name="confirmPassword" 
                            type="password"
                            autoComplete="new-password"
                            required 
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:ring-1 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all"
                            placeholder={t('auth.password_placeholder')}
                        />
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-brand-dark text-white py-3 rounded-sm font-medium uppercase tracking-wider hover:bg-brand-dark/90 transition-colors flex items-center justify-center"
                >
                    {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (mode === 'login' ? t('auth.login_btn') : t('auth.signup_btn'))}
                </button>
            </form>
            
            {mode === 'login' && (
                 <div className="mt-4 text-center">
                    <Link href="/auth/forgot-password" className="text-sm text-gray-500 hover:text-brand-gold transition-colors">
                        {t('auth.forgot_password')}
                    </Link>
                </div>
            )}
        </div>
    )
}
