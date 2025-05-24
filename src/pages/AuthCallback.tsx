import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

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
        // First try to exchange the auth code for a session
        // This is needed when the hash contains an access token
        if (location.hash) {
          const hashParams = new URLSearchParams(location.hash.substring(1));
          if (hashParams.has('access_token')) {
            console.log('Found access token in URL, setting session');
            
            // The session should be automatically set by Supabase client
            // when it detects the hash parameters
          }
        }
        
        // Now get the session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          throw error;
        }
        
        if (data?.session) {
          // Store user session data
          localStorage.setItem('user', JSON.stringify(data.session.user));
          console.log('Authentication successful, user:', data.session.user.email);
          
          // Redirect to create page after successful authentication
          setTimeout(() => {
            navigate('/create');
          }, 500);
        } else {
          // If no session, try to exchange the code for a session
          console.log('No session found, checking for code exchange');
          
          // Try to get the session one more time after a short delay
          // This gives Supabase client time to process the hash
          setTimeout(async () => {
            const { data: retryData, error: retryError } = await supabase.auth.getSession();
            
            if (retryError) {
              console.error('Retry error:', retryError);
              throw retryError;
            }
            
            if (retryData?.session) {
              localStorage.setItem('user', JSON.stringify(retryData.session.user));
              console.log('Retry successful, user:', retryData.session.user.email);
              navigate('/create');
            } else {
              // If still no session, something went wrong
              setError('Authentication failed. No session found after retry.');
              setTimeout(() => navigate('/login'), 3000);
            }
          }, 1000);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setTimeout(() => navigate('/login'), 3000);
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
