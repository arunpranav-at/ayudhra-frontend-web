'use client'

import { useState } from 'react'
import { Send, Search, User, MessageSquare, Phone, Video, MoreVertical, Paperclip, Smile, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { mockUsers, mockDoctors, mockChatMessages } from '@/lib/data'

export default function DoctorChat() {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock current doctor - in real app, this would come from authentication context
  const currentDoctor = mockDoctors[0]
  const doctorPatients = mockUsers.filter(u => u.doctorId === currentDoctor.id)
  
  // Filter patients based on search
  const filteredPatients = doctorPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Get messages for selected patient
  const getMessagesForPatient = (patientId: string) => {
    return mockChatMessages.filter(msg => 
      (msg.senderId === currentDoctor.id && msg.receiverId === patientId) ||
      (msg.senderId === patientId && msg.receiverId === currentDoctor.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }

  const selectedPatientData = selectedPatient ? doctorPatients.find(p => p.id === selectedPatient) : null
  const messages = selectedPatient ? getMessagesForPatient(selectedPatient) : []

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !selectedPatient) return

    // In real app, this would make an API call
    console.log('Sending message:', message, 'to patient:', selectedPatient)
    setMessage('')
  }

  const getLastMessage = (patientId: string) => {
    const patientMessages = getMessagesForPatient(patientId)
    return patientMessages[patientMessages.length - 1]
  }

  const getUnreadCount = (patientId: string) => {
    return getMessagesForPatient(patientId).filter(msg => 
      !msg.read && msg.senderId === patientId
    ).length
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Messages</h1>
          <p className="text-gray-600 mt-1">Communicate with your patients</p>
        </div>
        <div className="text-sm text-gray-600">
          Dr. {currentDoctor.name} • {doctorPatients.length} Patients
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        {/* Patient List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Patients</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-y-auto">
              {filteredPatients.map((patient) => {
                const lastMessage = getLastMessage(patient.id)
                const unreadCount = getUnreadCount(patient.id)
                
                return (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient.id)}
                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedPatient === patient.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-sm text-gray-900 truncate">
                            {patient.name}
                          </h3>
                          {unreadCount > 0 && (
                            <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          {patient.prakriti} • {patient.vikriti}
                        </p>
                        {lastMessage && (
                          <div className="text-xs text-gray-500 truncate">
                            <span className={lastMessage.senderId === currentDoctor.id ? 'font-medium' : ''}>
                              {lastMessage.senderId === currentDoctor.id ? 'You: ' : ''}
                            </span>
                            {lastMessage.message}
                          </div>
                        )}
                        {lastMessage && (
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(lastMessage.timestamp).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              
              {filteredPatients.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <User className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No patients found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedPatientData ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="lg:hidden"
                      onClick={() => setSelectedPatient(null)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedPatientData.name}</h3>
                      <p className="text-sm text-gray-600">
                        {selectedPatientData.prakriti} • Online
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === currentDoctor.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.senderId === currentDoctor.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.senderId === currentDoctor.id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {messages.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No messages yet</p>
                      <p className="text-sm">Start a conversation with {selectedPatientData.name}</p>
                    </div>
                  )}
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <Button type="button" variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button type="button" variant="ghost" size="sm">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button type="submit" disabled={!message.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            /* No Patient Selected */
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Patient</h3>
                <p>Choose a patient from the list to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center justify-center py-6">
              <MessageSquare className="h-6 w-6 mr-2 text-blue-600" />
              <span>Broadcast Message</span>
            </Button>
            
            <Button variant="outline" className="flex items-center justify-center py-6">
              <User className="h-6 w-6 mr-2 text-green-600" />
              <span>Patient Groups</span>
            </Button>
            
            <Button variant="outline" className="flex items-center justify-center py-6">
              <Phone className="h-6 w-6 mr-2 text-purple-600" />
              <span>Schedule Call</span>
            </Button>
          </div>
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