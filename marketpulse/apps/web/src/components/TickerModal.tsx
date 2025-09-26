'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { SentimentBadge } from './SentimentBadge'
import { StockChart } from './StockChart'
import { FeedbackForm } from './FeedbackForm'
import { useEffect } from 'react'
import { Ticker } from '@/lib/shared'

type TickerModalProps = {
  isOpen: boolean
  ticker: string
  onClose: () => void
}

export default function TickerModal({ isOpen, ticker, onClose }: TickerModalProps) {
  const { data: analysisData, isLoading: analysisLoading } = useQuery({
    queryKey: ['analyze', ticker],
    queryFn: () => api.analyze(ticker!),
    enabled: !!ticker && isOpen,
    staleTime: 1000 * 60 * 5,
  })

  const { data: priceData, isLoading: priceLoading } = useQuery({
    queryKey: ['dailyPrices', ticker],
    queryFn: () => api.dailyPrices(ticker!),
    enabled: !!ticker && isOpen,
    staleTime: 1000 * 60 * 15, // 15 minutes
  })

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || !ticker) return null

  const companyNames: Record<string, string> = {
    AAPL: 'Apple Inc.',
    MSFT: 'Microsoft Corporation',
    AMZN: 'Amazon.com Inc.',
    TSLA: 'Tesla Inc.',
    NVDA: 'NVIDIA Corporation',
    SPOT: 'Spotify Technology S.A.',
    // Add more company names as needed
  }

  const displayName = companyNames[ticker] || `${ticker} Inc.`

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-100">{ticker}</h2>
              <p className="text-gray-300">{displayName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Sentiment Overview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-100">Sentiment Analysis</h3>
            {analysisLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-8 bg-gray-600 rounded w-40"></div>
                <div className="h-4 bg-gray-600 rounded w-60"></div>
              </div>
            ) : analysisData ? (
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <SentimentBadge
                    label={analysisData.aggregate.label}
                    score={analysisData.aggregate.score}
                    size="lg"
                  />
                  <div className="text-sm text-gray-300">
                    Based on {analysisData.headlines.length} recent headlines
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Sentiment reflects the tone of recent financial headlines. A positive score suggests headlines are leaning optimistic, not a guarantee of stock performance.
                </p>
                <div className="text-sm text-gray-400">
                  Last updated: {new Date(analysisData.updatedAt).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-yellow-400 flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing market sentiment...</span>
                </div>
                <p className="text-xs text-gray-400">
                  We're gathering recent news articles and analyzing their sentiment. This may take a moment for newer stocks.
                </p>
              </div>
            )}
          </div>

          {/* Price Chart */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-100">Price Chart</h3>
              <div className="text-xs text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded">
                Prices delayed ~15m
              </div>
            </div>
            {priceLoading ? (
              <div className="animate-pulse">
                <div className="h-64 bg-gray-600 rounded-lg"></div>
              </div>
            ) : priceData ? (
              <StockChart data={priceData.series} ticker={ticker} />
            ) : (
              <div className="h-64 flex items-center justify-center bg-gray-700 rounded-lg">
                <p className="text-gray-400">No chart data</p>
              </div>
            )}
          </div>

          {/* Headlines */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-100">Recent Headlines</h3>
            {analysisLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : analysisData && analysisData.headlines.length > 0 ? (
              <div className="space-y-4">
                {analysisData.headlines.map((headline, index) => (
                  <div key={index} className="p-4 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors duration-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-100 mb-2 leading-tight">
                          {headline.title}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span>{new Date(headline.publishedAt).toLocaleDateString()}</span>
                          <a
                            href={headline.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-400 hover:text-primary-300 transition-colors duration-200"
                          >
                            Read more →
                          </a>
                        </div>
                      </div>
                      {headline.score !== undefined && headline.label && (
                        <SentimentBadge
                          label={headline.label as any}
                          score={headline.score}
                          size="sm"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : analysisData && analysisData.headlines.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">📰 No recent news found</div>
                <div className="text-sm text-gray-500">
                  We'll keep looking for news articles about {ticker}. Check back later!
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-yellow-400 flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                  <span>Loading recent headlines...</span>
                </div>
                <div className="text-sm text-gray-400">
                  Gathering the latest news articles for sentiment analysis.
                </div>
              </div>
            )}
          </div>

          {/* Feedback Form */}
          <div className="border-t border-gray-700 pt-8">
            <FeedbackForm ticker={ticker as Ticker} />
          </div>
        </div>
      </div>
    </div>
  )
}