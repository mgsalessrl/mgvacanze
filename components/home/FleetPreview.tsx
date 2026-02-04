import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface FleetPreviewProps {
  properties: Property[];
}

export default function FleetPreview({ properties }: FleetPreviewProps) {
  // Categorize
  const catamarans = properties.filter(p => 
    p.title.toLowerCase().includes('spirit') || p.title.toLowerCase().includes('dream')
  );
  const yachts = properties.filter(p => 
    p.title.toLowerCase().includes('breeze')
  );

  return (
    <div className="bg-gray-50 py-20">
      
      {/* Catamarans Section */}
      {catamarans.length > 0 && (
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-brand-dark uppercase tracking-widest">I Nostri Catamarani</h2>
            <div className="w-16 h-0.5 bg-brand-gold mx-auto mt-4"></div>
          </div>
          
          <div className="space-y-16">
            {catamarans.map((boat, index) => (
              <FleetCard key={boat.id} property={boat} reversed={index % 2 !== 0} subtitle="Catamarano di Charme" />
            ))}
          </div>
        </section>
      )}

      {/* Yachts Section */}
      {yachts.length > 0 && (
        <section className="container mx-auto px-4">
           {catamarans.length > 0 && <div className="border-t border-gray-200 my-16"></div>}
           <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-brand-dark uppercase tracking-widest">I Nostri Yacht</h2>
            <div className="w-16 h-0.5 bg-brand-gold mx-auto mt-4"></div>
          </div>

          <div className="space-y-16">
            {yachts.map((boat, index) => (
               <FleetCard key={boat.id} property={boat} reversed={index % 2 !== 0} subtitle="Yacht Esclusivo" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function FleetCard({ property, reversed, subtitle }: { property: Property; reversed: boolean; subtitle: string }) {
    // Helper to handle path logic
    const getPath = (img: string | null) => {
        if (!img) return '/placeholder.jpg';
        return img.startsWith('/') ? img : `/uploads/${img}`;
    };

    const displayImage = getPath(property.image);

    return (
        <div className={`flex flex-col ${reversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} bg-white shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300`}>
            <div className="lg:w-1/2 relative min-h-[400px] overflow-hidden">
                <Image 
                    src={displayImage}
                    alt={property.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
            </div>
            <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center text-center lg:text-left">
                <span className="text-brand-gold tracking-widest uppercase text-sm font-semibold mb-2">{subtitle}</span>
                <h3 className="font-display text-3xl mb-6 text-brand-dark">{property.title}</h3>
                
                <p className="text-gray-600 mb-8 leading-relaxed line-clamp-4">
                    {/* Use regex to strip HTML tags if description comes from rich text */}
                    {property.description?.replace(/<[^>]*>?/gm, '')}
                </p>

                <div className="grid grid-cols-3 gap-4 border-y border-gray-100 py-6 mb-8">
                    <div>
                        <span className="block text-2xl text-brand-dark font-display">{property.specs?.guests || '-'}</span>
                        <span className="text-xs text-gray-400 uppercase">Ospiti</span>
                    </div>
                    <div>
                        <span className="block text-2xl text-brand-dark font-display">{property.specs?.bedrooms || '-'}</span>
                        <span className="text-xs text-gray-400 uppercase">Cabine</span>
                    </div>
                    <div>
                        <span className="block text-2xl text-brand-dark font-display">{property.specs?.bathrooms || '-'}</span>
                        <span className="text-xs text-gray-400 uppercase">Bagni</span>
                    </div>
                </div>

                <div>
                    <Link 
                        href={`/property/${property.id}`} 
                        className="inline-flex items-center bg-brand-dark text-white px-8 py-3 uppercase tracking-widest text-sm font-semibold hover:bg-brand-gold transition-colors duration-300"
                    >
                        Dettagli <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
