import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const isActive = (path: string) => location.pathname === path;
  
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/create', label: 'Create Animation' },
    { path: '/pricing', label: 'Pricing' }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-dark-300/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-1.5 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">
                Mathx.AI
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200 relative px-1 py-2 ${
                  isActive(link.path) 
                    ? 'text-primary-400' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div 
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
                    initial={false}
                  />
                )}
              </Link>
            ))}
            
            <Link to="/create" className="btn btn-primary flex items-center space-x-1">
              <Play className="h-4 w-4" />
              <span>New Animation</span>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          className="md:hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-dark-300 border-b border-gray-800">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-primary-900 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/create"
              className="block w-full text-center btn btn-primary mt-3"
              onClick={() => setIsOpen(false)}
            >
              New Animation
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
