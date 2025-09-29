// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  abhaId: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
  prakriti: 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha';
  vikriti: 'Vata' | 'Pitta' | 'Kapha' | 'Balanced';
  doctorId: string;
  createdAt: string;
}

// Doctor Types
export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  hprId: string;
  qualification: string[];
  specialization: string;
  experience: number;
  clinicAddress: string;
  location: string;
  consultationFee: number;
  availableSlots: TimeSlot[];
  rating: number;
  reviewCount: number;
  patientsCount: number;
  createdAt: string;
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

// Food and Nutrition Types
export interface FoodItem {
  id: string;
  name: string;
  category: string;
  image: string;
  // Modern Nutrition
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  // Ayurvedic Properties
  rasa: Rasa[];
  virya: 'Ushna' | 'Shita'; // Hot or Cold
  vipaka: 'Madhura' | 'Amla' | 'Katu'; // Sweet, Sour, Pungent
  prabhava: string; // Unique effect
  guna: string[]; // Qualities like heavy/light, dry/oily
  dosha: {
    vata: 'increase' | 'decrease' | 'neutral';
    pitta: 'increase' | 'decrease' | 'neutral';
    kapha: 'increase' | 'decrease' | 'neutral';
  };
}

export type Rasa = 'Madhura' | 'Amla' | 'Lavana' | 'Katu' | 'Tikta' | 'Kashaya';

export interface FoodAnalysis {
  foodItem: FoodItem;
  quantity: number;
  consumedAt: string;
  userId: string;
  // Calculated values
  totalCalories: number;
  ayurvedicBalance: {
    rasaDistribution: Record<Rasa, number>;
    doshaImpact: {
      vata: number;
      pitta: number;
      kapha: number;
    };
  };
}

// Diet Plan Types
export interface DietPlan {
  id: string;
  userId: string;
  doctorId: string;
  name: string;
  description: string;
  duration: number; // days
  status: 'pending' | 'approved' | 'active' | 'completed';
  meals: Meal[];
  restrictions: string[];
  goals: string[];
  createdAt: string;
  approvedAt?: string;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  foods: {
    foodId: string;
    quantity: number;
    instructions?: string;
  }[];
  rasaBalance: Record<Rasa, number>;
}

// Preference Types
export interface DietPreferences {
  userId: string;
  budget: {
    min: number;
    max: number;
  };
  mealTimes: {
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks?: string[];
  };
  foodRestrictions: string[];
  preferredCuisines: string[];
  spiceLevel: 'mild' | 'medium' | 'spicy';
  goals: ('weight_loss' | 'weight_gain' | 'detox' | 'immunity' | 'digestion' | 'energy')[];
  lifestyle: 'sedentary' | 'active' | 'very_active';
}

// Analytics Types
export interface NutritionAnalytics {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly';
  date: string;
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  ayurvedicMetrics: {
    rasaDistribution: Record<Rasa, number>;
    doshaBalance: {
      vata: number;
      pitta: number;
      kapha: number;
    };
    virya: {
      hot: number;
      cold: number;
    };
  };
  foodCategories: Record<string, number>;
  digestibilityScore: number;
}

// Admin Types
export interface AdminStats {
  totalUsers: number;
  totalDoctors: number;
  totalFoodScans: number;
  totalDietPlans: number;
  activeSubscriptions: number;
  revenueMetrics: {
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
}

// Session and Chat Types
export interface Session {
  id: string;
  userId: string;
  doctorId: string;
  type: 'consultation' | 'follow-up' | 'emergency';
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  scheduledAt: string;
  date: string;
  duration: number; // minutes
  fee: number;
  notes?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  sessionId?: string;
  message: string;
  type: 'text' | 'image' | 'file';
  timestamp: string;
  read: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  duration: number;
  type: 'consultation' | 'follow-up';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  fee: number;
  createdAt: string;
}