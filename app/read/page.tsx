'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowUp, 
  Settings, 
  Maximize2, 
  Minimize2, 
  Sun, 
  Moon, 
  BookOpen, 
  RotateCcw, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Sliders,
  Type
} from 'lucide-react';
import { 
  saveReadingHistory, 
  getReaderSettings, 
  saveReaderSettings, 
  ReaderSettings 
} from '@/lib/storage';

function ReadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get('url');
  const seriesUrl = searchParams.get('series') || '';
  const seriesTitle = searchParams.get('title') || 'UYNovel Reader';

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [readerSettings, setReaderSettings] = useState<ReaderSettings>(getReaderSettings());
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Extract episode number from url
  const epMatch = url?.match(/episode_no=(\d+)/);
  const episodeNo = epMatch ? parseInt(epMatch[1], 10) : 1;

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    setError(null);

    fetch(`/api/read?url=${encodeURIComponent(url)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Gagal memuat halaman episode');
        return res.json();
      })
      .then((data) => {
        setImages(data.images || []);
        setLoading(false);

        // Save progress to reading history
        if (seriesUrl) {
          saveReadingHistory({
            titleNo: parseInt(url.match(/title_no=(\d+)/)?.[1] || '0', 10),
            title: seriesTitle,
            url: seriesUrl,
            thumbnail: data.images?.[0] || null,
            episodeNo,
            episodeTitle: `Episode ${episodeNo}`,
            episodeUrl: url,
            lastReadAt: Date.now(),
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Tidak dapat mengambil gambar episode. Episode ini mungkin memerlukan login di platform aslinya atau koneksi terputus.');
        setLoading(false);
      });
  }, [url, seriesUrl, seriesTitle, episodeNo]);

  // Track scroll progress and header auto-hide
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentScrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }

      setShowScrollTop(currentScrollY > 400);

      // Header hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const updateSettings = (partial: Partial<ReaderSettings>) => {
    const updated = { ...readerSettings, ...partial };
    setReaderSettings(updated);
    saveReaderSettings(updated);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!url) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] my-12">
        <p className="text-sm text-[var(--text-secondary)]">URL episode tidak disediakan.</p>
        <Link href="/" className="inline-block mt-4 text-xs font-semibold text-[#6659F5] hover:underline">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // Determine width class
  const getWidthClass = () => {
    switch (readerSettings.width) {
      case 'narrow':
        return 'max-w-xl'; // ~600px
      case 'standard':
        return 'max-w-2xl'; // ~768px
      case 'wide':
        return 'max-w-4xl'; // ~896px
      case 'full':
        return 'max-w-full';
      default:
        return 'max-w-2xl';
    }
  };

  // Determine background color
  const getBgClass = () => {
    switch (readerSettings.background) {
      case 'black':
        return 'bg-black text-white';
      case 'paper':
        return 'bg-[#F7F8FC] text-[#242447]';
      case 'midnight':
      default:
        return 'bg-[#101221] text-[#F5F6FF]';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${getBgClass()}`}>
      
      {/* FLOATING READER HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/75 border-b border-white/10 px-4 py-2.5 flex items-center justify-between text-white transition-transform duration-300 ${
          headerVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => {
              if (seriesUrl) {
                router.push(`/detail?url=${encodeURIComponent(seriesUrl)}`);
              } else {
                router.back();
              }
            }}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Kembali ke seri"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex flex-col min-w-0">
            <h1 className="text-xs sm:text-sm font-semibold truncate leading-tight">
              {seriesTitle}
            </h1>
            <span className="text-[11px] text-white/60 truncate">
              Episode #{episodeNo}
            </span>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Pengaturan pembaca"
          >
            <Sliders size={18} />
          </button>
        </div>

        {/* PROGRESS BAR UNDER HEADER */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
          <div
            className="h-full bg-[#6659F5] transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </header>

      {/* SETTINGS DRAWER / PANEL */}
      {settingsOpen && (
        <div className="fixed top-14 right-4 z-50 w-72 bg-[#191D32] border border-[#303650] rounded-2xl shadow-2xl p-4 text-white animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-[#303650] pb-2 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#9188FF]">
              Pengaturan Tampilan
            </h4>
            <button
              onClick={() => setSettingsOpen(false)}
              className="text-xs text-white/60 hover:text-white"
            >
              Tutup
            </button>
          </div>

          <div className="flex flex-col gap-4 text-xs">
            {/* WIDTH SETTING */}
            <div className="flex flex-col gap-1.5">
              <span className="text-white/70">Lebar Tampilan Gambar:</span>
              <div className="grid grid-cols-4 gap-1 bg-[#101221] p-1 rounded-xl">
                {(['narrow', 'standard', 'wide', 'full'] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => updateSettings({ width: w })}
                    className={`py-1 rounded-lg text-center font-medium capitalize transition-colors ${
                      readerSettings.width === w
                        ? 'bg-[#6659F5] text-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {w === 'narrow' ? 'S' : w === 'standard' ? 'M' : w === 'wide' ? 'L' : 'Auto'}
                  </button>
                ))}
              </div>
            </div>

            {/* BACKGROUND SETTING */}
            <div className="flex flex-col gap-1.5">
              <span className="text-white/70">Latar Belakang:</span>
              <div className="grid grid-cols-3 gap-1 bg-[#101221] p-1 rounded-xl">
                {[
                  { id: 'midnight', label: 'Midnight' },
                  { id: 'black', label: 'Hitam' },
                  { id: 'paper', label: 'Terang' },
                ].map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => updateSettings({ background: bg.id as any })}
                    className={`py-1 rounded-lg text-center font-medium transition-colors ${
                      readerSettings.background === bg.id
                        ? 'bg-[#6659F5] text-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {bg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEWER CONTENT */}
      <main className="flex-1 flex flex-col items-center pt-14 pb-20 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
            <div className="w-10 h-10 border-3 border-[#6659F5] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[var(--text-muted)] animate-pulse">
              Memuat episode webtoon...
            </p>
          </div>
        ) : error ? (
          <div className="p-8 max-w-md mx-auto my-12 text-center rounded-2xl bg-[#191D32] border border-[#303650] flex flex-col items-center gap-3 text-white">
            <p className="text-sm font-semibold">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 rounded-full bg-[#6659F5] text-white text-xs font-medium hover:bg-[#5547E8]"
            >
              Muat Ulang
            </button>
          </div>
        ) : images.length === 0 ? (
          <div className="p-8 max-w-md mx-auto my-12 text-center rounded-2xl bg-[#191D32] border border-[#303650] flex flex-col items-center gap-3 text-white">
            <BookOpen size={32} className="text-[#9188FF] opacity-60" />
            <h3 className="text-base font-semibold">Tidak Ada Gambar Dimuat</h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Episode ini mungkin merupakan episode berbayar atau memerlukan otentikasi pada platform sumber aslinya.
            </p>
            {seriesUrl && (
              <Link
                href={`/detail?url=${encodeURIComponent(seriesUrl)}`}
                className="mt-2 px-4 py-2 rounded-full bg-[#6659F5] text-white text-xs font-medium hover:bg-[#5547E8]"
              >
                Pilih Episode Lain
              </Link>
            )}
          </div>
        ) : (
          <div className={`w-full ${getWidthClass()} flex flex-col mx-auto select-none shadow-2xl`}>
            {images.map((img, idx) => (
              <img
                key={idx}
                src={`/api/image-proxy?url=${encodeURIComponent(img)}`}
                alt={`Halaman ${idx + 1}`}
                className="w-full h-auto block"
                loading="lazy"
              />
            ))}

            {/* END OF EPISODE BANNER */}
            <div className="p-8 text-center flex flex-col items-center justify-center gap-4 bg-white/5 backdrop-blur-md rounded-2xl m-4 border border-white/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#9188FF]">
                Akhir Episode #{episodeNo}
              </span>
              <p className="text-sm font-bold">
                Terima kasih telah membaca di UYNovel
              </p>
              {seriesUrl && (
                <Link
                  href={`/detail?url=${encodeURIComponent(seriesUrl)}`}
                  className="px-5 py-2.5 rounded-full bg-[#6659F5] hover:bg-[#5547E8] text-white text-xs font-semibold shadow-xs"
                >
                  Kembali ke Daftar Episode
                </Link>
              )}
            </div>
          </div>
        )}
      </main>

      {/* FLOATING SCROLL TO TOP BUTTON */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Kembali ke atas"
          className="fixed bottom-6 right-6 p-3 rounded-full bg-[#6659F5] text-white shadow-lg shadow-[#6659F5]/30 hover:scale-105 transition-all z-40 cursor-pointer"
        >
          <ArrowUp size={20} />
        </button>
      )}

    </div>
  );
}

export default function ReadPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#101221] flex items-center justify-center text-white">
          <div className="w-8 h-8 border-3 border-[#6659F5] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ReadContent />
    </Suspense>
  );
}
