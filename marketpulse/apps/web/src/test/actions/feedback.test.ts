import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitFeedback, getFeedbackStats } from '@/app/actions/feedback'

// Mock Prisma
const mockPrisma = {
  feedback: {
    create: vi.fn(),
    aggregate: vi.fn(),
  },
}

vi.mock('@/lib/db', () => ({
  prisma: mockPrisma,
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('Feedback Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('submitFeedback', () => {
    it('should submit valid feedback successfully', async () => {
      const mockFeedback = {
        id: 'test-id',
        ticker: 'AAPL',
        rating: 5,
        notes: 'Great analysis!',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrisma.feedback.create.mockResolvedValue(mockFeedback)

      const result = await submitFeedback({
        ticker: 'AAPL',
        rating: 5,
        notes: 'Great analysis!',
      })

      expect(result).toEqual({ success: true, id: 'test-id' })
      expect(mockPrisma.feedback.create).toHaveBeenCalledWith({
        data: {
          ticker: 'AAPL',
          rating: 5,
          notes: 'Great analysis!',
        },
      })
    })

    it('should handle feedback without notes', async () => {
      const mockFeedback = {
        id: 'test-id',
        ticker: 'TSLA',
        rating: 3,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrisma.feedback.create.mockResolvedValue(mockFeedback)

      const result = await submitFeedback({
        ticker: 'TSLA',
        rating: 3,
      })

      expect(result).toEqual({ success: true, id: 'test-id' })
      expect(mockPrisma.feedback.create).toHaveBeenCalledWith({
        data: {
          ticker: 'TSLA',
          rating: 3,
          notes: undefined,
        },
      })
    })

    it('should throw error for invalid ticker', async () => {
      await expect(
        submitFeedback({
          ticker: 'INVALID',
          rating: 5,
        })
      ).rejects.toThrow('Invalid ticker: INVALID')
    })

    it('should throw error for invalid rating', async () => {
      await expect(
        submitFeedback({
          ticker: 'AAPL',
          rating: 0, // Invalid rating
        })
      ).rejects.toThrow()
    })
  })

  describe('getFeedbackStats', () => {
    it('should return feedback stats for valid ticker', async () => {
      mockPrisma.feedback.aggregate.mockResolvedValue({
        _avg: { rating: 4.5 },
        _count: { id: 10 },
      })

      const result = await getFeedbackStats('AAPL')

      expect(result).toEqual({
        averageRating: 4.5,
        totalFeedback: 10,
      })

      expect(mockPrisma.feedback.aggregate).toHaveBeenCalledWith({
        where: { ticker: 'AAPL' },
        _avg: { rating: true },
        _count: { id: true },
      })
    })

    it('should return default values for no feedback', async () => {
      mockPrisma.feedback.aggregate.mockResolvedValue({
        _avg: { rating: null },
        _count: { id: 0 },
      })

      const result = await getFeedbackStats('NVDA')

      expect(result).toEqual({
        averageRating: 0,
        totalFeedback: 0,
      })
    })

    it('should return default values for invalid ticker', async () => {
      const result = await getFeedbackStats('INVALID')

      expect(result).toEqual({
        averageRating: 0,
        totalFeedback: 0,
      })

      expect(mockPrisma.feedback.aggregate).not.toHaveBeenCalled()
    })
  })
})