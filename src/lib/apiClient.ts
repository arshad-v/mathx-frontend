import { Session } from '@supabase/supabase-js';
import { getBackendToken, getStoredBackendToken } from './authBridge';

// Default to localhost:3000 if no backend URL is provided
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://manim-ai-backend-943004966625.asia-south1.run.app';

/**
 * Animation result interface
 */
export interface AnimationResult {
  videoUrl: string;
  codeUrl?: string;
  remainingTokens: number;
  animationId?: string;
  code?: string;
}

/**
 * Animation history item interface
 */
export interface AnimationHistoryItem {
  id: string;
  user_id: string;
  prompt: string;
  video_url: string;
  code_url: string;
  filename: string;
  created_at: string;
}

/**
 * API client for making authenticated requests to the backend
 */
class ApiClient {
  /**
   * Make an authenticated request to the backend API
   */
  async request<T>(
    endpoint: string, 
    options: RequestInit = {}, 
    session: Session | null = null
  ): Promise<T> {
    const url = `${backendUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    console.log(`Making API request to: ${url}`);
    
    // Set up headers with authentication
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    
    // First try to get the backend token from localStorage (faster)
    let backendToken = getStoredBackendToken();
    console.log('Initial token from storage:', backendToken ? 'Found' : 'Not found');
    
    // If no token in localStorage and we have a session, get a new token
    if (!backendToken && session) {
      console.log('No stored token, getting new token from session');
      try {
        // Try to get a backend token using the Supabase session
        backendToken = await getBackendToken(session);
        console.log('New token obtained:', backendToken ? 'Success' : 'Failed');
      } catch (tokenError) {
        console.error('Error getting backend token:', tokenError);
      }
    }
    
    // Set the Authorization header if we have a token
    if (backendToken) {
      console.log('Setting Authorization header with token');
      headers.set('Authorization', `Bearer ${backendToken}`);
    } else {
      console.warn('No authentication token available for request to:', endpoint);
    }
    
    const config: RequestInit = {
      ...options,
      headers,
    };
    
    try {
      console.log(`Sending request to ${url} with config:`, {
        method: config.method || 'GET',
        headers: Object.fromEntries(headers.entries()),
        bodyLength: config.body ? JSON.stringify(config.body).length : 0
      });
      
      const response = await fetch(url, config);
      
      // Handle non-OK responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error(`API error (${response.status}) for ${endpoint}:`, errorData);
        throw new Error(errorData.message || `API error: ${response.status}`);
      }
      
      // Parse JSON response
      const data = await response.json();
      console.log(`API response from ${endpoint}:`, data);
      return data as T;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }
  
  /**
   * Get user tokens
   */
  async getUserTokens(session: Session | null): Promise<{ tokens: number }> {
    return this.request<{ tokens: number }>('/api/user/tokens', {}, session);
  }
  
  /**
   * Generate animation
   */
  async generateAnimation(prompt: string, session: Session | null): Promise<AnimationResult> {
    return this.request<AnimationResult>(
      '/api/generate',
      {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      },
      session
    );
  }

  /**
   * Get user animation history
   */
  async getAnimationHistory(session: Session | null): Promise<{ animations: AnimationHistoryItem[] }> {
    return this.request<{ animations: AnimationHistoryItem[] }>(
      '/api/animations/history',
      {},
      session
    );
  }
  
  /**
   * Check server health
   */
  async checkHealth(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health');
  }
}

export const apiClient = new ApiClient();
