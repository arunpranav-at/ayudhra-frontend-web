'use client'

import { useState } from 'react'
import { Search, Filter, Eye, MessageSquare, Calendar, User, Phone, MapPin, Heart, TrendingUp, FileText, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { mockUsers, mockDoctors, mockNutritionAnalytics, mockDietPlans, mockSessions } from '@/lib/data'

export default function DoctorPatients() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDosha, setFilterDosha] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // Mock current doctor - in real app, this would come from authentication context
  const currentDoctor = mockDoctors[0]
  const doctorPatients = mockUsers.filter(u => u.doctorId === currentDoctor.id)
  
  const filteredPatients = doctorPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDosha = filterDosha === 'all' || patient.prakriti.includes(filterDosha)
    
    // Filter by status based on recent activity
    let matchesStatus = true
    if (filterStatus === 'active') {
      matchesStatus = true // All patients are considered active
    } else if (filterStatus === 'needs_attention') {
      matchesStatus = patient.vikriti !== 'Balanced' // Imbalanced patients need attention
    }
    
    return matchesSearch && matchesDosha && matchesStatus
  })

  const getPatientDietPlan = (patientId: string) => {
    return mockDietPlans.find(d => d.userId === patientId && d.status === 'active')
  }

  const getLastSession = (patientId: string) => {
    const sessions = mockSessions.filter(s => s.userId === patientId && s.doctorId === currentDoctor.id)
    return sessions.sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())[0]
  }

  const getPatientAnalytics = (patientId: string) => {
    return mockNutritionAnalytics.find(n => n.userId === patientId)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Patients</h1>
          <p className="text-gray-600 mt-1">Manage and monitor your assigned patients</p>
        </div>
        <div className="text-sm text-gray-600">
          Dr. {currentDoctor.name} • {doctorPatients.length} Active Patients
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{doctorPatients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Diet Plans</p>
                <p className="text-2xl font-bold text-gray-900">
                  {doctorPatients.filter(p => getPatientDietPlan(p.id)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Need Attention</p>
                <p className="text-2xl font-bold text-gray-900">
                  {doctorPatients.filter(p => p.vikriti !== 'Balanced').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">{currentDoctor.rating}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>Patient List</CardTitle>
              <CardDescription>
                {filteredPatients.length} of {doctorPatients.length} patients shown
              </CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={filterDosha}
                onChange={(e) => setFilterDosha(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Doshas</option>
                <option value="Vata">Vata</option>
                <option value="Pitta">Pitta</option>
                <option value="Kapha">Kapha</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="needs_attention">Needs Attention</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPatients.map((patient) => {
              const dietPlan = getPatientDietPlan(patient.id)
              const lastSession = getLastSession(patient.id)
              const analytics = getPatientAnalytics(patient.id)

              return (
                <Card key={patient.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Patient Basic Info */}
                      <div className="space-y-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="h-8 w-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-xl text-gray-900 mb-1">
                              {patient.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">{patient.email}</p>
                            
                            <div className="flex flex-wrap gap-1 mb-3">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {patient.prakriti}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                patient.vikriti === 'Balanced' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                              }`}>
                                {patient.vikriti}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                {patient.gender}, {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}y
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-1" />
                                {patient.phone.slice(-10)}
                              </div>
                              <div className="flex items-center">
                                <Heart className="h-4 w-4 mr-1" />
                                {patient.height}cm, {patient.weight}kg
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Medical Info */}
                        {patient.medicalHistory.length > 0 && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">
                              <strong>Medical History:</strong><br />
                              {patient.medicalHistory.join(', ')}
                            </p>
                          </div>
                        )}

                        {patient.allergies.length > 0 && (
                          <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-sm text-red-700">
                              <strong>Allergies:</strong><br />
                              {patient.allergies.join(', ')}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Health Metrics & Analytics */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Health Metrics</h4>
                        
                        {analytics && (
                          <div className="space-y-3">
                            <div className="bg-green-50 p-3 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Today&apos;s Calories</span>
                                <span className="text-lg font-bold text-green-700">
                                  {analytics.totalCalories}
                                </span>
                              </div>
                              <div className="text-xs text-green-600">
                                Digestibility Score: {analytics.digestibilityScore}/100
                              </div>
                            </div>

                            <div className="bg-blue-50 p-3 rounded-lg">
                              <div className="text-sm font-medium mb-2">Dosha Balance</div>
                              <div className="space-y-1">
                                {Object.entries(analytics.ayurvedicMetrics.doshaBalance).map(([dosha, value]) => (
                                  <div key={dosha} className="flex items-center justify-between text-xs">
                                    <span className="capitalize">{dosha}</span>
                                    <span>{value}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="bg-purple-50 p-3 rounded-lg">
                              <div className="text-sm font-medium mb-2">Six Tastes Balance</div>
                              <div className="grid grid-cols-3 gap-1 text-xs">
                                {Object.entries(analytics.ayurvedicMetrics.rasaDistribution).slice(0, 3).map(([rasa, value]) => (
                                  <div key={rasa} className="text-center">
                                    <div className="capitalize">{rasa.toLowerCase()}</div>
                                    <div className="font-semibold">{value}%</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions & Status */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">Patient Management</h4>
                        
                        {/* Diet Plan Status */}
                        <div className={`p-3 rounded-lg ${
                          dietPlan ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Diet Plan</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              dietPlan ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {dietPlan ? 'Active' : 'None'}
                            </span>
                          </div>
                          {dietPlan && (
                            <div className="text-xs text-gray-600">
                              {dietPlan.name}<br />
                              Duration: {dietPlan.duration} days
                            </div>
                          )}
                        </div>

                        {/* Last Session */}
                        {lastSession && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="text-sm font-medium mb-2">Last Session</div>
                            <div className="text-xs text-gray-600">
                              {new Date(lastSession.scheduledAt).toLocaleDateString()}<br />
                              {lastSession.type} • {lastSession.duration}min<br />
                              Status: {lastSession.status}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-2">
                          <Button className="w-full" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Full Profile
                          </Button>
                          
                          <Button variant="outline" className="w-full" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            {dietPlan ? 'Update Diet Plan' : 'Create Diet Plan'}
                          </Button>
                          
                          <Button variant="outline" className="w-full" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Send Message
                          </Button>
                          
                          <Button variant="outline" className="w-full" size="sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule Session
                          </Button>
                        </div>

                        {/* Patient Status */}
                        <div className="pt-2 border-t border-gray-200">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500">
                              Joined: {new Date(patient.createdAt).toLocaleDateString()}
                            </span>
                            <span className={`px-2 py-1 rounded ${
                              patient.vikriti === 'Balanced' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {patient.vikriti === 'Balanced' ? 'Stable' : 'Needs Attention'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Back to Dashboard */}
      <div className="flex justify-center">
        <Link href="/doctor">
          <Button variant="outline">
            ← Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}