import React from 'react';
import { Github, Code, Sparkles } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo and Branding */}
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary-400" />
            <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">
              AnimGenius
            </span>
          </div>
          
          {/* Links */}
          <div className="flex space-x-8">
            <a
              href="https://github.com"
              className="text-gray-400 hover:text-primary-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://docs.forverse.ai"
              className="text-gray-400 hover:text-primary-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Documentation"
            >
              <Code className="h-5 w-5" />
            </a>
          </div>
          
          {/* Copyright and Credits */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} AnimGenius. All rights reserved.
            </p>
            <div className="mt-2 flex items-center justify-center space-x-2 text-sm">
              <span className="text-gray-500">Powered by</span>
              <a 
                href="https://forverse.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Forverse.ai
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;