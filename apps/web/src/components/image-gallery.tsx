'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';

type ImageGalleryProps = {
  images: string[];
  alt: string;
};

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="not-prose my-8">
        <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
          <ImageIcon className="w-24 h-24 text-gray-400" />
        </div>
      </div>
    );
  }

  const handlePrevious = () => {
    setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
  };

  const handleNext = () => {
    setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  return (
    <div className="not-prose my-8" onKeyDown={handleKeyDown} tabIndex={0}>
      {/* Main carousel display */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-xl border border-gray-200">
        <Image
          src={images[selectedIndex]}
          alt={`${alt} - Bild ${selectedIndex + 1}`}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
        
        {/* Image counter badge */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/70 text-white text-sm font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
        
        {/* Navigation arrows overlaid on main image */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 p-3 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-110 group"
              aria-label="Vorheriges Bild"
            >
              <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 p-3 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-110 group"
              aria-label="Nächstes Bild"
            >
              <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </>
        )}

        {/* Indicator dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 px-3 py-2 rounded-full backdrop-blur-sm">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`rounded-full transition-all ${
                  idx === selectedIndex 
                    ? 'bg-white w-8 h-2.5' 
                    : 'bg-white/50 hover:bg-white/75 w-2.5 h-2.5'
                }`}
                aria-label={`Zu Bild ${idx + 1} gehen`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Scrollable thumbnail row below */}
      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {images.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative flex-shrink-0 w-28 h-20 rounded-xl overflow-hidden border-3 transition-all ${
                idx === selectedIndex
                  ? 'border-emerald-600 shadow-lg ring-2 ring-emerald-200 scale-105'
                  : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-emerald-400 hover:shadow-md'
              }`}
            >
              <Image
                src={url}
                alt={`Vorschau ${idx + 1}`}
                fill
                sizes="112px"
                className="object-cover"
              />
              {idx === selectedIndex && (
                <div className="absolute inset-0 bg-emerald-600/20 pointer-events-none" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
