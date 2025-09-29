'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Leaf, Eye, EyeOff, User, Stethoscope, Shield, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { authService } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useToastContext } from '@/contexts/ToastContext'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const { success, error: showError } = useToastContext()
  const initialRole = searchParams.get('role') || 'user'
  const signupSuccess = searchParams.get('signup') === 'success'
  
  const [userType, setUserType] = useState<'user' | 'doctor' | 'admin'>(initialRole as 'user' | 'doctor' | 'admin')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null) // Clear error when user starts typing
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Call appropriate login API based on user type
      let response;
      switch (userType) {
        case 'user':
          response = await authService.loginPatient(formData)
          break
        case 'doctor':
          response = await authService.loginDoctor(formData)
          break
        case 'admin':
          response = await authService.loginAdmin(formData)
          break
        default:
          throw new Error('Invalid user type')
      }

      // Update authentication context
      login(response.token, userType)
      success(`Welcome back! Redirecting to your ${userType} dashboard...`)
      
      // Redirect based on user type
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
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.'
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ayurveda-mandala flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Leaf className="h-12 w-12 text-white" />
              <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/90">Sign in to your Ayudhra account</p>
        </div>

        <Card className="bg-white shadow-xl border-0">
          <CardHeader>
            {signupSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                Account created successfully! Please sign in with your credentials.
              </div>
            )}
            
            {/* User Type Selection */}
            <div className="flex space-x-2 mb-6">
              <button
                type="button"
                onClick={() => setUserType('user')}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  userType === 'user'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <User className={`h-6 w-6 mx-auto mb-1 ${userType === 'user' ? 'text-green-600' : 'text-gray-500'}`} />
                <div className={`text-sm font-medium ${userType === 'user' ? 'text-green-600' : 'text-gray-800'}`}>
                  User
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setUserType('doctor')}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  userType === 'doctor'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <Stethoscope className={`h-6 w-6 mx-auto mb-1 ${userType === 'doctor' ? 'text-purple-600' : 'text-gray-500'}`} />
                <div className={`text-sm font-medium ${userType === 'doctor' ? 'text-purple-600' : 'text-gray-800'}`}>
                  Doctor
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setUserType('admin')}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  userType === 'admin'
                    ? 'border-amber-600 bg-amber-50'
                    : 'border-gray-200 hover:border-amber-300'
                }`}
              >
                <Shield className={`h-6 w-6 mx-auto mb-1 ${userType === 'admin' ? 'text-amber-600' : 'text-gray-500'}`} />
                <div className={`text-sm font-medium ${userType === 'admin' ? 'text-amber-600' : 'text-gray-800'}`}>
                  Admin
                </div>
              </button>
            </div>

            <CardTitle className="text-gray-900 text-xl font-bold">
              Sign In as {userType.charAt(0).toUpperCase() + userType.slice(1)}
            </CardTitle>
            <CardDescription className="text-gray-600">
              Enter your credentials to access your {userType} dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-800">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="w-full h-12 px-4 text-gray-900 bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-semibold mb-2 text-gray-800">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full h-12 px-4 pr-12 text-gray-900 bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded transition-colors"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-700 font-medium">
                    Remember me
                  </label>
                </div>

                <Link href="/auth/forgot-password" className="text-sm text-green-600 hover:text-green-700 hover:underline font-semibold transition-colors">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full mt-2 mb-4" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              <div className="text-center pt-4 border-t border-gray-200">
                <span className="text-gray-600">Don&apos;t have an account? </span>
                <Link href="/auth/signup" className="text-green-600 hover:text-green-700 hover:underline font-semibold transition-colors">
                  Sign up here
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}