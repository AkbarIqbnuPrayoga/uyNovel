'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, Play, BookOpen } from 'lucide-react';
import { getReadingHistory, ReadingHistoryItem } from '@/lib/storage';

export function ContinueReadingSection() {
  const [history, setHistory] = useState<ReadingHistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      setHistory(getReadingHistory());
    };
    update();
    window.addEventListener('uynovel-history-updated', update);
    return () => window.removeEventListener('uynovel-history-updated', update);
  }, []);

  if (!mounted || history.length === 0) {
    return null;
  }

  return (
    <section id="continue-reading" className="flex flex-col gap-4 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#EEECFF] dark:bg-[#1E233E] text-[#6659F5] dark:text-[#9188FF]">
            <History size={18} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1F2238] dark:text-[#F5F6FF]">
              Lanjutkan Membaca
            </h2>
            <p className="text-xs text-[#565D75] dark:text-[#B1B7CD]">
              Cerita yang baru saja Anda baca sebelumnya
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {history.slice(0, 3).map((item) => (
          <div
            key={item.url}
            className="flex items-center gap-3.5 p-3 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[#6659F5] dark:hover:border-[#9188FF] shadow-xs hover:shadow-md transition-all group"
          >
            {/* THUMB */}
            <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-[var(--bg-elevated)] shrink-0">
              {item.thumbnail ? (
                <img
                  src={`/api/image-proxy?url=${encodeURIComponent(item.thumbnail)}`}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen size={20} className="text-[#8E96AC] dark:text-[#7A829D] opacity-50" />
                </div>
              )}
            </div>

            {/* INFO */}
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[11px] font-semibold text-[#6659F5] dark:text-[#9188FF] uppercase tracking-wider">
                Bab #{item.episodeNo}
              </span>
              <h3 className="font-semibold text-sm text-[#1F2238] dark:text-[#F5F6FF] line-clamp-1 group-hover:text-[#6659F5] dark:group-hover:text-[#9188FF] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-[#8E96AC] dark:text-[#7A829D] line-clamp-1 mt-0.5">
                {item.episodeTitle || `Episode ${item.episodeNo}`}
              </p>

              <div className="pt-2 mt-auto">
                <Link
                  href={`/read?url=${encodeURIComponent(item.episodeUrl)}&series=${encodeURIComponent(item.url)}&title=${encodeURIComponent(item.title)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6659F5] dark:text-[#9188FF] hover:underline"
                >
                  <Play size={12} fill="currentColor" />
                  <span>Lanjutkan</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
