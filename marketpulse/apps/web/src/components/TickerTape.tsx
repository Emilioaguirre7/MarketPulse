'use client';

import React, { useEffect, useMemo, useState } from 'react';

type TapeItem = { symbol: string; price: number; changePct: number };

async function fetchDaily(symbol: string) {
  const res = await fetch(`/api/prices/daily/${symbol}?range=30d&t=${Date.now()}`, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
  if (!res.ok) throw new Error(`Failed daily for ${symbol}`);
  return res.json();
}

function formatPrice(n: number) {
  if (!Number.isFinite(n)) return '-';
  if (n >= 1000) return n.toFixed(2);
  if (n >= 100) return n.toFixed(2);
  if (n >= 10) return n.toFixed(2);
  return n.toFixed(2);
}

export default function TickerTape({
  symbols,
  refreshSec = 60, // Refresh every 60s as requested
  speedSec = 35, // Slightly slower for better readability with more stocks
}: {
  symbols?: string[];
  refreshSec?: number;
  speedSec?: number;
}) {
  const defaultList = useMemo(() => {
    // Expanded list of popular stocks across different sectors
    const popularStocks = [
      // Tech Giants
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'NFLX', 'CRM', 'ORCL',
      // Finance & Banking
      'JPM', 'BAC', 'WFC', 'GS', 'MS', 'V', 'MA', 'PYPL', 'SQ',
      // Healthcare & Pharma
      'JNJ', 'PFE', 'UNH', 'ABBV', 'MRK', 'TMO', 'ABT', 'CVS',
      // Consumer & Retail
      'WMT', 'HD', 'PG', 'KO', 'PEP', 'MCD', 'NKE', 'SBUX', 'TGT',
      // Energy & Industrials
      'XOM', 'CVX', 'BA', 'CAT', 'GE', 'MMM', 'HON', 'UPS', 'RTX',
      // Communication & Media
      'DIS', 'CMCSA', 'VZ', 'T', 'TMUS', 'CHTR',
      // Crypto & Fintech
      'COIN', 'HOOD', 'SOFI', 'AFRM'
    ];

    // Use env var as fallback if available, otherwise use expanded popular stocks
    const envStocks = process.env.NEXT_PUBLIC_DEFAULT_TICKERS;
    if (envStocks && envStocks.includes(',')) {
      return envStocks.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
    }

    // Randomize and select 15-20 stocks for variety
    const shuffled = [...popularStocks].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 18);
  }, []);

  const list = symbols?.length ? symbols : defaultList;
  const [items, setItems] = useState<TapeItem[]>([]);

  async function load() {
    try {
      const results = await Promise.allSettled(
        list.map(async sym => {
          try {
            const d = await fetchDaily(sym);
            const series = d?.series ?? [];
            const last = Number(d?.lastClose ?? series.at(-1)?.close ?? 0);
            const prev = Number(d?.prevClose ?? series.at(-2)?.close ?? last);
            const pct = prev && prev !== 0 ? ((last - prev) / prev) * 100 : 0;

            // Only include if we have valid price data
            if (last > 0 && Number.isFinite(last)) {
              return { symbol: sym, price: last, changePct: pct };
            }
            return null;
          } catch (error) {
            console.warn(`Failed to fetch ${sym}:`, error);
            return null;
          }
        })
      );

      const validItems = results
        .filter((result): result is PromiseFulfilledResult<TapeItem | null> =>
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value)
        .filter((item): item is TapeItem => item !== null);

      if (validItems.length > 0) {
        setItems(validItems);
      }
    } catch (error) {
      console.warn('TickerTape: Failed to load data', error);
      // tape is cosmetic; fail silently
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, refreshSec * 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.join(','), refreshSec]);

  if (!items.length) return null;

  // Duplicate row for seamless loop
  const row = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-white/5">
      <div
        className="flex whitespace-nowrap gap-6 will-change-transform ticker-scroll"
        style={{ animationDuration: `${speedSec}s` }}
      >
        {row.map((it, idx) => {
          const up = it.changePct >= 0;
          return (
            <div
              key={`${it.symbol}-${idx}`}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/20 border border-white/10"
              title={`${it.symbol} ${up ? '+' : ''}${it.changePct.toFixed(2)}%`}
            >
              <span className="font-semibold tracking-wide text-slate-200">{it.symbol}</span>
              <span className="text-slate-300 tabular-nums">${formatPrice(it.price)}</span>
              <span
                className={
                  'text-xs px-2 py-0.5 rounded-full tabular-nums ' +
                  (up
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/20')
                }
                aria-label={up ? 'Up' : 'Down'}
              >
                {up ? '▲' : '▼'} {Math.abs(it.changePct).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>

      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0B0D12] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0B0D12] to-transparent" />
    </div>
  );
}