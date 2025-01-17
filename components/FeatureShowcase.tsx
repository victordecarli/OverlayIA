'use client';

import Image from 'next/image';

const bottle = [
  {
    title: 'Original Image',
    description: 'Place text behind objects seamlessly',
    image: '/bottle1.webp',
    altText: 'Original bottle image'
  },
  {
    title: 'Clone objects, resize them, and add text behind the image',
    description: 'Clone and duplicate objects easily',
    image: '/bottle2.webp',
    href: '/clone-image',
    altText: 'Bottle image with cloned and resized objects'
  },
  {
    title: 'Change Background',
    description: 'Swap backgrounds instantly',
    image: '/bottle3.webp',
    href: '/change-background',
    altText: 'Bottle image with changed background'
  },
];

const human = [
  {
    title: 'Original Image',
    description: 'Place text behind objects seamlessly',
    image: '/human1.webp',
    altText: 'Original human portrait'
  },
  {
    title: 'Insert logos or images behind your image',
    description: 'Clone and duplicate objects easily',
    image: '/human2.webp',
    altText: 'Human portrait with logos inserted behind'
  },
  {
    title: 'Place multiple images behind your main image',
    description: 'Swap backgrounds instantly',
    image: '/human3.webp',
    altText: 'Human portrait with multiple background images'
  },
];

export function FeatureShowcase() {
  return (
    <section className="py-2" aria-label="Feature examples">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="md:grid md:grid-cols-3 gap-4 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar mb-4">
            {bottle.map((feature, index) => (
              <div key={index} className="w-full flex-shrink-0 snap-center">
                <div className="text-center mb-6">
                  <p className="text-white/50 text-sm group-hover:text-purple-400 transition-colors">
                    {feature.title}
                  </p>
                </div>
                <div className="relative h-[400px] md:h-[600px] w-full flex items-center justify-center rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b z-10 pointer-events-none" />
                  <Image
                    src={feature.image}
                    alt={feature.altText}
                    width={800}
                    height={800}
                    className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 80vw, 33vw"
                    quality={100}
                    priority={index < 2}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Mobile scroll indicator - only show on mobile */}
          <div className="md:hidden text-center text-white/40 text-xs mt-2 mb-6">
            Scroll to see more →
          </div>
          <div className="md:grid md:grid-cols-3 gap-4 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar mb-4">
            {human.map((feature, index) => (
              <div key={index} className="w-full flex-shrink-0 snap-center">
                <div className="text-center mt-1">
                  <p className="text-white/50 text-sm group-hover:text-purple-400 transition-colors mb-4">
                    {feature.title}
                  </p>
                </div>
                <div className="relative h-[400px] md:h-[600px] w-full flex items-center justify-center rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b z-10 pointer-events-none" />
                  <Image
                    src={feature.image}
                    alt={feature.altText}
                    width={800}
                    height={800}
                    className="w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 80vw, 33vw"
                    quality={100}
                    priority={index < 2}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Mobile scroll indicator - only show on mobile */}
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
