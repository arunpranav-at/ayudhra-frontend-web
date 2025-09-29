import { apiClient, ApiError } from './client';
import { API_ENDPOINTS } from './config';
import type { User, NutritionAnalytics, DietPlan } from '@/types';
import { mockUsers, mockNutritionAnalytics, mockDietPlans } from '@/lib/data';

export interface PatientResponse {
  success: boolean;
  data: User;
  message?: string;
}

export interface PatientsListResponse {
  success: boolean;
  data: User[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface PatientHealthData {
  analytics: NutritionAnalytics[];
  dietPlans: DietPlan[];
  lastUpdate: string;
}

class PatientsService {
  // Get all patients (for doctors/admin)
  async getPatients(): Promise<User[]> {
    try {
      const response = await apiClient.get<PatientsListResponse>(API_ENDPOINTS.patients.list);
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch patients', error);
      // Fallback to mock data
      console.warn('Patients API unavailable, using fallback data');
      return mockUsers;
    }
  }

  // Get patient by ID
  async getPatientById(patientId: string): Promise<User | null> {
    try {
      const response = await apiClient.get<PatientResponse>(API_ENDPOINTS.patients.byId(patientId));
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch patient details', error);
      // Fallback to mock data
      console.warn('Patient details API unavailable, using fallback data');
      return mockUsers.find(u => u.id === patientId) || null;
    }
  }

  // Get current patient profile
  async getPatientProfile(): Promise<User | null> {
    try {
      const response = await apiClient.get<PatientResponse>(API_ENDPOINTS.patients.profile);
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch patient profile', error);
      // Fallback to mock data (first user as current patient)
      console.warn('Patient profile API unavailable, using fallback data');
      return mockUsers[0] || null;
    }
  }

  // Update patient profile
  async updatePatientProfile(profileData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<PatientResponse>(API_ENDPOINTS.patients.profile, profileData);
      return response.data;
    } catch (error) {
      this.handleError('Failed to update patient profile', error);
      // Return mock updated data
      return { ...mockUsers[0], ...profileData };
    }
  }

  // Get patient health data
  async getPatientHealthData(patientId: string): Promise<PatientHealthData> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: PatientHealthData;
      }>(API_ENDPOINTS.patients.healthData(patientId));
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch patient health data', error);
      // Fallback to mock data
      console.warn('Patient health data API unavailable, using fallback data');
      return {
        analytics: mockNutritionAnalytics.filter(n => n.userId === patientId),
        dietPlans: mockDietPlans.filter(d => d.userId === patientId),
        lastUpdate: new Date().toISOString(),
      };
    }
  }

  // Get patients for current doctor
  async getDoctorPatients(): Promise<User[]> {
    try {
      const response = await apiClient.get<PatientsListResponse>(API_ENDPOINTS.doctors.patients);
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch doctor patients', error);
      // Fallback to mock data (filter by first doctor)
      console.warn('Doctor patients API unavailable, using fallback data');
      const mockDoctor = { id: 'doc_1' }; // Mock current doctor
      return mockUsers.filter(u => u.doctorId === mockDoctor.id);
    }
  }

  private handleError(message: string, error: unknown): void {
    if (error instanceof ApiError) {
      throw error;
    }
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new ApiError(message, 500, errorMessage);
  }
}

export const patientsService = new PatientsService();