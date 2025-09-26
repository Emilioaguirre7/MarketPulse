'use client'

import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { PricePoint } from '@marketpulse/shared'

interface StockChartProps {
  data: PricePoint[]
  ticker: string
  className?: string
}

export function StockChart({ data, ticker, className = '' }: StockChartProps) {
  const chartData = useMemo(() => {
    return data.map((point) => ({
      date: new Date(point.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      price: point.close,
      fullDate: point.date,
    }))
  }, [data])

  const { minPrice, maxPrice, priceChange, priceChangePercent } = useMemo(() => {
    if (data.length === 0) return { minPrice: 0, maxPrice: 0, priceChange: 0, priceChangePercent: 0 }

    const prices = data.map(p => p.close)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const firstPrice = data[0].close
    const lastPrice = data[data.length - 1].close
    const change = lastPrice - firstPrice
    const changePercent = (change / firstPrice) * 100

    return {
      minPrice: min,
      maxPrice: max,
      priceChange: change,
      priceChangePercent: changePercent,
    }
  }, [data])

  const lineColor = priceChange >= 0 ? '#22c55e' : '#ef4444'

  if (!data.length) {
    return (
      <div className={`flex items-center justify-center h-64 bg-gray-700 rounded-lg ${className}`}>
        <p className="text-gray-400">No chart data</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-100">{ticker} - 90 Day Price Chart</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-100">${data[data.length - 1]?.close.toFixed(2)}</div>
            <div className={`text-sm font-medium ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
            </div>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              fontSize={12}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={['dataMin - 5', 'dataMax + 5']}
              stroke="#9ca3af"
              fontSize={12}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              label={{ value: 'Close', angle: -90, position: 'insideLeft', style: { fill: '#9ca3af' } }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#f3f4f6',
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: lineColor }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}