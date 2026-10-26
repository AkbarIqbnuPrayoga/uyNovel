'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Flame, BookmarkCheck } from 'lucide-react';

export function MobileNav() {
  const pathname = usePathname();

  const links = [
    { label: 'Beranda', href: '/', icon: Home, exact: true },
    { label: 'Jelajah', href: '/search', icon: Compass, exact: false },
    { label: 'Trending', href: '/#trending', icon: Flame, exact: false },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-lg border-t border-[var(--border-color)] px-4 py-2 flex items-center justify-around shadow-lg transition-colors">
      {links.map((link) => {
        const isActive = link.exact 
          ? pathname === link.href 
          : pathname.startsWith(link.href) && link.href !== '/';
        const Icon = link.icon;
        
        return (
          <Link
            key={link.label}
            href={link.href}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              isActive
                ? 'text-[#6659F5] dark:text-[#9188FF] font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-[#EEECFF] dark:bg-[#1E233E]' : ''}`}>
              <Icon size={20} />
            </div>
            <span className="text-[11px]">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
