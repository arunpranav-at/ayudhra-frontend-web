import Link from 'next/link'
import { Camera, Calendar, User, TrendingUp, Apple, Clock, Star, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { mockUsers, mockDoctors, mockNutritionAnalytics } from '@/lib/data'
import ProtectedRoute from '@/components/common/ProtectedRoute'

function UserDashboard() {
  // Mock user data - in real app, this would come from authentication context
  const currentUser = mockUsers[0]
  const doctor = mockDoctors.find(d => d.id === currentUser.doctorId)
  const todayAnalytics = mockNutritionAnalytics[0]

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-white border-l-4 border-l-indigo-600 rounded-lg p-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800">
              Namaste, {currentUser.name}! 🙏
            </h1>
            <p className="text-gray-600 text-lg">
              Welcome to your Ayurvedic wellness journey
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3">
            <div className="text-sm text-gray-500">Prakriti</div>
            <div className="text-xl font-semibold text-indigo-700">{currentUser.prakriti}</div>
            <div className="text-sm text-gray-500 mt-1">Current State: <span className="text-purple-600">{currentUser.vikriti}</span></div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/user/scan">
          <Card className="bg-white border-l-4 border-l-emerald-500 hover:shadow-xl transition-all duration-300 cursor-pointer hover:transform hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center">
                <Camera className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-lg mb-1 text-gray-800">Scan Food</h3>
              <p className="text-sm text-gray-600">Analyze your meal with Ayurvedic principles</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/user/analytics">
          <Card className="bg-white border-l-4 border-l-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer hover:transform hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-1 text-gray-800">Analytics</h3>
              <p className="text-sm text-gray-600">View your nutrition insights</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/user/diet">
          <Card className="bg-white border-l-4 border-l-orange-500 hover:shadow-xl transition-all duration-300 cursor-pointer hover:transform hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                <Apple className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-lg mb-1 text-gray-800">Diet Plans</h3>
              <p className="text-sm text-gray-600">Personalized meal recommendations</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/user/sessions">
          <Card className="bg-white border-l-4 border-l-purple-500 hover:shadow-xl transition-all duration-300 cursor-pointer hover:transform hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-1 text-gray-800">Sessions</h3>
              <p className="text-sm text-gray-600">Book consultations</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Doctor Info & Today's Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doctor Information */}
        <Card className="bg-white border-l-4 border-l-green-600 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <User className="h-5 w-5 mr-2 text-green-600" />
              Your Ayurvedic Doctor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-800">{doctor?.name}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  {doctor?.specialization}
                </p>
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-700">{doctor?.rating}/5.0</span>
                  <span className="text-gray-500 text-sm">
                    ({doctor?.patientsCount} patients)
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {doctor?.experience} years experience
                </p>
                <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm">
                  Book Consultation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Nutrition Overview */}
        <Card className="bg-white border-l-4 border-l-red-500 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              Today's Nutrition Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Calories</span>
                  <span className="text-sm text-gray-600">
                    {todayAnalytics.totalCalories} / 2000
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${(todayAnalytics.totalCalories / 2000) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2 text-gray-700">Dosha Balance</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Vata</span>
                    <div className="flex-1 mx-2 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full" 
                        style={{ width: `${todayAnalytics.ayurvedicMetrics.doshaBalance.vata}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{todayAnalytics.ayurvedicMetrics.doshaBalance.vata}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Pitta</span>
                    <div className="flex-1 mx-2 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-orange-500 h-1.5 rounded-full" 
                        style={{ width: `${todayAnalytics.ayurvedicMetrics.doshaBalance.pitta}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{todayAnalytics.ayurvedicMetrics.doshaBalance.pitta}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Kapha</span>
                    <div className="flex-1 mx-2 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-green-500 h-1.5 rounded-full" 
                        style={{ width: `${todayAnalytics.ayurvedicMetrics.doshaBalance.kapha}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{todayAnalytics.ayurvedicMetrics.doshaBalance.kapha}%</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2 text-gray-700">Six Tastes Balance</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-pink-400 rounded-full mx-auto mb-1"></div>
                    <div className="text-gray-700">Sweet</div>
                    <div className="text-gray-500">
                      {todayAnalytics.ayurvedicMetrics.rasaDistribution.Madhura}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-red-400 rounded-full mx-auto mb-1"></div>
                    <div className="text-gray-700">Sour</div>
                    <div className="text-gray-500">
                      {todayAnalytics.ayurvedicMetrics.rasaDistribution.Amla}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-cyan-400 rounded-full mx-auto mb-1"></div>
                    <div className="text-gray-700">Salty</div>
                    <div className="text-gray-500">
                      {todayAnalytics.ayurvedicMetrics.rasaDistribution.Lavana}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-orange-400 rounded-full mx-auto mb-1"></div>
                    <div className="text-gray-700">Pungent</div>
                    <div className="text-gray-500">
                      {todayAnalytics.ayurvedicMetrics.rasaDistribution.Katu}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-lime-400 rounded-full mx-auto mb-1"></div>
                    <div className="text-gray-700">Bitter</div>
                    <div className="text-gray-500">
                      {todayAnalytics.ayurvedicMetrics.rasaDistribution.Tikta}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-violet-400 rounded-full mx-auto mb-1"></div>
                    <div className="text-gray-700">Astringent</div>
                    <div className="text-gray-500">
                      {todayAnalytics.ayurvedicMetrics.rasaDistribution.Kashaya}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Food Scans */}
        <Card className="bg-white border-l-4 border-l-teal-500 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-gray-800">
              Recent Food Scans
              <Link href="/user/scan">
                <Button variant="outline" size="sm" className="border-teal-500 text-teal-600 hover:bg-teal-50">View All</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                  <Apple className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-800">Mixed Vegetable Curry</div>
                  <div className="text-xs text-gray-500">
                    1 hour ago • Sweet, Bitter, Pungent
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-800">320 cal</div>
                  <div className="text-xs text-green-600">Balanced</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <Apple className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-800">Quinoa Salad Bowl</div>
                  <div className="text-xs text-gray-500">
                    3 hours ago • Sweet, Astringent
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-800">285 cal</div>
                  <div className="text-xs text-blue-600">Light</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <Apple className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-800">Spiced Lentil Soup</div>
                  <div className="text-xs text-gray-500">
                    5 hours ago • Salty, Pungent, Bitter
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-800">380 cal</div>
                  <div className="text-xs text-yellow-600">Warming</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-white border-l-4 border-l-indigo-500 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800">Ayurvedic Recommendations</CardTitle>
            <CardDescription className="text-gray-600">Based on your Prakriti and current state</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Morning Routine</span>
                </div>
                <p className="text-sm text-blue-700">
                  Start your day with warm water and ginger to enhance Agni (digestive fire)
                </p>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Apple className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Diet Tip</span>
                </div>
                <p className="text-sm text-green-700">
                  Include more bitter and astringent tastes to balance your current Pitta dominance
                </p>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-800">Mindfulness</span>
                </div>
                <p className="text-sm text-orange-700">
                  Practice mindful eating - chew slowly and appreciate the six tastes in your meal
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Wrap the component with route protection
function ProtectedUserDashboard() {
  return (
    <ProtectedRoute allowedUserTypes={['user']}>
      <UserDashboard />
    </ProtectedRoute>
  )
}

export default ProtectedUserDashboard