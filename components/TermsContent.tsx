"use client";

import Link from 'next/link';
import { useTranslation } from '@/components/I18nContext';

export function TermsContent() {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl text-gray-800">
            <h1 className="text-3xl font-bold mb-8 font-display text-brand-dark">{t('terms.title')}</h1>
            
            <section className="mb-8">
                <p className="mb-4">
                    {t('terms.intro')}
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 font-display text-brand-dark">{t('terms.weekly_title')}</h2>
                <ul className="list-disc pl-5 space-y-2">
                    <li>{t('terms.checkin')}</li>
                </ul>
            </section>

             <section className="mb-8">
                 <h2 className="text-xl font-bold mb-4 font-display text-brand-dark">{t('terms.cancellation_title')}</h2>
                 <ul className="list-disc pl-5 space-y-2">
                    <li>{t('terms.cancel_50')}</li>
                    <li>{t('terms.cancel_100')}</li>
                 </ul>
            </section>
            
             <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 font-display text-brand-dark">{t('terms.weather_title')}</h2>
                 <p className="mb-4">
                  {t('terms.weather_text')}
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-bold mb-4 font-display text-brand-dark">{t('terms.damage_title')}</h2>
                <p className="mb-4">
                    {t('terms.damage_text_1')}
                </p>
                <p className="mb-4">
                    {t('terms.damage_text_2')}
                </p>
                <p className="mb-4 font-bold">{t('terms.lessee_label')}</p>
                 <ul className="list-disc pl-5 space-y-2">
                    <li>{t('terms.lessee_1')}</li>
                    <li>{t('terms.lessee_2')}</li>
                    <li>{t('terms.lessee_3')}</li>
                 </ul>
            </section>
            
             <div className="mt-8 pt-8 border-t">
                <Link href="/" className="text-brand-gold hover:underline">
                    &larr; {t('common.back_home')}
                </Link>
            </div>
        </div>
    )
}
