export const MAX_WATCHLIST_SIZE = 8;

export function getDefaultTickers(): string[] {
  const defaultTickers = process.env.NEXT_PUBLIC_DEFAULT_TICKERS || 'AAPL,MSFT,AMZN,TSLA,NVDA';
  return defaultTickers.split(',').map(ticker => ticker.trim().toUpperCase());
}

export function loadWatchlist(): string[] {
  if (typeof window === 'undefined') {
    return getDefaultTickers();
  }

  try {
    const stored = localStorage.getItem('marketpulse_watchlist');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Failed to load watchlist from localStorage:', error);
  }

  return getDefaultTickers();
}

export function saveWatchlist(watchlist: string[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem('marketpulse_watchlist', JSON.stringify(watchlist));
  } catch (error) {
    console.warn('Failed to save watchlist to localStorage:', error);
  }
}

export function validateTicker(ticker: string): string {
  const cleaned = ticker.trim().toUpperCase();

  // Basic validation: ticker should be 1-5 characters, letters only
  if (!cleaned || cleaned.length > 5 || !/^[A-Z]+$/.test(cleaned)) {
    throw new Error('Invalid ticker format. Must be 1-5 letters only.');
  }

  return cleaned;
}