'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';
import { Footer } from '@/components/Footer';
import { NavDropdown } from '@/components/NavDropdown';
import { Features } from '@/components/Features';
import { UseCases } from '@/components/UseCases';
import { ProductHuntBadges } from '@/components/ProductHuntBadges';
import { FeatureShowcase } from '@/components/FeatureShowcase';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"],
    layoutEffect: false
  });

  return (
    <div className="min-h-screen relative flex flex-col" style={{ position: 'relative' }}>
      {/* Simplified Gradient Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#0A0A0A]" />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-[#0A0A0A] to-[#0A0A0A]" />
      </div>

      {/* Content Container */}
      <div ref={scrollRef} className="relative z-10 flex-grow">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-[100]">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-2xl mx-auto bg-[#141414] backdrop-blur-xl border border-white/5 rounded-full shadow-xl">
              <div className="px-8 py-3 flex items-center justify-between">
                <Link 
                  href="/" 
                  className="text-xl font-bold text-white hover:text-gray-200 transition-colors"
                >
                  UnderlayX
                </Link>
                <NavDropdown />
              </div>
            </div>
          </div>
        </nav>

        <main className="pt-24">
          {/* Hero Section */}
          <section className="container mx-auto px-4 py-16 md:py-16"> {/* Changed from md:py-24 to md:py-16 */}
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Transform Your Images
                <br />
                <span className="text-purple-400">Like Never Before</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                The ultimate tool to place text and shapes behind images, remove backgrounds, clone objects, change backgrounds, and create stunning glowing effects effortlessly.
              </p>
              <Link 
                href="/custom-editor" 
                onClick={() => setIsLoading(true)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xl font-semibold transition-all"
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Loading...
                  </>
                ) : (
                  "Start Creating for Free"
                )}
              </Link>
            </div>
          </section>

          {/* Feature Showcase */}
          <FeatureShowcase />

          {/* Features, Use Cases, and Product Hunt Badges */}
          <Features />
          <UseCases />
          <ProductHuntBadges />

          <Footer />
        </main>
      </div>
    </div>
  );
}