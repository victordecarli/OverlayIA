'use client';

import Image from 'next/image';

const features = [
  {
    title: 'Text Behind Image',
    description: 'Place text behind objects seamlessly',
    image: '/1.webp'
  },
  {
    title: 'Shape Behind Image',
    description: 'Add shapes behind objects for depth',
    image: '/1.webp'
  },
  {
    title: 'Clone Image',
    description: 'Clone and duplicate objects easily',
    image: '/1.webp'
  },
  {
    title: 'Change Background',
    description: 'Swap backgrounds instantly',
    image: '/1.webp'
  }
];

export function FeatureShowcase() {
  return (
    <section className="py-4">
      <div className="container mx-auto">
        <div className="max-w-7xl mx-auto overflow-hidden">
          {/* Centered scrolling container */}
          <div className="flex overflow-x-auto gap-0 snap-x snap-mandatory hide-scrollbar justify-center">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex-none w-[80vw] md:w-[25%] snap-start px-0.5 first:ml-auto last:mr-auto"
              >
                {/* Image Container - Added rounded corners */}
                <div className="relative max-h-[400px] md:max-h-[600px] w-full flex items-center justify-center rounded-2xl overflow-hidden"> {/* Added max-h-[400px] for mobile */}
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={800}
                    height={800}
                    className="max-w-full max-h-full w-auto h-auto object-contain rounded-2xl"
                    sizes="(max-width: 768px) 80vw, 25vw" // Updated sizes
                    quality={100}
                    priority={index < 2}
                  />
                </div>
                <div className="text-center mt-1">
                  <h3 className="text-white/90 text-sm">
                    {feature.title}
                  </h3>
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
