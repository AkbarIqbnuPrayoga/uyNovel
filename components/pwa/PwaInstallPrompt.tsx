'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare, Sparkles, CheckCircle2, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  useEffect(() => {
    // 1. Check if already running in standalone mode (already installed)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. Detect iOS devices
    const ua = window.navigator.userAgent;
    const isIosDevice = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: boolean }).MSStream;
    setIsIOS(isIosDevice);

    // 3. Check dismissed cache (suppress for 3 days if dismissed)
    const dismissedTime = localStorage.getItem('uynovel-pwa-dismissed');
    const threeDays = 3 * 24 * 60 * 60 * 1000;
    const isDismissedRecently = dismissedTime && Date.now() - parseInt(dismissedTime, 10) < threeDays;

    // 4. Handle Chromium `beforeinstallprompt`
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!isDismissedRecently) {
        // Small delay so user sees initial page before banner pops up
        const timer = setTimeout(() => setShowBanner(true), 2500);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. Handle app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setInstallSuccess(true);
      setDeferredPrompt(null);
      setTimeout(() => setInstallSuccess(false), 4000);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // 6. Support manual trigger from Navbar / Footer / Mobile drawer
    const handleManualTrigger = () => {
      if (isStandalone) {
        alert('UYNovel sudah terpasang di perangkat Anda!');
        return;
      }
      if (isIosDevice) {
        setShowIOSModal(true);
      } else if (deferredPrompt) {
        handleInstallClick();
      } else {
        setShowBanner(true);
      }
    };

    window.addEventListener('uynovel-open-install-prompt', handleManualTrigger);

    // For iOS users that haven't dismissed, show after short delay
    if (isIosDevice && !isDismissedRecently && !isStandalone) {
      const timer = setTimeout(() => setShowBanner(true), 3500);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
        window.removeEventListener('uynovel-open-install-prompt', handleManualTrigger);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('uynovel-open-install-prompt', handleManualTrigger);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      setShowBanner(false);
      return;
    }

    if (!deferredPrompt) {
      // Fallback instructions if prompt not ready
      alert('Untuk memasang UYNovel di perangkat ini, buka menu peramban (titik tiga ⋮) lalu pilih "Tambahkan ke Layar Utama" / "Install Aplikasi".');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstallSuccess(true);
        setShowBanner(false);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error('Error triggering PWA install:', err);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('uynovel-pwa-dismissed', Date.now().toString());
  };

  // If already installed and no success toast, render nothing
  if (isInstalled && !installSuccess) return null;

  return (
    <>
      {/* SUCCESS TOAST */}
      {installSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#101221] dark:bg-[#1E233E] text-white rounded-2xl shadow-2xl border border-[#6659F5]/40 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 size={20} className="text-[#34D399] shrink-0" />
          <span className="text-xs sm:text-sm font-medium">
            UYNovel berhasil dipasang! Buka melalui layar utama HP Anda.
          </span>
        </div>
      )}

      {/* FLOATING INSTALL BANNER */}
      {showBanner && !isInstalled && (
        <div className="fixed bottom-18 md:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)]/80 p-3.5 sm:p-4 rounded-2xl shadow-2xl shadow-[#6659F5]/15 backdrop-blur-xl flex items-center gap-3.5 relative overflow-hidden">
            
            {/* Subtle gradient accent stripe */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6659F5] via-[#9188FF] to-[#6659F5]" />

            {/* App Icon */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6659F5] to-[#242447] dark:from-[#9188FF] dark:to-[#191D32] flex items-center justify-center text-white shrink-0 shadow-md">
              <Smartphone size={24} className="text-white" />
            </div>

            {/* Text description */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs sm:text-sm font-bold text-[#1F2238] dark:text-[#F5F6FF] truncate">
                  Pasang UYNovel di HP
                </h4>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-[#6659F5]/10 text-[#6659F5] dark:text-[#9188FF] shrink-0">
                  Gratis
                </span>
              </div>
              <p className="text-[11px] text-[#565D75] dark:text-[#B1B7CD] line-clamp-1 mt-0.5">
                Akses lebih cepat, hemat kuota & layar penuh.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#6659F5] hover:bg-[#5547E8] text-white text-xs font-semibold shadow-sm shadow-[#6659F5]/30 active:scale-95 transition-all cursor-pointer"
              >
                <Download size={14} />
                <span>Pasang</span>
              </button>
              
              <button
                onClick={handleDismiss}
                aria-label="Tutup saran pemasangan"
                className="p-1.5 rounded-lg text-[#8E96AC] hover:text-[#1F2238] dark:hover:text-[#F5F6FF] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IOS INSTALL INSTRUCTIONS MODAL */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div 
            className="w-full max-w-sm bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 duration-300 relative text-[#1F2238] dark:text-[#F5F6FF]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--bg-elevated)] text-[#8E96AC] dark:text-[#7A829D]"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6659F5] to-[#242447] flex items-center justify-center text-white shadow-lg">
                <Sparkles size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold">Pasang di iPhone / iPad</h3>
                <p className="text-xs text-[#8E96AC] dark:text-[#7A829D]">UYNovel Web App</p>
              </div>
            </div>

            <p className="text-xs text-[#565D75] dark:text-[#B1B7CD] mb-5 leading-relaxed">
              Ikuti 3 langkah mudah ini untuk memasang UYNovel di layar utama HP Anda:
            </p>

            {/* Steps */}
            <div className="flex flex-col gap-3.5 mb-6">
              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                <div className="w-8 h-8 rounded-xl bg-[#6659F5]/10 text-[#6659F5] dark:text-[#9188FF] flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </div>
                <div className="text-xs">
                  <span className="font-semibold block">Ketuk tombol Bagikan</span>
                  <span className="text-[#8E96AC] dark:text-[#7A829D] flex items-center gap-1 mt-0.5">
                    Ikon kotak berpanah <Share size={13} className="inline text-[#6659F5] dark:text-[#9188FF]" /> di bawah Safari
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                <div className="w-8 h-8 rounded-xl bg-[#6659F5]/10 text-[#6659F5] dark:text-[#9188FF] flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </div>
                <div className="text-xs">
                  <span className="font-semibold block">Pilih "Tambah ke Layar Utama"</span>
                  <span className="text-[#8E96AC] dark:text-[#7A829D] flex items-center gap-1 mt-0.5">
                    Atau <PlusSquare size={13} className="inline text-[#6659F5] dark:text-[#9188FF]" /> &quot;Add to Home Screen&quot;
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)]">
                <div className="w-8 h-8 rounded-xl bg-[#6659F5]/10 text-[#6659F5] dark:text-[#9188FF] flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </div>
                <div className="text-xs">
                  <span className="font-semibold block">Ketuk &quot;Tambah&quot; di kanan atas</span>
                  <span className="text-[#8E96AC] dark:text-[#7A829D] mt-0.5 block">
                    UYNovel siap dibuka dari layar utama HP Anda!
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-3 rounded-xl bg-[#6659F5] text-white font-semibold text-xs shadow-md shadow-[#6659F5]/25 active:scale-95 transition-all"
            >
              Mengerti & Siap Pasang
            </button>
          </div>
          <div className="fixed inset-0 -z-10" onClick={() => setShowIOSModal(false)} />
        </div>
      )}
    </>
  );
}

/** Helper button to trigger install prompt from anywhere */
export function InstallAppButton({ className = '' }: { className?: string }) {
  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('uynovel-open-install-prompt'));
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={className || "flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#6659F5]/10 hover:bg-[#6659F5]/20 text-[#6659F5] dark:text-[#9188FF] text-xs font-semibold transition-all cursor-pointer"}
    >
      <Download size={14} />
      <span>Pasang Aplikasi</span>
    </button>
  );
}
