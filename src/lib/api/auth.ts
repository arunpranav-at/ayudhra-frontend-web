import { authClient, ApiError } from './client';
import { API_ENDPOINTS } from './config';

// Authentication Request/Response Types
export interface PatientSignupRequest {
  fullName: string;
  email: string;
  phone: string;
  abhaId?: string;
  dob: string;
  gender: 'Male' | 'Female';
  height?: number;
  weight?: number;
  knownAllergies?: string[];
  medicalHistory?: string[];
  password: string;
}

export interface DoctorSignupRequest {
  fullName: string;
  email: string;
  phone: string;
  hprId: string;
  qualifications: string[];
  specialization: string;
  experience: number;
  consultationFees: number;
  clinicAddress: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: 'success';
  token: string;
}

export interface SignupResponse {
  status: 'success';
  data: {
    patient?: {
      _id: string;
      fullName: string;
      email: string;
      phone: string;
      abhaId?: string;
      dob: string;
      gender: 'Male' | 'Female';
      height?: number;
      weight?: number;
      knownAllergies?: string[];
      medicalHistory?: string[];
    };
    doctor?: {
      _id: string;
      fullName: string;
      email: string;
      phone: string;
      hprId: string;
      qualifications: string[];
      specialization: string;
      experience: number;
      consultationFees: number;
      clinicAddress: string;
    };
  };
}

export interface ErrorResponse {
  status: 'fail' | 'error';
  message: string;
}

// Authentication Service
class AuthService {
  // Patient Authentication
  async signupPatient(data: PatientSignupRequest): Promise<SignupResponse> {
    try {
      return await authClient.post<SignupResponse>(
        API_ENDPOINTS.auth.patient.signup,
        data
      );
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async loginPatient(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await authClient.post<AuthResponse>(
        API_ENDPOINTS.auth.patient.login,
        data
      );
      this.storeToken(response.token);
      return response;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Doctor Authentication
  async signupDoctor(data: DoctorSignupRequest): Promise<SignupResponse> {
    try {
      return await authClient.post<SignupResponse>(
        API_ENDPOINTS.auth.doctor.signup,
        data
      );
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  async loginDoctor(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await authClient.post<AuthResponse>(
        API_ENDPOINTS.auth.doctor.login,
        data
      );
      this.storeToken(response.token);
      return response;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Admin Authentication
  async loginAdmin(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await authClient.post<AuthResponse>(
        API_ENDPOINTS.auth.admin.login,
        data
      );
      this.storeToken(response.token);
      return response;
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Token Management
  private storeToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_type');
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // User Type Management
  setUserType(userType: 'user' | 'doctor' | 'admin'): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_type', userType);
    }
  }

  getUserType(): 'user' | 'doctor' | 'admin' | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('user_type') as 'user' | 'doctor' | 'admin' | null;
    }
    return null;
  }

  logout(): void {
    this.removeToken();
  }

  // Error handling
  private handleAuthError(error: any): Error {
    if (error instanceof ApiError) {
      try {
        const errorData = JSON.parse(error.response || '{}') as ErrorResponse;
        return new Error(errorData.message || 'Authentication failed');
      } catch {
        return new Error(error.message || 'Authentication failed');
      }
    }
    return error instanceof Error ? error : new Error('Authentication failed');
  }
}

export const authService = new AuthService();