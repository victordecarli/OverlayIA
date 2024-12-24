'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6">
          UnderlayX AI
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Create stunning visuals with text and shapes behind your images.
            Professional-grade effects for your creative projects.
          </p>
          <Link 
            href="/custom-editor" 
            onClick={() => setIsLoading(true)}
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white hover:bg-gray-100 disabled:bg-gray-200 text-black rounded-lg text-lg md:text-xl font-semibold transition-colors"
          >
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                Loading...
              </>
            ) : (
              'Start Creating'
            )}
          </Link>
        </motion.div>

        {/* Gallery Grid */}
        <div className="flex flex-col gap-2 md:gap-6 max-w-7xl mx-auto">
          {/* First Row */}
          <motion.div 
            style={{ y }}
            className="flex flex-col md:flex-row gap-2 md:gap-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full md:w-[70%] aspect-video md:h-[500px] relative overflow-hidden"
            >
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <Image
                  src="/images/journey.png"
                  alt="Landscape example"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 70vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 p-6">
                    <h3 className="text-white text-2xl font-bold">Transform Landscapes</h3>
                    <p className="text-gray-200">Add depth to your scenic shots</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full md:w-[30%] aspect-[3/4] md:h-[500px] relative overflow-hidden"
            >
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <Image
                  src="/images/pose.png"
                  alt="Portrait example"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 30vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 p-6">
                    <h3 className="text-white text-xl font-bold">Perfect Portraits</h3>
                    <p className="text-gray-200">Enhanced studio effects</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Second Row */}
          <motion.div 
            style={{ y }}
            className="flex flex-col md:flex-row gap-2 md:gap-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full md:w-[70%] aspect-video md:h-[500px] relative overflow-hidden"
            >
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <Image
                  src="/images/move.png"
                  alt="Journey example"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 70vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 p-6">
                    <h3 className="text-white text-2xl font-bold">Epic Journeys</h3>
                    <p className="text-gray-200">Create storytelling imagery</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full md:w-[30%] aspect-[3/4] md:h-[500px] relative overflow-hidden"
            >
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <Image
                  src="/images/star.png"
                  alt="Star example"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 30vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 p-6">
                    <h3 className="text-white text-xl font-bold">Stellar Effects</h3>
                    <p className="text-gray-200">Add magical elements</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>  );}