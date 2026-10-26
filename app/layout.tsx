import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Manrope, Literata } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

const literata = Literata({
  subsets: ['latin'],
  variable: '--font-literata',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'UYNovel — Modern Minimalist Novel & Webtoon Platform',
  description: 'Temukan dan baca webtoon, manga, dan novel dengan pengalaman membaca digital modern, estetik, dan nyaman.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'UYNovel',
  },
};

export const viewport: Viewport = {
  themeColor: '#101221',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html 
      lang="id" 
      className={`${plusJakarta.variable} ${manrope.variable} ${literata.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <link rel="apple-touch-icon" href="/icon.png" />
      </head>
      <body className="antialiased selection:bg-[#6659F5]/20 selection:text-[#6659F5] dark:selection:bg-[#9188FF]/30 dark:selection:text-[#C5BEFF]">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('SW Registered: ', registration.scope);
                  }, function(err) {
                    console.log('SW Registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
