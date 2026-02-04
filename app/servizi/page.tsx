import { getSeoMetadata } from '@/lib/seo-config';
import ServicesPageClient from './ServicesClient';
import { Metadata } from 'next';

export const metadata: Metadata = getSeoMetadata('/servizi');

export default function ServicesPage() {
  return <ServicesPageClient />;
}
