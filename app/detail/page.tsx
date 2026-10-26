'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowLeft, 
  Star, 
  Users, 
  Clock, 
  BookOpen, 
  Bookmark, 
  BookmarkCheck, 
  Play, 
  Heart, 
  ArrowUpDown, 
  Share2, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileNav } from '@/components/layout/MobileNav';
import { 
  isBookmarked, 
  toggleBookmark, 
  getReadingHistory, 
  ReadingHistoryItem 
} from '@/lib/storage';

function DetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get('url');

  const [detail, setDetail] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sortAsc, setSortAsc] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [lastRead, setLastRead] = useState<ReadingHistoryItem | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    setError(null);
    setBookmarked(isBookmarked(url));

    const history = getReadingHistory();
    const existing = history.find((h) => h.url === url);
    if (existing) setLastRead(existing);

    fetch(`/api/episodes?url=${encodeURIComponent(url)}&page=1`)
      .then((res) => {
        if (!res.ok) throw new Error('Gagal memuat detail seri');
        return res.json();
      })
      .then((data) => {
        setDetail(data);
        setEpisodes(data.episodesList || []);
        setHasMore(data.hasNext);
        setPage(1);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Gagal memuat informasi seri dari sumber data.');
        setLoading(false);
      });
  }, [url]);

  const handleBookmarkToggle = () => {
    if (!detail || !url) return;
    const newState = toggleBookmark({
      titleNo: detail.titleNo || 0,
      title: detail.title || '',
      url,
      thumbnail: detail.thumbnail || null,
      author: detail.author || null,
      genre: detail.genre || null,
    });
    setBookmarked(newState);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const loadMore = () => {
    if (!url || !hasMore || loadingMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    fetch(`/api/episodes?url=${encodeURIComponent(url)}&page=${nextPage}`)
      .then((res) => res.json())
      .then((data) => {
        setEpisodes((prev) => [...prev, ...(data.episodesList || [])]);
        setHasMore(data.hasNext);
        setPage(nextPage);
        setLoadingMore(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingMore(false);
      });
  };

  if (!url) {
    return (
      <div className="p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-center">
        <p className="text-sm text-[var(--text-secondary)]">Parameter URL tidak ditemukan.</p>
        <Link href="/" className="inline-block mt-4 text-xs font-semibold text-[#6659F5] hover:underline">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-8 animate-pulse">
        <div className="h-72 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)]" />
        <div className="h-96 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)]" />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="p-10 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-center flex flex-col items-center justify-center gap-3">
        <AlertCircle size={32} className="text-[#6659F5] dark:text-[#9188FF]" />
        <h2 className="text-lg font-bold text-[var(--text-primary)]">Gagal Memuat Seri</h2>
        <p className="text-xs text-[var(--text-secondary)] max-w-sm">{error || 'Data tidak tersedia.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 rounded-full bg-[#6659F5] text-white text-xs font-medium"
        >
          Muat Ulang
        </button>
      </div>
    );
  }

  const sortedEpisodes = [...episodes].sort((a, b) => {
    const noA = Number(a.episodeNo) || 0;
    const noB = Number(b.episodeNo) || 0;
    return sortAsc ? noA - noB : noB - noA;
  });

  // Determine starting chapter link
  const firstEpisode = episodes.length > 0 ? episodes[episodes.length - 1] : null;
  const targetEpisode = lastRead 
    ? { url: lastRead.episodeUrl, episodeNo: lastRead.episodeNo, title: lastRead.episodeTitle }
    : firstEpisode;

  return (
    <div className="flex flex-col gap-8">
      {/* BACK NAVIGATION */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-1 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            aria-label="Bagikan link"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />}
            <span>{copied ? 'Tersalin' : 'Bagikan'}</span>
          </button>

          <button
            onClick={handleBookmarkToggle}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
              bookmarked
                ? 'bg-[#EEECFF] dark:bg-[#1E233E] text-[#6659F5] dark:text-[#9188FF] border-[#C5BEFF]'
                : 'bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {bookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            <span>{bookmarked ? 'Tersimpan' : 'Simpan'}</span>
          </button>
        </div>
      </div>

      {/* SERIES EDITORIAL HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-center md:items-start">
          
          {/* COVER */}
          <div className="relative w-48 sm:w-56 aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--bg-elevated)] shrink-0 shadow-md">
            {detail.thumbnail ? (
              <Image
                src={`/api/image-proxy?url=${encodeURIComponent(detail.thumbnail)}`}
                alt={detail.title || 'Cover'}
                fill
                unoptimized
                priority
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen size={48} className="text-[var(--text-muted)] opacity-30" />
              </div>
            )}
          </div>

          {/* SERIES INFO */}
          <div className="flex flex-col flex-1 text-center md:text-left items-center md:items-start min-w-0">
            {/* BADGES */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {detail.status && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#EEECFF] dark:bg-[#1E233E] text-[#6659F5] dark:text-[#C5BEFF]">
                  {detail.status}
                </span>
              )}
              {detail.genre && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-color)]">
                  {detail.genre}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight mb-1">
              {detail.title}
            </h1>

            {detail.author && (
              <p className="text-sm font-medium text-[var(--text-secondary)] mb-4">
                Oleh <span className="text-[var(--text-primary)] font-semibold">{detail.author}</span>
              </p>
            )}

            {/* METRICS BAR */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 py-2 px-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs text-[var(--text-secondary)] mb-4 w-fit">
              {detail.rating && (
                <div className="flex items-center gap-1.5 font-semibold text-[#6659F5] dark:text-[#9188FF]">
                  <Star size={14} className="fill-current" />
                  <span>{detail.rating}</span>
                </div>
              )}
              {detail.subscribers && (
                <div className="flex items-center gap-1.5">
                  <Users size={14} className="text-[var(--text-muted)]" />
                  <span>{detail.subscribers} Pembaca</span>
                </div>
              )}
              {detail.day && (
                <div className="flex items-center gap-1.5">
                  <Clock size={14} className="text-[var(--text-muted)]" />
                  <span className="capitalize">{detail.day}</span>
                </div>
              )}
            </div>

            {/* SYNOPSIS */}
            {detail.synopsis && (
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-6 max-w-2xl">
                {detail.synopsis}
              </p>
            )}

            {/* PRIMARY CTA */}
            {targetEpisode && (
              <div className="mt-auto pt-2 flex flex-wrap gap-3">
                <Link
                  href={`/read?url=${encodeURIComponent(targetEpisode.url)}&series=${encodeURIComponent(url)}&title=${encodeURIComponent(detail.title || '')}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#6659F5] hover:bg-[#5547E8] text-white font-semibold text-sm shadow-sm shadow-[#6659F5]/30 hover:shadow-md transition-all"
                >
                  <Play size={16} fill="currentColor" />
                  <span>
                    {lastRead ? `Lanjutkan Bab #${lastRead.episodeNo}` : 'Mulai Membaca'}
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EPISODES SECTION */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
          <div className="flex items-baseline gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
              Daftar Episode
            </h2>
            <span className="text-xs text-[var(--text-muted)]">
              ({episodes.length} episode dimuat)
            </span>
          </div>

          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2.5 py-1 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors"
          >
            <ArrowUpDown size={14} />
            <span>{sortAsc ? 'Terlama ke Terbaru' : 'Terbaru ke Terlama'}</span>
          </button>
        </div>

        {/* EPISODE LIST */}
        <div className="flex flex-col gap-2">
          {sortedEpisodes.map((ep: any, idx: number) => {
            const isLastReadEp = lastRead?.episodeUrl === ep.url;
            return (
              <Link
                key={ep.url || idx}
                href={`/read?url=${encodeURIComponent(ep.url)}&series=${encodeURIComponent(url)}&title=${encodeURIComponent(detail.title || '')}`}
                className={`flex items-center gap-3.5 sm:gap-4 p-2.5 sm:p-3 rounded-2xl border transition-all duration-200 group ${
                  isLastReadEp
                    ? 'bg-[#EEECFF]/40 dark:bg-[#1E233E]/40 border-[#C5BEFF] dark:border-[#9188FF]/50'
                    : 'bg-[var(--bg-surface)] border-[var(--border-color)] hover:border-[#6659F5] dark:hover:border-[#9188FF] hover:bg-[var(--bg-elevated)]'
                }`}
              >
                {/* THUMBNAIL */}
                <div className="relative w-20 sm:w-28 aspect-video rounded-xl overflow-hidden bg-[var(--bg-elevated)] shrink-0">
                  {ep.thumbnail ? (
                    <Image
                      src={`/api/image-proxy?url=${encodeURIComponent(ep.thumbnail)}`}
                      alt={ep.title || 'Episode'}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen size={18} className="text-[var(--text-muted)] opacity-40" />
                    </div>
                  )}

                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-black/75 text-white backdrop-blur-xs">
                    #{ep.episodeNo}
                  </div>
                </div>

                {/* DETAILS */}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-xs sm:text-sm text-[var(--text-primary)] group-hover:text-[#6659F5] dark:group-hover:text-[#9188FF] transition-colors line-clamp-1">
                      {ep.title}
                    </h3>
                    {isLastReadEp && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#6659F5] text-white shrink-0">
                        Terakhir Dibaca
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mt-1">
                    {ep.date && <span>{ep.date}</span>}
                    {ep.likes && (
                      <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                        <Heart size={11} className="text-[#6659F5] dark:text-[#9188FF] fill-[#6659F5]/30 dark:fill-[#9188FF]/30" />
                        <span>{ep.likes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* LOAD MORE BUTTON */}
        {hasMore && (
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="w-full py-3.5 mt-4 rounded-2xl bg-[var(--bg-surface)] hover:bg-[var(--bg-elevated)] border border-[var(--border-color)] text-xs sm:text-sm font-semibold text-[var(--text-primary)] hover:border-[#6659F5] dark:hover:border-[#9188FF] transition-all disabled:opacity-50"
          >
            {loadingMore ? 'Memuat Episode Lainnya...' : 'Muat Lebih Banyak Episode'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function DetailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors pb-16 md:pb-0">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Suspense
          fallback={
            <div className="flex flex-col gap-6 animate-pulse">
              <div className="h-64 rounded-3xl bg-[var(--bg-surface)]" />
              <div className="h-96 rounded-2xl bg-[var(--bg-surface)]" />
            </div>
          }
        >
          <DetailContent />
        </Suspense>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
