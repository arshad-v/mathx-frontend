import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader, Play, Download, Coins } from 'lucide-react';
import PromptForm from '../components/PromptForm';
import VideoPlayer from '../components/VideoPlayer';
import { getStoredBackendToken, getStoredUser } from '../lib/authBridge';

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

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    // Get the backend token from authBridge
    const token = getStoredBackendToken();
    const user = getStoredUser();
    const userId = localStorage.getItem('current_user_id');
    
    if (!token) {
      console.log('No backend token found, redirecting to login');
      navigate('/login');
      return;
    }
    
    if (!userId) {
      console.log('No user ID found, but token exists. Strange state.');
      // We'll continue anyway since we have a token
    } else {
      console.log('Current user ID:', userId);
    }
    
    if (user && typeof user.tokens !== 'undefined') {
      // If we already have the user with tokens in localStorage, use that
      console.log('Using tokens from stored user:', user.tokens, 'for user:', user.email);
      setTokens(user.tokens);
    }

    // Fetch user tokens from backend
    console.log('Fetching tokens from backend');
    fetch(`${backendUrl}/api/user/tokens`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch tokens: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Tokens fetched successfully:', data);
        setTokens(data.tokens);
      })
      .catch(err => {
        console.error('Error fetching tokens:', err);
        // If we have tokens from the stored user, don't show an error
        if (!(user && typeof user.tokens !== 'undefined')) {
          setError('Failed to fetch tokens');
        }
      });

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

    const token = getStoredBackendToken();
    if (!token) {
      console.log('No backend token found, redirecting to login');
      navigate('/login');
      return;
    }

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
      
      const data = await response.json();
      setResult(data);
      setTokens(data.remainingTokens);
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
