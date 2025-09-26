'use client'

import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export function Toast({ message, type, isVisible, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose, duration])

  if (!isVisible) return null

  const bgColor = {
    success: 'bg-green-600/90',
    error: 'bg-red-600/90',
    info: 'bg-blue-600/90'
  }[type]

  const icon = {
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }[type]

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-right-full duration-300`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
          aria-label="Close toast"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

interface UseToastReturn {
  showToast: (message: string, type?: ToastType) => void
  ToastComponent: () => JSX.Element | null
}

export function useToast(): UseToastReturn {
  const [toast, setToast] = useState<{ message: string; type: ToastType; id: number } | null>(null)

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type, id: Date.now() })
  }

  const hideToast = () => {
    setToast(null)
  }

  const ToastComponent = () => (
    <Toast
      message={toast?.message || ''}
      type={toast?.type || 'info'}
      isVisible={!!toast}
      onClose={hideToast}
    />
  )

  return { showToast, ToastComponent }
}