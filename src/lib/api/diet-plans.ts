import { apiClient, ApiError } from './client';
import { API_ENDPOINTS } from './config';
import type { DietPlan, Meal } from '@/types';
import { mockDietPlans } from '@/lib/data';

export interface DietPlanResponse {
  success: boolean;
  data: DietPlan;
  message?: string;
}

export interface DietPlansListResponse {
  success: boolean;
  data: DietPlan[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface CreateDietPlanRequest {
  userId: string;
  name: string;
  description: string;
  duration: number;
  meals: Meal[];
  restrictions: string[];
  goals: string[];
}

class DietPlansService {
  // Get all diet plans
  async getDietPlans(): Promise<DietPlan[]> {
    try {
      const response = await apiClient.get<DietPlansListResponse>(API_ENDPOINTS.dietPlans.list);
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch diet plans', error);
      // Fallback to mock data
      console.warn('Diet plans API unavailable, using fallback data');
      return mockDietPlans;
    }
  }

  // Get diet plan by ID
  async getDietPlanById(planId: string): Promise<DietPlan | null> {
    try {
      const response = await apiClient.get<DietPlanResponse>(API_ENDPOINTS.dietPlans.byId(planId));
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch diet plan', error);
      // Fallback to mock data
      console.warn('Diet plan details API unavailable, using fallback data');
      return mockDietPlans.find(p => p.id === planId) || null;
    }
  }

  // Get diet plans for a patient
  async getDietPlansByPatient(patientId: string): Promise<DietPlan[]> {
    try {
      const response = await apiClient.get<DietPlansListResponse>(API_ENDPOINTS.dietPlans.byPatient(patientId));
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch patient diet plans', error);
      // Fallback to mock data
      console.warn('Patient diet plans API unavailable, using fallback data');
      return mockDietPlans.filter(p => p.userId === patientId);
    }
  }

  // Create new diet plan
  async createDietPlan(planData: CreateDietPlanRequest): Promise<DietPlan> {
    try {
      const response = await apiClient.post<DietPlanResponse>(API_ENDPOINTS.dietPlans.create, planData);
      return response.data;
    } catch (error) {
      this.handleError('Failed to create diet plan', error);
      // Return mock created plan
      const mockPlan: DietPlan = {
        id: `plan_${Date.now()}`,
        userId: planData.userId,
        doctorId: 'doc_1', // Mock current doctor
        name: planData.name,
        description: planData.description,
        duration: planData.duration,
        status: 'pending',
        meals: planData.meals,
        restrictions: planData.restrictions,
        goals: planData.goals,
        createdAt: new Date().toISOString(),
      };
      console.warn('Create diet plan API unavailable, returning mock data');
      return mockPlan;
    }
  }

  // Update diet plan
  async updateDietPlan(planId: string, planData: Partial<DietPlan>): Promise<DietPlan> {
    try {
      const response = await apiClient.put<DietPlanResponse>(API_ENDPOINTS.dietPlans.update(planId), planData);
      return response.data;
    } catch (error) {
      this.handleError('Failed to update diet plan', error);
      // Return mock updated plan
      const existingPlan = mockDietPlans.find(p => p.id === planId);
      const updatedPlan = { ...existingPlan, ...planData } as DietPlan;
      console.warn('Update diet plan API unavailable, returning mock data');
      return updatedPlan;
    }
  }

  // Delete diet plan
  async deleteDietPlan(planId: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.dietPlans.delete(planId));
    } catch (error) {
      this.handleError('Failed to delete diet plan', error);
      console.warn('Delete diet plan API unavailable, action not performed');
    }
  }

  // Approve diet plan (for doctors)
  async approveDietPlan(planId: string): Promise<DietPlan> {
    try {
      const response = await apiClient.put<DietPlanResponse>(
        API_ENDPOINTS.dietPlans.update(planId),
        { status: 'approved', approvedAt: new Date().toISOString() }
      );
      return response.data;
    } catch (error) {
      this.handleError('Failed to approve diet plan', error);
      // Return mock approved plan
      const existingPlan = mockDietPlans.find(p => p.id === planId);
      const approvedPlan = {
        ...existingPlan,
        status: 'approved' as const,
        approvedAt: new Date().toISOString(),
      } as DietPlan;
      console.warn('Approve diet plan API unavailable, returning mock data');
      return approvedPlan;
    }
  }

  // Get active diet plan for current user
  async getActiveDietPlan(): Promise<DietPlan | null> {
    try {
      // This would typically get the current user's ID from auth context
      const response = await apiClient.get<DietPlanResponse>(`${API_ENDPOINTS.dietPlans.list}?status=active&limit=1`);
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch active diet plan', error);
      // Fallback to mock data
      console.warn('Active diet plan API unavailable, using fallback data');
      return mockDietPlans.find(p => p.status === 'active') || null;
    }
  }

  // Generate AI-powered diet plan suggestions
  async generateDietPlanSuggestions(data: {
    userId: string;
    preferences: string[];
    restrictions: string[];
    goals: string[];
    prakriti: string;
    vikriti: string;
  }): Promise<{
    suggestions: Partial<DietPlan>[];
    reasoning: string;
  }> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: {
          suggestions: Partial<DietPlan>[];
          reasoning: string;
        };
      }>('/api/ai/diet-plan-suggestions', data);
      return response.data;
    } catch (error) {
      this.handleError('Failed to generate diet plan suggestions', error);
      // Return mock AI suggestions
      console.warn('Diet plan AI suggestions API unavailable, using fallback data');
      return {
        suggestions: [
          {
            name: 'Pitta-Pacifying Plan',
            description: 'Cooling foods to balance excess heat',
            duration: 21,
            goals: ['Balance Dosha', 'Improve Digestion'],
            restrictions: ['Spicy Foods', 'Citrus'],
          },
          {
            name: 'Detox & Cleanse',
            description: 'Gentle cleansing with supportive foods',
            duration: 14,
            goals: ['Detoxification', 'Energy Boost'],
            restrictions: ['Processed Foods', 'Heavy Foods'],
          },
        ],
        reasoning: 'Based on your Pitta constitution and current imbalance, these plans focus on cooling, easy-to-digest foods that will help restore balance.',
      };
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

export const dietPlansService = new DietPlansService();