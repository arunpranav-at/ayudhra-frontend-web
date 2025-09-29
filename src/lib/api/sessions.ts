import { apiClient, ApiError } from './client';
import { API_ENDPOINTS } from './config';
import type { Session, Appointment } from '@/types';
import { mockSessions } from '@/lib/data';

export interface SessionResponse {
  success: boolean;
  data: Session;
  message?: string;
}

export interface SessionsListResponse {
  success: boolean;
  data: Session[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface CreateSessionRequest {
  doctorId: string;
  type: 'consultation' | 'follow-up' | 'emergency';
  scheduledAt: string;
  duration: number;
  notes?: string;
}

export interface UpdateSessionRequest {
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  notes?: string;
  rescheduleDate?: string;
}

class SessionsService {
  // Get all sessions
  async getSessions(): Promise<Session[]> {
    try {
      const response = await apiClient.get<SessionsListResponse>(API_ENDPOINTS.sessions.list);
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch sessions', error);
      // Fallback to mock data
      console.warn('Sessions API unavailable, using fallback data');
      return mockSessions;
    }
  }

  // Get session by ID
  async getSessionById(sessionId: string): Promise<Session | null> {
    try {
      const response = await apiClient.get<SessionResponse>(API_ENDPOINTS.sessions.byId(sessionId));
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch session details', error);
      // Fallback to mock data
      console.warn('Session details API unavailable, using fallback data');
      return mockSessions.find(s => s.id === sessionId) || null;
    }
  }

  // Get sessions for current patient
  async getPatientSessions(): Promise<Session[]> {
    try {
      const response = await apiClient.get<SessionsListResponse>(API_ENDPOINTS.sessions.byPatient);
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch patient sessions', error);
      // Fallback to mock data (first user's sessions)
      console.warn('Patient sessions API unavailable, using fallback data');
      return mockSessions.filter(s => s.userId === 'user_1');
    }
  }

  // Get sessions for current doctor
  async getDoctorSessions(): Promise<Session[]> {
    try {
      const response = await apiClient.get<SessionsListResponse>(API_ENDPOINTS.sessions.byDoctor);
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch doctor sessions', error);
      // Fallback to mock data (first doctor's sessions)
      console.warn('Doctor sessions API unavailable, using fallback data');
      return mockSessions.filter(s => s.doctorId === 'doc_1');
    }
  }

  // Book a new session
  async bookSession(sessionData: CreateSessionRequest): Promise<Session> {
    try {
      const response = await apiClient.post<SessionResponse>(API_ENDPOINTS.sessions.create, sessionData);
      return response.data;
    } catch (error) {
      this.handleError('Failed to book session', error);
      // Return mock created session
      const mockSession: Session = {
        id: `session_${Date.now()}`,
        userId: 'user_1', // Mock current user
        doctorId: sessionData.doctorId,
        type: sessionData.type,
        status: 'scheduled',
        scheduledAt: sessionData.scheduledAt,
        date: sessionData.scheduledAt.split('T')[0],
        duration: sessionData.duration,
        fee: 500, // Mock fee
        notes: sessionData.notes,
        createdAt: new Date().toISOString(),
      };
      console.warn('Book session API unavailable, returning mock data');
      return mockSession;
    }
  }

  // Update session
  async updateSession(sessionId: string, updates: UpdateSessionRequest): Promise<Session> {
    try {
      const response = await apiClient.put<SessionResponse>(API_ENDPOINTS.sessions.update(sessionId), updates);
      return response.data;
    } catch (error) {
      this.handleError('Failed to update session', error);
      // Return mock updated session
      const existingSession = mockSessions.find(s => s.id === sessionId);
      const updatedSession = { ...existingSession, ...updates } as Session;
      console.warn('Update session API unavailable, returning mock data');
      return updatedSession;
    }
  }

  // Cancel session
  async cancelSession(sessionId: string, reason?: string): Promise<Session> {
    try {
      const response = await apiClient.put<SessionResponse>(
        API_ENDPOINTS.sessions.cancel(sessionId),
        { reason }
      );
      return response.data;
    } catch (error) {
      this.handleError('Failed to cancel session', error);
      // Return mock cancelled session
      const existingSession = mockSessions.find(s => s.id === sessionId);
      const cancelledSession = {
        ...existingSession,
        status: 'cancelled' as const,
        notes: reason ? `Cancelled: ${reason}` : 'Cancelled',
      } as Session;
      console.warn('Cancel session API unavailable, returning mock data');
      return cancelledSession;
    }
  }

  // Get upcoming sessions
  async getUpcomingSessions(): Promise<Session[]> {
    try {
      const now = new Date().toISOString();
      const response = await apiClient.get<SessionsListResponse>(
        `${API_ENDPOINTS.sessions.list}?status=scheduled&from=${now}&sort=scheduledAt`
      );
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch upcoming sessions', error);
      // Fallback to mock data
      console.warn('Upcoming sessions API unavailable, using fallback data');
      const now = new Date();
      return mockSessions.filter(s => 
        s.status === 'scheduled' && new Date(s.scheduledAt) > now
      );
    }
  }

  // Get session history
  async getSessionHistory(): Promise<Session[]> {
    try {
      const response = await apiClient.get<SessionsListResponse>(
        `${API_ENDPOINTS.sessions.list}?status=completed&sort=-scheduledAt`
      );
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch session history', error);
      // Fallback to mock data
      console.warn('Session history API unavailable, using fallback data');
      return mockSessions.filter(s => s.status === 'completed');
    }
  }

  // Get available time slots for a doctor
  async getAvailableSlots(doctorId: string, date: string): Promise<Array<{
    time: string;
    available: boolean;
    duration: number;
  }>> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: Array<{
          time: string;
          available: boolean;
          duration: number;
        }>;
      }>(`/api/doctors/${doctorId}/availability?date=${date}`);
      return response.data;
    } catch (error) {
      this.handleError('Failed to fetch available slots', error);
      // Return mock available slots
      console.warn('Available slots API unavailable, using fallback data');
      const slots = [];
      for (let hour = 9; hour <= 17; hour++) {
        slots.push({
          time: `${hour.toString().padStart(2, '0')}:00`,
          available: Math.random() > 0.3, // 70% available
          duration: 60,
        });
      }
      return slots;
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

export const sessionsService = new SessionsService();