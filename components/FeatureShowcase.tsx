'use client';

import Image from 'next/image';
import Link from 'next/link';

const bottle = [
  {
    title: 'Original Image',
    image: '/bottle1.webp',
    altText: 'Original bottle image'
  },
  {
    title: 'Add a new image behind the main one',
    image: '/bottle4.webp',
    altText: 'Bottle image with new image'
  },
  {
    title: 'Clone objects, resize them, and add text behind the image',
    image: '/bottle2.webp',
    href: '/clone-image',
    altText: 'Bottle image with cloned and resized objects'
  },
  {
    title: 'Change Background',
    image: '/bottle3.webp',
    href: '/change-background',
    altText: 'Bottle image with changed background'
  },
];

const human = [
  {
    title: 'Original Image',
    image: '/human1.webp',
    altText: 'Original human portrait'
  },
  {
    title: 'Clone images without changing the background',
    image: '/human4.webp',
    altText: 'human portrait with cloned images'
  },
  {
    title: 'Insert logos or images behind your image',
    image: '/human2.webp',
    altText: 'Human portrait with logos inserted behind'
  },
  {
    title: 'Place multiple images behind your main image',
    image: '/human3.webp',
    altText: 'Human portrait with multiple background images'
  },
];

export function FeatureShowcase() {
  return (
    <section className="py-2" aria-label="Feature examples">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Bottle showcase */}
          <div className="md:grid md:grid-cols-4 gap-2 md:gap-4 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar mb-8">
            {bottle.map((feature, index) => (
              <div
                key={index}
                className="flex-none w-[80vw] md:w-full snap-start"
              >
                <div className="relative max-h-[400px] md:max-h-[600px] w-full flex items-center justify-center rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b z-10 pointer-events-none" />
                  <Image
                    src={feature.image}
                    alt={feature.altText}
                    width={800}
                    height={800}
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-2xl"
                    sizes="(max-width: 768px) 80vw, 25vw"
                    quality={100}
                    priority={index < 2}
                  />
                </div>
                <div className="text-center mt-1">
                  <p className="text-white/70 text-xs">
                    {feature.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Human showcase */}
          <div className="md:grid md:grid-cols-4 gap-2 md:gap-4 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar">
            {human.map((feature, index) => (
              <div
                key={index}
                className="flex-none w-[80vw] md:w-full snap-start"
              >
                <div className="relative max-h-[400px] md:max-h-[600px] w-full flex items-center justify-center rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b z-10 pointer-events-none" />
                  <Image
                    src={feature.image}
                    alt={feature.altText}
                    width={800}
                    height={800}
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-2xl"
                    sizes="(max-width: 768px) 80vw, 25vw"
                    quality={100}
                    priority={index < 2}
                  />
                </div>
                <div className="text-center mt-1">
                  <p className="text-white/70 text-xs">
                    {feature.title}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile scroll indicator */}
          <div className="md:hidden text-center text-white/40 text-xs mt-2">
            Scroll to see more →
          </div>
        </div>
      </div>

      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
