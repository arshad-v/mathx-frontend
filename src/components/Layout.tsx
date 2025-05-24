import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import ProfileButton from './ProfileButton';
import { getStoredUser, isAuthenticated, AUTH_CHANGE_EVENT } from '../lib/authBridge';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // State to store user data and authentication state
  const [user, setUser] = useState(getStoredUser());
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

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
      console.log('Layout: Auth changed, updating user data');
      const currentUser = getStoredUser();
      const authState = isAuthenticated();
      
      setUser(currentUser);
      setAuthenticated(authState);
      
      console.log('Layout: Updated auth state:', authState);
      console.log('Layout: Updated user:', currentUser);
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);

    // Check for user data and auth state periodically
    const interval = setInterval(() => {
      const currentUser = getStoredUser();
      const authState = isAuthenticated();
      
      if (authState !== authenticated) {
        console.log('Layout: Auth state changed, updating', authState);
        setAuthenticated(authState);
      }
      
      if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
        console.log('Layout: User data changed, updating');
        setUser(currentUser);
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
      clearInterval(interval);
    };
  }, []);

  const handleProfileClick = () => {
    if (authenticated && user) {
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