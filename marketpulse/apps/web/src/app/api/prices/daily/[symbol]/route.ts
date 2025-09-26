import { NextRequest, NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2'

export const runtime = 'nodejs'
export const revalidate = 900 // 15 minutes

interface PricePoint {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface PriceResponse {
  ticker: string
  series: PricePoint[]
  prevClose: number | null
  lastClose: number | null
  delayed: boolean
}

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const symbol = params.symbol.toUpperCase()

    // Get historical data for the last 90 days
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - 90)

    const queryOptions = {
      period1: startDate,
      period2: endDate,
      interval: '1d' as const,
    }

    const result = await yahooFinance.historical(symbol, queryOptions)

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: 'No data found for symbol' },
        { status: 404 }
      )
    }

    // Convert to our format
    const series: PricePoint[] = result.map((item) => ({
      date: item.date.toISOString().split('T')[0], // YYYY-MM-DD format
      open: item.open || 0,
      high: item.high || 0,
      low: item.low || 0,
      close: item.close || 0,
      volume: item.volume || 0,
    }))

    // Sort by date to ensure proper order
    series.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const response: PriceResponse = {
      ticker: symbol,
      series,
      prevClose: series.length > 1 ? series[series.length - 2].close : null,
      lastClose: series.length > 0 ? series[series.length - 1].close : null,
      delayed: true,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching price data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch price data' },
      { status: 500 }
    )
  }
}