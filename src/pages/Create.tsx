import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader, Play, Download, Coins } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import PromptForm from '../components/PromptForm';
import VideoPlayer from '../components/VideoPlayer';

type Status = 'idle' | 'generating' | 'complete' | 'error';

interface AnimationResult {
  videoUrl: string;
  remainingTokens: number;
}

const Create: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('idle');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<AnimationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<number>(0);
  const [serverAvailable, setServerAvailable] = useState(true);

  // Initialize Supabase client
  const supabaseUrl = import.meta.env.SUPABASE_URL || 'https://iaioivhibyazmntdiadn.supabase.co';
  const supabaseAnonKey = import.meta.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhaW9pdmhpYnlhem1udGRpYWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMjg3MjIsImV4cCI6MjA2MjYwNDcyMn0.2yYZQp_FgMso3noCFAT7mwlFZ-ab7xB6E4IQ0UaJkzE';
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    async function initializeData() {
      try {
        // Get session from Supabase
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session) {
          // Only log detailed errors that aren't the expected 'Auth session missing' error
          if (error && error.message !== 'Auth session missing!') {
            console.error('Authentication error:', error);
          } else {
            console.log('No active session, redirecting to login');
          }
          navigate('/login');
          return;
        }
        
        // We have a valid session, store the token for API calls
        const token = data.session.access_token;
        localStorage.setItem('token', token);
        
        // Fetch user tokens directly from Supabase table
        try {
          // Get the user's ID and email from Supabase
          const authId = data.session.user.id;
          const userEmail = data.session.user.email || '';
          console.log('Current user ID:', authId, 'Email:', userEmail);
          
          // First check if user exists with id matching auth ID
          let { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, email, tokens')
            .eq('id', authId)
            .maybeSingle();
          
          // If not found by id, try oauth_id
          if (!userData && userError?.code === 'PGRST116') {
            console.log('User not found by id, trying oauth_id');
            const { data: oauthUserData, error: oauthError } = await supabase
              .from('users')
              .select('id, email, tokens')
              .eq('oauth_id', authId)
              .maybeSingle();
              
            userData = oauthUserData;
            userError = oauthError;
          }
          
          console.log('User data query result:', userData, userError);
          
          // If user still not found, create a new user record
          if (!userData && (userError?.code === 'PGRST116' || userError?.message.includes('no rows'))) {
            console.log('User not found in database, creating new user record');
            
            // Determine if this is an OAuth user (Google) or email user
            const isOAuthUser = data.session.user.app_metadata?.provider === 'google';
            
            // Create new user record
            const newUser: { 
              email: string; 
              tokens: number; 
              created_at: string; 
              id?: string; 
              oauth_id?: string; 
            } = {
              email: userEmail,
              tokens: 5, // Default starting tokens
              created_at: new Date().toISOString()
            };
            
            if (isOAuthUser) {
              // For OAuth users, store auth ID in oauth_id field
              newUser.oauth_id = authId;
            } else {
              // For email users, use auth ID as primary id
              newUser.id = authId;
            }
            
            const { data: insertedUser, error: insertError } = await supabase
              .from('users')
              .insert([newUser])
              .select();
              
            if (insertError) {
              console.error('Error creating new user record:', insertError);
            } else {
              console.log('Created new user record:', insertedUser);
              userData = insertedUser[0];
            }
          }
          
          if (userError) {
            console.error('Error fetching user tokens from Supabase:', userError);
            
            // Fallback to API if Supabase query fails
            const response = await fetch(`${backendUrl}/api/user/tokens`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            const tokenData = await response.json();
            setTokens(tokenData.tokens);
          } else if (userData) {
            console.log('Successfully fetched tokens from Supabase:', userData.tokens);
            setTokens(userData.tokens);
          } else {
            console.warn('User found in auth but not in users table');
            setTokens(0);
          }
        } catch (tokenErr) {
          console.error('Error fetching tokens:', tokenErr);
          setError('Failed to fetch tokens');
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
        navigate('/login');
      }
    }
    
    initializeData();

    // Check server health
    fetch(`${backendUrl}/health`)
      .catch(() => {
        setServerAvailable(false);
        setError('Backend server is not running.');
      });
  }, [navigate, backendUrl]);

  const handleSubmit = async (inputPrompt: string) => {
    if (!serverAvailable) {
      setError('Backend server is not running.');
      return;
    }

    // Get the current session token
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
      console.error('No active session:', error);
      navigate('/login');
      return;
    }
    
    const token = data.session.access_token;

    setPrompt(inputPrompt);
    setStatus('generating');
    setError(null);
    
    try {
      const response = await fetch(`${backendUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ prompt: inputPrompt }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate animation');
      }
      
      const responseData = await response.json();
      setResult(responseData);
      
      // Update tokens in state
      setTokens(responseData.remainingTokens);
      
      // Also update tokens in Supabase table
      try {
        const authId = data.session.user.id;
        console.log('Updating tokens for user ID:', authId);
        
        // First check if user exists with id matching auth ID
        let { data: findUser, error: findError } = await supabase
          .from('users')
          .select('id, oauth_id')
          .eq('id', authId)
          .maybeSingle();
          
        // If not found by id, try oauth_id
        if (!findUser && findError?.code === 'PGRST116') {
          console.log('User not found by id for update, trying oauth_id');
          const { data: oauthUser, error: oauthError } = await supabase
            .from('users')
            .select('id, oauth_id')
            .eq('oauth_id', authId)
            .maybeSingle();
            
          findUser = oauthUser;
          findError = oauthError;
        }
        
        console.log('Found user for update:', findUser, findError);
        
        // If user still not found, create a new user record
        if (!findUser) {
          console.log('User not found for token update, creating new record');
          const userEmail = data.session.user.email || '';
          const isOAuthUser = data.session.user.app_metadata?.provider === 'google';
          
          const newUser: { 
            email: string; 
            tokens: number; 
            created_at: string; 
            id?: string; 
            oauth_id?: string; 
          } = {
            email: userEmail,
            tokens: responseData.remainingTokens, // Use the remaining tokens from response
            created_at: new Date().toISOString()
          };
          
          if (isOAuthUser) {
            newUser.oauth_id = authId;
          } else {
            newUser.id = authId;
          }
          
          const { data: insertedUser, error: insertError } = await supabase
            .from('users')
            .insert([newUser])
            .select();
            
          if (insertError) {
            console.error('Error creating new user record during token update:', insertError);
          } else {
            console.log('Created new user record with updated tokens:', insertedUser);
          }
          return; // Exit since we've already set the tokens in the new record
        }
        
        // Determine which field to use for the update
        let updateQuery;
        if (findUser.id === authId) {
          updateQuery = supabase
            .from('users')
            .update({ tokens: responseData.remainingTokens })
            .eq('id', authId);
        } else {
          updateQuery = supabase
            .from('users')
            .update({ tokens: responseData.remainingTokens })
            .eq('oauth_id', authId);
        }
        
        const { error: updateError } = await updateQuery;
        
        if (updateError) {
          console.error('Error updating tokens in Supabase:', updateError);
        } else {
          console.log('Successfully updated tokens to:', responseData.remainingTokens);
        }
      } catch (updateErr) {
        console.error('Failed to update tokens in Supabase:', updateErr);
      }
      
      setStatus('complete');
    } catch (err) {
      console.error('Error generating animation:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setStatus('error');
    }
  };

  const handleDownload = async () => {
    if (!result?.videoUrl) return;
    
    try {
      const response = await fetch(`${backendUrl}/${result.videoUrl}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `animation-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading video:', err);
      setError('Failed to download video');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <motion.h1 
          className="text-3xl font-bold text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Create Your Animation
        </motion.h1>
        <motion.div 
          className="mt-2 flex items-center justify-center gap-2 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Coins className="h-5 w-5 text-primary-400" />
          <span>Tokens remaining: {tokens}</span>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          className="card h-full"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Enter Your Prompt</h2>
            <PromptForm onSubmit={handleSubmit} isGenerating={status === 'generating'} />
            
            {status === 'generating' && (
              <div className="mt-8 flex flex-col items-center justify-center p-8">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-t-2 border-primary-500 animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader className="h-8 w-8 text-primary-400 animate-pulse" />
                  </div>
                </div>
                <p className="mt-4 text-gray-400">Generating your animation...</p>
                <div className="mt-2 text-xs text-gray-500">This may take a minute</div>
              </div>
            )}
            
            {status === 'error' && (
              <div className="mt-8 bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">
                <p className="font-medium">Error generating animation</p>
                <p className="mt-1 text-sm">{error}</p>
              </div>
            )}
          </div>
        </motion.div>
        
        <div>
          <motion.div 
            className="card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Animation Preview</h2>
              
              {status === 'idle' && (
                <div className="aspect-video bg-dark-300 rounded-lg flex items-center justify-center border border-gray-800">
                  <div className="text-center p-6">
                    <Play className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                    <p className="text-gray-400">Your animation will appear here</p>
                    <p className="mt-2 text-sm text-gray-500">
                      Enter a prompt to get started
                    </p>
                  </div>
                </div>
              )}
              
              {status === 'generating' && (
                <div className="aspect-video bg-dark-300 rounded-lg flex items-center justify-center border border-gray-800">
                  <div className="animate-pulse text-center">
                    <div className="h-32 w-32 bg-dark-100 rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-dark-100 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-dark-100 rounded w-1/2 mx-auto mt-2"></div>
                  </div>
                </div>
              )}
              
              {status === 'complete' && result && (
                <>
                  <VideoPlayer videoUrl={result.videoUrl} />
                  
                  <div className="mt-4 flex justify-between">
                    <button 
                      onClick={handleDownload}
                      className="btn btn-outline flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Download MP4
                    </button>
                    <button 
                      onClick={() => setStatus('idle')}
                      className="btn btn-primary flex items-center gap-1"
                    >
                      <Play className="h-4 w-4" />
                      Generate New
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
          
          {status === 'complete' && (
            <motion.div 
              className="mt-6 p-4 bg-dark-200 rounded-lg border border-gray-800"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h3 className="font-medium mb-2">Prompt Used:</h3>
              <p className="text-gray-300 bg-dark-300 p-3 rounded border border-gray-700">
                {prompt}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Create;
