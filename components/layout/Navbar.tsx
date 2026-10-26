'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Search, 
  Sun, 
  Moon, 
  Bookmark, 
  History, 
  Menu, 
  X, 
  Sparkles,
  TrendingUp,
  Compass
} from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { getBookmarks, getReadingHistory } from '@/lib/storage';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);

  // Sync counts on mount and events
  useEffect(() => {
    const updateCounts = () => {
      setBookmarkCount(getBookmarks().length);
      setHistoryCount(getReadingHistory().length);
    };
    updateCounts();

    window.addEventListener('uynovel-bookmarks-updated', updateCounts);
    window.addEventListener('uynovel-history-updated', updateCounts);

    return () => {
      window.removeEventListener('uynovel-bookmarks-updated', updateCounts);
      window.removeEventListener('uynovel-history-updated', updateCounts);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', href: '/', icon: Sparkles },
    { label: 'Explore', href: '/search', icon: Compass },
    { label: 'Trending', href: '/#trending', icon: TrendingUp },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[var(--bg-main)]/85 border-b border-[var(--border-color)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* LOGO */}
        <Link 
          href="/" 
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6659F5] rounded-xl py-1 px-1.5 -ml-1.5 transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6659F5] to-[#242447] dark:from-[#9188FF] dark:to-[#191D32] flex items-center justify-center text-white shadow-sm shadow-[#6659F5]/20 group-hover:scale-105 transition-transform">
            <BookOpen size={20} className="text-white drop-shadow-sm" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-extrabold tracking-tight text-[#242447] dark:text-[#F5F6FF]">
                UY<span className="text-[#6659F5] dark:text-[#9188FF]">Novel</span>
              </span>
            </div>
            <span className="text-[10px] uppercase font-medium tracking-wider text-[var(--text-muted)] -mt-1">
              Digital Editorial
            </span>
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex items-center gap-1 bg-[var(--bg-surface)] px-2 py-1.5 rounded-full border border-[var(--border-color)] shadow-xs">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#6659F5] text-white shadow-sm dark:bg-[#9188FF] dark:text-[#101221]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                }`}
              >
                <Icon size={15} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Search Button / Input */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Cari webtoon atau manga"
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:border-[#6659F5] dark:hover:border-[#9188FF] hover:text-[var(--text-primary)] transition-all text-xs"
          >
            <Search size={14} className="text-[#6659F5] dark:text-[#9188FF]" />
            <span className="hidden lg:inline">Cari judul webtoon...</span>
            <span className="lg:hidden">Cari...</span>
            <kbd className="hidden lg:inline-block ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-[var(--bg-elevated)] text-[var(--text-secondary)] rounded border border-[var(--border-color)]">
              /
            </kbd>
          </button>

          {/* Mobile search icon */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Cari judul"
            className="sm:hidden p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[#6659F5] transition-colors"
          >
            <Search size={18} />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label={`Ganti ke tema ${theme === 'dark' ? 'terang' : 'gelap'}`}
            title={`Ganti ke tema ${theme === 'dark' ? 'terang' : 'gelap'}`}
            className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[#6659F5] dark:hover:text-[#9188FF] hover:bg-[var(--bg-elevated)] transition-all cursor-pointer"
          >
            {theme === 'dark' ? (
              <Sun size={18} className="text-[#C5BEFF]" />
            ) : (
              <Moon size={18} className="text-[#6659F5]" />
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu navigasi"
            className="md:hidden p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* QUICK SEARCH MODAL OVERLAY */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div 
            className="w-full max-w-xl bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] shadow-2xl p-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 border-b border-[var(--border-color)] pb-3">
              <Search size={20} className="text-[#6659F5] dark:text-[#9188FF] shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Cari webtoon, manga, atau judul cerita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-[var(--text-primary)] placeholder-[var(--text-muted)] text-base outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-muted)]"
              >
                <X size={18} />
              </button>
            </form>

            <div className="pt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
              <span>Saran pencarian:</span>
              {['Tower of God', 'Omniscient Reader', 'Lookism', 'Eleceed'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    router.push(`/search?q=${encodeURIComponent(item)}`);
                    setSearchOpen(false);
                  }}
                  className="px-2.5 py-1 rounded-full bg-[var(--bg-elevated)] hover:bg-[#EEECFF] dark:hover:bg-[#1E233E] hover:text-[#6659F5] dark:hover:text-[#9188FF] transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="fixed inset-0 -z-10" onClick={() => setSearchOpen(false)} />
        </div>
      )}

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-4 flex flex-col gap-3 shadow-lg animate-in slide-in-from-top-2">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)]">
            <Search size={16} className="text-[#6659F5] dark:text-[#9188FF]" />
            <input
              type="text"
              placeholder="Cari judul..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm w-full outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)]"
            />
          </form>

          <div className="flex flex-col gap-1 pt-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#6659F5] text-white dark:bg-[#9188FF] dark:text-[#101221]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                  }`}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>{bookmarkCount} Disimpan</span>
            <span>{historyCount} Riwayat Baca</span>
          </div>
        </div>
      )}
    </header>
  );
}
