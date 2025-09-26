import { z } from 'zod';

// Define a flexible ticker validation schema
export const TickerSchema = z.string().regex(/^[A-Z]{1,5}$/, 'Ticker must be 1-5 uppercase letters');
export type Ticker = z.infer<typeof TickerSchema>;

// Keep a list of default/popular tickers for UI purposes
export const DEFAULT_TICKERS = ['AAPL', 'MSFT', 'AMZN', 'TSLA', 'NVDA'] as const;

export const SentimentLabel = z.enum(['positive', 'neutral', 'negative']);
export type SentimentLabel = z.infer<typeof SentimentLabel>;

export const HeadlineSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  publishedAt: z.string().datetime(),
  score: z.number().optional(),
  label: SentimentLabel.optional(),
});

export type Headline = z.infer<typeof HeadlineSchema>;

export const PricePointSchema = z.object({
  date: z.string(),
  close: z.number(),
});

export type PricePoint = z.infer<typeof PricePointSchema>;

export const AggregateSentimentSchema = z.object({
  score: z.number().min(-1).max(1),
  label: SentimentLabel,
});

export type AggregateSentiment = z.infer<typeof AggregateSentimentSchema>;

export const AnalyzeResponseSchema = z.object({
  ticker: TickerSchema,
  updatedAt: z.string().datetime(),
  aggregate: AggregateSentimentSchema,
  headlines: z.array(HeadlineSchema),
});

export type AnalyzeResponse = z.infer<typeof AnalyzeResponseSchema>;

export const PricesResponseSchema = z.object({
  ticker: TickerSchema,
  series: z.array(PricePointSchema),
});

export type PricesResponse = z.infer<typeof PricesResponseSchema>;

export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export const FeedbackSchema = z.object({
  id: z.string().optional(),
  ticker: TickerSchema,
  rating: z.number().min(1).max(5),
  notes: z.string().optional(),
  createdAt: z.string().datetime().optional(),
});

export type Feedback = z.infer<typeof FeedbackSchema>;