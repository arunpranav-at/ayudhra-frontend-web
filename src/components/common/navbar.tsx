'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Leaf, User, Stethoscope, Shield, Menu, X, BarChart3, MessageSquare, Calendar, LogOut } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

export default function Navbar() {
  const pathname = usePathname()
  const { isAuthenticated, userType, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isAuthPage = pathname?.startsWith('/auth')
  
  if (isAuthPage) {
    return (
      <nav className="gradient-rainbow shadow-2xl sticky top-0 z-50 w-full border-b border-white/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Leaf className="h-10 w-10 text-white group-hover:text-white/80 transition-colors" />
                <div className="absolute inset-0 bg-white/20 rounded-full blur-lg group-hover:blur-xl transition-all"></div>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold text-white group-hover:text-white/90 transition-colors">Ayudhra</span>
                <p className="text-sm text-white/70">by Team Hexabyte</p>
              </div>
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  // If not authenticated, show minimal navbar
  if (!isAuthenticated) {
    return (
      <nav className="gradient-rainbow shadow-2xl sticky top-0 z-50 w-full border-b border-white/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Leaf className="h-10 w-10 text-white group-hover:text-white/80 transition-colors" />
                <div className="absolute inset-0 bg-white/20 rounded-full blur-lg group-hover:blur-xl transition-all"></div>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold text-white group-hover:text-white/90 transition-colors">Ayudhra</span>
                <p className="text-sm text-white/70">by Team Hexabyte</p>
              </div>
            </Link>
            <div className="flex items-center">
              <Link
                href="/auth/login"
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-all transform hover:scale-105 shadow-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  const getDashboardLink = () => {
    switch (userType) {
      case 'user': return '/user'
      case 'doctor': return '/doctor'
      case 'admin': return '/admin'
      default: return '/'
    }
  }

  const getNavItems = () => {
    switch (userType) {
      case 'user':
        return [
          { name: 'Dashboard', href: '/user', icon: User },
          { name: 'Food Scan', href: '/user/scan', icon: Leaf },
          { name: 'Analytics', href: '/user/analytics', icon: BarChart3 },
          { name: 'Sessions', href: '/user/sessions', icon: Calendar },
          { name: 'Messages', href: '/user/chat', icon: MessageSquare },
        ]
      case 'doctor':
        return [
          { name: 'Dashboard', href: '/doctor', icon: Stethoscope },
          { name: 'Patients', href: '/doctor/patients', icon: User },
          { name: 'Diet Plans', href: '/doctor/plans', icon: Leaf },
          { name: 'Messages', href: '/doctor/chat', icon: MessageSquare },
        ]
      case 'admin':
        return [
          { name: 'Dashboard', href: '/admin', icon: Shield },
          { name: 'Doctors', href: '/admin/doctors', icon: Stethoscope },
          { name: 'Users', href: '/admin/users', icon: User },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  return (
    <nav className="gradient-rainbow shadow-2xl sticky top-0 z-50 w-full border-b border-white/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18">
          <div className="flex items-center">
            <Link href={getDashboardLink()} className="flex items-center space-x-3 group">
              <div className="relative">
                <Leaf className="h-10 w-10 text-white group-hover:text-white/80 transition-colors" />
                <div className="absolute inset-0 bg-white/20 rounded-full blur-lg group-hover:blur-xl transition-all"></div>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold text-white group-hover:text-white/90 transition-colors">Ayudhra</span>
                <p className="text-sm text-white/70">by Team Hexabyte</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex ml-12 space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all transform hover:scale-105",
                      pathname === item.href
                        ? "bg-white/25 backdrop-blur-sm text-white shadow-lg border border-white/30"
                        : "text-white/80 hover:bg-white/15 hover:text-white backdrop-blur-sm border border-transparent hover:border-white/20"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="text-sm text-white/80 capitalize bg-white/15 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              {userType} Dashboard
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-white/30 transition-all transform hover:scale-105 shadow-lg"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-white/20 backdrop-blur-sm border border-white/30 text-white p-3 rounded-xl hover:bg-white/30 transition-all"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-4 pb-6 space-y-2 bg-black/20 backdrop-blur-sm rounded-xl mt-4 mb-4 border border-white/20">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all",
                      pathname === item.href
                        ? "bg-white/25 backdrop-blur-sm text-white shadow-lg border border-white/30"
                        : "text-white/80 hover:bg-white/15 hover:text-white border border-transparent hover:border-white/20"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-6 w-6" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              <div className="border-t border-white/20 pt-4 mt-4">
                <div className="text-sm text-white/70 px-4 py-2 capitalize bg-white/10 rounded-lg mb-3 border border-white/20">
                  {userType} Dashboard
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-4 py-3 text-base font-medium text-white bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 rounded-lg transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}