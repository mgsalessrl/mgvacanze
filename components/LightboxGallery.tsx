'use client';

import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export interface GalleryImage {
  src: string;
  caption: string;
}

interface LightboxGalleryProps {
  images: (string | GalleryImage)[];
  title?: string;
}

export function LightboxGallery({ images, title }: LightboxGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Normalize images to GalleryImage format
  const normalizedImages: GalleryImage[] = useMemo(() => {
    if (!images || !Array.isArray(images)) return [];
    
    const normalized = images.map(img => {
      if (typeof img === 'string') {
          // Robust check for string URLs
          const src = img.trim();
          return {
              src: src.startsWith('/') || src.startsWith('http') ? src : `/uploads/${src}`,
              caption: title || ''
          };
      }
      return img;
    }).filter(img => img && img.src && img.src !== "");
    
    return normalized;
  }, [images, title]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % normalizedImages.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + normalizedImages.length) % normalizedImages.length);
  };

  if(!normalizedImages || normalizedImages.length === 0) return null;

  const lightboxContent = (
    <div 
        className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        onClick={closeLightbox}
    >
      {/* Close Button */}
      <button 
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 z-[110]"
        onClick={closeLightbox}
      >
        <X className="w-8 h-8" />
      </button>

      {/* Previous Button */}
      <button 
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2 z-[110] hidden md:block"
        onClick={prevImage}
      >
        <ChevronLeft className="w-10 h-10" />
      </button>

      {/* Next Button */}
      <button 
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-2 z-[110] hidden md:block"
        onClick={nextImage}
      >
        <ChevronRight className="w-10 h-10" />
      </button>

      {/* Main Image Container */}
      <div className="relative w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col items-center justify-center pointer-events-none" onClick={(e) => e.stopPropagation()}>
          <div className="relative w-full h-full flex-grow min-h-0 pointer-events-auto">
            <Image
                src={normalizedImages[currentIndex].src}
                alt={normalizedImages[currentIndex].caption}
                fill
                className="object-contain drop-shadow-2xl"
                priority
                quality={90}
                sizes="100vw"
            />
          </div>
          
          {/* Caption & Counter */}
          <div className="mt-4 text-center z-50 relative pointer-events-auto">
              <h3 className="text-white text-xl font-display mb-1 drop-shadow-md">{normalizedImages[currentIndex].caption}</h3>
              <span className="text-white/60 text-sm bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                {currentIndex + 1} / {normalizedImages.length}
              </span>
          </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {normalizedImages.map((img, i) => (
          <div 
            key={i} 
            className="relative aspect-video rounded-lg overflow-hidden shadow-sm bg-gray-100 group cursor-pointer"
            onClick={() => openLightbox(i)}
          >
            <Image
              src={img.src} 
              alt={img.caption || `Gallery image ${i + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {/* Caption Overlay on Hover */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <div className="text-center p-2">
                   <Maximize2 className="text-white w-8 h-8 mx-auto mb-2 drop-shadow-md" />
                   <p className="text-white font-medium text-sm drop-shadow-md">{img.caption}</p>
               </div>
            </div>
          </div>
        ))}
      </div>

      {isOpen && mounted && createPortal(lightboxContent, document.body)}
    </>
  );
}
