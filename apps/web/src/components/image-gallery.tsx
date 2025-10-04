'use client';

import { useState } from 'react';
import Image from 'next/image';

type ImageGalleryProps = {
  images: string[];
  alt: string;
};

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) return null;

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
      <div className="relative aspect-video bg-gray-50 border border-gray-200">
        <Image
          src={images[selectedIndex]}
          alt={`${alt} - Image ${selectedIndex + 1}`}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
        
        {/* Navigation arrows overlaid on main image */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 shadow-md"
              aria-label="Previous"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 shadow-md"
              aria-label="Next"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Indicator dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === selectedIndex 
                    ? 'bg-gray-800 w-6' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Scrollable thumbnail row below */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {images.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative flex-shrink-0 w-24 h-16 border-2 transition-all ${
                idx === selectedIndex
                  ? 'border-gray-900 opacity-100'
                  : 'border-gray-200 opacity-50 hover:opacity-75'
              }`}
            >
              <Image
                src={url}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
