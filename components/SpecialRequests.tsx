"use client";

import { useTranslation } from './I18nContext';
import Link from 'next/link';

export default function SpecialRequests() {
    const { t } = useTranslation();

    return (
      <section className="bg-brand-gold py-16 text-center text-brand-dark">
         <h2 className="text-3xl font-display mb-6">{t('common.special_req_title')}</h2>
         <p className="mb-8 max-w-xl mx-auto">{t('common.special_req_desc')}</p>
         <Link href="/contact" className="inline-block border-2 border-brand-dark px-8 py-3 uppercase tracking-widest font-bold hover:bg-brand-dark hover:text-brand-gold transition-colors">
            {t('nav.contact')}
         </Link>
      </section>
    );
}
