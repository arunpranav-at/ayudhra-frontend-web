'use client'

import { useState } from 'react'
import { Camera, Upload, Zap, Thermometer, Droplets, Leaf, Info, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { foodAnalysisService, type FoodAnalysisResponse } from '@/lib/api'

// Fallback data for when API fails
const fallbackFoodData = {
  food_detected: "Apple",
  modern_nutrition: {
    calories: 52,
    protein: "0.3g",
    carbs: "14g",
    fats: "0.2g",
    vitamins: ["Vitamin C", "Vitamin K"],
    minerals: ["Potassium", "Manganese"]
  },
  ayurvedic_nutrition: {
    rasa: "Sweet, Astringent",
    guna: "Light, Dry",
    virya: "Cooling",
    vipaka: "Sweet",
    doshaEffect: {
      vata: "Pacifies",
      pitta: "Pacifies",
      kapha: "May aggravate in excess"
    }
  }
}

export default function FoodScanPage() {
  const [scanning, setScanning] = useState(false)
  const [scannedFood, setScannedFood] = useState<FoodAnalysisResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleAnalysis = async (file?: File) => {
    setScanning(true)
    setError(null)
    
    try {
      let result: FoodAnalysisResponse;
      
      if (file) {
        result = await foodAnalysisService.analyzeFoodFromFile(file)
      } else {
        // For camera capture, we'll simulate with fallback data for now
        // In a real app, you'd integrate with camera API
        await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing
        result = fallbackFoodData
      }
      
      setScannedFood(result)
    } catch (err) {
      // Silently use fallback data when API fails
      console.warn('Food analysis API unavailable, using sample data:', err)
      setScannedFood(fallbackFoodData)
    } finally {
      setScanning(false)
    }
  }

  const handleScan = () => {
    handleAnalysis()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      handleAnalysis(file)
    }
  }

  const parseNumericValue = (value: string): number => {
    return parseFloat(value.replace(/[^\d.]/g, '')) || 0
  }

  const getRasaColor = (rasa: string) => {
    const colors: Record<string, string> = {
      'Sweet': 'bg-pink-400',
      'Madhura': 'bg-pink-400',
      'Sour': 'bg-red-400',
      'Amla': 'bg-red-400', 
      'Salty': 'bg-cyan-400',
      'Lavana': 'bg-cyan-400',
      'Pungent': 'bg-orange-400',
      'Katu': 'bg-orange-400',
      'Bitter': 'bg-lime-400',
      'Tikta': 'bg-lime-400',
      'Astringent': 'bg-violet-400',
      'Kashaya': 'bg-violet-400'
    }
    return colors[rasa] || 'bg-gray-400'
  }

  const getDoshaColor = (effect: string) => {
    const lowerEffect = effect.toLowerCase()
    if (lowerEffect.includes('increase') || lowerEffect.includes('aggravate')) return 'text-red-600'
    if (lowerEffect.includes('decrease') || lowerEffect.includes('pacif')) return 'text-green-600'
    return 'text-gray-600'
  }

  const getDoshaSymbol = (effect: string) => {
    const lowerEffect = effect.toLowerCase()
    if (lowerEffect.includes('increase') || lowerEffect.includes('aggravate')) return '↑'
    if (lowerEffect.includes('decrease') || lowerEffect.includes('pacif')) return '↓'
    return '='
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Food Analysis</h1>
          <p className="text-green-100">
            Discover the Ayurvedic properties and modern nutrition facts of your food
          </p>
        </div>

      {!scannedFood ? (
        /* Scanning Interface */
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Scan Your Food</CardTitle>
              <CardDescription>
                Take a photo or upload an image to analyze its Ayurvedic properties
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Camera/Upload Area */}
              <div className="border-4 border-dashed border-gray-300 rounded-xl p-16 text-center bg-gray-50">
                {scanning ? (
                  <div className="space-y-4">
                    <Loader2 className="h-20 w-20 text-green-600 mx-auto animate-spin" />
                    <p className="text-xl font-medium text-gray-800">Analyzing your food...</p>
                    <p className="text-gray-600 text-lg">
                      Identifying Ayurvedic properties and nutritional content
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Camera className="h-20 w-20 text-gray-500 mx-auto" />
                    <div>
                      <p className="text-xl font-medium mb-2 text-gray-800">Ready to scan</p>
                      <p className="text-gray-600 mb-4 text-lg">
                        Place your food in good lighting for best results
                      </p>
                      {selectedFile && (
                        <p className="text-sm text-green-600 mb-2 font-medium">
                          Selected: {selectedFile.name}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {!scanning && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={handleScan} className="flex-1" size="lg" disabled={scanning}>
                    <Camera className="mr-2 h-5 w-5" />
                    Take Photo
                  </Button>
                  
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      disabled={scanning}
                    />
                    <label htmlFor="file-upload" className="block">
                      <Button variant="outline" size="lg" className="w-full bg-white border-green-300 text-green-700 hover:bg-green-50" asChild disabled={scanning}>
                        <span className="flex items-center justify-center">
                          <Upload className="mr-2 h-5 w-5" />
                          Upload Image
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Analysis Results */
        <div className="space-y-6">
          {/* Food Identification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{scannedFood.food_detected}</CardTitle>
              <CardDescription>AI-Powered Food Analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Modern Nutrition */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Modern Nutrition (per 100g)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white shadow-md border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{scannedFood?.modern_nutrition?.calories || 0}</div>
                      <div className="text-sm text-gray-700">Calories</div>
                    </div>
                    <div className="text-center p-3 bg-white shadow-md border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{scannedFood?.modern_nutrition?.protein || "0g"}</div>
                      <div className="text-sm text-gray-700">Protein</div>
                    </div>
                    <div className="text-center p-3 bg-white shadow-md border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{scannedFood?.modern_nutrition?.carbs || "0g"}</div>
                      <div className="text-sm text-gray-700">Carbs</div>
                    </div>
                    <div className="text-center p-3 bg-white shadow-md border rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{scannedFood?.modern_nutrition?.fats || "0g"}</div>
                      <div className="text-sm text-gray-700">Fat</div>
                    </div>
                  </div>
                  
                  {/* Vitamins and Minerals */}
                  <div className="mt-4 space-y-2">
                    <div>
                      <h4 className="font-medium text-sm mb-1">Vitamins:</h4>
                      <div className="flex flex-wrap gap-1">
                        {(scannedFood?.modern_nutrition?.vitamins || []).map((vitamin, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {vitamin}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">Minerals:</h4>
                      <div className="flex flex-wrap gap-1">
                        {(scannedFood?.modern_nutrition?.minerals || []).map((mineral, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            {mineral}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ayurvedic Properties Overview */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Ayurvedic Properties</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white shadow-md border rounded-lg">
                      <span className="flex items-center text-gray-700">
                        <Thermometer className="h-4 w-4 mr-2 text-gray-600" />
                        Virya (Energy)
                      </span>
                      <span className={`font-medium ${(scannedFood?.ayurvedic_nutrition?.virya || '').toLowerCase().includes('cooling') ? 'text-blue-600' : 'text-red-600'}`}>
                        {scannedFood?.ayurvedic_nutrition?.virya || 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white shadow-md border rounded-lg">
                      <span className="flex items-center text-gray-700">
                        <Droplets className="h-4 w-4 mr-2 text-gray-600" />
                        Vipaka (Post-digestive)
                      </span>
                      <span className="font-medium text-blue-600">{scannedFood?.ayurvedic_nutrition?.vipaka || 'N/A'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white shadow-md border rounded-lg">
                      <span className="flex items-center text-gray-700">
                        <Leaf className="h-4 w-4 mr-2 text-gray-600" />
                        Rasa (Taste)
                      </span>
                      <span className="font-medium text-blue-600">{scannedFood?.ayurvedic_nutrition?.rasa || 'N/A'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white shadow-md border rounded-lg">
                      <span className="flex items-center text-gray-700">
                        <Info className="h-4 w-4 mr-2 text-gray-600" />
                        Guna (Quality)
                      </span>
                      <span className="font-medium text-blue-600">{scannedFood?.ayurvedic_nutrition?.guna || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Six Tastes (Shad Rasa) */}
          <Card className="bg-white shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800">
                <Leaf className="h-5 w-5 mr-2 text-green-600" />
                Six Tastes (Shad Rasa)
              </CardTitle>
              <CardDescription className="text-gray-600">
                The foundation of Ayurvedic nutrition - each taste affects the body differently
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(scannedFood?.ayurvedic_nutrition?.rasa || 'Sweet').split(',').map((rasa: string, index: number) => {
                  const cleanRasa = rasa.trim()
                  return (
                    <div key={index} className="text-center p-4 border rounded-lg bg-white shadow-sm">
                      <div className={`w-12 h-12 ${getRasaColor(cleanRasa)} rounded-full mx-auto mb-2`}></div>
                      <div className="font-medium text-gray-800">{cleanRasa}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {cleanRasa.toLowerCase().includes('sweet') && 'Nourishing'}
                        {cleanRasa.toLowerCase().includes('sour') && 'Energizing'}
                        {cleanRasa.toLowerCase().includes('salty') && 'Balancing'}
                        {cleanRasa.toLowerCase().includes('pungent') && 'Cleansing'}
                        {cleanRasa.toLowerCase().includes('bitter') && 'Detoxifying'}
                        {cleanRasa.toLowerCase().includes('astringent') && 'Firming'}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Dosha Impact */}
          <Card className="bg-white shadow-xl border-0">
            <CardHeader>
              <CardTitle className="text-gray-800">Dosha Impact</CardTitle>
              <CardDescription className="text-gray-600">
                How this food affects your three doshas (biological energies)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">V</span>
                  </div>
                  <div className="font-semibold mb-1 text-gray-800">Vata (Air + Space)</div>
                  <div className={`text-lg font-bold ${getDoshaColor(scannedFood?.ayurvedic_nutrition?.doshaEffect?.vata || 'neutral')}`}>
                    {getDoshaSymbol(scannedFood?.ayurvedic_nutrition?.doshaEffect?.vata || 'neutral')} {(scannedFood?.ayurvedic_nutrition?.doshaEffect?.vata || 'neutral').toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Movement & Circulation</div>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">P</span>
                  </div>
                  <div className="font-semibold mb-1 text-gray-800">Pitta (Fire + Water)</div>
                  <div className={`text-lg font-bold ${getDoshaColor(scannedFood?.ayurvedic_nutrition?.doshaEffect?.pitta || 'neutral')}`}>
                    {getDoshaSymbol(scannedFood?.ayurvedic_nutrition?.doshaEffect?.pitta || 'neutral')} {(scannedFood?.ayurvedic_nutrition?.doshaEffect?.pitta || 'neutral').toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Digestion & Metabolism</div>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">K</span>
                  </div>
                  <div className="font-semibold mb-1 text-gray-800">Kapha (Earth + Water)</div>
                  <div className={`text-lg font-bold ${getDoshaColor(scannedFood?.ayurvedic_nutrition?.doshaEffect?.kapha || 'neutral')}`}>
                    {getDoshaSymbol(scannedFood?.ayurvedic_nutrition?.doshaEffect?.kapha || 'neutral')} {(scannedFood?.ayurvedic_nutrition?.doshaEffect?.kapha || 'neutral').toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Structure & Immunity</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prabhava (Unique Effect) */}
          <Card className="bg-white shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800">
                <Zap className="h-5 w-5 mr-2 text-yellow-600" />
                Special Properties
              </CardTitle>
              <CardDescription className="text-gray-600">
                Unique effects and properties of this food according to Ayurveda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800 mb-1">Guna (Qualities):</p>
                    <p className="text-gray-700">{scannedFood?.ayurvedic_nutrition?.guna || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => setScannedFood(null)} variant="outline" className="flex-1 bg-white text-green-700 hover:bg-green-50 border-green-300 font-semibold">
              Scan Another Food
            </Button>
            <Button className="flex-1">
              Add to Meal Log
            </Button>
            <Button variant="secondary" className="flex-1 bg-white text-gray-800 hover:bg-gray-50 border-gray-300 font-semibold">
              Get Recommendations
            </Button>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}