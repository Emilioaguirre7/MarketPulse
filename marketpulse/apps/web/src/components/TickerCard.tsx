'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { api } from '@/lib/api'
import { SentimentBadge } from './SentimentBadge'
import { useInView } from '@/lib/useInView'
import { Ticker } from '@marketpulse/shared'

interface TickerCardProps {
  ticker: Ticker
  onClick: () => void
  onRemove?: () => void
  showRemoveButton?: boolean
  index?: number // For staggered animations
}

// Simple sparkline component using inline SVG
function Sparkline({ data, className }: { data: number[], className?: string }) {
  if (!data || data.length < 2) return null

  const width = 120
  const height = 24
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min

  if (range === 0) return null

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((value - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')

  const isPositive = data[data.length - 1] >= data[0]
  const strokeColor = isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'

  return (
    <svg
      width={width}
      height={height}
      className={`${className} sparkline-reveal overflow-visible`}
      viewBox={`0 0 ${width} ${height}`}
    >
      <polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        points={points}
        className="opacity-70"
      />
    </svg>
  )
}

// Animated number component
function AnimatedNumber({ value, previousValue, className, prefix = '$', suffix = '' }: {
  value: number
  previousValue?: number
  className?: string
  prefix?: string
  suffix?: string
}) {
  const [displayValue, setDisplayValue] = useState(value)
  const [animationClass, setAnimationClass] = useState('')
  const animationRef = useRef<number>()

  useEffect(() => {
    if (previousValue !== undefined && previousValue !== value) {
      const isUp = value > previousValue
      setAnimationClass(isUp ? 'price-flash-up' : 'price-flash-down')

      // Animate the number
      const start = previousValue
      const end = value
      const duration = 300
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeOut = 1 - Math.pow(1 - progress, 2)
        const current = start + (end - start) * easeOut

        setDisplayValue(current)

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        }
      }

      animationRef.current = requestAnimationFrame(animate)

      // Remove animation class after animation completes
      const timeout = setTimeout(() => setAnimationClass(''), 300)

      return () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current)
        clearTimeout(timeout)
      }
    } else {
      setDisplayValue(value)
    }
  }, [value, previousValue])

  return (
    <span className={`${className} ${animationClass} tabular-nums`}>
      {prefix}{displayValue.toFixed(2)}{suffix}
    </span>
  )
}

export function TickerCard({ ticker, onClick, onRemove, showRemoveButton, index = 0 }: TickerCardProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analyze', ticker],
    queryFn: () => api.analyze(ticker),
    staleTime: 1000 * 60 * 1, // 1 minute
  })

  const { data: priceData, isLoading: priceLoading } = useQuery({
    queryKey: ['dailyPrices', ticker],
    queryFn: () => api.dailyPrices(ticker),
    staleTime: 1000 * 60 * 15, // 15 minutes
  })

  // Intersection observer for entrance animation
  const { elementRef, isInView } = useInView({ threshold: 0.2 })

  // Store previous price for animation
  const [previousPrice, setPreviousPrice] = useState<number>()
  const currentPrice = priceData?.lastClose || priceData?.series?.at(-1)?.close

  useEffect(() => {
    if (currentPrice && currentPrice !== previousPrice) {
      setPreviousPrice(currentPrice)
    }
  }, [currentPrice, previousPrice])

  // Extract sparkline data from series (last 20 points)
  const sparklineData = priceData?.series?.slice(-20).map(p => p.close) || []

  const companyNames: Record<string, string> = {
    AAPL: 'Apple Inc.',
    MSFT: 'Microsoft Corporation',
    AMZN: 'Amazon.com Inc.',
    TSLA: 'Tesla Inc.',
    NVDA: 'NVIDIA Corporation',
    SPOT: 'Spotify Technology S.A.',
    // Add more company names as needed
  }

  // Only show error for price data, not sentiment data
  const hasPriceError = priceData === undefined && !priceLoading && error
  const hasNoSentiment = !isLoading && !data && !error
  const displayName = companyNames[ticker] || `${ticker} Inc.`

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove?.()
  }

  // Show error card only if we can't load price data
  if (hasPriceError) {
    return (
      <div
        ref={elementRef}
        className={`card cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 relative focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 ${
          isInView ? 'fade-slide-up' : 'opacity-0'
        }`}
        style={{ animationDelay: `${index * 100}ms` }}
        tabIndex={0}
      >
        {/* Remove button */}
        {showRemoveButton && onRemove && (
          <button
            onClick={handleRemoveClick}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-400 transition-colors duration-200 z-10"
            aria-label={`Remove ${ticker} from watchlist`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-300 mb-2">{ticker}</h3>
          <p className="text-sm text-red-400">No data available</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={elementRef}
      className={`card cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200 relative focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 ${
        isInView ? 'fade-slide-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {/* Remove button */}
      {showRemoveButton && onRemove && (
        <button
          onClick={handleRemoveClick}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-400 transition-colors duration-200 z-10"
          aria-label={`Remove ${ticker} from watchlist`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className="space-y-4">
        {/* Sparkline at top */}
        {sparklineData.length > 0 && (
          <div className="flex justify-end -mb-2">
            <Sparkline data={sparklineData} className="" />
          </div>
        )}

        {/* Header with ticker and sentiment pill */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-100">{ticker}</h3>
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-6 bg-gray-600 rounded-full w-20"></div>
            </div>
          ) : data ? (
            <span
              className={`
                inline-flex items-center gap-1 font-medium rounded-full text-xs px-3 py-1 transition-all duration-200
                hover:shadow-sm
                ${data.aggregate.label === 'positive' ? 'bg-green-600/20 text-green-400 hover:shadow-green-500/20' :
                  data.aggregate.label === 'negative' ? 'bg-red-600/20 text-red-400 hover:shadow-red-500/20' :
                  'bg-gray-600/20 text-gray-400 hover:shadow-gray-500/20'}
              `}
            >
              <span className={`w-2 h-2 rounded-full ${
                data.aggregate.label === 'positive' ? 'bg-green-500' :
                data.aggregate.label === 'negative' ? 'bg-red-500' :
                'bg-gray-400'
              }`} />
              {data.aggregate.label === 'positive' ? 'Positive' :
               data.aggregate.label === 'negative' ? 'Negative' : 'Neutral'}
              {data.aggregate.score !== undefined && (
                <span className="opacity-75">({data.aggregate.score > 0 ? '+' : ''}{data.aggregate.score.toFixed(3)})</span>
              )}
            </span>
          ) : error ? (
            <span className="inline-flex items-center gap-1 font-medium rounded-full text-xs px-3 py-1 bg-gray-600/20 text-gray-400">
              <span className="w-2 h-2 bg-gray-500 rounded-full" />
              No data
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-medium rounded-full text-xs px-3 py-1 bg-yellow-600/20 text-yellow-400">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              Computing...
            </span>
          )}
        </div>

        {/* Company name and price info */}
        <div className="space-y-2">
          <p className="text-sm text-gray-300">{displayName}</p>
          {priceLoading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-600 rounded w-16"></div>
            </div>
          ) : priceData && priceData.series && priceData.series.length > 0 ? (
            <div>
              <div className="text-lg font-semibold text-gray-100">
                <AnimatedNumber
                  value={priceData.series[priceData.series.length - 1].close}
                  previousValue={previousPrice}
                  className=""
                />
              </div>
              {priceData.prevClose && (
                <div className={`text-sm font-medium ${
                  priceData.lastClose && priceData.prevClose
                    ? (priceData.lastClose - priceData.prevClose) >= 0
                      ? 'text-green-400'
                      : 'text-red-400'
                    : 'text-gray-400'
                }`}>
                  {priceData.lastClose && priceData.prevClose && (
                    <>
                      {(priceData.lastClose - priceData.prevClose) >= 0 ? '+' : ''}
                      {(priceData.lastClose - priceData.prevClose).toFixed(2)} (
                      {(((priceData.lastClose - priceData.prevClose) / priceData.prevClose) * 100).toFixed(2)}%)
                    </>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="relative h-3 bg-gray-600 rounded w-full overflow-hidden shimmer"></div>
              <div className="relative h-3 bg-gray-600 rounded w-3/4 overflow-hidden shimmer"></div>
              <div className="relative h-3 bg-gray-600 rounded w-1/2 overflow-hidden shimmer"></div>
            </div>
          </div>
        ) : data ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-300">
              <span>Headlines analyzed</span>
              <span className="font-medium">{data.headlines.length}</span>
            </div>
            <div className="text-xs text-gray-400">
              Last updated: {new Date(data.updatedAt).toLocaleString()}
            </div>
            {data.headlines.length > 0 && (
              <div className="pt-2 border-t border-gray-700">
                <p className="text-sm text-gray-200 line-clamp-2">
                  Latest: {data.headlines[0].title}
                </p>
              </div>
            )}
          </div>
        ) : error ? (
          <div className="space-y-3">
            <div className="text-sm text-yellow-400 flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              Gathering news data...
            </div>
            <div className="text-xs text-gray-400">
              This may take a moment for new stocks
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-yellow-400 flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              Analyzing sentiment...
            </div>
            <div className="text-xs text-gray-400">
              Please wait while we process news data
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-700">
          <button className="text-primary-400 text-sm font-medium hover:text-primary-300 transition-colors duration-200">
            View Details →
          </button>
        </div>
      </div>
    </div>
  )
}