import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for gallery
const ANIMATIONS = [
  {
    id: 1,
    title: "Sine Wave Transformation",
    description: "Visualization of a sine wave morphing into a cosine wave",
    thumbnail: "https://images.pexels.com/photos/3846155/pexels-photo-3846155.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    createdAt: "2 days ago"
  },
  {
    id: 2,
    title: "3D Torus Animation",
    description: "A sphere morphing into a torus with color gradients",
    thumbnail: "https://images.pexels.com/photos/8964935/pexels-photo-8964935.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    createdAt: "1 week ago"
  },
  {
    id: 3,
    title: "Pythagorean Theorem",
    description: "Visual proof of the Pythagorean theorem with animated squares",
    thumbnail: "https://images.pexels.com/photos/3825567/pexels-photo-3825567.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    createdAt: "2 weeks ago"
  },
  {
    id: 4,
    title: "Fourier Series Approximation",
    description: "Fourier series approximating a square wave with increasing terms",
    thumbnail: "https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    createdAt: "3 weeks ago"
  },
  {
    id: 5,
    title: "Binary Search Visualization",
    description: "Step-by-step visualization of binary search algorithm",
    thumbnail: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    createdAt: "1 month ago"
  },
  {
    id: 6,
    title: "Matrix Transformation",
    description: "Linear transformation of vectors in 2D space using matrices",
    thumbnail: "https://images.pexels.com/photos/8961098/pexels-photo-8961098.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    createdAt: "1 month ago"
  }
];

const Gallery: React.FC = () => {
  const [filter, setFilter] = useState('all');
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Animation Gallery</h1>
          <p className="mt-2 text-gray-400">
            Browse and view previously generated animations
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Link to="/create" className="btn btn-primary flex items-center gap-1">
            <Play className="h-4 w-4" />
            Create New Animation
          </Link>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'all' 
                ? 'bg-primary-600 text-white' 
                : 'bg-dark-200 text-gray-400 hover:bg-dark-300'
            }`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'recent' 
                ? 'bg-primary-600 text-white' 
                : 'bg-dark-200 text-gray-400 hover:bg-dark-300'
            }`}
            onClick={() => setFilter('recent')}
          >
            Recent
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === 'popular' 
                ? 'bg-primary-600 text-white' 
                : 'bg-dark-200 text-gray-400 hover:bg-dark-300'
            }`}
            onClick={() => setFilter('popular')}
          >
            Popular
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ANIMATIONS.map((animation, index) => (
          <motion.div
            key={animation.id}
            className="card overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div className="aspect-video relative group">
              <img 
                src={animation.thumbnail} 
                alt={animation.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-dark-400/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-3 bg-primary-600 rounded-full text-white hover:bg-primary-700 transition-colors">
                  <Play className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white">
                {animation.title}
              </h3>
              <p className="mt-1 text-sm text-gray-400">
                {animation.description}
              </p>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{animation.createdAt}</span>
                </div>
                
                <button className="text-xs text-primary-400 hover:text-primary-300 font-medium">
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;