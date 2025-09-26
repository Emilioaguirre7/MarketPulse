'use server'

import { prisma } from '@/lib/db'
import { FeedbackSchema, TickerSchema } from '@/lib/shared'
import { revalidatePath } from 'next/cache'

export async function submitFeedback(data: {
  ticker: string
  rating: number
  notes?: string
}) {
  try {
    // Validate input using shared schema
    const validatedData = FeedbackSchema.parse({
      ticker: data.ticker,
      rating: data.rating,
      notes: data.notes || undefined,
      createdAt: new Date().toISOString(),
    })

    // Ticker validation is already handled by FeedbackSchema

    // Save to database
    const feedback = await prisma.feedback.create({
      data: {
        ticker: validatedData.ticker,
        rating: validatedData.rating,
        notes: validatedData.notes,
      },
    })

    // Revalidate any pages that might show feedback stats
    revalidatePath('/')

    return { success: true, id: feedback.id }
  } catch (error) {
    console.error('Failed to submit feedback:', error)
    throw new Error('Failed to submit feedback')
  }
}

export async function getFeedbackStats(ticker: string) {
  try {
    // Validate ticker format
    const validTicker = TickerSchema.parse(ticker.toUpperCase())

    const stats = await prisma.feedback.aggregate({
      where: { ticker: validTicker },
      _avg: { rating: true },
      _count: { id: true },
    })

    return {
      averageRating: stats._avg.rating || 0,
      totalFeedback: stats._count.id,
    }
  } catch (error) {
    console.error('Failed to get feedback stats:', error)
    return { averageRating: 0, totalFeedback: 0 }
  }
}