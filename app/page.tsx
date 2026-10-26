'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { HeroSection } from '@/components/home/HeroSection';
import { TrendingSection } from '@/components/home/TrendingSection';
import { ContinueReadingSection } from '@/components/home/ContinueReadingSection';

export default function Home() {
  const [featuredItem, setFeaturedItem] = useState<any>(null);

  useEffect(() => {
    fetch('/api/trending?day=trending')
      .then((res) => res.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setFeaturedItem(data.items[0]);
        }
      })
      .catch((err) => {
        console.error('Error fetching featured item:', err);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors pb-16 md:pb-0">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-8 sm:gap-10">
        {/* HERO SECTION */}
        <HeroSection featuredItem={featuredItem} />

        {/* CONTINUE READING (IF USER HAS HISTORY) */}
        <ContinueReadingSection />

        {/* TRENDING SECTION */}
        <TrendingSection />
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
