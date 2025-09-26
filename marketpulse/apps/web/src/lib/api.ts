import { MarketPulseClient } from './shared'

const NLP_BASE_URL = process.env.NEXT_PUBLIC_NLP_BASE_URL || 'http://localhost:8000'

export const nlpClient = new MarketPulseClient(NLP_BASE_URL)

export const api = {
  health: () => nlpClient.getHealth(),
  analyze: (ticker: string) => nlpClient.analyze(ticker),
  prices: (ticker: string) => nlpClient.getPrices(ticker),
  dailyPrices: async (ticker: string) => {
    const response = await fetch(`/api/prices/daily/${ticker}`)
    if (!response.ok) {
      throw new Error('Failed to fetch daily prices')
    }
    return response.json()
  },
  headlines: (ticker: string) => nlpClient.getHeadlines(ticker),
}