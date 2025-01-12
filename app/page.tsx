'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { Features } from '@/components/Features';
import { UseCases } from '@/components/UseCases';
import { ProductHuntBadges } from '@/components/ProductHuntBadges';
import { FeatureShowcase } from '@/components/FeatureShowcase';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);
  

  return (
    <div className="min-h-screen relative flex flex-col" role="region" aria-label="Home page content">
      {/* Simplified Gradient Background */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[#0A0A0A]" />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-[#0A0A0A] to-[#0A0A0A]" />
      </div>

      {/* Content Container */}
      <div ref={scrollRef} className="relative z-10 flex-grow">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-[100]" role="navigation" aria-label="Main navigation">
          <div className="container mx-auto px-4 py-6">
            <div className="max-w-2xl mx-auto bg-[#141414] backdrop-blur-xl border border-white/5 rounded-full shadow-xl">
              <div className="px-8 py-3 flex items-center justify-between">
                <Link 
                  href="/" 
                  className="text-xl font-bold text-white hover:text-gray-200 transition-colors"
                >
                  UnderlayX
                </Link>
                <Navbar />
              </div>
            </div>
          </div>
        </nav>

        <main className="pt-24" role="main" aria-label="Main content">
          {/* Hero Section */}
          <section className="container mx-auto px-4 py-4 md:py-10"> {/* Changed from md:py-24 to md:py-16 */}
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h1 className="text-2xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Transform Your Images
                <br/>
                <span className="text-purple-400 md:mt-2 block">Like Never Before</span>
              </h1>
              <p className="text-sm md:text-lg text-gray-300 mb-8 max-w-xl mx-auto">
              The all-in-one tool to seamlessly add text and shapes behind images, remove backgrounds, clone objects, and change backgrounds.
              </p>
              <Link 
                href="/custom-editor"
                onClick={() => setIsLoading(true)}
                className="inline-flex items-center px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xl font-semibold transition-all"
              >
                {isLoading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Loading...
                  </>
                ) : (
                  "Start Creating"
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