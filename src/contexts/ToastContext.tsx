'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useToast, ToastContainer, Toast } from '@/components/ui/toast'

interface ToastContextType {
  success: (message: string, duration?: number) => string
  error: (message: string, duration?: number) => string
  info: (message: string, duration?: number) => string
  warning: (message: string, duration?: number) => string
  removeToast: (id: string) => void
  addToast: (toast: Omit<Toast, 'id'>) => string
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const { toasts, success, error, info, warning, removeToast, addToast } = useToast()

  const value = {
    success,
    error,
    info,
    warning,
    removeToast,
    addToast,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider')
  }
  return context
}