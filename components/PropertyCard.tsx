"use client";

import Image from 'next/image';
import { Property } from '../lib/types';
import Link from 'next/link';
import { useTranslation } from './I18nContext';

export default function PropertyCard({ property }: { property: Property }) {
  const { t } = useTranslation();
  const imageUrl = property.image?.startsWith('/') 
    ? property.image 
    : (property.image ? `/uploads/${property.image}` : '/placeholder.jpg');

  // Determine SEO URL
  let href = `/property/${property.id}`;
  const lowerTitle = property.title.toLowerCase();
  
  if (lowerTitle.includes('spirit') && !lowerTitle.includes('pasqua')) {
      href = '/noleggio-catamarano/elyvian-spirit';
  } else if (lowerTitle.includes('dream') && !lowerTitle.includes('pasqua')) {
      href = '/noleggio-catamarano/elyvian-dream';
  } else if (lowerTitle.includes('breeze') && !lowerTitle.includes('pasqua')) {
      href = '/noleggio-yacht/elyvian-breeze';
  } else if (lowerTitle.includes('pasqua')) {
      // Map Easter packages if they are separate properties in DB
      if (lowerTitle.includes('spirit')) href = '/pasqua-elyvian-spirit';
      else if (lowerTitle.includes('dream')) href = '/pasqua-elyvian-dream';
      else if (lowerTitle.includes('breeze')) href = '/pasqua-elyvian-breeze';
  }

  return (
    <Link href={href} className="group block border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white text-gray-900">
      <div className="relative h-48 w-full bg-gray-200">
        {property.image ? (
            <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        ) : (
            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 truncate group-hover:text-brand-gold transition-colors font-display">{property.title}</h3>
        <p className="text-sm text-gray-600 mb-2 truncate">{property.location.city}</p>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
            <span>{property.specs.guests} {t('boat.guests')}</span>
            <span>{property.specs.bedrooms} {t('boat.cabins')}</span>
            <span>{property.specs.bathrooms} {t('boat.bathrooms')}</span>
        </div>
        <div className="flex justify-between items-center">
            <span className="text-brand-dark font-bold text-xl">
                {property.price > 0 ? `€${property.price}` : t('fleet.price_contact')}
            </span>
            <span className="bg-brand-dark text-white px-4 py-2 rounded text-sm group-hover:bg-brand-gold group-hover:text-white transition-colors">
                {t('fleet.details_btn')}
            </span>
        </div>
      </div>
    </Link>
  );
}
