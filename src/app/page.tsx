import Link from 'next/link'
import Image from 'next/image'
import { Leaf, Users, Stethoscope, Shield, ArrowRight, Star, Heart, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ayurveda-mandala">
      {/* Hero Section with Ayurvedic Theme */}
      <section className="ayurveda-energy py-24 px-4 text-center">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="relative ayurveda-pulse">
                <Leaf className="h-24 w-24 text-white drop-shadow-lg" />
                <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl"></div>
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold hero-heading mb-6 drop-shadow-lg">
              <span className="hero-accent">Ayudhra</span>
            </h1>
            <p className="text-2xl md:text-3xl hero-subtext mb-4 drop-shadow-sm">
              Practice Management & Nutrient Analysis Software
            </p>
            <p className="text-xl hero-subtext mb-8 drop-shadow-sm">
              Tailored for Ayurvedic Dietitians, Focused on Ayurveda Diet Plans
            </p>
            <div className="text-lg hero-subtext font-medium mb-12 drop-shadow-sm">
              Developed by Team Hexabyte
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="btn-ayurveda-primary text-xl px-10 py-4 ayurveda-shadow-lg ayurveda-hover ayurveda-transition">
                  Get Started <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="btn-ayurveda-accent text-xl px-10 py-4 ayurveda-shadow-lg ayurveda-transition">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 ayurveda-calm">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-ayurveda-forest mb-6 ayurveda-heading">
              Comprehensive Ayurvedic Nutrition Analysis
            </h2>
            <p className="text-xl text-ayurveda-forest/80 max-w-4xl mx-auto">
              Experience the perfect blend of modern technology and ancient Ayurvedic wisdom
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {/* Six Tastes */}
            <Card className="ayurveda-card-pitta text-center ayurveda-hover ayurveda-transition ayurveda-shadow-lg ayurveda-rounded">
              <CardHeader>
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <Heart className="h-10 w-10 text-orange-600" />
                </div>
                <CardTitle className="text-2xl text-ayurveda-forest ayurveda-subheading">Six Tastes Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-lg">
                  Complete analysis of Shad Rasa - Madhura, Amla, Lavana, Katu, Tikta, and Kashaya for balanced nutrition
                </CardDescription>
              </CardContent>
            </Card>

            {/* Dosha Balance */}
            <Card className="ayurveda-card-vata text-center ayurveda-hover ayurveda-transition ayurveda-shadow-lg ayurveda-rounded">
              <CardHeader>
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <Brain className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-ayurveda-forest ayurveda-subheading">Dosha Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-lg">
                  Personalized food recommendations based on your Vata, Pitta, and Kapha constitution and current state
                </CardDescription>
              </CardContent>
            </Card>

            {/* Virya & Vipaka */}
            <Card className="ayurveda-card-kapha text-center ayurveda-hover ayurveda-transition ayurveda-shadow-lg ayurveda-rounded">
              <CardHeader>
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <Star className="h-10 w-10 text-emerald-600" />
                </div>
                <CardTitle className="text-2xl text-ayurveda-forest ayurveda-subheading">Complete Ayurvedic Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 text-lg">
                  Detailed analysis including Virya (heating/cooling), Vipaka (post-digestive effect), and Prabhava (unique properties)
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Role-based Access */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border-l-4 border-l-emerald-500 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center">
                  <Users className="h-10 w-10 text-emerald-600" />
                </div>
                <CardTitle className="text-gray-800 text-2xl font-bold">For Users</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-700 text-lg">Food scanning & analysis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-700 text-lg">Personalized diet plans</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-700 text-lg">Analytics & progress tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-700 text-lg">Doctor consultations</span>
                </div>
                <Link href="/auth/signup?role=user" className="block">
                  <Button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-3 rounded-lg transition-colors">Join as User</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-l-green-600 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                  <Stethoscope className="h-10 w-10 text-green-700" />
                </div>
                <CardTitle className="text-gray-800 text-2xl font-bold">For Doctors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700 text-lg">Patient management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700 text-lg">Diet plan creation & approval</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-gray-700 text-lg">Practice analytics</span>
                </div>
                <Link href="/auth/signup?role=doctor" className="block">
                  <Button className="w-full mt-6 bg-green-700 hover:bg-green-800 text-white text-lg py-3 rounded-lg transition-colors">Join as Doctor</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-l-amber-500 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center">
                  <Shield className="h-10 w-10 text-amber-600" />
                </div>
                <CardTitle className="text-gray-800 text-2xl font-bold">For Admins</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-700 text-lg">System overview</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-700 text-lg">User & doctor management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-700 text-lg">Platform analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-700 text-lg">Content management</span>
                </div>
                <Link href="/auth/login?role=admin" className="block">
                  <Button className="w-full mt-6 bg-amber-600 hover:bg-amber-700 text-white text-lg py-3 rounded-lg transition-colors">Admin Access</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dosha Section */}
      <section className="py-24 px-4 bg-pattern-grid">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 text-gray-900">
            Ayurvedic Dosha Analysis
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-vata text-center hover:transform hover:scale-105 transition-all shadow-2xl">
              <CardHeader>
                <div className="text-8xl mb-6">💨</div>
                <CardTitle className="text-3xl font-bold text-white">Vata</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 text-lg">
                  Air and space elements. Governs movement, circulation, and nervous system.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-pitta text-center hover:transform hover:scale-105 transition-all shadow-2xl">
              <CardHeader>
                <div className="text-8xl mb-6">🔥</div>
                <CardTitle className="text-3xl font-bold text-white">Pitta</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 text-lg">
                  Fire and water elements. Controls digestion, metabolism, and transformation.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-kapha text-center hover:transform hover:scale-105 transition-all shadow-2xl">
              <CardHeader>
                <div className="text-8xl mb-6">🌍</div>
                <CardTitle className="text-3xl font-bold text-white">Kapha</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/90 text-lg">
                  Earth and water elements. Provides structure, stability, and immunity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="gradient-rainbow py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-6">
              <Leaf className="h-12 w-12 text-white" />
              <span className="text-4xl font-bold text-white">Ayudhra</span>
            </div>
            <p className="text-white/90 mb-6 text-xl">
              Practice Management & Nutrient Analysis Software for Ayurvedic Dietitians
            </p>
            <p className="text-white/70 text-lg">
              © 2024 Team Hexabyte. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}