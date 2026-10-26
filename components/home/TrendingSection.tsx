'use client';

import React, { useState, useEffect } from 'react';
import { Flame, RefreshCw, AlertCircle } from 'lucide-react';
import { SeriesCard } from '@/components/series/SeriesCard';

const DAY_FILTERS = [
  { id: 'trending', label: 'Hari Ini' },
  { id: 'monday', label: 'Senin' },
  { id: 'tuesday', label: 'Selasa' },
  { id: 'wednesday', label: 'Rabu' },
  { id: 'thursday', label: 'Kamis' },
  { id: 'friday', label: 'Jumat' },
  { id: 'saturday', label: 'Sabtu' },
  { id: 'sunday', label: 'Minggu' },
  { id: 'completed', label: 'Tamat' },
];

export function TrendingSection() {
  const [activeFilter, setActiveFilter] = useState('trending');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrending = (day: string) => {
    setLoading(true);
    setError(null);
    fetch(`/api/trending?day=${encodeURIComponent(day)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Gagal memuat data trending');
        return res.json();
      })
      .then((data) => {
        setItems(data.items || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Tidak dapat memuat judul trending saat ini.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTrending(activeFilter);
  }, [activeFilter]);

  return (
    <section id="trending" className="flex flex-col gap-6 pt-6">
      
      {/* SECTION HEADER & TABS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border-color)] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-[#EEECFF] dark:bg-[#1E233E] text-[#6659F5] dark:text-[#9188FF]">
              <Flame size={18} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2238] dark:text-[#F5F6FF] tracking-tight">
              Trending Sekarang
            </h2>
          </div>
          <p className="text-sm text-[#565D75] dark:text-[#B1B7CD]">
            Koleksi cerita terpopuler yang sedang banyak dibaca saat ini.
          </p>
        </div>

        {/* DAY FILTER CHIPS */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {DAY_FILTERS.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#6659F5] text-white shadow-xs dark:bg-[#9188FF] dark:text-[#101221]'
                    : 'bg-[var(--bg-surface)] text-[#565D75] dark:text-[#B1B7CD] hover:text-[#1F2238] dark:hover:text-[#F5F6FF] hover:bg-[#EEECFF] dark:hover:bg-[#222741] border border-[var(--border-color)]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENT GRID / STATES */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] overflow-hidden animate-pulse"
            >
              <div className="aspect-[3/4] bg-[var(--bg-elevated)]" />
              <div className="p-3.5 flex flex-col gap-2">
                <div className="h-4 w-3/4 bg-[var(--bg-elevated)] rounded" />
                <div className="h-3 w-1/2 bg-[var(--bg-elevated)] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 sm:p-12 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-center flex flex-col items-center justify-center gap-3">
          <AlertCircle size={32} className="text-[#6659F5] dark:text-[#9188FF] opacity-80" />
          <h3 className="text-base font-semibold text-[#1F2238] dark:text-[#F5F6FF]">
            Belum dapat memuat trending
          </h3>
          <p className="text-xs text-[#565D75] dark:text-[#B1B7CD] max-w-sm">
            {error} Silakan periksa koneksi internet Anda atau coba muat ulang.
          </p>
          <button
            onClick={() => fetchTrending(activeFilter)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6659F5] text-white text-xs font-medium hover:bg-[#5547E8] transition-colors mt-2"
          >
            <RefreshCw size={14} />
            <span>Coba Lagi</span>
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-center flex flex-col items-center justify-center gap-2">
          <p className="text-sm font-medium text-[#1F2238] dark:text-[#F5F6FF]">
            Tidak ada cerita trending untuk kategori ini.
          </p>
          <p className="text-xs text-[#565D75] dark:text-[#B1B7CD] max-w-sm">
            Coba pilih hari lain atau gunakan fitur pencarian untuk menemukan judul favorit Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {items.map((item, idx) => (
            <SeriesCard
              key={`${item.titleNo}-${idx}`}
              title={item.title}
              url={item.url}
              thumbnail={item.thumbnail}
              genre={item.genre}
              likes={item.likes}
              rank={idx + 1}
              isPriority={idx < 5}
            />
          ))}
        </div>
      )}
    </section>
  );
}
