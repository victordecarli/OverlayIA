'use client';

import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    title: 'Text Behind Image',
    description: 'Place text behind objects seamlessly',
    image: '/1.webp',
    href: '/text-behind-image',
    altText: 'Example of text behind image effect' // Added unique alt text
  },
  {
    title: 'Shape Behind Image',
    description: 'Add shapes behind objects for depth',
    image: '/2.webp',
    href: '/shape-behind-image',
    altText: 'Demonstration of shapes placed behind objects'
  },
  {
    title: 'Clone Image',
    description: 'Clone and duplicate objects easily',
    image: '/3.webp',
    href: '/clone-image',
    altText: 'Example of cloned image elements'
  },
  {
    title: 'Change Background',
    description: 'Swap backgrounds instantly',
    image: '/4.webp',
    href: '/change-background',
    altText: 'Background replacement demonstration'
  }
];

export function FeatureShowcase() {
  return (
    <section className="py-4" aria-label="Feature examples">
      <div className="container mx-auto">
        <div className="max-w-7xl mx-auto overflow-hidden">
          <div className="flex overflow-x-auto gap-1 snap-x snap-mandatory hide-scrollbar px-4 md:px-0">
            {features.map((feature, index) => (
              <Link
                key={index}
                href={feature.href}
                className="flex-none w-[80vw] md:w-[25%] snap-start group"
              >
                <div className="relative max-h-[400px] md:max-h-[600px] w-full flex items-center rounded-2xl justify-center  overflow-hidden">
                  <Image
                    src={feature.image}
                    alt={feature.altText}
                    width={800}
                    height={800}
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-2xl transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 80vw, 25vw"
                    quality={100}
                    priority={index < 2}
                  />
                </div>
                <div className="text-center mt-1">
                  <p className="text-white/90 text-sm group-hover:text-purple-400 transition-colors">
                    {feature.title}
                  </p>
                </div>
              </Link>
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
