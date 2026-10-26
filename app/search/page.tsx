'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search as SearchIcon, X, Filter, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { SeriesCard } from '@/components/series/SeriesCard';

const SUGGESTED_SEARCHES = [
  'Tower of God',
  'Omniscient Reader',
  'Lookism',
  'Eleceed',
  'Wind Breaker',
  'Viral Hit',
  'The Boxer',
  'Sweet Home',
];

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQ);
  const [activeTab, setActiveTab] = useState<'all' | 'originals' | 'canvas'>('all');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(!!initialQ);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = (q: string) => {
    if (!q.trim()) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/search?q=${encodeURIComponent(q.trim())}`)
      .then((res) => {
        if (!res.ok) throw new Error('Gagal mengambil hasil pencarian');
        return res.json();
      })
      .then((data) => {
        setResults(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Terjadi kendala saat mencari cerita.');
        setLoading(false);
      });
  };

  useEffect(() => {
    setQuery(initialQ);
    if (initialQ) {
      fetchResults(initialQ);
    }
  }, [initialQ]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      fetchResults(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults(null);
    router.push('/search');
  };

  const displayedItems = results
    ? activeTab === 'all'
      ? results.items || []
      : activeTab === 'originals'
      ? results.originals || []
      : results.canvas || []
    : [];

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER & SEARCH FORM */}
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Jelajahi Cerita
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Cari judul webtoon, komik, atau temukan cerita baru dari kreator favorit Anda.
        </p>

        {/* SEARCH BAR */}
        <form onSubmit={handleSearchSubmit} className="relative mt-2">
          <div className="relative flex items-center w-full bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] shadow-xs focus-within:border-[#6659F5] dark:focus-within:border-[#9188FF] focus-within:ring-2 focus-within:ring-[#6659F5]/20 transition-all p-1.5 sm:p-2">
            <div className="pl-3 text-[var(--text-muted)]">
              <SearchIcon size={20} className="text-[#6659F5] dark:text-[#9188FF]" />
            </div>
            
            <input
              type="text"
              placeholder="Ketik judul webtoon atau kreator..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent px-3 py-2 text-sm sm:text-base text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none"
              autoFocus={!initialQ}
            />

            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors mr-1"
                aria-label="Bersihkan pencarian"
              >
                <X size={16} />
              </button>
            )}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#6659F5] hover:bg-[#5547E8] text-white font-medium text-xs sm:text-sm shadow-xs transition-colors shrink-0"
            >
              Cari
            </button>
          </div>
        </form>
      </div>

      {/* FILTER TABS & COUNT (WHEN SEARCHED) */}
      {results && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
          <div className="text-sm text-[var(--text-secondary)]">
            Ditemukan{' '}
            <span className="font-bold text-[var(--text-primary)]">
              {displayedItems.length}
            </span>{' '}
            judul untuk &ldquo;{results.query}&rdquo;
          </div>

          <div className="flex items-center gap-1.5 bg-[var(--bg-surface)] p-1 rounded-xl border border-[var(--border-color)] self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#6659F5] text-white dark:bg-[#9188FF] dark:text-[#101221]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Semua ({results.items?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('originals')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'originals'
                  ? 'bg-[#6659F5] text-white dark:bg-[#9188FF] dark:text-[#101221]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Originals ({results.originals?.length || 0})
            </button>

            <button
              onClick={() => setActiveTab('canvas')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'canvas'
                  ? 'bg-[#6659F5] text-white dark:bg-[#9188FF] dark:text-[#101221]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Canvas ({results.canvas?.length || 0})
            </button>
          </div>
        </div>
      )}

      {/* RESULTS DISPLAY */}
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
          <AlertCircle size={32} className="text-[#6659F5] dark:text-[#9188FF]" />
          <h3 className="text-base font-semibold text-[var(--text-primary)]">{error}</h3>
          <button
            onClick={() => fetchResults(query)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6659F5] text-white text-xs font-medium hover:bg-[#5547E8] transition-colors"
          >
            <RefreshCw size={14} />
            <span>Coba Lagi</span>
          </button>
        </div>
      ) : results && displayedItems.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-center flex flex-col items-center justify-center gap-3">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">
            Tidak ada judul yang cocok
          </h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-sm">
            Kami tidak menemukan hasil untuk &ldquo;{query}&rdquo;. Silakan coba dengan kata kunci lain atau pilih saran populer di bawah.
          </p>
          <button
            onClick={handleClear}
            className="px-4 py-2 rounded-full bg-[var(--bg-elevated)] hover:bg-[#6659F5] hover:text-white text-xs font-medium transition-colors"
          >
            Hapus Pencarian
          </button>
        </div>
      ) : results ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {displayedItems.map((item: any, idx: number) => (
            <SeriesCard
              key={`${item.titleNo}-${idx}`}
              title={item.title}
              url={item.url}
              thumbnail={item.thumbnail}
              author={item.author}
              genre={item.genre}
              section={item.section}
              isPriority={idx < 4}
            />
          ))}
        </div>
      ) : (
        /* IDLE STATE: SUGGESTIONS */
        <div className="flex flex-col gap-6 py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
            <Sparkles size={16} className="text-[#6659F5] dark:text-[#9188FF]" />
            <span>Pencarian Populer Rekomendasi</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {SUGGESTED_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => {
                  setQuery(term);
                  router.push(`/search?q=${encodeURIComponent(term)}`);
                  fetchResults(term);
                }}
                className="px-4 py-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[#EEECFF] dark:hover:bg-[#1E233E] text-[var(--text-secondary)] hover:text-[#6659F5] dark:hover:text-[#9188FF] border border-[var(--border-color)] hover:border-[#C5BEFF] text-xs font-medium transition-all"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors pb-16 md:pb-0">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Suspense
          fallback={
            <div className="flex flex-col gap-4 animate-pulse">
              <div className="h-10 w-48 bg-[var(--bg-surface)] rounded-xl" />
              <div className="h-12 w-full bg-[var(--bg-surface)] rounded-2xl" />
            </div>
          }
        >
          <SearchContent />
        </Suspense>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
