import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { QueryProvider } from '@/lib/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MarketPulse - AI Stock Sentiment Dashboard',
  description: 'Track stock sentiment with AI-powered analysis of financial news',
  keywords: 'stocks, sentiment analysis, AI, financial news, AAPL, MSFT, AMZN, TSLA, NVDA',
  authors: [{ name: 'MarketPulse Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'MarketPulse - AI Stock Sentiment Dashboard',
    description: 'Track stock sentiment with AI-powered analysis of financial news',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <div className="min-h-screen bg-gray-50">
            {children}
          </div>
        </QueryProvider>
      </body>
    </html>
  )
}