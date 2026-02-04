import { supabase } from '@/lib/supabase';
import { Property } from '@/lib/types';
import { boatData } from '@/lib/boat_data';
import { notFound } from 'next/navigation';
import PropertyPageClient from '@/components/PropertyPageClient';
import { createClient } from '@/lib/supabase-server';
import { seoConfig, getSeoMetadata } from '@/lib/seo-config';
import { Metadata } from 'next';

// ---------------------------------------------------------
// HELPER FUNCTIONS (Duplicated from Property Page for stability)
// ---------------------------------------------------------

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

// ---------------------------------------------------------
// SEO METADATA
// ---------------------------------------------------------

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams?: Promise<{ variant?: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const { variant } = (await searchParams) || {};
    
    // Check for Greece variant first
    if (variant === 'grecia') {
        // e.g., pasqua-grecia-elyvian-spirit -> key in seoConfig
        // But the incoming slug is 'pasqua-spirit' because of the Rewrite.
        // We construct the "virtual" key based on logic:
        // if slug is pasqua-spirit, try pasqua-grecia-elyvian-spirit
        // Map slug to SEO key for Greece
        const greeceMap: Record<string, string> = {
            'pasqua-spirit': 'pasqua-grecia-elyvian-spirit',
            'pasqua-dream': 'pasqua-grecia-elyvian-dream',
            'pasqua-breeze': 'pasqua-grecia-elyvian-breeze'
        };
        const seoKey = greeceMap[slug];
        if (seoKey && seoConfig[seoKey]) {
            return {
                title: seoConfig[seoKey].title,
                description: seoConfig[seoKey].description,
            };
        }
    }

    // Default (Italy / Weekly)
    let seoKey = slug;
    
    // Specific Mapping for Easter Italy URLs which map to short slugs
    // We used URL keys in seoConfig, but here we have the slug.
    // If slug is 'pasqua-spirit', map to 'pasqua-elyvian-spirit' key
    const italyMap: Record<string, string> = {
        'pasqua-spirit': 'pasqua-elyvian-spirit',
        'pasqua-dream': 'pasqua-elyvian-dream',
        'pasqua-breeze': 'pasqua-elyvian-breeze'
    };
    
    if (italyMap[slug]) seoKey = italyMap[slug];
    
    const meta = getSeoMetadata(seoKey);
    return {
        title: meta.title,
        description: meta.description
    };
}


// ---------------------------------------------------------
// MAIN PAGE COMPONENT
// ---------------------------------------------------------

export default async function BoatSlugPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams?: Promise<{ variant?: string }> }) {
  const { slug } = await params;
  
  // 1. Fetch Property by fuzzy title matching
  const titleMap: Record<string, string> = {
      'elyvian-breeze': 'Elyvian Breeze',
      'elyvian-spirit': 'Elyvian Spirit',
      'elyvian-dream': 'Elyvian Dream',
      'pasqua-dream': 'Elyvian Dream',
      'pasqua-spirit': 'Elyvian Spirit',
      'pasqua-breeze': 'Elyvian Breeze'
  };

  const searchTitle = titleMap[slug] || slug.replace(/-/g, ' ');

  // Fetch data in parallel
  const [propertiesResult, globalExtras, discounts] = await Promise.all([
      supabase.from('properties').select('*').ilike('title', `%${searchTitle}%`),
      getGlobalExtras(),
      getDiscounts()
  ]);

  if (propertiesResult.error || !propertiesResult.data || propertiesResult.data.length === 0) {
      return notFound();
  }

  // 2. Hydrate Property Object
  const data = propertiesResult.data[0] as any;
  const property: Property = {
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
  };

  // 3. Override with BoatData (Critical for Packages)
  let boatKey: keyof typeof boatData | undefined;
  if (slug && slug in boatData) {
      boatKey = slug as keyof typeof boatData;
  }

  if (boatKey) {
       const bData = boatData[boatKey];
       property.description = bData.description;
       property.description_en = (bData as any).description_en;
       
       const { features, ...restSpecs } = bData.specs;
       property.technical_specs = restSpecs;
       
       property.features = [
           ...(features || []),
           ...(bData.servicesIncluded ? bData.servicesIncluded.map((s: string) => s) : [])
       ];

       if (bData.images && bData.images.length > 0) {
           property.images = bData.images.map((img: string) => `${bData.imagesPath}/${img}`);
       }
  }

  // 4. Inject Global Extras
  if (globalExtras.length > 0) {
      property.extra_options = globalExtras.map(e => ({
          name: e.name,
          price: Number(e.price),
          type: 0,
          description: e.description
      }));
  }

  // 5. Render Client Component
  return <PropertyPageClient property={property} boatSlug={boatKey} discounts={discounts} />;
}
