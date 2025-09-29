'use client'

import { useState } from 'react'
import { Send, Search, User, MessageSquare, Phone, Video, MoreVertical, Paperclip, Smile, ArrowLeft, Star } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { mockUsers, mockDoctors, mockChatMessages } from '@/lib/data'

export default function UserChat() {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  // Mock current user - in real app, this would come from authentication context
  const currentUser = mockUsers[0]
  const userDoctor = mockDoctors.find(d => d.id === currentUser.doctorId)
  
  // Get messages for selected doctor
  const getMessagesForDoctor = (doctorId: string) => {
    return mockChatMessages.filter(msg => 
      (msg.senderId === currentUser.id && msg.receiverId === doctorId) ||
      (msg.senderId === doctorId && msg.receiverId === currentUser.id)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  }

  const selectedDoctorData = selectedDoctor ? mockDoctors.find(d => d.id === selectedDoctor) : null
  const messages = selectedDoctor ? getMessagesForDoctor(selectedDoctor) : []

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !selectedDoctor) return

    // In real app, this would make an API call
    console.log('Sending message:', message, 'to doctor:', selectedDoctor)
    setMessage('')
  }

  const getLastMessage = (doctorId: string) => {
    const doctorMessages = getMessagesForDoctor(doctorId)
    return doctorMessages[doctorMessages.length - 1]
  }

  const getUnreadCount = (doctorId: string) => {
    return getMessagesForDoctor(doctorId).filter(msg => 
      !msg.read && msg.senderId === doctorId
    ).length
  }

  // Auto-select user's assigned doctor if available
  useState(() => {
    if (userDoctor && !selectedDoctor) {
      setSelectedDoctor(userDoctor.id)
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Messages</h1>
            <p className="text-green-100 mt-1">Chat with your healthcare providers</p>
          </div>
          <div className="text-sm text-green-100">
            Welcome, {currentUser.name}
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        {/* Doctor List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Your Doctors</CardTitle>
            <CardDescription>Healthcare providers you can message</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-y-auto">
              {/* Primary Doctor */}
              {userDoctor && (
                <div
                  onClick={() => setSelectedDoctor(userDoctor.id)}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedDoctor === userDoctor.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-sm text-gray-900 truncate">
                          Dr. {userDoctor.name}
                        </h3>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                          Primary
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        {userDoctor.specialization}
                      </p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-500">{userDoctor.rating}</span>
                      </div>
                      
                      {(() => {
                        const lastMessage = getLastMessage(userDoctor.id)
                        const unreadCount = getUnreadCount(userDoctor.id)
                        
                        return (
                          <>
                            {lastMessage && (
                              <div className="text-xs text-gray-500 truncate mt-2">
                                <span className={lastMessage.senderId === currentUser.id ? 'font-medium' : ''}>
                                  {lastMessage.senderId === currentUser.id ? 'You: ' : ''}
                                </span>
                                {lastMessage.message}
                              </div>
                            )}
                            {lastMessage && (
                              <div className="flex items-center justify-between mt-1">
                                <div className="text-xs text-gray-400">
                                  {new Date(lastMessage.timestamp).toLocaleDateString()}
                                </div>
                                {unreadCount > 0 && (
                                  <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                                    {unreadCount}
                                  </span>
                                )}
                              </div>
                            )}
                          </>
                        )
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* Other Available Doctors */}
              {mockDoctors.filter(d => d.id !== userDoctor?.id).slice(0, 3).map((doctor) => {
                const lastMessage = getLastMessage(doctor.id)
                const unreadCount = getUnreadCount(doctor.id)
                
                return (
                  <div
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor.id)}
                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedDoctor === doctor.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-sm text-gray-900 truncate">
                            Dr. {doctor.name}
                          </h3>
                          {unreadCount > 0 && (
                            <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          {doctor.specialization}
                        </p>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-500">{doctor.rating}</span>
                        </div>
                        
                        {lastMessage && (
                          <div className="text-xs text-gray-500 truncate mt-2">
                            <span className={lastMessage.senderId === currentUser.id ? 'font-medium' : ''}>
                              {lastMessage.senderId === currentUser.id ? 'You: ' : ''}
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
              
              {mockDoctors.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <User className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No doctors available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedDoctorData ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="lg:hidden"
                      onClick={() => setSelectedDoctor(null)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Dr. {selectedDoctorData.name}</h3>
                      <p className="text-sm text-gray-600">
                        {selectedDoctorData.specialization} • {selectedDoctorData.location}
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
                      className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          msg.senderId === currentUser.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.senderId === currentUser.id ? 'text-blue-100' : 'text-gray-500'
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
                      <p className="text-sm">Start a conversation with Dr. {selectedDoctorData.name}</p>
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
            /* No Doctor Selected */
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Doctor</h3>
                <p>Choose a doctor from the list to start messaging</p>
                {!userDoctor && (
                  <div className="mt-4">
                    <Link href="/user/sessions">
                      <Button>Book a Session First</Button>
                    </Link>
                  </div>
                )}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/user/sessions">
              <Button variant="outline" className="flex items-center justify-center py-6 w-full">
                <MessageSquare className="h-6 w-6 mr-2 text-blue-600" />
                <span>Book Session</span>
              </Button>
            </Link>
            
            <Button variant="outline" className="flex items-center justify-center py-6">
              <Phone className="h-6 w-6 mr-2 text-green-600" />
              <span>Emergency Call</span>
            </Button>
            
            <Link href="/user/analytics">
              <Button variant="outline" className="flex items-center justify-center py-6 w-full">
                <User className="h-6 w-6 mr-2 text-purple-600" />
                <span>Health Reports</span>
              </Button>
            </Link>

            <Link href="/user/scan">
              <Button variant="outline" className="flex items-center justify-center py-6 w-full">
                <Search className="h-6 w-6 mr-2 text-orange-600" />
                <span>Food Scan</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

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