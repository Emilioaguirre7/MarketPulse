import { AnalyzeResponse, PricesResponse, HealthResponse, Ticker, TickerSchema } from './types';

export class MarketPulseClient {
  constructor(private baseUrl: string) {}

  private validateTicker(ticker: string): Ticker {
    const result = TickerSchema.safeParse(ticker.toUpperCase());
    if (!result.success) {
      throw new Error(`Invalid ticker format: ${ticker}. Must be 1-5 letters only.`);
    }
    return result.data;
  }

  async getHealth(): Promise<HealthResponse> {
    const response = await fetch(`${this.baseUrl}/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }
    return response.json() as Promise<HealthResponse>;
  }

  async getHeadlines(ticker: string) {
    const validTicker = this.validateTicker(ticker);
    const response = await fetch(`${this.baseUrl}/headlines/${validTicker}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch headlines for ${validTicker}: ${response.statusText}`);
    }
    return response.json();
  }

  async getPrices(ticker: string): Promise<PricesResponse> {
    const validTicker = this.validateTicker(ticker);
    const response = await fetch(`${this.baseUrl}/prices/${validTicker}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch prices for ${validTicker}: ${response.statusText}`);
    }
    return response.json() as Promise<PricesResponse>;
  }

  async analyze(ticker: string): Promise<AnalyzeResponse> {
    const validTicker = this.validateTicker(ticker);
    const response = await fetch(`${this.baseUrl}/analyze/${validTicker}`);
    if (!response.ok) {
      throw new Error(`Failed to analyze ${validTicker}: ${response.statusText}`);
    }
    return response.json() as Promise<AnalyzeResponse>;
  }
}