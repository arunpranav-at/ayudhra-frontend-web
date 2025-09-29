'use client'

import { useState } from 'react'
import { Calendar, Clock, User, Star, MapPin, Video, CheckCircle, AlertCircle, Filter, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { mockDoctors, mockUsers, mockSessions, mockAppointments } from '@/lib/data'

export default function UserSessions() {
  const [activeTab, setActiveTab] = useState('book')
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('')
  const [sessionType, setSessionType] = useState<'consultation' | 'follow-up' | 'emergency'>('consultation')
  const [searchTerm, setSearchTerm] = useState('')
  const [specializationFilter, setSpecializationFilter] = useState('')

  // Mock current user - in real app, this would come from authentication context
  const currentUser = mockUsers[0]
  
  // Get user's sessions and appointments
  const userSessions = mockSessions.filter(s => s.userId === currentUser.id)
  const userAppointments = mockAppointments.filter(a => a.patientId === currentUser.id)
  
  // Filter doctors based on search and specialization
  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialization = !specializationFilter || doctor.specialization === specializationFilter
    return matchesSearch && matchesSpecialization
  })

  // Get unique specializations for filter
  const specializations = Array.from(new Set(mockDoctors.map(d => d.specialization)))

  // Generate available time slots for selected doctor and date
  const generateTimeSlots = () => {
    const slots = []
    const startHour = 9
    const endHour = 17
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push(time)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()
  const selectedDoctorData = selectedDoctor ? mockDoctors.find(d => d.id === selectedDoctor) : null

  const handleBookSession = () => {
    if (!selectedDoctor || !selectedDate || !selectedTimeSlot) {
      alert('Please select doctor, date, and time slot')
      return
    }

    // In real app, this would make an API call
    console.log('Booking session:', {
      doctorId: selectedDoctor,
      date: selectedDate,
      time: selectedTimeSlot,
      type: sessionType,
      userId: currentUser.id
    })

    alert('Session booked successfully!')
    // Reset form
    setSelectedDoctor(null)
    setSelectedDate('')
    setSelectedTimeSlot('')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'scheduled': return 'text-blue-600 bg-blue-100'
      case 'confirmed': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />
      case 'pending':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800">
      <div className="container mx-auto p-6 space-y-6">{/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Sessions</h1>
          <p className="text-green-100 mt-1">Book consultations and manage your appointments</p>
        </div>
        <div className="text-sm text-green-100">
          Welcome, {currentUser.name}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-300">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('book')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'book'
                ? 'border-green-300 text-green-100'
                : 'border-transparent text-white hover:text-green-100 hover:border-green-400'
            }`}
          >
            Book Session
          </button>
          <button
            onClick={() => setActiveTab('scheduled')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'scheduled'
                ? 'border-green-300 text-green-100'
                : 'border-transparent text-white hover:text-green-100 hover:border-green-400'
            }`}
          >
            Scheduled Sessions
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-green-300 text-green-100'
                : 'border-transparent text-white hover:text-green-100 hover:border-green-400'
            }`}
          >
            Session History
          </button>
        </nav>
      </div>

      {/* Book Session Tab */}
      {activeTab === 'book' && (
        <div className="space-y-6">
          {/* Session Type Selection */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-black">Select Session Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setSessionType('consultation')}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    sessionType === 'consultation'
                      ? 'border-green-500 bg-green-50 text-black'
                      : 'border-gray-300 bg-gray-50 text-black hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <User className={`h-5 w-5 ${
                      sessionType === 'consultation' ? 'text-green-700' : 'text-black'
                    }`} />
                    <h3 className="font-semibold text-black">Initial Consultation</h3>
                  </div>
                  <p className="text-sm text-black">First-time consultation with detailed assessment</p>
                  <p className="text-lg font-bold text-green-600 mt-2">₹500</p>
                </button>

                <button
                  onClick={() => setSessionType('follow-up')}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    sessionType === 'follow-up'
                      ? 'border-green-500 bg-green-50 text-black'
                      : 'border-gray-300 bg-gray-50 text-black hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className={`h-5 w-5 ${
                      sessionType === 'follow-up' ? 'text-green-700' : 'text-black'
                    }`} />
                    <h3 className="font-semibold text-black">Follow-up Session</h3>
                  </div>
                  <p className="text-sm text-black">Progress review and plan adjustments</p>
                  <p className="text-lg font-bold text-green-600 mt-2">₹300</p>
                </button>

                <button
                  onClick={() => setSessionType('emergency')}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    sessionType === 'emergency'
                      ? 'border-green-500 bg-green-50 text-black'
                      : 'border-gray-300 bg-gray-50 text-black hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className={`h-5 w-5 ${
                      sessionType === 'emergency' ? 'text-red-600' : 'text-red-500'
                    }`} />
                    <h3 className="font-semibold text-black">Emergency Consultation</h3>
                  </div>
                  <p className="text-sm text-black">Urgent health concerns (same day)</p>
                  <p className="text-lg font-bold text-green-600 mt-2">₹800</p>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Doctor Selection */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-black">Select Doctor</CardTitle>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
                  <Input
                    placeholder="Search doctors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-4 w-4" />
                  <select
                    value={specializationFilter}
                    onChange={(e) => setSpecializationFilter(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Specializations</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDoctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      selectedDoctor === doctor.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 bg-white hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${
                          selectedDoctor === doctor.id ? 'text-black' : 'text-black'
                        }`}>Dr. {doctor.name}</h3>
                        <p className={`text-sm ${
                          selectedDoctor === doctor.id ? 'text-black' : 'text-black'
                        }`}>{doctor.specialization}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className={`font-medium ${
                          selectedDoctor === doctor.id ? 'text-black' : 'text-black'
                        }`}>{doctor.rating}</span>
                        <span className={selectedDoctor === doctor.id ? 'text-black' : 'text-black'}>({doctor.reviewCount} reviews)</span>
                      </div>
                      
                      <div className={`flex items-center space-x-1 ${
                        selectedDoctor === doctor.id ? 'text-black' : 'text-black'
                      }`}>
                        <MapPin className="h-4 w-4" />
                        <span>{doctor.location}</span>
                      </div>
                      
                      <div className={`flex items-center space-x-1 ${
                        selectedDoctor === doctor.id ? 'text-black' : 'text-black'
                      }`}>
                        <Clock className="h-4 w-4" />
                        <span>{doctor.experience} years experience</span>
                      </div>
                      
                      <div className="text-green-600 font-semibold">
                        ₹{doctor.consultationFee} per session
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Date and Time Selection */}
          {selectedDoctorData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-black">Select Date</CardTitle>
                  <CardDescription className="text-black">Choose your preferred appointment date</CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-black">Select Time</CardTitle>
                  <CardDescription className="text-black">Available time slots with Dr. {selectedDoctorData.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`p-2 text-sm rounded border transition-colors ${
                          selectedTimeSlot === slot
                            ? 'bg-green-500 text-white border-green-500'
                            : 'bg-white border-gray-300 hover:border-green-300 text-black'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Booking Summary */}
          {selectedDoctorData && selectedDate && selectedTimeSlot && (
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-black">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-black">Doctor:</span>
                    <span className="font-semibold text-black">Dr. {selectedDoctorData.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black">Specialization:</span>
                    <span className="font-semibold text-black">{selectedDoctorData.specialization}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black">Session Type:</span>
                    <span className="font-semibold capitalize text-black">{sessionType.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black">Date:</span>
                    <span className="font-semibold text-black">{new Date(selectedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black">Time:</span>
                    <span className="font-semibold text-black">{selectedTimeSlot}</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-3">
                    <span className="text-lg font-semibold text-black">Total Amount:</span>
                    <span className="text-xl font-bold text-green-600">
                      ₹{sessionType === 'consultation' ? '500' : sessionType === 'follow-up' ? '300' : '800'}
                    </span>
                  </div>
                </div>
                
                <Button onClick={handleBookSession} className="w-full">
                  Book Session
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Scheduled Sessions Tab */}
      {activeTab === 'scheduled' && (
        <div className="space-y-4">
          {userAppointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').map((appointment) => {
            const doctor = mockDoctors.find(d => d.id === appointment.doctorId)
            return (
              <Card key={appointment.id} className="bg-white shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Dr. {doctor?.name}</h3>
                        <p className="text-sm text-gray-800">{doctor?.specialization}</p>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-800">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(appointment.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)}
                        <span className="capitalize">{appointment.status}</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Video className="h-4 w-4 mr-1" />
                          Join Call
                        </Button>
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          
          {userAppointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-500" />
              <h3 className="text-lg font-medium text-black mb-2">No Scheduled Sessions</h3>
              <p className="text-black">You don&apos;t have any upcoming sessions</p>
              <Button className="mt-4" onClick={() => setActiveTab('book')}>
                Book a Session
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Session History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {userSessions.map((session) => {
            const doctor = mockDoctors.find(d => d.id === session.doctorId)
            return (
              <Card key={session.id} className="bg-white shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Dr. {doctor?.name}</h3>
                        <p className="text-sm text-gray-800">{doctor?.specialization}</p>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-800">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(session.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{session.duration} minutes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${getStatusColor(session.status)}`}>
                        {getStatusIcon(session.status)}
                        <span className="capitalize">{session.status}</span>
                      </div>
                      
                      {session.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          View Summary
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {session.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{session.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
          
          {userSessions.length === 0 && (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 mx-auto mb-4 text-gray-500" />
              <h3 className="text-lg font-medium text-black mb-2">No Session History</h3>
              <p className="text-black">Your completed sessions will appear here</p>
            </div>
          )}
        </div>
      )}

      {/* Back to Dashboard */}
      <div className="flex justify-center">
        <Link href="/user">
          <Button variant="outline" className="bg-white text-green-700 border-green-500 hover:bg-green-500 hover:text-white">
            ← Back to Dashboard
          </Button>
        </Link>
      </div>
      </div>
    </div>
  )
}