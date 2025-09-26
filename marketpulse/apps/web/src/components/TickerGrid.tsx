'use client'

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { TickerCard } from './TickerCard'
import { loadWatchlist, saveWatchlist, MAX_WATCHLIST_SIZE } from '@/lib/watchlist'
import { api } from '@/lib/api'
import { Ticker } from '@/lib/shared'

interface TickerGridProps {
  onTickerClick: (ticker: string) => void
  onShowToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

export interface TickerGridRef {
  addTicker: (ticker: string) => Promise<void>
}

export const TickerGrid = forwardRef<TickerGridRef, TickerGridProps>(({ onTickerClick, onShowToast }, ref) => {
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load watchlist on mount
  useEffect(() => {
    const savedWatchlist = loadWatchlist()
    setWatchlist(savedWatchlist)
    setIsLoading(false)
  }, [])

  // Save watchlist whenever it changes
  useEffect(() => {
    if (!isLoading) {
      saveWatchlist(watchlist)
    }
  }, [watchlist, isLoading])

  const handleAddTicker = async (ticker: string) => {
    // Check if already exists
    if (watchlist.includes(ticker)) {
      onShowToast('Already on your list.', 'info')
      return
    }

    // Check limit
    if (watchlist.length >= MAX_WATCHLIST_SIZE) {
      onShowToast(`Limit reached (${MAX_WATCHLIST_SIZE}). Remove a card to add more.`, 'error')
      return
    }

    try {
      // Validate ticker by calling price API (this is the critical validation)
      const response = await api.dailyPrices(ticker)

      if (!response.series || response.series.length === 0) {
        onShowToast("Couldn't find that symbol.", 'error')
        return
      }

      // Add to watchlist - sentiment analysis can fail without blocking the add
      setWatchlist(prev => [...prev, ticker])
      onShowToast(`${ticker} added to your watchlist!`, 'success')

      // Try to preload sentiment data in the background, but don't block on it
      try {
        await api.analyze(ticker)
      } catch (sentimentError) {
        // Sentiment analysis failed, but that's OK - the card will show loading state
        console.log(`Sentiment analysis for ${ticker} will be calculated in background`)
      }
    } catch (error) {
      onShowToast("Couldn't find that symbol.", 'error')
    }
  }

  const handleRemoveTicker = (ticker: string) => {
    setWatchlist(prev => prev.filter(t => t !== ticker))
    onShowToast(`${ticker} removed from your watchlist.`, 'info')
  }

  // Expose handleAddTicker via ref
  useImperativeHandle(ref, () => ({
    addTicker: handleAddTicker
  }), [handleAddTicker])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="card"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="space-y-4">
              <div className="flex justify-end -mb-2">
                <div className="relative h-6 bg-gray-600 rounded w-24 overflow-hidden shimmer"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="relative h-6 bg-gray-600 rounded w-16 overflow-hidden shimmer"></div>
                <div className="relative h-6 bg-gray-600 rounded-full w-20 overflow-hidden shimmer"></div>
              </div>
              <div className="space-y-2">
                <div className="relative h-4 bg-gray-600 rounded w-32 overflow-hidden shimmer"></div>
                <div className="relative h-6 bg-gray-600 rounded w-20 overflow-hidden shimmer"></div>
              </div>
              <div className="space-y-2">
                <div className="relative h-3 bg-gray-600 rounded w-full overflow-hidden shimmer"></div>
                <div className="relative h-3 bg-gray-600 rounded w-3/4 overflow-hidden shimmer"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {watchlist.map((ticker, index) => (
        <TickerCard
          key={ticker}
          ticker={ticker as Ticker}
          onClick={() => onTickerClick(ticker)}
          onRemove={() => handleRemoveTicker(ticker)}
          showRemoveButton={true}
          index={index}
        />
      ))}
    </div>
  )
})

TickerGrid.displayName = 'TickerGrid'