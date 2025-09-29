'use client'

import Link from 'next/link'
import { Stethoscope, Users, Calendar, MessageSquare, Clock, TrendingUp, CheckCircle, AlertCircle, FileText, Star, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { mockDoctors, mockUsers, mockSessions, mockDietPlans, mockChatMessages, mockAppointments } from '@/lib/data'

export default function DoctorDashboard() {
  // Mock current doctor - in real app, this would come from authentication context
  const currentDoctor = mockDoctors[0]
  const doctorPatients = mockUsers.filter(u => u.doctorId === currentDoctor.id)
  const doctorSessions = mockSessions.filter(s => s.doctorId === currentDoctor.id)
  const doctorDietPlans = mockDietPlans.filter(d => d.doctorId === currentDoctor.id)
  const doctorMessages = mockChatMessages.filter(m => m.senderId === currentDoctor.id || m.receiverId === currentDoctor.id)
  const upcomingAppointments = mockAppointments.filter(a => 
    a.doctorId === currentDoctor.id && a.status === 'scheduled'
  ).slice(0, 3)

  const pendingDietPlans = doctorDietPlans.filter(d => d.status === 'pending').length
  const unreadMessages = doctorMessages.filter(m => !m.read && m.receiverId === currentDoctor.id).length
  const completedSessions = doctorSessions.filter(s => s.status === 'completed').length
  const scheduledSessions = doctorSessions.filter(s => s.status === 'scheduled').length

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-white border-l-4 border-l-blue-600 rounded-lg p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">
              Welcome, {currentDoctor.name}! 👨‍⚕️
            </h1>
            <p className="text-gray-600 text-lg">
              Your Ayurvedic practice dashboard
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3">
            <div className="text-sm text-gray-500">Today's Schedule</div>
            <div className="text-xl font-semibold text-blue-700">{scheduledSessions} consultations</div>
            <div className="text-sm text-gray-500 mt-1">
              Rating: <span className="text-amber-600">{currentDoctor.rating}/5.0 ⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Patients</p>
                <p className="text-2xl font-bold text-gray-900">{doctorPatients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Today&apos;s Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{scheduledSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Plans</p>
                <p className="text-2xl font-bold text-gray-900">{pendingDietPlans}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">New Messages</p>
                <p className="text-2xl font-bold text-gray-900">{unreadMessages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/doctor/patients">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-green-500">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-1">Manage Patients</h3>
              <p className="text-sm text-muted-foreground">View patient profiles and health data</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/doctor/plans">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-500">
            <CardContent className="p-6 text-center">
              <FileText className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-1">Diet Plans</h3>
              <p className="text-sm text-muted-foreground">Create and approve diet plans</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/doctor/sessions">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-cyan-500">
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-cyan-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-1">Sessions</h3>
              <p className="text-sm text-muted-foreground">Manage consultations</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/doctor/chat">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-500">
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-12 w-12 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-1">Messages</h3>
              <p className="text-sm text-muted-foreground">Chat with patients</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Upcoming Appointments
              </span>
              <Link href="/doctor/sessions">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => {
                const patient = doctorPatients.find(p => p.id === appointment.patientId)
                return (
                  <div key={appointment.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-800">{patient?.name}</div>
                      <div className="text-xs text-gray-600">
                        {appointment.date} at {appointment.time} • {appointment.duration}min
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        {appointment.type} - ₹{appointment.fee}
                      </div>
                    </div>
                    <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {appointment.status}
                    </div>
                  </div>
                )
              })}

              {upcomingAppointments.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No upcoming appointments</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Patient Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent Patient Activity
              </span>
              <Link href="/doctor/patients">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {doctorPatients.slice(0, 3).map((patient) => (
                <div key={patient.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{patient.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {patient.prakriti} • {patient.vikriti} state
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Last food scan: 2 hours ago
                    </div>
                  </div>
                  <div className="text-xs text-blue-600">
                    View Profile →
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Practice Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* This Month Stats */}
        <Card>
          <CardHeader>
            <CardTitle>This Month&apos;s Performance</CardTitle>
            <CardDescription>Your practice metrics for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Consultations Completed</span>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold">{completedSessions}</span>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Diet Plans Created</span>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold">{doctorDietPlans.length}</span>
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Patient Satisfaction</span>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold">{currentDoctor.rating}/5.0</span>
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Response Rate</span>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold">98%</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Actions</CardTitle>
            <CardDescription>Tasks that require your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">
                    Diet Plans to Review
                  </span>
                </div>
                <span className="text-orange-600 font-semibold">{pendingDietPlans}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Unread Messages
                  </span>
                </div>
                <span className="text-blue-600 font-semibold">{unreadMessages}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Today&apos;s Sessions
                  </span>
                </div>
                <span className="text-blue-600 font-semibold">{scheduledSessions}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">
                    Patient Reports to Review
                  </span>
                </div>
                <span className="text-purple-600 font-semibold">3</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}