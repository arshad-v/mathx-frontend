import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader, Play, Download, Coins, Sparkles, Zap, AlertTriangle } from 'lucide-react';
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

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch user tokens
    fetch(`${backendUrl}/api/user/tokens`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setTokens(data.tokens))
      .catch(err => {
        console.error('Error fetching tokens:', err);
        setError('Failed to fetch tokens');
      });

    // Check server health
    fetch(`${backendUrl}/health`)
      .catch(() => {
        setServerAvailable(false);
        setError('Backend server is not running.');
      });
  }, [navigate, backendUrl]);

  // Handle the submission of a new animation prompt
  const handleSubmit = async (inputPrompt: string) => {
    if (!serverAvailable) {
      setError('Backend server is not running.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
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

  // Handle the download of the generated animation
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
    <div className="min-h-screen bg-gradient-to-b from-dark-100 to-dark-300">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center p-1 px-3 mb-4 bg-primary-900/30 backdrop-blur-sm rounded-full border border-primary-700/30 text-primary-400 text-sm">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            <span>Powered by Manim</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Create Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-blue-400">Animation</span>
          </h1>
          <motion.p 
            className="mt-4 text-gray-300 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Transform your mathematical concepts into beautiful visualizations with the power of AI and Manim
          </motion.p>
          <motion.div 
            className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2 bg-dark-400/50 backdrop-blur-sm rounded-full border border-gray-700 text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Coins className="h-5 w-5 text-primary-400" />
            <span>You have <strong className="text-primary-400 font-medium">{tokens}</strong> tokens remaining</span>
          </motion.div>
        </motion.div>
      
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div 
            className="bg-dark-400/30 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary-900/40 rounded-lg">
                  <Play className="h-5 w-5 text-primary-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Animation Preview</h2>
              </div>
              
              {status === 'idle' && (
                <div className="aspect-video bg-gradient-to-br from-dark-300 to-dark-400 rounded-xl flex items-center justify-center border border-gray-700/50 shadow-inner overflow-hidden group">
                  <div className="text-center p-8 transform transition-transform duration-500 group-hover:scale-105">
                    <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-dark-200/50 flex items-center justify-center border border-primary-800/20 shadow-lg">
                      <Play className="h-8 w-8 text-primary-400/70" />
                    </div>
                    <p className="text-gray-300 font-medium text-lg">Your animation will appear here</p>
                    <p className="mt-3 text-gray-400">
                      Enter a prompt to get started with Manim visualization
                    </p>
                  </div>
                </div>
              )}
              
              {status === 'generating' && (
                <div className="aspect-video bg-gradient-to-br from-dark-300 to-dark-400 rounded-xl flex items-center justify-center border border-gray-700/50 shadow-inner overflow-hidden">
                  <div className="animate-pulse text-center p-8">
                    <div className="relative h-32 w-32 mx-auto mb-6">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-900/40 to-primary-700/40 animate-pulse"></div>
                      <div className="absolute inset-2 rounded-full bg-dark-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="h-10 w-10 text-primary-400/70 animate-pulse" />
                      </div>
                    </div>
                    <div className="h-4 bg-dark-200/80 rounded-full w-3/4 mx-auto"></div>
                    <div className="h-4 bg-dark-200/60 rounded-full w-1/2 mx-auto mt-3"></div>
                    <div className="h-4 bg-dark-200/40 rounded-full w-2/3 mx-auto mt-3"></div>
                  </div>
                </div>
              )}
              
              {status === 'complete' && result && (
                <>
                  <div className="rounded-xl overflow-hidden border border-gray-700/50 shadow-lg">
                    <VideoPlayer videoUrl={result.videoUrl} />
                  </div>
                  
                  <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4">
                    <button 
                      onClick={handleDownload}
                      className="btn-modern btn-outline flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-gray-200 border-2 border-gray-700 hover:border-primary-500 hover:bg-primary-900/20 transition-all duration-300 font-medium"
                    >
                      <Download className="h-5 w-5" />
                      Download MP4
                    </button>
                    <button 
                      onClick={() => setStatus('idle')}
                      className="btn-modern btn-primary flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white shadow-lg hover:shadow-primary-700/30 transition-all duration-300 font-medium"
                    >
                      <Sparkles className="h-5 w-5" />
                      Create New Animation
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
          
          {status === 'complete' && (
            <motion.div 
              className="mt-6 p-6 bg-dark-400/30 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h3 className="font-medium text-white text-lg mb-3">Prompt Used:</h3>
              <div className="bg-dark-300/70 p-4 rounded-lg border border-gray-700/70 shadow-inner">
                <p className="text-gray-300 font-mono">
                  {prompt}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Tips Section */}
      <motion.div 
        className="max-w-4xl mx-auto mt-16 mb-8 px-6 py-8 bg-dark-400/20 backdrop-blur-sm rounded-2xl border border-primary-800/20 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3 className="text-xl font-semibold text-white mb-4 text-center">Tips for Creating Great Manim Animations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="p-4 bg-dark-300/50 rounded-xl border border-gray-700/50">
            <h4 className="font-medium text-primary-400 mb-2">Be Specific</h4>
            <p className="text-gray-300 text-sm">Describe exactly what mathematical concept you want to visualize and how you want it to be presented.</p>
          </div>
          <div className="p-4 bg-dark-300/50 rounded-xl border border-gray-700/50">
            <h4 className="font-medium text-primary-400 mb-2">Include Transitions</h4>
            <p className="text-gray-300 text-sm">Mention how elements should transform or move to create smooth, engaging animations.</p>
          </div>
          <div className="p-4 bg-dark-300/50 rounded-xl border border-gray-700/50">
            <h4 className="font-medium text-primary-400 mb-2">Add Context</h4>
            <p className="text-gray-300 text-sm">Include educational context or explanations you want displayed alongside the visual elements.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Create;
