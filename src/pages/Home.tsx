import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Code, Wand2, Video } from 'lucide-react';
import heroVideo from '../assets/hero.mp4';

const Home: React.FC = () => {
  const features = [
    {
      icon: <Wand2 className="h-8 w-8 text-primary-400" />,
      title: 'AI-Powered Creation',
      description: 'Simply describe your vision, and our advanced AI will transform it into stunning animations.',
    },
    {
      icon: <Code className="h-8 w-8 text-primary-400" />,
      title: 'Smart Generation',
      description: 'Our AI understands complex concepts and generates beautiful visualizations automatically.',
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary-400" />,
      title: 'Creative Freedom',
      description: 'Create complex mathematical animations without any technical knowledge.',
    },
    {
      icon: <Video className="h-8 w-8 text-primary-400" />,
      title: 'Instant Results',
      description: 'Watch your ideas come to life with high-quality MP4 animations you can download and share.',
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero section */}
      <section className="relative">
        <div className="absolute inset-0 z-0 gradient-bg opacity-70"></div>
        <div className="absolute inset-0 z-0 bg-[url('https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 md:py-32">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Create Stunning Animations
              <span className="block text-primary-400 mt-2">Powered by AI</span>
            </motion.h1>
            
            <motion.p 
              className="mt-6 max-w-2xl mx-auto text-lg text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Transform your ideas into beautiful mathmatical visualizations using cutting-edge AI technology. Start with free tokens - no coding required.
            </motion.p>
            
            <motion.div 
              className="mt-10 flex justify-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link to="/create" className="btn btn-primary px-6 py-3 text-lg">
                Get Started
              </Link>
              <Link to="/pricing" className="btn btn-outline px-6 py-3 text-lg">
                View Pricing
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            className="mt-16 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <div className="video-container shadow-2xl shadow-primary-900/20 border border-gray-800">
              <video 
                src={heroVideo} 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-16 bg-dark-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">How It Works:</h2>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              AnimGenius combines state-of-the-art AI with stunning visualizations to bring your concepts to life
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-dark-300 rounded-xl border border-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="p-3 rounded-full bg-primary-900/30 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Start Creating with Free Tokens
          </h2>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            No technical knowledge required. Just describe what you want to create, 
            and let our AI bring your vision to life.
          </p>
          <Link to="/create" className="btn bg-white text-primary-900 hover:bg-gray-100 px-8 py-3 text-lg font-medium">
            Start Creating Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;