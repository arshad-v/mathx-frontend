import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Code, Wand2, Video, Layers, PenTool, Zap, BookOpen } from 'lucide-react';
import heroVideo from '../assets/hero.mp4';

const Home: React.FC = () => {
  const features = [
    {
      icon: <Wand2 className="h-8 w-8 text-primary-400" />,
      title: 'AI-Powered Creation',
      description: 'Simply describe your vision, and our advanced AI will transform it into stunning Manim animations.',
    },
    {
      icon: <Code className="h-8 w-8 text-primary-400" />,
      title: 'Smart Generation',
      description: 'Our AI understands complex mathematical concepts and generates beautiful visualizations using Manim.',
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary-400" />,
      title: 'Creative Freedom',
      description: 'Create complex mathematical animations without writing a single line of Manim code.',
    },
    {
      icon: <Video className="h-8 w-8 text-primary-400" />,
      title: 'Instant Results',
      description: 'Watch your ideas come to life with high-quality MP4 animations you can download and share.',
    },
  ];

  const manimFeatures = [
    {
      icon: <Layers className="h-8 w-8 text-primary-400" />,
      title: 'Mathematical Precision',
      description: 'Manim creates mathematically accurate animations with perfect rendering of equations, graphs, and geometric shapes.',
    },
    {
      icon: <PenTool className="h-8 w-8 text-primary-400" />,
      title: 'Vector Graphics',
      description: 'All animations are created as vector graphics, ensuring crystal-clear quality at any resolution.',
    },
    {
      icon: <Zap className="h-8 w-8 text-primary-400" />,
      title: 'Powerful Animations',
      description: 'From simple transformations to complex calculus visualizations, Manim handles it all with smooth, professional animations.',
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary-400" />,
      title: '3Blue1Brown Legacy',
      description: 'Created by Grant Sanderson for his popular YouTube channel, Manim is the gold standard for math animations.',
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
              <span className="block text-primary-400 mt-2">Powered by AI & Manim</span>
            </motion.h1>
            
            <motion.p 
              className="mt-6 max-w-2xl mx-auto text-lg text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Transform your ideas into beautiful mathematical visualizations using cutting-edge AI technology and the powerful Manim animation engine. Start with free tokens - no coding required.
            </motion.p>
            
            <motion.div 
              className="mt-10 flex justify-center space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link to="/create" className="btn btn-primary px-6 py-3 text-lg">
                Start with Free
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
      
      
      {/* Manim Showcase Section */}
      <section className="py-20 bg-gradient-to-b from-dark-200 to-dark-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              The Power of <span className="text-primary-400">Manim</span>
            </h2>
            <p className="mt-4 text-gray-400 max-w-3xl mx-auto text-lg">
              Our platform leverages the incredible Manim animation engine, created by 3Blue1Brown's Grant Sanderson.
              Manim is the gold standard for creating stunning mathematical animations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {manimFeatures.map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-dark-400/50 backdrop-blur-sm rounded-xl border border-primary-800/30 shadow-lg hover:shadow-primary-900/20 transition-all duration-300 hover:-translate-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <div className="p-3 rounded-full bg-primary-900/30 mb-4 ring-2 ring-primary-700/30">
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

          <motion.div 
            className="bg-dark-400/30 backdrop-blur-md rounded-2xl p-8 border border-primary-800/20 shadow-xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">What Can You Create With Manim?</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-primary-400 mr-2">•</span>
                    <span>Complex mathematical concepts visualized step-by-step</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-400 mr-2">•</span>
                    <span>Beautiful geometric transformations and morphing shapes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-400 mr-2">•</span>
                    <span>Calculus visualizations with derivatives and integrals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-400 mr-2">•</span>
                    <span>Linear algebra demonstrations with vectors and matrices</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-400 mr-2">•</span>
                    <span>Probability and statistics animations with dynamic graphs</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link to="/create" className="btn btn-primary px-6 py-3">
                    Try It Now
                  </Link>
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                <img 
                  src="https://i.postimg.cc/VkHqgV5C/Whats-App-Image-2025-05-24-at-19-25-44-cf174cfe.jpg" 
                  alt="Manim animation example" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start Creating with Free Tokens
          </h2>
          <p className="text-lg text-gray-200 mb-8 max-w-3xl mx-auto">
            No technical knowledge of Manim or Python required. Just describe what you want to create, 
            and let our AI bring your mathematical vision to life with professional-quality animations.
          </p>
          <Link to="/create" className="btn bg-white text-primary-900 hover:bg-gray-100 px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            Start Creating Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
