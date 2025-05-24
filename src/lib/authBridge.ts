import { Session } from '@supabase/supabase-js';

// Default to localhost:3000 if no backend URL is provided
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://manim-ai-backend-943004966625.asia-south1.run.app';

/**
 * Converts a Supabase session to a JWT token for the backend
 */
export async function getBackendToken(session: Session | null): Promise<string | null> {
  if (!session) {
    console.warn('No session provided to getBackendToken');
    return null;
  }
  
  // Check if we already have a valid token in localStorage
  const existingToken = localStorage.getItem('backend_token');
  if (existingToken) {
    console.log('Using existing backend token from localStorage');
    // We could add JWT expiration validation here if needed
    return existingToken;
  }
  
  try {
    console.log('Getting new backend token for user:', session.user?.email);
    console.log('Using backend URL:', backendUrl);
    
    // Call the backend endpoint to verify the OAuth user and get a JWT token
    // Include more user information to ensure proper identification
    const response = await fetch(`${backendUrl}/api/auth/verify-oauth-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: session.user?.email,
        supabaseId: session.user?.id,
        provider: session.user?.app_metadata?.provider || 'google',
        providerUserId: session.user?.identities?.[0]?.identity_data?.sub || session.user?.id,
        name: session.user?.user_metadata?.full_name || session.user?.user_metadata?.name,
        avatar: session.user?.user_metadata?.avatar_url,
        accessToken: session.access_token,
        sessionId: session.user?.id + '_' + Date.now(), // Add unique session identifier
      }),
    });
    
    console.log('Backend response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
      console.error('Backend token error response:', errorData);
      throw new Error(errorData.message || `Failed to get backend token: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Received backend response:', data);
    
    if (!data.token) {
      console.error('No token in backend response');
      throw new Error('Backend did not return a token');
    }
    
    // Ensure tokens are properly set for new users
    if (data.user && typeof data.user.tokens === 'undefined') {
      data.user.tokens = 5; // Default to 5 tokens for new users
      console.log('Setting default 5 tokens for new user');
    }
    
    // Store the backend token in localStorage with user ID to avoid conflicts
    const userId = session.user?.id || 'unknown';
    
    // Clear any previous tokens to avoid conflicts
    localStorage.removeItem('backend_token');
    localStorage.removeItem('user');
    
    // Store with user-specific keys
    localStorage.setItem('backend_token', data.token);
    localStorage.setItem('current_user_id', userId);
    localStorage.setItem('user', JSON.stringify({
      ...data.user,
      id: userId,
      email: session.user?.email,
      provider: session.user?.app_metadata?.provider || 'google',
    }));
    
    console.log('Successfully stored backend token and user data for user:', session.user?.email);
    return data.token;
  } catch (error) {
    console.error('Error getting backend token:', error);
    return null;
  }
}

/**
 * Gets the stored backend JWT token
 */
export function getStoredBackendToken(): string | null {
  return localStorage.getItem('backend_token');
}

/**
 * Gets the stored user data
 */
export function getStoredUser(): any {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
}

/**
 * Clears all stored auth data
 */
export function clearAuthData(): void {
  localStorage.removeItem('backend_token');
  localStorage.removeItem('user');
}
