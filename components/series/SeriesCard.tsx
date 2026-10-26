'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, BookOpen } from 'lucide-react';

interface SeriesCardProps {
  title: string;
  url: string;
  thumbnail: string | null;
  author?: string | null;
  genre?: string | null;
  likes?: string | null;
  rank?: number;
  section?: string | null;
  isPriority?: boolean;
}

export function SeriesCard({
  title,
  url,
  thumbnail,
  author,
  genre,
  likes,
  rank,
  section,
  isPriority = false,
}: SeriesCardProps) {
  const [imgError, setImgError] = useState(false);

  const proxiedThumbnail = thumbnail
    ? `/api/image-proxy?url=${encodeURIComponent(thumbnail)}`
    : null;

  return (
    <Link
      href={`/detail?url=${encodeURIComponent(url)}&thumb=${encodeURIComponent(thumbnail || '')}&title=${encodeURIComponent(title || '')}`}
      className="group relative flex flex-col bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-xs hover:shadow-lg hover:border-[#6659F5] dark:hover:border-[#9188FF] transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6659F5]"
    >
      {/* COVER IMAGE CONTAINER */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--bg-elevated)]">
        {proxiedThumbnail && !imgError ? (
          <img
            src={proxiedThumbnail}
            alt={title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-[var(--bg-elevated)] to-[var(--bg-surface)] text-[var(--text-muted)]">
            <BookOpen size={32} className="opacity-30 mb-2" />
            <span className="text-xs font-medium line-clamp-2 px-2">{title}</span>
          </div>
        )}

        {/* TOP BADGES */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {rank !== undefined ? (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-white/90 dark:bg-[#101221]/90 text-[#1F2238] dark:text-[#F5F6FF] shadow-sm backdrop-blur-md">
              #{rank}
            </span>
          ) : <span />}

          {section && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#EEECFF]/90 dark:bg-[#1E233E]/90 text-[#6659F5] dark:text-[#C5BEFF] backdrop-blur-md">
              {section}
            </span>
          )}
        </div>

        {/* BOTTOM GRADIENT OVERLAY */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* METADATA CONTENT */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-1.5 bg-[var(--bg-surface)]">
        <div>
          {genre && (
            <span className="text-[11px] font-semibold text-[#6659F5] dark:text-[#9188FF] line-clamp-1">
              {genre}
            </span>
          )}
          <h3 className="font-semibold text-sm sm:text-base text-[#1F2238] dark:text-[#F5F6FF] group-hover:text-[#6659F5] dark:group-hover:text-[#9188FF] transition-colors line-clamp-2 leading-snug">
            {title}
          </h3>
        </div>

        <div className="flex items-center justify-between text-xs text-[#8E96AC] dark:text-[#7A829D] pt-1 border-t border-[var(--border-subtle)]">
          {author ? (
            <span className="line-clamp-1 max-w-[65%]">{author}</span>
          ) : (
            <span className="text-[11px]">Webtoon</span>
          )}

          {likes && (
            <div className="flex items-center gap-1 text-[#565D75] dark:text-[#B1B7CD] font-medium">
              <Heart size={12} className="text-[#6659F5] dark:text-[#9188FF] fill-[#6659F5]/30 dark:fill-[#9188FF]/30" />
              <span>{likes}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
