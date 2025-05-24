import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { getBackendToken, dispatchAuthChangeEvent, AUTH_CHANGE_EVENT } from '../lib/authBridge';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);
  
  // Initialize Supabase client with the same credentials as in Login.tsx
  const supabaseUrl = import.meta.env.SUPABASE_URL || 'https://iaioivhibyazmntdiadn.supabase.co';
  const supabaseAnonKey = import.meta.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhaW9pdmhpYnlhem1udGRpYWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMjg3MjIsImV4cCI6MjA2MjYwNDcyMn0.2yYZQp_FgMso3noCFAT7mwlFZ-ab7xB6E4IQ0UaJkzE';
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      setProcessing(true);
      console.log('Auth callback initiated, hash:', location.hash);
      
      try {
        // First check if we already have a session
        const { data: initialSession } = await supabase.auth.getSession();
        
        if (initialSession?.session) {
          console.log('User already has a session:', initialSession.session.user.email);
          
          try {
            // Get a backend token using the Supabase session
            console.log('Getting backend token for existing session');
            const backendToken = await getBackendToken(initialSession.session);
            
            if (backendToken) {
              console.log('Successfully got backend token');
              // The authBridge will store the user and token in localStorage
              
              // Force a hard redirect to the create page to ensure a clean state
              window.location.href = '/create';
              return;
            } else {
              console.error('Failed to get backend token for existing session');
              // Continue with the flow to try other methods
            }
          } catch (tokenErr) {
            console.error('Error getting backend token:', tokenErr);
            // Continue with the flow to try other methods
          }
        }
        
        // Process the hash if it exists
        if (location.hash) {
          console.log('Processing hash parameters');
          const hashParams = new URLSearchParams(location.hash.substring(1));
          if (hashParams.has('access_token')) {
            console.log('Found access token in URL');
            
            // Wait a moment for Supabase to process the hash
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Now check for session again
            const { data, error } = await supabase.auth.getSession();
            
            if (error) {
              console.error('Error getting session after hash processing:', error);
              throw error;
            }
            
            if (data?.session) {
              console.log('Authentication successful, user:', data.session.user.email);
              
              try {
                // Get a backend token using the Supabase session
                console.log('Getting backend token for new session');
                const backendToken = await getBackendToken(data.session);
                
                if (backendToken) {
                  console.log('Successfully got backend token');
                  // The authBridge will store the user and token in localStorage
                  
                  // Log the authenticated user
                  console.log('Authentication successful for:', data.session.user.email);
                  
                  // Dispatch the auth change event using our helper function
                  dispatchAuthChangeEvent();
                  
                  // Force a hard redirect to ensure a clean state
                  // Add a query parameter to help with debugging
                  const userEmail = data.session.user.email || 'unknown';
                  window.location.href = `/create?auth=success&user=${encodeURIComponent(userEmail)}`;
                  return;
                } else {
                  console.error('Failed to get backend token for new session');
                  setError('Failed to get backend token. Please try again.');
                }
              } catch (tokenErr) {
                console.error('Error getting backend token:', tokenErr);
                setError('Error authenticating with backend. Please try again.');
              }
            }
          }
        }
        
        // If we get here, try one more time with a longer delay
        console.log('No session found yet, trying one more time after delay');
        
        setTimeout(async () => {
          try {
            const { data: finalAttempt, error: finalError } = await supabase.auth.getSession();
            
            if (finalError) {
              console.error('Final attempt error:', finalError);
              throw finalError;
            }
            
            if (finalAttempt?.session) {
              console.log('Final attempt successful, user:', finalAttempt.session.user.email);
              
              try {
                // Get a backend token using the Supabase session
                console.log('Getting backend token for final attempt session');
                const backendToken = await getBackendToken(finalAttempt.session);
                
                if (backendToken) {
                  console.log('Successfully got backend token');
                  // The authBridge will store the user and token in localStorage
                  
                  // Dispatch the auth change event using our helper function
                  dispatchAuthChangeEvent();
                  
                  // Force a hard redirect
                  window.location.href = '/create';
                  return;
                } else {
                  console.error('Failed to get backend token for final attempt');
                  setError('Failed to get backend token. Please try again.');
                  setTimeout(() => window.location.href = '/login', 2000);
                }
              } catch (tokenErr) {
                console.error('Error getting backend token:', tokenErr);
                setError('Error authenticating with backend. Please try again.');
                setTimeout(() => window.location.href = '/login', 2000);
              }
            } else {
              // If still no session, something went wrong
              console.error('Authentication failed. No session found after multiple attempts.');
              setError('Authentication failed. Please try again.');
              setTimeout(() => window.location.href = '/login', 2000);
            }
          } catch (retryErr) {
            console.error('Final attempt error:', retryErr);
            setError(retryErr instanceof Error ? retryErr.message : 'Authentication failed');
            setTimeout(() => window.location.href = '/login', 2000);
          }
        }, 1500);
        
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setTimeout(() => window.location.href = '/login', 2000);
      } finally {
        setProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate, location]);

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-6">
      <div className="card p-8 w-full max-w-md text-center">
        {error ? (
          <>
            <h2 className="text-2xl font-bold text-red-500 mb-4">Authentication Error</h2>
            <p className="text-gray-400">{error}</p>
            <p className="text-gray-400 mt-4">Redirecting to login page...</p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white mb-4">Authenticating...</h2>
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
