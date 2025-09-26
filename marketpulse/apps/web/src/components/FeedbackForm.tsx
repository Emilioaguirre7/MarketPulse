'use client'

import { useState } from 'react'
import { Ticker } from '@marketpulse/shared'
import { submitFeedback } from '@/app/actions/feedback'

interface FeedbackFormProps {
  ticker: Ticker
}

export function FeedbackForm({ ticker }: FeedbackFormProps) {
  const [rating, setRating] = useState<number>(0)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return

    setIsSubmitting(true)
    try {
      await submitFeedback({ ticker, rating, notes })
      setSubmitted(true)
      setRating(0)
      setNotes('')
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-4">
        <div className="text-success-600 text-lg font-medium mb-2">Thank you for your feedback!</div>
        <button
          onClick={() => setSubmitted(false)}
          className="text-primary-600 text-sm hover:text-primary-700 transition-colors duration-200"
        >
          Submit another rating
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Was this sentiment analysis helpful?</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating (1-5 stars)
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition-colors duration-200 ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Additional comments (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Share your thoughts about the accuracy of this sentiment analysis..."
          />
        </div>

        <button
          type="submit"
          disabled={rating === 0 || isSubmitting}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  )
}