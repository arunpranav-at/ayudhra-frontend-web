import { User, Doctor, FoodItem, NutritionAnalytics, AdminStats, DietPlan, Session, ChatMessage, Appointment } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Arjun Kumar',
    email: 'arjun.kumar@example.com',
    phone: '+91 9876543210',
    abhaId: 'ABHA-1234-5678-9012',
    dateOfBirth: '1990-05-15',
    gender: 'male',
    height: 175,
    weight: 70,
    medicalHistory: ['Hypertension', 'Diabetes Type 2'],
    allergies: ['Nuts', 'Shellfish'],
    currentMedications: ['Metformin', 'Lisinopril'],
    prakriti: 'Vata-Pitta',
    vikriti: 'Pitta',
    doctorId: '1',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 9876543211',
    abhaId: 'ABHA-2345-6789-0123',
    dateOfBirth: '1985-08-22',
    gender: 'female',
    height: 160,
    weight: 55,
    medicalHistory: ['Migraine', 'PCOS'],
    allergies: ['Dairy'],
    currentMedications: ['Birth Control Pills'],
    prakriti: 'Kapha',
    vikriti: 'Kapha',
    doctorId: '1',
    createdAt: '2024-02-20T14:30:00Z'
  }
];

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Rajesh Ayengar',
    email: 'rajesh.ayengar@ayudhra.com',
    phone: '+91 9123456789',
    hprId: 'HPR-AYUR-001',
    qualification: ['BAMS', 'MD (Ayurveda)', 'PhD in Panchakarma'],
    specialization: 'Panchakarma',
    experience: 15,
    clinicAddress: '123, Ayurveda Street, Bangalore, Karnataka - 560001',
    location: 'Bangalore',
    consultationFee: 800,
    availableSlots: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00' },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
      { day: 'Friday', startTime: '09:00', endTime: '17:00' },
      { day: 'Saturday', startTime: '09:00', endTime: '13:00' }
    ],
    rating: 4.8,
    reviewCount: 124,
    patientsCount: 250,
    createdAt: '2023-06-01T08:00:00Z'
  },
  {
    id: '2',
    name: 'Dr. Meera Nair',
    email: 'meera.nair@ayudhra.com',
    phone: '+91 9123456790',
    hprId: 'HPR-AYUR-002',
    qualification: ['BAMS', 'MS (Ayurveda Gynecology)'],
    specialization: 'Women Health',
    experience: 12,
    clinicAddress: '456, Wellness Avenue, Chennai, Tamil Nadu - 600001',
    location: 'Chennai',
    consultationFee: 700,
    availableSlots: [
      { day: 'Monday', startTime: '10:00', endTime: '18:00' },
      { day: 'Tuesday', startTime: '10:00', endTime: '18:00' },
      { day: 'Wednesday', startTime: '10:00', endTime: '18:00' },
      { day: 'Thursday', startTime: '10:00', endTime: '18:00' },
      { day: 'Friday', startTime: '10:00', endTime: '18:00' }
    ],
    rating: 4.9,
    reviewCount: 89,
    patientsCount: 180,
    createdAt: '2023-08-15T10:00:00Z'
  },
  {
    id: '3',
    name: 'Dr. Amit Gupta',
    email: 'amit.gupta@ayudhra.com',
    phone: '+91 9123456791',
    hprId: 'HPR-AYUR-003',
    qualification: ['BAMS', 'MD (Kaya Chikitsa)'],
    specialization: 'Dermatology',
    experience: 10,
    clinicAddress: '789, Health Plaza, Mumbai, Maharashtra - 400001',
    location: 'Mumbai',
    consultationFee: 600,
    availableSlots: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00' },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
      { day: 'Friday', startTime: '09:00', endTime: '17:00' }
    ],
    rating: 4.6,
    reviewCount: 67,
    patientsCount: 140,
    createdAt: '2023-09-10T10:00:00Z'
  },
  {
    id: '4',
    name: 'Dr. Lakshmi Devi',
    email: 'lakshmi.devi@ayudhra.com',
    phone: '+91 9123456792',
    hprId: 'HPR-AYUR-004',
    qualification: ['BAMS', 'MD (Shalya Tantra)'],
    specialization: 'Surgery',
    experience: 18,
    clinicAddress: '321, Ayur Complex, Hyderabad, Telangana - 500001',
    location: 'Hyderabad',
    consultationFee: 900,
    availableSlots: [
      { day: 'Monday', startTime: '08:00', endTime: '16:00' },
      { day: 'Tuesday', startTime: '08:00', endTime: '16:00' },
      { day: 'Wednesday', startTime: '08:00', endTime: '16:00' },
      { day: 'Thursday', startTime: '08:00', endTime: '16:00' },
      { day: 'Friday', startTime: '08:00', endTime: '16:00' }
    ],
    rating: 4.9,
    reviewCount: 156,
    patientsCount: 320,
    createdAt: '2023-05-20T08:00:00Z'
  }
];

export const mockFoodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Basmati Rice',
    category: 'Grains',
    image: '/images/foods/rice.jpg',
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    fiber: 0.4,
    rasa: ['Madhura'],
    virya: 'Shita',
    vipaka: 'Madhura',
    prabhava: 'Nourishing and easy to digest',
    guna: ['Guru', 'Snigdha'],
    dosha: {
      vata: 'decrease',
      pitta: 'decrease',
      kapha: 'increase'
    }
  },
  {
    id: '2',
    name: 'Turmeric',
    category: 'Spices',
    image: '/images/foods/turmeric.jpg',
    calories: 354,
    protein: 7.8,
    carbs: 65,
    fat: 10,
    fiber: 21,
    rasa: ['Katu', 'Tikta'],
    virya: 'Ushna',
    vipaka: 'Katu',
    prabhava: 'Anti-inflammatory, blood purifier',
    guna: ['Laghu', 'Ruksha'],
    dosha: {
      vata: 'increase',
      pitta: 'neutral',
      kapha: 'decrease'
    }
  },
  {
    id: '3',
    name: 'Ghee',
    category: 'Fats',
    image: '/images/foods/ghee.jpg',
    calories: 900,
    protein: 0,
    carbs: 0,
    fat: 100,
    fiber: 0,
    rasa: ['Madhura'],
    virya: 'Ushna',
    vipaka: 'Madhura',
    prabhava: 'Enhances digestion, nourishes tissues',
    guna: ['Guru', 'Snigdha'],
    dosha: {
      vata: 'decrease',
      pitta: 'neutral',
      kapha: 'increase'
    }
  },
  {
    id: '4',
    name: 'Ginger',
    category: 'Spices',
    image: '/images/foods/ginger.jpg',
    calories: 80,
    protein: 1.8,
    carbs: 18,
    fat: 0.8,
    fiber: 2,
    rasa: ['Katu'],
    virya: 'Ushna',
    vipaka: 'Madhura',
    prabhava: 'Digestive stimulant, anti-nausea',
    guna: ['Laghu', 'Snigdha'],
    dosha: {
      vata: 'decrease',
      pitta: 'increase',
      kapha: 'decrease'
    }
  },
  {
    id: '5',
    name: 'Cucumber',
    category: 'Vegetables',
    image: '/images/foods/cucumber.jpg',
    calories: 16,
    protein: 0.7,
    carbs: 4,
    fat: 0.1,
    fiber: 0.5,
    rasa: ['Madhura', 'Kashaya'],
    virya: 'Shita',
    vipaka: 'Madhura',
    prabhava: 'Cooling, hydrating',
    guna: ['Laghu', 'Snigdha'],
    dosha: {
      vata: 'increase',
      pitta: 'decrease',
      kapha: 'neutral'
    }
  }
];

export const mockNutritionAnalytics: NutritionAnalytics[] = [
  {
    userId: '1',
    period: 'daily',
    date: '2024-03-26',
    totalCalories: 1850,
    macros: {
      protein: 65,
      carbs: 220,
      fat: 70
    },
    ayurvedicMetrics: {
      rasaDistribution: {
        'Madhura': 40,
        'Amla': 15,
        'Lavana': 10,
        'Katu': 20,
        'Tikta': 10,
        'Kashaya': 5
      },
      doshaBalance: {
        vata: 35,
        pitta: 40,
        kapha: 25
      },
      virya: {
        hot: 60,
        cold: 40
      }
    },
    foodCategories: {
      'Grains': 35,
      'Vegetables': 25,
      'Proteins': 20,
      'Fruits': 15,
      'Spices': 5
    },
    digestibilityScore: 75
  }
];

export const mockDietPlans: DietPlan[] = [
  {
    id: '1',
    userId: '1',
    doctorId: '1',
    name: 'Vata Balance Diet Plan',
    description: 'A comprehensive 30-day diet plan to balance Vata dosha and improve digestion',
    duration: 30,
    status: 'active',
    meals: [
      {
        id: '1',
        name: 'Breakfast',
        time: '08:00',
        foods: [
          { foodId: '1', quantity: 100, instructions: 'Cook with ghee and mild spices' },
          { foodId: '3', quantity: 10, instructions: 'Add a teaspoon over rice' }
        ],
        rasaBalance: {
          'Madhura': 70,
          'Amla': 5,
          'Lavana': 5,
          'Katu': 15,
          'Tikta': 3,
          'Kashaya': 2
        }
      }
    ],
    restrictions: ['No cold drinks', 'No raw vegetables', 'No processed foods'],
    goals: ['Balance Vata', 'Improve digestion', 'Increase energy'],
    createdAt: '2024-03-01T10:00:00Z',
    approvedAt: '2024-03-02T10:00:00Z'
  }
];

export const mockAdminStats: AdminStats = {
  totalUsers: 1250,
  totalDoctors: 85,
  totalFoodScans: 15680,
  totalDietPlans: 420,
  activeSubscriptions: 980,
  revenueMetrics: {
    thisMonth: 450000,
    lastMonth: 420000,
    growth: 7.14
  }
};

// Sessions Mock Data
export const mockSessions: Session[] = [
  {
    id: '1',
    userId: '1',
    doctorId: '1',
    type: 'consultation',
    status: 'scheduled',
    scheduledAt: '2024-03-28T10:00:00Z',
    date: '2024-03-28',
    duration: 60,
    fee: 800,
    createdAt: '2024-03-25T08:00:00Z'
  },
  {
    id: '2',
    userId: '1',
    doctorId: '1',
    type: 'follow-up',
    status: 'completed',
    scheduledAt: '2024-03-20T14:00:00Z',
    date: '2024-03-20',
    duration: 30,
    fee: 400,
    notes: 'Diet plan adjustment discussed',
    createdAt: '2024-03-18T10:00:00Z'
  },
  {
    id: '3',
    userId: '2',
    doctorId: '1',
    type: 'consultation',
    status: 'scheduled',
    scheduledAt: '2024-03-29T11:00:00Z',
    date: '2024-03-29',
    duration: 60,
    fee: 800,
    createdAt: '2024-03-26T09:00:00Z'
  }
];

// Chat Messages Mock Data
export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: '1', // Dr. Rajesh
    receiverId: '1', // Arjun Kumar
    message: 'Hello Arjun! How are you feeling after starting the new diet plan?',
    type: 'text',
    timestamp: '2024-03-26T09:00:00Z',
    read: true
  },
  {
    id: '2',
    senderId: '1', // Arjun Kumar
    receiverId: '1', // Dr. Rajesh
    message: 'Good morning Doctor! I\'m feeling much better. My digestion has improved significantly.',
    type: 'text',
    timestamp: '2024-03-26T09:15:00Z',
    read: true
  },
  {
    id: '3',
    senderId: '1', // Dr. Rajesh
    receiverId: '1', // Arjun Kumar
    message: 'That\'s wonderful to hear! Please continue with the prescribed diet and let me know if you have any concerns.',
    type: 'text',
    timestamp: '2024-03-26T09:20:00Z',
    read: true
  },
  {
    id: '4',
    senderId: '1', // Arjun Kumar
    receiverId: '1', // Dr. Rajesh
    message: 'Doctor, can I add some fruits to my evening snack?',
    type: 'text',
    timestamp: '2024-03-26T15:30:00Z',
    read: false
  }
];

// Appointments Mock Data
export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    date: '2024-03-28',
    time: '10:00',
    duration: 60,
    type: 'consultation',
    status: 'scheduled',
    fee: 800,
    createdAt: '2024-03-25T08:00:00Z'
  },
  {
    id: '2',
    patientId: '1',
    doctorId: '1',
    date: '2024-03-20',
    time: '14:00',
    duration: 30,
    type: 'follow-up',
    status: 'completed',
    notes: 'Diet plan adjustment discussed',
    fee: 400,
    createdAt: '2024-03-18T10:00:00Z'
  },
  {
    id: '3',
    patientId: '2',
    doctorId: '1',
    date: '2024-03-29',
    time: '11:00',
    duration: 60,
    type: 'consultation',
    status: 'confirmed',
    fee: 800,
    createdAt: '2024-03-26T09:00:00Z'
  },
  {
    id: '4',
    patientId: '1',
    doctorId: '1',
    date: '2024-04-05',
    time: '15:00',
    duration: 30,
    type: 'follow-up',
    status: 'scheduled',
    fee: 400,
    createdAt: '2024-03-26T12:00:00Z'
  }
];

// Helper functions for generating chart data
export const generateWeeklyData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => ({
    day,
    calories: Math.floor(Math.random() * 500) + 1500,
    vata: Math.floor(Math.random() * 40) + 20,
    pitta: Math.floor(Math.random() * 40) + 20,
    kapha: Math.floor(Math.random() * 40) + 20
  }));
};

export const generateMonthlyData = () => {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  return weeks.map(week => ({
    week,
    calories: Math.floor(Math.random() * 3000) + 10000,
    avgDigestion: Math.floor(Math.random() * 30) + 70,
    rasaBalance: Math.floor(Math.random() * 20) + 75
  }));
};