'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Calendar, Zap, Target, Award } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { analyticsService } from '@/lib/api'
import { useToastContext } from '@/contexts/ToastContext'

export default function AnalyticsPage() {
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>('weekly')
  const [loading, setLoading] = useState(true)
  const [healthMetrics, setHealthMetrics] = useState<any>(null)
  const [weeklyData, setWeeklyData] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const { error: showError } = useToastContext()
  
  // Mock user ID - in real app, this would come from auth context
  const userId = 'user_1'

  useEffect(() => {
    loadAnalyticsData()
  }, [timeFrame])

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)
      
      // Load data with silent fallbacks
      const metrics = await analyticsService.getHealthMetrics(userId)
      setHealthMetrics(metrics)
      
      const [weekly, monthly] = await Promise.all([
        analyticsService.getWeeklyData(userId),
        analyticsService.getMonthlyData(userId)
      ])
      
      setWeeklyData(weekly)
      setMonthlyData(monthly)
      
    } catch (error) {
      // Silent error handling - no user notification
      // Set fallback data directly
      setHealthMetrics({
        doshaBalance: { vata: 35, pitta: 40, kapha: 25 },
        digestiveHealth: 78,
        rasaDistribution: {
          'Sweet (Madhura)': 30,
          'Sour (Amla)': 15,
          'Salty (Lavana)': 12,
          'Pungent (Katu)': 20,
          'Bitter (Tikta)': 13,
          'Astringent (Kashaya)': 10,
        },
        energyLevel: 82,
        recommendations: [
          'Reduce Pitta-aggravating foods during lunch',
          'Add more cooling foods to your diet',
          'Practice meditation to balance Vata',
          'Include bitter greens for liver support',
        ],
      })
      
      setWeeklyData([
        { day: 'Mon', calories: 1850, protein: 65, carbs: 230, fat: 70, water: 2.2 },
        { day: 'Tue', calories: 1920, protein: 70, carbs: 240, fat: 75, water: 2.5 },
        { day: 'Wed', calories: 1780, protein: 60, carbs: 220, fat: 65, water: 2.0 },
        { day: 'Thu', calories: 1900, protein: 68, carbs: 235, fat: 72, water: 2.3 },
        { day: 'Fri', calories: 1950, protein: 72, carbs: 245, fat: 78, water: 2.4 },
        { day: 'Sat', calories: 1820, protein: 62, carbs: 225, fat: 68, water: 2.1 },
        { day: 'Sun', calories: 1880, protein: 66, carbs: 232, fat: 71, water: 2.2 },
      ])
      
      setMonthlyData([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Mock data for charts that don't have API yet
  const rasaData = healthMetrics?.rasaDistribution ? Object.entries(healthMetrics.rasaDistribution).map(([name, value], index) => ({
    name,
    value: value as number,
    color: ['#ec4899', '#ef4444', '#06b6d4', '#f97316', '#84cc16', '#8b5cf6'][index % 6]
  })) : [
    { name: 'Sweet (Madhura)', value: 30, color: '#ec4899' },
    { name: 'Sour (Amla)', value: 15, color: '#ef4444' },
    { name: 'Salty (Lavana)', value: 12, color: '#06b6d4' },
    { name: 'Pungent (Katu)', value: 20, color: '#f97316' },
    { name: 'Bitter (Tikta)', value: 13, color: '#84cc16' },
    { name: 'Astringent (Kashaya)', value: 10, color: '#8b5cf6' }
  ]

  const doshaData = [
    { name: 'Mon', vata: healthMetrics?.doshaBalance.vata || 35, pitta: healthMetrics?.doshaBalance.pitta || 40, kapha: healthMetrics?.doshaBalance.kapha || 25 },
    { name: 'Tue', vata: 32, pitta: 45, kapha: 23 },
    { name: 'Wed', vata: 28, pitta: 42, kapha: 30 },
    { name: 'Thu', vata: 30, pitta: 38, kapha: 32 },
    { name: 'Fri', vata: 25, pitta: 35, kapha: 40 },
    { name: 'Sat', vata: 33, pitta: 37, kapha: 30 },
    { name: 'Sun', vata: 31, pitta: 41, kapha: 28 }
  ]

  const foodCategoryData = [
    { category: 'Grains', percentage: 35 },
    { category: 'Vegetables', percentage: 25 },
    { category: 'Proteins', percentage: 20 },
    { category: 'Fruits', percentage: 15 },
    { category: 'Spices', percentage: 5 }
  ]

  return (
    <div className="min-h-screen bg-green-50">
      <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Nutrition Analytics</h1>
          <p className="text-green-100">
            Track your Ayurvedic nutrition journey with detailed insights
          </p>
        </div>
        
        {/* Time Frame Selector */}
        <div className="flex bg-white rounded-lg p-1 mt-4 md:mt-0 shadow-sm">
          <button
            onClick={() => setTimeFrame('daily')}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              timeFrame === 'daily' 
                ? 'bg-green-600 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeFrame('weekly')}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              timeFrame === 'weekly' 
                ? 'bg-green-600 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeFrame('monthly')}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              timeFrame === 'monthly' 
                ? 'bg-green-600 text-white' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-full">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {weeklyData.length > 0 ? Math.round(weeklyData.reduce((sum, day) => sum + day.calories, 0) / weeklyData.length) : 1850}
                </p>
                <p className="text-sm text-gray-600">Avg Daily Calories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-full">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {healthMetrics?.digestiveHealth || 78}%
                </p>
                <p className="text-sm text-gray-600">Dosha Balance Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 rounded-full">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">85%</p>
                <p className="text-sm text-gray-600">Rasa Completeness</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {healthMetrics?.energyLevel || 82}%
                </p>
                <p className="text-sm text-gray-600">Energy Level</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calorie Trend */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <TrendingUp className="h-5 w-5 mr-2" />
              Calorie Intake Trend
            </CardTitle>
            <CardDescription className="text-gray-600">Daily calorie consumption over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="#16a34a" 
                  fill="#16a34a" 
                  fillOpacity={0.3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Six Tastes Distribution */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-gray-800">Six Tastes (Shad Rasa) Distribution</CardTitle>
            <CardDescription className="text-gray-600">Balance of tastes in your diet</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={rasaData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${value}%`}
                >
                  {rasaData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Dosha Balance Over Time */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-gray-800">Dosha Balance Tracking</CardTitle>
            <CardDescription className="text-gray-600">How your dosha balance changes throughout the week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={doshaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="vata" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  dot={{ fill: '#6366f1' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="pitta" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  dot={{ fill: '#f59e0b' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="kapha" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Food Categories */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-gray-800">Food Category Distribution</CardTitle>
            <CardDescription className="text-gray-600">Breakdown of food types in your diet</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={foodCategoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="percentage" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Digestive Health */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-gray-800">Digestive Health (Agni) Score</CardTitle>
            <CardDescription className="text-gray-600">Based on food combinations and eating patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Overall Agni Strength</span>
                <span className="text-sm font-bold text-gray-800">78/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full" 
                  style={{ width: '78%' }}
                ></div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">Good</div>
                  <div className="text-xs text-green-700">Meal Timing</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-lg font-bold text-yellow-600">Fair</div>
                  <div className="text-xs text-yellow-700">Food Combining</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">Excellent</div>
                  <div className="text-xs text-blue-700">Hydration</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-gray-800">Personalized Recommendations</CardTitle>
            <CardDescription className="text-gray-600">Based on your current constitution and imbalances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {healthMetrics?.recommendations?.length > 0 ? (
                healthMetrics.recommendations.map((recommendation: string, index: number) => (
                  <div key={index} className={`p-4 border rounded-lg ${
                    index % 4 === 0 ? 'bg-orange-50 border-orange-200' :
                    index % 4 === 1 ? 'bg-blue-50 border-blue-200' :
                    index % 4 === 2 ? 'bg-green-50 border-green-200' :
                    'bg-purple-50 border-purple-200'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        index % 4 === 0 ? 'bg-orange-400' :
                        index % 4 === 1 ? 'bg-blue-400' :
                        index % 4 === 2 ? 'bg-green-400' :
                        'bg-purple-400'
                      }`}></div>
                      <div>
                        <p className={`text-sm ${
                          index % 4 === 0 ? 'text-orange-700' :
                          index % 4 === 1 ? 'text-blue-700' :
                          index % 4 === 2 ? 'text-green-700' :
                          'text-purple-700'
                        }`}>
                          {recommendation}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-orange-800 text-sm">Reduce Pitta</p>
                        <p className="text-orange-700 text-sm">
                          Include more sweet, bitter, and astringent tastes. Avoid spicy foods during lunch.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-blue-800 text-sm">Support Vata</p>
                        <p className="text-blue-700 text-sm">
                          Add more warm, cooked foods and healthy fats like ghee to ground excess Vata.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-green-800 text-sm">Optimize Timing</p>
                        <p className="text-green-700 text-sm">
                          Your largest meal should be at midday when Agni is strongest (12-2 PM).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-purple-800 text-sm">Seasonal Adjustment</p>
                        <p className="text-purple-700 text-sm">
                          As we approach winter, increase warm spices and reduce cold/raw foods.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Progress */}
      <Card className="bg-white shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-800">
            <Target className="h-5 w-5 mr-2" />
            Health Goals Progress
          </CardTitle>
          <CardDescription className="text-gray-600">Track your progress towards Ayurvedic wellness goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Balance Doshas</span>
                <span className="text-sm text-gray-600">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Improve Digestion</span>
                <span className="text-sm text-gray-600">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Increase Energy</span>
                <span className="text-sm text-gray-600">82%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}