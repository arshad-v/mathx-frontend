import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import ProfileButton from './ProfileButton';
import { getStoredUser } from '../lib/authBridge';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // State to store user data
  const [user, setUser] = useState(getStoredUser());

  // Effect to refresh user data when localStorage changes
  useEffect(() => {
    // Initial load
    setUser(getStoredUser());

    // Setup event listener for storage changes
    const handleStorageChange = () => {
      console.log('Storage changed, updating user data');
      setUser(getStoredUser());
    };

    // Listen for storage events (when localStorage changes)
    window.addEventListener('storage', handleStorageChange);

    // Custom event for auth changes within the same window
    const handleAuthChange = () => {
      console.log('Auth changed, updating user data');
      setUser(getStoredUser());
    };

    window.addEventListener('auth-change', handleAuthChange);

    // Check for user data periodically
    const interval = setInterval(() => {
      const currentUser = getStoredUser();
      if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
        console.log('User data changed, updating');
        setUser(currentUser);
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
      clearInterval(interval);
    };
  }, []);

  const handleProfileClick = () => {
    if (user) {
      setIsSidebarOpen(true);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      
      <ProfileButton 
        onClick={handleProfileClick}
        user={user}
      />
      
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user ? {
          email: user.email,
          plan: 'Personal Plan',
          avatar: user.avatar,
          tokens: user.tokens
        } : null}
      />
    </div>
  );
};

export default Layout;