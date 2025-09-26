const getDefaultTickers = (): string[] => {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_DEFAULT_TICKERS) {
    return process.env.NEXT_PUBLIC_DEFAULT_TICKERS.replace(/"/g, '').split(',');
  }
  return ['AAPL','MSFT','AMZN','TSLA','NVDA'];
};

export const DEFAULT_TICKERS: string[] = getDefaultTickers();

export * from './types';
export * from './client';