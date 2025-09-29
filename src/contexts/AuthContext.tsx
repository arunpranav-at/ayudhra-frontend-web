'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { authService } from '@/lib/api'

interface AuthContextType {
  isAuthenticated: boolean
  userType: 'user' | 'doctor' | 'admin' | null
  login: (token: string, type: 'user' | 'doctor' | 'admin') => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userType, setUserType] = useState<'user' | 'doctor' | 'admin' | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated on app start
    const token = authService.getToken()
    const type = authService.getUserType()
    
    if (token && type) {
      setIsAuthenticated(true)
      setUserType(type)
    }
    
    setIsLoading(false)
  }, [])

  const login = (token: string, type: 'user' | 'doctor' | 'admin') => {
    authService.setUserType(type)
    setIsAuthenticated(true)
    setUserType(type)
  }

  const logout = () => {
    authService.logout()
    setIsAuthenticated(false)
    setUserType(null)
    router.push('/auth/login')
  }

  const value = {
    isAuthenticated,
    userType,
    login,
    logout,
    isLoading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Route protection hook
export function useAuthGuard(allowedUserTypes?: ('user' | 'doctor' | 'admin')[]) {
  const { isAuthenticated, userType, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return

    // If not authenticated and not on auth pages, redirect to login
    if (!isAuthenticated && !pathname.startsWith('/auth')) {
      router.push('/auth/login')
      return
    }

    // If authenticated but user type not allowed for this route
    if (isAuthenticated && allowedUserTypes && userType && !allowedUserTypes.includes(userType)) {
      // Redirect to appropriate dashboard
      switch (userType) {
        case 'user':
          router.push('/user')
          break
        case 'doctor':
          router.push('/doctor')
          break
        case 'admin':
          router.push('/admin')
          break
        default:
          router.push('/auth/login')
      }
      return
    }

    // If authenticated and on auth pages, redirect to dashboard
    if (isAuthenticated && pathname.startsWith('/auth')) {
      switch (userType) {
        case 'user':
          router.push('/user')
          break
        case 'doctor':
          router.push('/doctor')
          break
        case 'admin':
          router.push('/admin')
          break
        default:
          router.push('/')
      }
      return
    }
  }, [isAuthenticated, userType, isLoading, pathname, router, allowedUserTypes])

  return { isAuthenticated, userType, isLoading }
}