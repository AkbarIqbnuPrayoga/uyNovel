'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Compass, Flame, Sparkles, BookOpen, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  featuredItem?: {
    title: string;
    url: string;
    thumbnail: string | null;
    genre?: string | null;
    likes?: string | null;
  } | null;
}

export function HeroSection({ featuredItem }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#EEECFF] via-[#F7F8FC] to-[#FFFFFF] dark:from-[#191D32] dark:via-[#131627] dark:to-[#101221] border border-[var(--border-color)] p-6 sm:p-10 shadow-xs transition-colors duration-300">
      {/* BACKGROUND DECORATIVE GLOW */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#C5BEFF]/40 dark:bg-[#6659F5]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#6659F5]/15 dark:bg-[#9188FF]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* TEXT CONTENT */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-[#222741]/90 border border-[#C5BEFF] dark:border-[#9188FF]/30 text-xs font-semibold text-[#6659F5] dark:text-[#C5BEFF] w-fit shadow-2xs backdrop-blur-md">
            <Sparkles size={14} />
            <span>Digital Editorial Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#1F2238] dark:text-[#F5F6FF] leading-[1.15]">
            Temukan cerita favorit berikutnya.
          </h1>

          <p className="text-sm sm:text-base text-[#565D75] dark:text-[#B1B7CD] leading-relaxed max-w-xl">
            Jelajahi webtoon, manga, dan komik pilihan dengan pengalaman membaca editorial yang bersih, nyaman di mata, dan dirancang untuk kenyamanan jangka panjang.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6659F5] hover:bg-[#5547E8] text-white font-medium text-sm shadow-sm shadow-[#6659F5]/25 hover:shadow-md transition-all duration-200"
            >
              <Compass size={16} />
              <span>Jelajahi Cerita</span>
            </Link>

            <a
              href="#trending"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-[#191D32] hover:bg-[#EEECFF] dark:hover:bg-[#222741] border border-[var(--border-color)] text-[#1F2238] dark:text-[#F5F6FF] font-medium text-sm transition-colors"
            >
              <Flame size={16} className="text-[#6659F5] dark:text-[#9188FF]" />
              <span>Lihat Trending</span>
            </a>
          </div>
        </div>

        {/* FEATURED SPOTLIGHT CARD (IF AVAILABLE) */}
        {featuredItem ? (
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <Link
              href={`/detail?url=${encodeURIComponent(featuredItem.url)}&thumb=${encodeURIComponent(featuredItem.thumbnail || '')}&title=${encodeURIComponent(featuredItem.title || '')}`}
              className="group relative w-full max-w-xs bg-white dark:bg-[#191D32] rounded-2xl border border-[var(--border-color)] p-3.5 shadow-md hover:shadow-xl hover:border-[#6659F5] dark:hover:border-[#9188FF] transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[var(--bg-elevated)]">
                {featuredItem.thumbnail ? (
                  <img
                    src={`/api/image-proxy?url=${encodeURIComponent(featuredItem.thumbnail)}`}
                    alt={featuredItem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen size={40} className="text-[var(--text-muted)] opacity-40" />
                  </div>
                )}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#6659F5] text-white shadow-xs">
                  Sorotan Hari Ini
                </div>
              </div>

              <div className="pt-3 px-1 flex flex-col gap-1">
                <h3 className="font-bold text-base text-[#1F2238] dark:text-[#F5F6FF] group-hover:text-[#6659F5] dark:group-hover:text-[#9188FF] transition-colors line-clamp-2">
                  {featuredItem.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-[#565D75] dark:text-[#B1B7CD] pt-1">
                  <span>Mulai Membaca</span>
                  <ArrowRight size={14} className="text-[#6659F5] dark:text-[#9188FF] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        ) : null}

      </div>
    </section>
  );
}
