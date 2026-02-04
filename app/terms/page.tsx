import Link from 'next/link';
import { Metadata } from 'next';

import { TermsContent } from '@/components/TermsContent';

export const metadata: Metadata = {
  title: 'Termini e Condizioni | MG Vacanze',
  description: 'Termini e condizioni per il noleggio di imbarcazioni con MG Vacanze.',
};

export default function TermsPage() {
    return <TermsContent />;
}