import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import { refreshSessionIfNeeded } from './sessionUtils';
import { getBackendToken, clearAuthData, getStoredUser } from './authBridge';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  backendUser: any;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [backendUser, setBackendUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if this is a redirect from OAuth
        if (location.hash || location.search) {
          console.log('Detected OAuth callback, handling authentication...');
          try {
            // Process the OAuth callback
            const { data, error } = await supabase.auth.getSession();
            
            if (error) {
              throw error;
            }
            
            if (data?.session) {
              console.log('Successfully retrieved session from OAuth callback');
              setSession(data.session);
              setUser(data.session.user);
              
              // Get backend token and user data
              const backendToken = await getBackendToken(data.session);
              if (backendToken) {
                const storedUser = getStoredUser();
                if (storedUser) {
                  setBackendUser(storedUser);
                  console.log('Successfully retrieved backend user data');
                }
              }
              
              // Store session in localStorage as a backup
              localStorage.setItem('supabase.auth.token', JSON.stringify({
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
              }));
              
              return;
            }
          } catch (callbackError) {
            console.error('Error processing OAuth callback:', callbackError);
            setError('Failed to process login. Please try again.');
          }
        }
        
        // Try to get existing session
        console.log('Checking for existing session...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          throw error;
        }
        
        if (data?.session) {
          console.log('Found existing session');
          setSession(data.session);
          setUser(data.session.user);
          
          // Get backend token and user data
          await getBackendToken(data.session);
          const storedUser = getStoredUser();
          if (storedUser) {
            setBackendUser(storedUser);
            console.log('Successfully retrieved backend user data');
          }
        } else {
          console.log('No active session found');
          // Try to recover from localStorage backup
          const storedToken = localStorage.getItem('supabase.auth.token');
          if (storedToken) {
            try {
              const { access_token, refresh_token } = JSON.parse(storedToken);
              if (access_token && refresh_token) {
                console.log('Attempting to recover session from stored token...');
                const { data: refreshData, error: refreshError } = 
                  await supabase.auth.refreshSession({ refresh_token });
                  
                if (refreshError) {
                  console.error('Failed to refresh stored token:', refreshError);
                  localStorage.removeItem('supabase.auth.token');
                } else if (refreshData?.session) {
                  console.log('Successfully recovered session from stored token');
                  setSession(refreshData.session);
                  setUser(refreshData.session.user);
                  
                  // Get backend token and user data
                  await getBackendToken(refreshData.session);
                  const storedUser = getStoredUser();
                  if (storedUser) {
                    setBackendUser(storedUser);
                    console.log('Successfully retrieved backend user data');
                  }
                }
              }
            } catch (parseError) {
              console.error('Error parsing stored token:', parseError);
              localStorage.removeItem('supabase.auth.token');
            }
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle token refresh
  useEffect(() => {
    if (!session) return;
    
    const refreshInterval = setInterval(async () => {
      try {
        const refreshedSession = await refreshSessionIfNeeded();
        if (refreshedSession && refreshedSession.access_token !== session.access_token) {
          setSession(refreshedSession);
          setUser(refreshedSession.user);
        }
      } catch (err) {
        console.error('Session refresh error:', err);
      }
    }, 60 * 1000); // Check every minute
    
    return () => clearInterval(refreshInterval);
  }, [session]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting Google login from AuthContext...');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: 'email profile',
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          }
        }
      });
      
      if (error) {
        console.error('Error initiating Google OAuth:', error);
        throw error;
      }
      
      console.log('Google OAuth flow initiated successfully');
      // The redirect will happen automatically
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign in with Google');
      setLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear backend auth data
      clearAuthData();
      setBackendUser(null);
      
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, backendUser, loading, error, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
