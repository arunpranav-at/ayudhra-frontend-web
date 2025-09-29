'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Users, Stethoscope, Activity, DollarSign, TrendingUp, TrendingDown, Eye, UserCheck, Calendar, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { mockUsers, mockDoctors, mockAdminStats, mockSessions, generateWeeklyData, generateMonthlyData } from '@/lib/data'

export default function AdminDashboard() {
  const stats = mockAdminStats
  const weeklyData = generateWeeklyData()
  const monthlyData = generateMonthlyData()

  // Data for charts
  const userGrowthData = [
    { month: 'Jan', users: 850, doctors: 45 },
    { month: 'Feb', users: 950, doctors: 52 },
    { month: 'Mar', users: 1250, doctors: 85 },
    { month: 'Apr', users: 1400, doctors: 92 },
  ]

  const doshaDistribution = [
    { name: 'Vata', value: 35, color: '#3b82f6' },
    { name: 'Pitta', value: 40, color: '#f59e0b' },
    { name: 'Kapha', value: 25, color: '#10b981' },
  ]

  const recentSessions = mockSessions.slice(0, 5)

  return (
    <div className="min-h-screen bg-pattern-dots">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="bg-white border-l-4 border-l-purple-600 rounded-lg p-6 shadow-lg">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 text-xl">Complete system overview and management</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 border-none shadow-2xl hover:transform hover:scale-105 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-white">Total Users</CardTitle>
            <Users className="h-8 w-8 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-sm text-white/80 mt-2">
              <TrendingUp className="inline h-4 w-4 mr-2" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-pink-600 border-none shadow-2xl hover:transform hover:scale-105 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-white">Total Doctors</CardTitle>
            <Stethoscope className="h-8 w-8 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalDoctors}</div>
            <p className="text-sm text-white/80 mt-2">
              <TrendingUp className="inline h-4 w-4 mr-2" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 border-none shadow-2xl hover:transform hover:scale-105 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-white">Food Scans</CardTitle>
            <Activity className="h-8 w-8 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalFoodScans.toLocaleString()}</div>
            <p className="text-sm text-white/80 mt-2">
              <TrendingUp className="inline h-4 w-4 mr-2" />
              +25% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 border-none shadow-2xl hover:transform hover:scale-105 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium text-white">Revenue</CardTitle>
            <DollarSign className="h-8 w-8 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">₹{(stats.revenueMetrics.thisMonth / 1000).toFixed(0)}K</div>
            <p className="text-sm text-white/80 mt-2">
              <TrendingUp className="inline h-4 w-4 mr-2" />
              +{stats.revenueMetrics.growth.toFixed(1)}% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User & Doctor Growth */}
        <Card className="bg-white border-l-4 border-l-emerald-500 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">User & Doctor Growth</CardTitle>
            <CardDescription className="text-gray-600">Monthly growth trends</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#10b981" opacity={0.3} />
                <XAxis dataKey="month" stroke="#059669" fontSize={12} />
                <YAxis stroke="#059669" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(16, 185, 129, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white'
                  }}
                />
                <Bar dataKey="users" fill="url(#greenGradient)" name="Users" radius={[4, 4, 0, 0]} />
                <Bar dataKey="doctors" fill="url(#blueGradient)" name="Doctors" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Dosha Distribution */}
        <Card className="bg-gradient-to-br from-white/90 via-purple-50/90 to-pink-100/90 backdrop-blur-sm border-none shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-rose-500/20 rounded-t-lg">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">User Dosha Distribution</CardTitle>
            <CardDescription className="text-purple-700/80 font-medium">Constitution types across platform</CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-pattern-grid opacity-90">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={doshaDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {doshaDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(147, 51, 234, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sessions */}
        <Card className="bg-gradient-to-br from-white/90 via-blue-50/90 to-indigo-100/90 backdrop-blur-sm border-none shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-t-lg">
            <CardTitle className="flex items-center justify-between text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Recent Sessions
              <Link href="/admin/sessions">
                <Button variant="outline" size="sm" className="border-blue-300 text-blue-600 hover:bg-blue-50">View All</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-pattern-dots opacity-90">
            <div className="space-y-4">
              {recentSessions.map((session) => {
                const user = mockUsers.find(u => u.id === session.userId)
                const doctor = mockDoctors.find(d => d.id === session.doctorId)
                return (
                  <div key={session.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border border-blue-200/50 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-blue-900 truncate">
                        {user?.name} → {doctor?.name}
                      </div>
                      <div className="text-xs text-blue-700/70">
                        {new Date(session.scheduledAt).toLocaleDateString()} • {session.type}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs px-3 py-2 rounded-full font-medium shadow-sm ${
                        session.status === 'completed' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' :
                        session.status === 'scheduled' ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200' :
                        'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200'
                      }`}>
                        {session.status}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-white/90 via-orange-50/90 to-red-100/90 backdrop-blur-sm border-none shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 rounded-t-lg">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Quick Actions</CardTitle>
            <CardDescription className="text-orange-700/80 font-medium">Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-pattern-grid opacity-90">
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/users">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 border-green-300 hover:from-green-100 hover:to-emerald-200 transition-all hover:scale-105 shadow-lg">
                  <Users className="h-8 w-8 mb-2 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">Manage Users</span>
                </Button>
              </Link>
              
              <Link href="/admin/doctors">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-300 hover:from-blue-100 hover:to-indigo-200 transition-all hover:scale-105 shadow-lg">
                  <Stethoscope className="h-8 w-8 mb-2 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">Manage Doctors</span>
                </Button>
              </Link>
              
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center bg-gradient-to-br from-cyan-50 to-teal-100 border-cyan-300 hover:from-cyan-100 hover:to-teal-200 transition-all hover:scale-105 shadow-lg">
                <Activity className="h-8 w-8 mb-2 text-cyan-600" />
                <span className="text-sm font-semibold text-cyan-700">View Analytics</span>
              </Button>
              
              <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 border-purple-300 hover:from-purple-100 hover:to-pink-200 transition-all hover:scale-105 shadow-lg">
                <MessageSquare className="h-8 w-8 mb-2 text-purple-600" />
                <span className="text-sm font-semibold text-purple-700">System Logs</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Health */}
      <Card className="bg-gradient-to-br from-white/90 via-emerald-50/90 to-teal-100/90 backdrop-blur-sm border-none shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-t-lg">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Platform Health</CardTitle>
          <CardDescription className="text-emerald-700/80 font-medium">System performance and user engagement metrics</CardDescription>
        </CardHeader>
        <CardContent className="p-6 bg-pattern-dots opacity-90">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl shadow-lg">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">98.5%</div>
              <div className="text-sm text-green-700 font-medium">Uptime</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow-lg">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">2.3s</div>
              <div className="text-sm text-blue-700 font-medium">Avg Response Time</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-teal-100 rounded-xl shadow-lg">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">85%</div>
              <div className="text-sm text-cyan-700 font-medium">User Satisfaction</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-100 rounded-xl shadow-lg">
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">12.5k</div>
              <div className="text-sm text-orange-700 font-medium">Active Sessions</div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}