import { supabase } from './supabase';

/**
 * This function handles the OAuth callback after a user signs in with Google
 * It ensures that the session is properly established and tokens are retrieved
 */
export const handleAuthCallback = async () => {
  try {
    // Get the URL hash and query parameters
    const hash = window.location.hash;
    const query = window.location.search;
    
    // If there's a hash or query parameter, it might be an OAuth callback
    if (hash || query) {
      // Let Supabase handle the OAuth callback
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session after OAuth callback:', error);
        throw error;
      }
      
      if (data?.session) {
        // Session established successfully
        console.log('Session established successfully after OAuth callback');
        return data.session;
      }
    }
    
    // If we get here, there was no callback or session wasn't established
    return null;
  } catch (error) {
    console.error('Error handling auth callback:', error);
    throw error;
  }
};

/**
 * This function refreshes the session token if it's about to expire
 */
export const refreshSessionIfNeeded = async () => {
  try {
    const { data } = await supabase.auth.getSession();
    
    if (data?.session) {
      const expiresAt = data.session.expires_at;
      if (expiresAt) {
        const expiryTime = new Date(expiresAt * 1000);
        const now = new Date();
        
        // If token expires in less than 5 minutes, refresh it
        if ((expiryTime.getTime() - now.getTime()) < 5 * 60 * 1000) {
          const { data: refreshData, error } = await supabase.auth.refreshSession();
          
          if (error) {
            console.error('Error refreshing session:', error);
            throw error;
          }
          
          return refreshData.session;
        }
      }
      
      return data.session;
    }
    
    return null;
  } catch (error) {
    console.error('Error refreshing session:', error);
    throw error;
  }
};
