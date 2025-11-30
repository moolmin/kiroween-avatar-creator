'use client';

import React, { useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

// Example data with real avatar images
const avatarExamples = [
  { id: 1, src: '/examples/avatar1.png', alt: 'Avatar example 1' },
  { id: 2, src: '/examples/avatar2.png', alt: 'Avatar example 2' },
  { id: 3, src: '/examples/avatar3.png', alt: 'Avatar example 3' },
  { id: 4, src: '/examples/avatar4.png', alt: 'Avatar example 4' },
  { id: 5, src: '/examples/avatar5.png', alt: 'Avatar example 5' },
  { id: 6, src: '/examples/avatar6.png', alt: 'Avatar example 6' },
];

export default function EmblaCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'center',
      containScroll: 'trimSnaps',
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Carousel viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {avatarExamples.map((example) => (
            <div
              key={example.id}
              className="flex-[0_0_100%] min-w-0 px-2"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto min-w-[160px] min-h-[160px] overflow-hidden rounded-lg">
                <Image 
                  src={example.src}
                  alt={example.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 300px"
                  priority
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-purple z-10"
        onClick={scrollPrev}
        aria-label="Previous avatar examples"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-purple z-10"
        onClick={scrollNext}
        aria-label="Next avatar examples"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}