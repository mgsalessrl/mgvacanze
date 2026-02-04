export type Property = {
  id: number;
  title: string;
  description: string;
  price: number;
  location: {
    city: string;
    address: string;
    lat: number;
    lng: number;
  };
  specs: {
    bedrooms: number;
    bathrooms: number;
    guests: number;
    area: number;
  };
  technical_specs?: Record<string, string>; // From JSONB
  features?: string[]; // From JSONB/Array
  // I18n Extensions
  description_en?: string;
  image: string | null;
  images?: string[]; // Gallery
  extra_options?: {
    name: string;
    price: number;
    type: number;
  }[];
};

export interface ExtraService {
  id: string;
  label: string;
  price: number;
  type: 'toggle' | 'counter';
  maxLimitRule?: 'fixed' | 'guests' | 'cabins';
  maxQuantity?: number; // if fixed
}

export type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  published_at: string;
  status: 'draft' | 'published' | 'archived';
};
