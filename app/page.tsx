'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// const galleryImages = [
//   { src: '/gallery/1.jpg', alt: 'Example 1' },
//   { src: '/gallery/2.jpg', alt: 'Example 2' },
//   { src: '/gallery/3.jpg', alt: 'Example 3' },
//   { src: '/gallery/4.jpg', alt: 'Example 4' },
//   { src: '/gallery/5.jpg', alt: 'Example 5' },
//   { src: '/gallery/6.jpg', alt: 'Example 6' },
// ];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <h1 className="text-7xl font-bold text-white mb-6">
          UnderlayX
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Create stunning visuals with text and shapes behind your images.
            Professional-grade effects for your creative projects.
          </p>
          <Link 
            href="/custom-editor" 
            className="inline-block px-8 py-4 bg-white hover:bg-gray-100 text-black rounded-lg text-xl font-semibold transition-colors"
          >
            Start Creating
          </Link>
        </motion.div>

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-900"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
          ))}
        </div> */}
      </div>
    </div>
  );
}