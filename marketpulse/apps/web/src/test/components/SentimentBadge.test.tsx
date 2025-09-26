import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SentimentBadge } from '@/components/SentimentBadge'

describe('SentimentBadge', () => {
  it('renders positive sentiment correctly', () => {
    render(<SentimentBadge label="positive" score={0.5} />)

    expect(screen.getByText('Positive')).toBeInTheDocument()
    expect(screen.getByText('(+0.500)')).toBeInTheDocument()
  })

  it('renders negative sentiment correctly', () => {
    render(<SentimentBadge label="negative" score={-0.3} />)

    expect(screen.getByText('Negative')).toBeInTheDocument()
    expect(screen.getByText('(-0.300)')).toBeInTheDocument()
  })

  it('renders neutral sentiment correctly', () => {
    render(<SentimentBadge label="neutral" score={0.01} />)

    expect(screen.getByText('Neutral')).toBeInTheDocument()
    expect(screen.getByText('(+0.010)')).toBeInTheDocument()
  })

  it('renders without score when not provided', () => {
    render(<SentimentBadge label="positive" />)

    expect(screen.getByText('Positive')).toBeInTheDocument()
    expect(screen.queryByText(/\(/)).not.toBeInTheDocument()
  })

  it('applies correct CSS classes for different sizes', () => {
    const { rerender } = render(<SentimentBadge label="positive" size="sm" />)
    expect(screen.getByText('Positive').closest('span')).toHaveClass('px-2', 'py-1', 'text-xs')

    rerender(<SentimentBadge label="positive" size="lg" />)
    expect(screen.getByText('Positive').closest('span')).toHaveClass('px-4', 'py-2', 'text-base')
  })
})