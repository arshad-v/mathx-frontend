import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-6">
      <div className="text-center">
        <div className="text-9xl font-bold text-primary-600">404</div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">Page not found</h1>
        <p className="mt-4 text-gray-400">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="btn btn-primary flex items-center space-x-2 mx-auto w-fit"
          >
            <Home className="h-4 w-4" />
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;