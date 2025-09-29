// API Configuration
export const API_CONFIG = {
  // Main API Gateway
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  // Individual Services
  authURL: process.env.NEXT_PUBLIC_AUTH_BASE_URL || 'http://localhost:3002',
  analyticsURL: process.env.NEXT_PUBLIC_ANALYTICS_BASE_URL || 'http://localhost:3003',
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    patient: {
      signup: '/auth/patient/signup',
      login: '/auth/patient/login',
    },
    doctor: {
      signup: '/auth/doctor/signup',
      login: '/auth/doctor/login',
    },
    admin: {
      login: '/auth/admin/login',
    },
  },
  // Analytics
  analytics: {
    foodAnalysis: '/analytics/user/food/food-analysis',
    nutritionData: '/analytics/user/nutrition',
    doshaAnalysis: '/analytics/user/dosha',
    healthMetrics: '/analytics/user/health-metrics',
    weeklyData: '/analytics/user/weekly',
    monthlyData: '/analytics/user/monthly',
  },
  // Patients
  patients: {
    list: '/api/patients',
    byId: (id: string) => `/api/patients/${id}`,
    profile: '/api/patients/profile',
    healthData: (id: string) => `/api/patients/${id}/health`,
  },
  // Doctors
  doctors: {
    list: '/api/doctors',
    byId: (id: string) => `/api/doctors/${id}`,
    profile: '/api/doctors/profile',
    patients: '/api/doctors/patients',
  },
  // Diet Plans
  dietPlans: {
    list: '/api/diet-plans',
    byId: (id: string) => `/api/diet-plans/${id}`,
    create: '/api/diet-plans',
    update: (id: string) => `/api/diet-plans/${id}`,
    delete: (id: string) => `/api/diet-plans/${id}`,
    byPatient: (patientId: string) => `/api/diet-plans/patient/${patientId}`,
  },
  // Sessions
  sessions: {
    list: '/api/sessions',
    byId: (id: string) => `/api/sessions/${id}`,
    create: '/api/sessions',
    update: (id: string) => `/api/sessions/${id}`,
    cancel: (id: string) => `/api/sessions/${id}/cancel`,
    byPatient: '/api/sessions/patient',
    byDoctor: '/api/sessions/doctor',
  },
  // Chat
  chat: {
    messages: '/api/chat/messages',
    send: '/api/chat/send',
    conversations: '/api/chat/conversations',
    conversation: (id: string) => `/api/chat/conversations/${id}`,
  },
  // Admin
  admin: {
    users: {
      list: '/api/admin/users',
      byId: (id: string) => `/api/admin/users/${id}`,
      approve: (id: string) => `/api/admin/users/${id}/approve`,
      suspend: (id: string) => `/api/admin/users/${id}/suspend`,
    },
    doctors: {
      list: '/api/admin/doctors',
      byId: (id: string) => `/api/admin/doctors/${id}`,
      approve: (id: string) => `/api/admin/doctors/${id}/approve`,
      suspend: (id: string) => `/api/admin/doctors/${id}/suspend`,
    },
    dashboard: '/api/admin/dashboard',
  },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;