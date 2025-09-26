'use client'

import { useState, useCallback } from 'react'
import { validateTicker } from '@/lib/watchlist'
import { api } from '@/lib/api'

interface TopbarProps {
  onAddTicker: (ticker: string) => void
}

export function Topbar({ onAddTicker }: TopbarProps) {
  const [searchValue, setSearchValue] = useState('')
  const [isValidating, setIsValidating] = useState(false)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    const ticker = validateTicker(searchValue)
    if (!ticker) return

    setIsValidating(true)
    try {
      await onAddTicker(ticker)
    } finally {
      setIsValidating(false)
      setSearchValue('')
    }
  }, [searchValue, onAddTicker])

  const handleAddClick = useCallback(() => {
    const ticker = validateTicker(searchValue)
    if (ticker) {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent)
    }
  }, [searchValue, handleSubmit])

  return (
    <header className="bg-gray-800 shadow-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Logo and description */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-100 mb-2">
              MarketPulse
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              AI-Powered Stock Sentiment Dashboard
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <label htmlFor="ticker-search" className="sr-only">
                  Add ticker symbol
                </label>
                <input
                  id="ticker-search"
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Add ticker (e.g., NVDA)"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={isValidating}
                />
              </div>
              <button
                type="button"
                onClick={handleAddClick}
                disabled={isValidating || !searchValue.trim()}
                aria-label="Add ticker to watchlist"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
              >
                {isValidating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>
          </form>

          <p className="text-gray-400 max-w-2xl text-center text-sm">
            Track real-time sentiment analysis of financial news for stocks.
            Click on any card to view detailed analysis, price charts, and recent headlines.
          </p>
        </div>
      </div>
    </header>
  )
}