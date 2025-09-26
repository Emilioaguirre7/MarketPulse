export const api = {
  analyze: async (ticker: string) => {
    const response = await fetch(`/api/news/${ticker}`)
    if (!response.ok) {
      throw new Error(`Failed to analyze ${ticker}: ${response.statusText}`)
    }
    return response.json()
  },
  dailyPrices: async (ticker: string) => {
    const response = await fetch(`/api/prices/daily/${ticker}`)
    if (!response.ok) {
      throw new Error('Failed to fetch daily prices')
    }
    return response.json()
  },
}