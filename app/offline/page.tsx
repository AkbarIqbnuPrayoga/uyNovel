'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { WifiOff, RotateCcw, Home, Bookmark, BookOpen, Compass } from 'lucide-react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setChecking(true);
    setTimeout(() => {
      if (navigator.onLine) {
        window.location.href = '/';
      } else {
        setChecking(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-main)] text-[var(--text-primary)] px-4 py-12 transition-colors relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#6659F5]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full text-center flex flex-col items-center relative z-10">
        
        {/* Brand Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6659F5] to-[#242447] dark:from-[#9188FF] dark:to-[#191D32] flex items-center justify-center text-white mb-8 shadow-xl shadow-[#6659F5]/20">
          <BookOpen size={28} />
        </div>

        {/* Offline Badge & Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-center shadow-md">
            <WifiOff size={40} className="text-[#8E96AC] dark:text-[#7A829D]" />
          </div>
          <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 flex items-center gap-1.5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-ping" />
            Offline
          </div>
        </div>

        {/* Headings */}
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1F2238] dark:text-[#F5F6FF] mb-3">
          Koneksi Internet Terputus
        </h1>
        <p className="text-sm text-[#565D75] dark:text-[#B1B7CD] leading-relaxed mb-8">
          Perangkat Anda tidak terhubung ke jaringan internet. UYNovel tetap dapat dibuka, dan Anda dapat mengakses fitur yang sudah tersimpan di cache.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs mb-8">
          <button
            onClick={handleRetry}
            disabled={checking}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#6659F5] hover:bg-[#5547E8] text-white font-semibold text-sm shadow-md shadow-[#6659F5]/25 transition-all cursor-pointer active:scale-95 disabled:opacity-60"
          >
            <RotateCcw size={16} className={checking ? 'animate-spin' : ''} />
            <span>{checking ? 'Memeriksa Jaringan...' : 'Coba Muat Ulang'}</span>
          </button>
          
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-color)] text-[#1F2238] dark:text-[#F5F6FF] font-semibold text-sm transition-all"
          >
            <Home size={16} />
            <span>Ke Beranda</span>
          </Link>
        </div>

        {/* Offline tips */}
        <div className="w-full bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl p-4 text-left">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8E96AC] dark:text-[#7A829D] mb-2.5">
            Tips Membaca Offline:
          </h3>
          <ul className="text-xs text-[#565D75] dark:text-[#B1B7CD] space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6659F5] dark:bg-[#9188FF] mt-1.5 shrink-0" />
              <span>Buka kembali halaman yang sebelumnya telah Anda baca saat online.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6659F5] dark:bg-[#9188FF] mt-1.5 shrink-0" />
              <span>Daftar tersimpan (Bookmark) dan riwayat tetap aman di penyimpanan lokal Anda.</span>
            </li>
          </ul>
        </div>

        {/* App Footer Info */}
        <p className="text-[11px] text-[#8E96AC] dark:text-[#7A829D] mt-8">
          UYNovel Progressive Web App • Versi Mandiri
        </p>
      </div>
    </div>
  );
}
