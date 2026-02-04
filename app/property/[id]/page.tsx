import { supabase } from '@/lib/supabase';
import { Property } from '@/lib/types';
import { boatData } from '@/lib/boat_data';
import { notFound } from 'next/navigation';
import PropertyPageClient from '@/components/PropertyPageClient';
import { createClient } from '@/lib/supabase-server';

// Revalidate every hour
export const revalidate = 3600;

// Generate static params...
export async function generateStaticParams() {
  const { data: properties } = await supabase
    .from('properties')
    .select('id');

  return ((properties as any[]) || []).map((p) => ({
    id: p.id.toString(),
  }));
}

async function getProperty(id: string) {
  const { data: rawData, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', Number(id))
    .single();

  if (error || !rawData) return null;

  const data = rawData as any;

  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    price: data.price || 0,
    location: {
      city: data.city || '',
      address: data.address || '',
      lat: data.lat || 0,
      lng: data.lng || 0,
    },
    specs: {
      bedrooms: data.bedrooms || 0,
      bathrooms: data.bathrooms || 0,
      guests: data.guests || 0,
      area: data.area || 0,
    },
    technical_specs: (data.specs as Record<string, string>) || {},
    features: (data.features as string[]) || [],
    image: data.image_url,
    images: (data.images as string[]) || [],
    extra_options: (data.extra_options as any[]) || [],
  } as Property;
}

async function getGlobalExtras() {
    const supabaseServer = await createClient();
    const { data } = await supabaseServer
        .from('extras')
        .select('*')
        .order('price', { ascending: false });
    return (data || []) as any[];
}

async function getDiscounts() {
    const supabaseServer = await createClient();
    const { data } = await supabaseServer.from('discounts').select('*');
    return (data || []) as any[];
}

export default async function PropertyPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams?: Promise<{ slug?: string }> }) {
  const { id } = await params;
  const slug = (await searchParams)?.slug;
  
  const [property, globalExtras, discounts] = await Promise.all([
      getProperty(id),
      getGlobalExtras(),
      getDiscounts()
  ]);

  if (!property) {
    notFound();
  }

  // Override with manual boat data if available (for Standard Fleet pages)
  let boatKey: keyof typeof boatData | undefined;
  
  // Try using passed slug first, then fallback to title matching
  if (slug && slug in boatData) {
      boatKey = slug as keyof typeof boatData;
  } else if (property.title.toLowerCase().includes('pasqua') && property.title.toLowerCase().includes('dream')) {
      boatKey = 'pasqua-dream';
  } else if (property.title.toLowerCase().includes('pasqua') && property.title.toLowerCase().includes('spirit')) {
      boatKey = 'pasqua-spirit';
  } else if (property.title.toLowerCase().includes('pasqua') && property.title.toLowerCase().includes('breeze')) {
      boatKey = 'pasqua-breeze';
  } else if (property.title.toLowerCase().includes('elyvian dream')) {
      boatKey = 'elyvian-dream';
  } else if (property.title.toLowerCase().includes('elyvian spirit')) {
      boatKey = 'elyvian-spirit';
  } else if (property.title.toLowerCase().includes('elyvian breeze')) {
      boatKey = 'elyvian-breeze';
  }

  if (boatKey) {
       const bData = boatData[boatKey];
       property.description = bData.description;
       property.description_en = (bData as any).description_en;
       
       const { features, ...restSpecs } = bData.specs;
       property.technical_specs = restSpecs;
       
       // Combine features and included services for display
       property.features = [
           ...(features || []),
           ...(bData.servicesIncluded ? bData.servicesIncluded.map((s: string) => `Incluso: ${s}`) : [])
       ];

       // Override images if available in boatData
       if (bData.images && bData.images.length > 0) {
           property.images = bData.images.map((img: string) => `${bData.imagesPath}/${img}`);
       }
  }

  // Replace static extras with global dynamic extras
  if (globalExtras.length > 0) {
      property.extra_options = globalExtras.map(e => ({
          name: e.name,
          price: Number(e.price),
          type: 0,
          description: e.description
      }));
  }

  return <PropertyPageClient property={property} boatSlug={boatKey} discounts={discounts} />;
}
