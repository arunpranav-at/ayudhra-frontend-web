import { apiClient, ApiError } from './client';
import { API_ENDPOINTS } from './config';
import type { Doctor } from '@/types';
import { mockDoctors } from '@/lib/data';

export interface DoctorResponse {
  success: boolean;
  data: Doctor;
  message?: string;
}

export interface DoctorsListResponse {
  success: boolean;
  data: Doctor[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

class DoctorsService {
  // Get all doctors
  async getDoctors(): Promise<Doctor[]> {
    try {
      const response = await apiClient.get<DoctorsListResponse>(API_ENDPOINTS.doctors.list);
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch doctors', error);
      // Fallback to mock data
      console.warn('Doctors API unavailable, using fallback data');
      return mockDoctors;
    }
  }

  // Get doctor by ID
  async getDoctorById(doctorId: string): Promise<Doctor | null> {
    try {
      const response = await apiClient.get<DoctorResponse>(API_ENDPOINTS.doctors.byId(doctorId));
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch doctor details', error);
      // Fallback to mock data
      console.warn('Doctor details API unavailable, using fallback data');
      return mockDoctors.find(d => d.id === doctorId) || null;
    }
  }

  // Get current doctor profile
  async getDoctorProfile(): Promise<Doctor | null> {
    try {
      const response = await apiClient.get<DoctorResponse>(API_ENDPOINTS.doctors.profile);
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch doctor profile', error);
      // Fallback to mock data (first doctor as current doctor)
      console.warn('Doctor profile API unavailable, using fallback data');
      return mockDoctors[0] || null;
    }
  }

  // Update doctor profile
  async updateDoctorProfile(profileData: Partial<Doctor>): Promise<Doctor> {
    try {
      const response = await apiClient.put<DoctorResponse>(API_ENDPOINTS.doctors.profile, profileData);
      return response.data;
    } catch (error) {
      this.handleError('Failed to update doctor profile', error);
      // Return mock updated data
      return { ...mockDoctors[0], ...profileData };
    }
  }

  // Search doctors by specialization, location, etc.
  async searchDoctors(filters: {
    specialization?: string;
    location?: string;
    rating?: number;
    availability?: string;
  }): Promise<Doctor[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters.specialization) queryParams.set('specialization', filters.specialization);
      if (filters.location) queryParams.set('location', filters.location);
      if (filters.rating) queryParams.set('rating', filters.rating.toString());
      if (filters.availability) queryParams.set('availability', filters.availability);
      
      const url = `${API_ENDPOINTS.doctors.list}?${queryParams.toString()}`;
      const response = await apiClient.get<DoctorsListResponse>(url);
      return response.data;
    } catch (error) {
      this.handleError('Failed to search doctors', error);
      // Fallback to filtered mock data
      console.warn('Doctor search API unavailable, using fallback data');
      let filteredDoctors = mockDoctors;
      
      if (filters.specialization) {
        filteredDoctors = filteredDoctors.filter(d => 
          d.specialization.toLowerCase().includes(filters.specialization!.toLowerCase())
        );
      }
      if (filters.location) {
        filteredDoctors = filteredDoctors.filter(d => 
          d.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      if (filters.rating) {
        filteredDoctors = filteredDoctors.filter(d => d.rating >= filters.rating!);
      }
      
      return filteredDoctors;
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

export const doctorsService = new DoctorsService();