import { analyticsClient, ApiError } from './client';
import { API_ENDPOINTS } from './config';

// Food Analysis Types
export interface FoodAnalysisRequest {
  imageBase64: string;
}

export interface ModernNutrition {
  calories: number;
  protein: string;
  carbs: string;
  fats: string;
  vitamins: string[];
  minerals: string[];
}

export interface DoshaEffect {
  vata: string;
  pitta: string;
  kapha: string;
}

export interface AyurvedicNutrition {
  rasa: string;
  guna: string;
  virya: string;
  vipaka: string;
  doshaEffect: DoshaEffect;
}

export interface FoodAnalysisResponse {
  food_detected: string;
  modern_nutrition: ModernNutrition;
  ayurvedic_nutrition: AyurvedicNutrition;
}

export interface FoodAnalysisError {
  error: string;
}

// Utility function to convert File to Base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Food Analysis Service
class FoodAnalysisService {
  async analyzeFood(imageBase64: string): Promise<FoodAnalysisResponse> {
    try {
      return await analyticsClient.post<FoodAnalysisResponse>(
        API_ENDPOINTS.analytics.foodAnalysis,
        { imageBase64 }
      );
    } catch (error) {
      throw this.handleAnalysisError(error);
    }
  }

  async analyzeFoodFromFile(file: File): Promise<FoodAnalysisResponse> {
    try {
      const base64 = await fileToBase64(file);
      return await this.analyzeFood(base64);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to process image: ${error.message}`);
      }
      throw new Error('Failed to process image');
    }
  }

  // Error handling
  private handleAnalysisError(error: any): Error {
    if (error instanceof ApiError) {
      try {
        const errorData = JSON.parse(error.response || '{}') as FoodAnalysisError;
        return new Error(errorData.error || 'Food analysis failed');
      } catch {
        if (error.status === 400) {
          return new Error('Invalid image format. Please upload a valid image.');
        } else if (error.status === 500) {
          return new Error('Food analysis service is currently unavailable. Please try again later.');
        }
        return new Error(error.message || 'Food analysis failed');
      }
    }
    return error instanceof Error ? error : new Error('Food analysis failed');
  }
}

export const foodAnalysisService = new FoodAnalysisService();