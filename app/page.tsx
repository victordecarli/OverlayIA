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
      {/* First Viewport Section */}
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 md:py-6 md:h-screen md:flex md:flex-col">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 md:mb-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              UnderlayX AI
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-6">
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

          {/* First Row Images */}
          <div className="flex flex-col gap-2 md:gap-6 max-w-7xl mx-auto md:flex-grow">
            <motion.div 
              style={{ y }}
              className="flex flex-col md:flex-row gap-2 md:gap-6 md:h-[calc(100vh-280px)]"
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full md:w-[70%] aspect-video md:h-full relative overflow-hidden group"
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
                className="w-full md:w-[30%] aspect-[3/4] md:h-full relative overflow-hidden group"
              >
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <Image
                    src="/images/star.png"
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
          </div>
        </div>
      </div>

      {/* Features Section with Background */}
      <div className="relative z-10 bg-black">
        <div className="container mx-auto px-4">
          <div className="py-12 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group p-6 md:p-8 rounded-2xl border border-gray-800 hover:border-gray-600 transition-colors bg-black/20 backdrop-blur-sm"
              >
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                  For Content Creators
                </h3>
                <h4 className="text-lg text-gray-300 font-semibold mb-3">
                  Effortlessly Create Stunning Visuals
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  Add shapes, text, and glow effects behind objects in your images to make captivating YouTube thumbnails, Instagram posts, and more. No design skills needed!
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="group p-6 md:p-8 rounded-2xl border border-gray-800 hover:border-gray-600 transition-colors bg-black/20 backdrop-blur-sm"
              >
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  For Marketers
                </h3>
                <h4 className="text-lg text-gray-300 font-semibold mb-3">
                  Boost Your Campaigns with Eye-Catching Graphics
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  Design high-quality visuals with custom fonts, colors, and styles to make your ads, banners, and promotional materials stand out instantly.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="group p-6 md:p-8 rounded-2xl border border-gray-800 hover:border-gray-600 transition-colors bg-black/20 backdrop-blur-sm"
              >
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                  For Photographers
                </h3>
                <h4 className="text-lg text-gray-300 font-semibold mb-3">
                  Enhance Your Photos with Creative Effects
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  Transform ordinary images into extraordinary works of art by placing text and shapes behind objects seamlessly using AI.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Business & Social Section */}
      <div className="min-h-screen md:h-screen flex items-center bg-black/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:h-[calc(100vh-120px)]">
            {/* Text Boxes */}
            <div className="w-full md:w-[70%] flex flex-col gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group p-6 md:p-8 rounded-2xl border border-gray-800 hover:border-gray-600 transition-colors bg-black/20 backdrop-blur-sm h-[calc(50%-8px)]"
              >
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                  For Businesses
                </h3>
                <h4 className="text-lg text-gray-300 font-semibold mb-3">
                  Create Professional-Grade Graphics in Minutes
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  Save time and money by designing logos, presentations, and promotional content with high-quality downloads and customizable tools.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="group p-6 md:p-8 rounded-2xl border border-gray-800 hover:border-gray-600 transition-colors bg-black/20 backdrop-blur-sm h-[calc(50%-8px)]"
              >
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-pink-400 transition-colors">
                  For Social Media Enthusiasts
                </h3>
                <h4 className="text-lg text-gray-300 font-semibold mb-3">
                  Stand Out on Every Platform
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  Design engaging content for Instagram, TikTok, Facebook, and more by effortlessly adding creative effects to your photos.
                </p>
              </motion.div>
            </div>

            {/* Pose Image */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full md:w-[30%] aspect-[3/4] md:h-full relative overflow-hidden group"
            >
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <Image
                  src="/images/pose.png"
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
          </div>
        </div>
      </div>

      {/* Artists & Students Section */}
      <div className="min-h-screen md:h-screen flex items-center bg-black/40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:h-[calc(100vh-120px)]">
            {/* Move Image */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full md:w-[70%] aspect-[16/9] md:h-full relative overflow-hidden group"
            >
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <Image
                  src="/images/move.png"
                  alt="Journey example"
                  fill
                  className="object-contain md:object-cover object-center hover:scale-105 transition-transform duration-700"
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

            {/* Text Boxes */}
            <div className="w-full md:w-[30%] flex flex-col gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group p-6 md:p-8 rounded-2xl border border-gray-800 hover:border-gray-600 transition-colors bg-black/20 backdrop-blur-sm h-[calc(50%-8px)]"
              >
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                  For Digital Artists
                </h3>
                <h4 className="text-lg text-gray-300 font-semibold mb-3">
                  Unleash Your Creativity with AI-Powered Tools
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  Experiment with colors, fonts, and effects to bring your artistic vision to life, all while running entirely on your device.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="group p-6 md:p-8 rounded-2xl border border-gray-800 hover:border-gray-600 transition-colors bg-black/20 backdrop-blur-sm h-[calc(50%-8px)]"
              >
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                  For Students & Educators
                </h3>
                <h4 className="text-lg text-gray-300 font-semibold mb-3">
                  Simplify Creative Projects
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  Easily design posters, presentations, and visual aids for school or teaching projects with innovative tools powered by AI.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Viewport Section */}
      
    </div>
  );
}