import { apiClient, ApiError } from './client';
import { API_ENDPOINTS } from './config';
import type { User, Doctor, AdminStats } from '@/types';
import { mockUsers, mockDoctors } from '@/lib/data';

export interface AdminUserResponse {
  success: boolean;
  data: User;
  message?: string;
}

export interface AdminUsersListResponse {
  success: boolean;
  data: User[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface AdminDoctorResponse {
  success: boolean;
  data: Doctor;
  message?: string;
}

export interface AdminDoctorsListResponse {
  success: boolean;
  data: Doctor[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface AdminDashboardResponse {
  success: boolean;
  data: AdminStats;
}

class AdminService {
  // User Management
  async getUsers(page = 1, limit = 20, status?: 'active' | 'suspended' | 'pending'): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (status) params.set('status', status);
      
      const response = await apiClient.get<AdminUsersListResponse>(
        `${API_ENDPOINTS.admin.users.list}?${params.toString()}`
      );
      return {
        users: response.data,
        total: response.pagination?.total || response.data.length,
        page: response.pagination?.page || page,
        limit: response.pagination?.limit || limit,
      };
    } catch (error) {
      this.handleError('Failed to fetch users', error);
      // Fallback to mock data
      console.warn('Admin users API unavailable, using fallback data');
      return {
        users: mockUsers,
        total: mockUsers.length,
        page,
        limit,
      };
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const response = await apiClient.get<AdminUserResponse>(API_ENDPOINTS.admin.users.byId(userId));
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch user details', error);
      // Fallback to mock data
      console.warn('Admin user details API unavailable, using fallback data');
      return mockUsers.find(u => u.id === userId) || null;
    }
  }

  async approveUser(userId: string): Promise<User> {
    try {
      const response = await apiClient.put<AdminUserResponse>(API_ENDPOINTS.admin.users.approve(userId));
      return response.data;
    } catch (error) {
      this.handleError('Failed to approve user', error);
      // Return mock approved user
      const user = mockUsers.find(u => u.id === userId);
      console.warn('Approve user API unavailable, returning mock data');
      return user!;
    }
  }

  async suspendUser(userId: string, reason: string): Promise<User> {
    try {
      const response = await apiClient.put<AdminUserResponse>(
        API_ENDPOINTS.admin.users.suspend(userId),
        { reason }
      );
      return response.data;
    } catch (error) {
      this.handleError('Failed to suspend user', error);
      // Return mock suspended user
      const user = mockUsers.find(u => u.id === userId);
      console.warn('Suspend user API unavailable, returning mock data');
      return user!;
    }
  }

  // Doctor Management
  async getDoctors(page = 1, limit = 20, status?: 'active' | 'suspended' | 'pending'): Promise<{
    doctors: Doctor[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (status) params.set('status', status);
      
      const response = await apiClient.get<AdminDoctorsListResponse>(
        `${API_ENDPOINTS.admin.doctors.list}?${params.toString()}`
      );
      return {
        doctors: response.data,
        total: response.pagination?.total || response.data.length,
        page: response.pagination?.page || page,
        limit: response.pagination?.limit || limit,
      };
    } catch (error) {
      this.handleError('Failed to fetch doctors', error);
      // Fallback to mock data
      console.warn('Admin doctors API unavailable, using fallback data');
      return {
        doctors: mockDoctors,
        total: mockDoctors.length,
        page,
        limit,
      };
    }
  }

  async getDoctorById(doctorId: string): Promise<Doctor | null> {
    try {
      const response = await apiClient.get<AdminDoctorResponse>(API_ENDPOINTS.admin.doctors.byId(doctorId));
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch doctor details', error);
      // Fallback to mock data
      console.warn('Admin doctor details API unavailable, using fallback data');
      return mockDoctors.find(d => d.id === doctorId) || null;
    }
  }

  async approveDoctor(doctorId: string): Promise<Doctor> {
    try {
      const response = await apiClient.put<AdminDoctorResponse>(API_ENDPOINTS.admin.doctors.approve(doctorId));
      return response.data;
    } catch (error) {
      this.handleError('Failed to approve doctor', error);
      // Return mock approved doctor
      const doctor = mockDoctors.find(d => d.id === doctorId);
      console.warn('Approve doctor API unavailable, returning mock data');
      return doctor!;
    }
  }

  async suspendDoctor(doctorId: string, reason: string): Promise<Doctor> {
    try {
      const response = await apiClient.put<AdminDoctorResponse>(
        API_ENDPOINTS.admin.doctors.suspend(doctorId),
        { reason }
      );
      return response.data;
    } catch (error) {
      this.handleError('Failed to suspend doctor', error);
      // Return mock suspended doctor
      const doctor = mockDoctors.find(d => d.id === doctorId);
      console.warn('Suspend doctor API unavailable, returning mock data');
      return doctor!;
    }
  }

  // Dashboard & Analytics
  async getDashboardStats(): Promise<AdminStats> {
    try {
      const response = await apiClient.get<AdminDashboardResponse>(API_ENDPOINTS.admin.dashboard);
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch dashboard stats', error);
      // Return mock stats
      console.warn('Admin dashboard API unavailable, using fallback data');
      return {
        totalUsers: mockUsers.length,
        totalDoctors: mockDoctors.length,
        totalFoodScans: 1250,
        totalDietPlans: 89,
        activeSubscriptions: 156,
        revenueMetrics: {
          thisMonth: 125000,
          lastMonth: 118000,
          growth: 5.9,
        },
      };
    }
  }

  // Search functionality
  async searchUsers(query: string): Promise<User[]> {
    try {
      const response = await apiClient.get<AdminUsersListResponse>(
        `${API_ENDPOINTS.admin.users.list}?search=${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error) {
      this.handleError('Failed to search users', error);
      // Fallback search in mock data
      console.warn('User search API unavailable, using fallback data');
      return mockUsers.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  async searchDoctors(query: string): Promise<Doctor[]> {
    try {
      const response = await apiClient.get<AdminDoctorsListResponse>(
        `${API_ENDPOINTS.admin.doctors.list}?search=${encodeURIComponent(query)}`
      );
      return response.data;
    } catch (error) {
      this.handleError('Failed to search doctors', error);
      // Fallback search in mock data
      console.warn('Doctor search API unavailable, using fallback data');
      return mockDoctors.filter(doctor => 
        doctor.name.toLowerCase().includes(query.toLowerCase()) ||
        doctor.email.toLowerCase().includes(query.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(query.toLowerCase())
      );
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

export const adminService = new AdminService();