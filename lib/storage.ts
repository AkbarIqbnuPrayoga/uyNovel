export interface ReadingHistoryItem {
  titleNo: number;
  title: string;
  url: string;
  thumbnail: string | null;
  episodeNo: number;
  episodeTitle: string;
  episodeUrl: string;
  lastReadAt: number;
  genre?: string | null;
  author?: string | null;
}

export interface BookmarkItem {
  titleNo: number;
  title: string;
  url: string;
  thumbnail: string | null;
  author?: string | null;
  genre?: string | null;
  savedAt: number;
}

export interface ReaderSettings {
  mode: 'webtoon' | 'novel';
  width: 'narrow' | 'standard' | 'wide' | 'full';
  background: 'midnight' | 'black' | 'paper';
  fontSize: number; // For novel reader
  lineHeight: number; // For novel reader
  fontFamily: 'literata' | 'jakarta' | 'mono';
}

const HISTORY_KEY = 'uynovel_reading_history';
const BOOKMARKS_KEY = 'uynovel_bookmarks';
const READER_SETTINGS_KEY = 'uynovel_reader_settings';

export const getReadingHistory = (): ReadingHistoryItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading history', e);
    return [];
  }
};

export const saveReadingHistory = (item: ReadingHistoryItem) => {
  if (typeof window === 'undefined') return;
  try {
    const existing = getReadingHistory();
    const filtered = existing.filter(h => h.url !== item.url);
    const updated = [item, ...filtered].slice(0, 30); // Keep last 30
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('uynovel-history-updated'));
  } catch (e) {
    console.error('Error saving reading history', e);
  }
};

export const getBookmarks = (): BookmarkItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading bookmarks', e);
    return [];
  }
};

export const toggleBookmark = (item: Omit<BookmarkItem, 'savedAt'>): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const existing = getBookmarks();
    const index = existing.findIndex(b => b.url === item.url);
    let updated: BookmarkItem[];
    let isBookmarked = false;

    if (index >= 0) {
      updated = existing.filter(b => b.url !== item.url);
      isBookmarked = false;
    } else {
      updated = [{ ...item, savedAt: Date.now() }, ...existing];
      isBookmarked = true;
    }

    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('uynovel-bookmarks-updated'));
    return isBookmarked;
  } catch (e) {
    console.error('Error toggling bookmark', e);
    return false;
  }
};

export const isBookmarked = (url: string): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const existing = getBookmarks();
    return existing.some(b => b.url === url);
  } catch {
    return false;
  }
};

export const defaultReaderSettings: ReaderSettings = {
  mode: 'webtoon',
  width: 'standard',
  background: 'midnight',
  fontSize: 18,
  lineHeight: 1.8,
  fontFamily: 'literata',
};

export const getReaderSettings = (): ReaderSettings => {
  if (typeof window === 'undefined') return defaultReaderSettings;
  try {
    const raw = localStorage.getItem(READER_SETTINGS_KEY);
    return raw ? { ...defaultReaderSettings, ...JSON.parse(raw) } : defaultReaderSettings;
  } catch {
    return defaultReaderSettings;
  }
};

export const saveReaderSettings = (settings: Partial<ReaderSettings>) => {
  if (typeof window === 'undefined') return;
  try {
    const current = getReaderSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(READER_SETTINGS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('uynovel-reader-settings-updated'));
  } catch (e) {
    console.error('Error saving reader settings', e);
  }
};
