'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-[var(--border-color)] bg-[var(--bg-surface)] mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* BRAND */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6659F5] to-[#242447] dark:from-[#9188FF] dark:to-[#191D32] flex items-center justify-center text-white">
                <BookOpen size={16} />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-[#1F2238] dark:text-[#F5F6FF]">
                UY<span className="text-[#6659F5] dark:text-[#9188FF]">Novel</span>
              </span>
            </Link>
            <p className="text-sm text-[#565D75] dark:text-[#B1B7CD] leading-relaxed max-w-md">
              Platform modern dan minimalis untuk menemukan dan membaca webtoon, komik, dan novel secara nyaman dengan tipografi editorial yang ramah bagi mata.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#8E96AC] dark:text-[#7A829D] mt-1">
              <ShieldCheck size={14} className="text-[#059669] dark:text-[#34D399]" />
              <span>Sumber resmi & legal via Webtoons API</span>
            </div>
          </div>

          {/* EXPLORE LINKS */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1F2238] dark:text-[#F5F6FF]">
              Navigasi
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-[#565D75] dark:text-[#B1B7CD]">
              <li>
                <Link href="/" className="hover:text-[#6659F5] dark:hover:text-[#9188FF] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-[#6659F5] dark:hover:text-[#9188FF] transition-colors">
                  Jelajahi Cerita
                </Link>
              </li>
              <li>
                <Link href="/#trending" className="hover:text-[#6659F5] dark:hover:text-[#9188FF] transition-colors">
                  Trending Terkini
                </Link>
              </li>
              <li>
                <Link href="/#continue-reading" className="hover:text-[#6659F5] dark:hover:text-[#9188FF] transition-colors">
                  Lanjutkan Membaca
                </Link>
              </li>
            </ul>
          </div>

          {/* CREDITS & INFO */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1F2238] dark:text-[#F5F6FF]">
              Pengembang & Lisensi
            </h4>
            <p className="text-sm text-[#565D75] dark:text-[#B1B7CD] leading-relaxed">
              Didesain dan dikembangkan dengan presisi oleh{' '}
              <span className="font-semibold text-[#1F2238] dark:text-[#F5F6FF]">
                Akbar Iqbnu Prayoga
              </span>.
            </p>
            <p className="text-xs text-[#8E96AC] dark:text-[#7A829D] leading-relaxed">
              UYNovel menghargai hak cipta penerbit & kreator komik. Seluruh materi gambar dan teks adalah hak milik dari pencipta aslinya.
            </p>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E96AC] dark:text-[#7A829D]">
          <p>© 2026 UYNovel. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#565D75] dark:hover:text-[#B1B7CD] transition-colors">Modern Editorial Platform</span>
            <span>•</span>
            <span className="hover:text-[#565D75] dark:hover:text-[#B1B7CD] transition-colors">v2.0 Redesign</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
