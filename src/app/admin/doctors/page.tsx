'use client'

import { useState } from 'react'
import { Search, Filter, Eye, Edit, MoreVertical, Stethoscope, Calendar, Phone, MapPin, Star, Users, Award } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { mockDoctors, mockUsers } from '@/lib/data'

export default function AdminDoctors() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterSpecialization, setFilterSpecialization] = useState('all')
  
  const allSpecializations = Array.from(new Set(mockDoctors.flatMap(d => d.specialization)))
  
  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecialization = filterSpecialization === 'all' || 
                                  doctor.specialization.includes(filterSpecialization)
    return matchesSearch && matchesSpecialization
  })

  const getPatientCount = (doctorId: string) => {
    return mockUsers.filter(u => u.doctorId === doctorId).length
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctor Management</h1>
          <p className="text-gray-600 mt-1">Manage and monitor all platform doctors</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Stethoscope className="h-4 w-4 mr-2" />
          Add New Doctor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Stethoscope className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Doctors</p>
                <p className="text-2xl font-bold text-gray-900">{mockDoctors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockDoctors.reduce((sum, d) => sum + d.patientsCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(mockDoctors.reduce((sum, d) => sum + d.rating, 0) / mockDoctors.length).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Award className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Specializations</p>
                <p className="text-2xl font-bold text-gray-900">{allSpecializations.length}</p>
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
              <CardTitle>All Doctors</CardTitle>
              <CardDescription>
                {filteredDoctors.length} of {mockDoctors.length} doctors shown
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Specializations</option>
                {allSpecializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <Stethoscope className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-xl text-gray-900 mb-1">
                          {doctor.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{doctor.email}</p>
                        
                        {/* Rating and Experience */}
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-sm font-medium">{doctor.rating}</span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {doctor.experience} years exp
                          </span>
                          <span className="text-sm text-gray-600">
                            ₹{doctor.consultationFee}/session
                          </span>
                        </div>

                        {/* Specializations */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {doctor.specialization}
                          </span>
                        </div>

                        {/* Qualifications */}
                        <div className="mb-3">
                          <p className="text-sm text-gray-600">
                            <strong>Qualifications:</strong> {doctor.qualification.join(', ')}
                          </p>
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            {doctor.phone}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span className="truncate">{doctor.clinicAddress}</span>
                          </div>
                          <div className="flex items-center">
                            <Award className="h-4 w-4 mr-2" />
                            HPR ID: {doctor.hprId}
                          </div>
                        </div>

                        {/* Patient Count */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-green-600" />
                            <span className="font-medium text-green-700">
                              {getPatientCount(doctor.id)} Active Patients
                            </span>
                          </div>
                          <span className="text-gray-500">
                            Total: {doctor.patientsCount}
                          </span>
                        </div>

                        {/* Available Days */}
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Available:</strong>
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {doctor.availableSlots.map((slot) => (
                              <span key={slot.day} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                {slot.day} {slot.startTime}-{slot.endTime}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button variant="outline" size="sm" className="w-24">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="w-24">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="w-24">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        Joined: {new Date(doctor.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          doctor.rating >= 4.5 ? 'bg-green-100 text-green-800' :
                          doctor.rating >= 4.0 ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {doctor.rating >= 4.5 ? 'Top Rated' :
                           doctor.rating >= 4.0 ? 'Highly Rated' :
                           'Good Rating'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          getPatientCount(doctor.id) > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {getPatientCount(doctor.id) > 0 ? 'Active' : 'Available'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-12">
              <Stethoscope className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Back to Dashboard */}
      <div className="flex justify-center">
        <Link href="/admin">
          <Button variant="outline">
            ← Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}