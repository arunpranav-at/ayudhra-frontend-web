'use client'

import { useState } from 'react'
import { Plus, Search, Filter, Eye, Edit, CheckCircle, Clock, AlertCircle, User, Calendar, FileText, Trash2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { mockDietPlans, mockUsers, mockDoctors } from '@/lib/data'

export default function DoctorDietPlans() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  // Mock current doctor - in real app, this would come from authentication context
  const currentDoctor = mockDoctors[0]
  const doctorDietPlans = mockDietPlans.filter(plan => plan.doctorId === currentDoctor.id)
  
  const filteredPlans = doctorDietPlans.filter(plan => {
    const patient = mockUsers.find(u => u.id === plan.userId)
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false
    const matchesStatus = filterStatus === 'all' || plan.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const getPatientName = (userId: string) => {
    const patient = mockUsers.find(u => u.id === userId)
    return patient?.name || 'Unknown Patient'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <AlertCircle className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const handleApprovePlan = (planId: string) => {
    // In real app, this would make an API call
    console.log('Approving plan:', planId)
  }

  const handleRejectPlan = (planId: string) => {
    // In real app, this would make an API call
    console.log('Rejecting plan:', planId)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Diet Plans Management</h1>
          <p className="text-gray-600 mt-1">Create, approve, and manage patient diet plans</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Create New Diet Plan
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Plans</p>
                <p className="text-2xl font-bold text-gray-900">{doctorDietPlans.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Plans</p>
                <p className="text-2xl font-bold text-gray-900">
                  {doctorDietPlans.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-900">
                  {doctorDietPlans.filter(p => p.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Patients Covered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(doctorDietPlans.map(p => p.userId)).size}
                </p>
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
              <CardTitle>All Diet Plans</CardTitle>
              <CardDescription>
                {filteredPlans.length} of {doctorDietPlans.length} plans shown
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search plans or patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPlans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Plan Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-1">
                            {plan.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Patient: <strong>{getPatientName(plan.userId)}</strong>
                          </p>
                          <p className="text-sm text-gray-700 mb-3">
                            {plan.description}
                          </p>
                        </div>
                        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getStatusColor(plan.status)}`}>
                          {getStatusIcon(plan.status)}
                          <span className="text-sm font-medium capitalize">{plan.status}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>Duration: {plan.duration} days</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span>{plan.meals.length} meals configured</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>Created: {new Date(plan.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Goals */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Goals:</p>
                        <div className="flex flex-wrap gap-1">
                          {plan.goals.map((goal, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {goal}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Restrictions */}
                      {plan.restrictions.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Restrictions:</p>
                          <div className="flex flex-wrap gap-1">
                            {plan.restrictions.map((restriction, index) => (
                              <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                {restriction}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 min-w-[160px]">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Plan
                      </Button>

                      {plan.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprovePlan(plan.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleRejectPlan(plan.id)}
                          >
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </>
                      )}

                      {plan.status === 'active' && (
                        <Button variant="outline" size="sm" className="w-full">
                          <User className="h-4 w-4 mr-2" />
                          Contact Patient
                        </Button>
                      )}

                      <Button variant="outline" size="sm" className="w-full text-red-600 border-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  {/* Meals Preview */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-2">Meal Plan Overview:</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {plan.meals.slice(0, 3).map((meal) => (
                        <div key={meal.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="font-medium text-sm">{meal.name}</div>
                          <div className="text-xs text-gray-600">at {meal.time}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {meal.foods.length} food items
                          </div>
                        </div>
                      ))}
                      {plan.meals.length > 3 && (
                        <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-center">
                          <span className="text-sm text-gray-600">
                            +{plan.meals.length - 3} more meals
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Approval Info */}
                  {plan.approvedAt && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-600">
                        Approved on: {new Date(plan.approvedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPlans.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No diet plans found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start by creating a new diet plan for your patients'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button className="mt-4 bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Diet Plan
                </Button>
              )}
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