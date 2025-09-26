'use client'

import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import TickerModal from '@/components/TickerModal'
import { Topbar } from '@/components/Topbar'
import { TickerGrid, TickerGridRef } from '@/components/TickerGrid'
import { useToast } from '@/components/Toast'
import { Ticker } from '@marketpulse/shared'

const TickerTape = dynamic(() => import('@/components/TickerTape'), { ssr: false })

export default function HomePage() {
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const tickerGridRef = useRef<TickerGridRef>(null)
  const { showToast, ToastComponent } = useToast()

  const handleTickerClick = (ticker: string) => {
    setSelectedTicker(ticker)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTicker(null)
  }

  const handleAddTicker = async (ticker: string) => {
    if (tickerGridRef.current) {
      await tickerGridRef.current.addTicker(ticker)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <Topbar onAddTicker={handleAddTicker} />

      {/* Ticker Tape */}
      <TickerTape />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TickerGrid
          ref={tickerGridRef}
          onTickerClick={handleTickerClick}
          onShowToast={showToast}
        />

        {/* Additional Info Section */}
        <div className="mt-16 bg-gray-800 rounded-2xl shadow-sm border border-gray-700 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">
              How It Works
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto">
              MarketPulse analyzes recent financial news headlines using advanced sentiment analysis
              to provide insights into market perception of your favorite stocks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3v6m0 0l-3-3m3 3l3-3" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Collect Headlines</h3>
              <p className="text-gray-300">
                We gather the latest financial news headlines from reliable sources for each stock.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-success-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">AI Analysis</h3>
              <p className="text-gray-300">
                Our AI analyzes the sentiment of each headline using advanced natural language processing.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-warning-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">Present Insights</h3>
              <p className="text-gray-300">
                View aggregated sentiment scores and individual headline analysis alongside price charts.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p className="mb-2">
              Built with Next.js, FastAPI, and AI-powered sentiment analysis
            </p>
            <p className="text-sm">
              Data updates every 5 minutes • Not financial advice
            </p>
            <p className="text-xs text-slate-500 text-center mt-8 mb-4">
              MarketPulse provides sentiment insights for educational purposes only. Not financial advice.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal */}
      <TickerModal
        ticker={selectedTicker || ''}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Toast notifications */}
      <ToastComponent />
    </div>
  )
}