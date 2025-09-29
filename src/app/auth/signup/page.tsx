'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Leaf, User, Stethoscope, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { authService, type PatientSignupRequest, type DoctorSignupRequest } from '@/lib/api'
import { useToastContext } from '@/contexts/ToastContext'

export default function SignUpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { success, error: showError } = useToastContext()
  const initialRole = searchParams.get('role') || 'user'
  
  const [userType, setUserType] = useState<'user' | 'doctor'>(initialRole as 'user' | 'doctor')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    // Common fields
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // User specific
    abhaId: '',
    dateOfBirth: '',
    gender: '',
    height: '',
    weight: '',
    medicalHistory: '',
    allergies: '',
    currentMedications: '',
    
    // Doctor specific
    hprId: '',
    qualification: '',
    specialization: '',
    experience: '',
    clinicAddress: '',
    consultationFee: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setError(null) // Clear error when user starts typing
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = (): string | null => {
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match'
    }
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long'
    }
    if (!formData.email.includes('@')) {
      return 'Please enter a valid email address'
    }
    if (!formData.phone.trim()) {
      return 'Phone number is required'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate form
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setIsLoading(false)
      return
    }

    try {
      if (userType === 'user') {
        const patientData: PatientSignupRequest = {
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          dob: formData.dateOfBirth,
          gender: formData.gender as 'Male' | 'Female',
          password: formData.password,
          ...(formData.abhaId && { abhaId: formData.abhaId }),
          ...(formData.height && { height: parseInt(formData.height) }),
          ...(formData.weight && { weight: parseInt(formData.weight) }),
          ...(formData.allergies && { knownAllergies: formData.allergies.split(',').map(a => a.trim()) }),
          ...(formData.medicalHistory && { medicalHistory: formData.medicalHistory.split(',').map(m => m.trim()) }),
        }
        
        await authService.signupPatient(patientData)
        success('Account created successfully! Please sign in with your credentials.')
        // Redirect to login after successful signup
        router.push('/auth/login?role=user&signup=success')
      } else {
        const doctorData: DoctorSignupRequest = {
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          hprId: formData.hprId,
          qualifications: formData.qualification.split(',').map(q => q.trim()),
          specialization: formData.specialization,
          experience: parseInt(formData.experience),
          consultationFees: parseInt(formData.consultationFee),
          clinicAddress: formData.clinicAddress,
          password: formData.password,
        }
        
        await authService.signupDoctor(doctorData)
        success('Doctor account created successfully! Please sign in with your credentials.')
        // Redirect to login after successful signup
        router.push('/auth/login?role=doctor&signup=success')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed. Please try again.'
      setError(errorMessage)
      showError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ayurveda-mandala flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Leaf className="h-12 w-12 text-white" />
              <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join Ayudhra</h1>
          <p className="text-white/90">Create your account to start your wellness journey</p>
        </div>

        <Card className="bg-white shadow-xl border-0">
          <CardHeader>
            {/* User Type Selection */}
            <div className="flex space-x-4 mb-6">
              <button
                type="button"
                onClick={() => setUserType('user')}
                className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                  userType === 'user'
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <User className={`h-8 w-8 mx-auto mb-2 ${userType === 'user' ? 'text-green-600' : 'text-gray-400'}`} />
                <div className={`font-medium ${userType === 'user' ? 'text-green-600' : 'text-gray-700'}`}>
                  User/Patient
                </div>
                <div className="text-sm text-gray-500">
                  Get personalized diet plans
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setUserType('doctor')}
                className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                  userType === 'doctor'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <Stethoscope className={`h-8 w-8 mx-auto mb-2 ${userType === 'doctor' ? 'text-purple-600' : 'text-gray-400'}`} />
                <div className={`font-medium ${userType === 'doctor' ? 'text-purple-600' : 'text-gray-700'}`}>
                  Ayurvedic Doctor
                </div>
                <div className="text-sm text-gray-500">
                  Manage patients & create diet plans
                </div>
              </button>
            </div>

            <CardTitle className="text-gray-900">
              Sign Up as {userType === 'user' ? 'Patient' : 'Doctor'}
            </CardTitle>
            <CardDescription className="text-gray-700">
              Fill in your details to create your {userType} account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="auth-form space-y-6">
              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-2 text-gray-800">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="h-12 px-4 text-gray-900 bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-800">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="h-12 px-4 text-gray-900 bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold mb-2 text-gray-800">
                    Phone Number *
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="h-12 px-4 text-gray-900 bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg"
                  />
                </div>
                
                <div>
                  <label htmlFor={userType === 'user' ? 'abhaId' : 'hprId'} className="block text-sm font-semibold mb-2 text-gray-800">
                    {userType === 'user' ? 'ABHA ID *' : 'HPR ID *'}
                  </label>
                  <Input
                    id={userType === 'user' ? 'abhaId' : 'hprId'}
                    name={userType === 'user' ? 'abhaId' : 'hprId'}
                    type="text"
                    required
                    value={userType === 'user' ? formData.abhaId : formData.hprId}
                    onChange={handleInputChange}
                    placeholder={userType === 'user' ? 'ABHA-XXXX-XXXX-XXXX' : 'HPR-AYUR-XXX'}
                    className="h-12 px-4 text-gray-900 bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg"
                  />
                </div>
              </div>

              {/* User Specific Fields */}
              {userType === 'user' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-sm font-semibold mb-2 text-gray-800">
                        Date of Birth *
                      </label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        required
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="h-12 px-4 text-gray-900 bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="gender" className="block text-sm font-semibold mb-2 text-gray-800">
                        Gender *
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        required
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full h-12 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="height" className="block text-sm font-semibold mb-2 text-gray-800">
                        Height (cm) *
                      </label>
                      <Input
                        id="height"
                        name="height"
                        type="number"
                        required
                        value={formData.height}
                        onChange={handleInputChange}
                        placeholder="175"
                        className="h-12 px-4 text-gray-900 bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="weight" className="block text-sm font-semibold mb-2 text-gray-800">
                        Weight (kg) *
                      </label>
                      <Input
                        id="weight"
                        name="weight"
                        type="number"
                        required
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="70"
                        className="h-12 px-4 text-gray-900 bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="allergies" className="block text-sm font-semibold mb-2 text-gray-800">
                        Known Allergies
                      </label>
                      <Input
                        id="allergies"
                        name="allergies"
                        type="text"
                        value={formData.allergies}
                        onChange={handleInputChange}
                        placeholder="e.g., Nuts, Dairy, Shellfish"
                        className="h-12 px-4 text-gray-900 bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="medicalHistory" className="block text-sm font-semibold mb-2 text-gray-800">
                      Medical History
                    </label>
                    <textarea
                      id="medicalHistory"
                      name="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={handleInputChange}
                      placeholder="Brief medical history (optional)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 min-h-[100px] transition-colors"
                    />
                  </div>
                </>
              )}

              {/* Doctor Specific Fields */}
              {userType === 'doctor' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="qualification" className="block text-sm font-semibold mb-2 text-gray-800">
                        Qualifications *
                      </label>
                      <Input
                        id="qualification"
                        name="qualification"
                        type="text"
                        required
                        value={formData.qualification}
                        onChange={handleInputChange}
                        placeholder="e.g., BAMS, MD (Ayurveda)"
                        className="h-12 px-4 text-gray-900 bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="specialization" className="block text-sm font-semibold mb-2 text-gray-800">
                        Specialization *
                      </label>
                      <Input
                        id="specialization"
                        name="specialization"
                        type="text"
                        required
                        value={formData.specialization}
                        onChange={handleInputChange}
                        placeholder="e.g., Panchakarma, Nutrition"
                        className="h-12 px-4 text-gray-900 bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="experience" className="block text-sm font-semibold mb-2 text-gray-800">
                        Experience (years) *
                      </label>
                      <Input
                        id="experience"
                        name="experience"
                        type="number"
                        required
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder="10"
                        className="h-12 px-4 text-gray-900 bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="consultationFee" className="block text-sm font-semibold mb-2 text-gray-800">
                        Consultation Fee (₹) *
                      </label>
                      <Input
                        id="consultationFee"
                        name="consultationFee"
                        type="number"
                        required
                        value={formData.consultationFee}
                        onChange={handleInputChange}
                        placeholder="800"
                        className="h-12 px-4 text-gray-900 bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="clinicAddress" className="block text-sm font-semibold mb-2 text-gray-800">
                      Clinic Address *
                    </label>
                    <textarea
                      id="clinicAddress"
                      name="clinicAddress"
                      required
                      value={formData.clinicAddress}
                      onChange={handleInputChange}
                      placeholder="Complete clinic address with city, state, and pincode"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 min-h-[100px] transition-colors"
                    />
                  </div>
                </>
              )}

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold mb-2 text-gray-800">
                    Password *
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a strong password"
                      className="h-12 px-4 pr-12 text-gray-900 bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg"
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
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2 text-gray-800">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="h-12 px-4 pr-12 text-gray-900 bg-white border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full mt-6 mb-4" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>

              <div className="text-center pt-4 border-t border-gray-200">
                <span className="text-gray-600">Already have an account? </span>
                <Link href="/auth/login" className="text-green-600 hover:text-green-700 hover:underline font-semibold transition-colors">
                  Sign in here
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
