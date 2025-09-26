import { SentimentLabel } from '@/lib/shared'

interface SentimentBadgeProps {
  label: SentimentLabel
  score?: number
  size?: 'sm' | 'md' | 'lg'
}

export function SentimentBadge({ label, score, size = 'md' }: SentimentBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  const labelColors = {
    positive: 'sentiment-positive',
    neutral: 'sentiment-neutral',
    negative: 'sentiment-negative',
  }

  const labelText = {
    positive: 'Positive',
    neutral: 'Neutral',
    negative: 'Negative',
  }

  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium rounded-full border
        ${sizeClasses[size]} ${labelColors[label]}
      `}
    >
      <span className={`w-2 h-2 rounded-full ${
        label === 'positive' ? 'bg-green-500' :
        label === 'negative' ? 'bg-red-500' :
        'bg-gray-400'
      }`} />
      {labelText[label]}
      {score !== undefined && (
        <span className="opacity-75">({score > 0 ? '+' : ''}{score.toFixed(3)})</span>
      )}
    </span>
  )
}