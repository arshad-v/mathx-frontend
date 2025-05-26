import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import ProfileButton from './ProfileButton';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize Supabase client
  const supabaseUrl = import.meta.env.SUPABASE_URL || 'https://iaioivhibyazmntdiadn.supabase.co';
  const supabaseAnonKey = import.meta.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhaW9pdmhpYnlhem1udGRpYWRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwMjg3MjIsImV4cCI6MjA2MjYwNDcyMn0.2yYZQp_FgMso3noCFAT7mwlFZ-ab7xB6E4IQ0UaJkzE';
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Get user from Supabase
  useEffect(() => {
    async function getUser() {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          // Only log errors that aren't the expected 'Auth session missing' error
          if (error.message !== 'Auth session missing!') {
            console.error('Error getting user:', error);
          }
          return;
        }

        if (data?.user) {
          setUser(data.user);
          // Still store in localStorage for compatibility with other components
          localStorage.setItem('user', JSON.stringify(data.user));
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    }

    getUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session ? 'User logged in' : 'No session');
      
      if (event === 'SIGNED_OUT') {
        // Handle sign out event
        console.log('User signed out, clearing all state');
        setUser(null);
        localStorage.clear();
        sessionStorage.clear();
      } else if (session?.user) {
        // Handle sign in event
        console.log('User signed in:', session.user.email);
        setUser(session.user);
        localStorage.setItem('user', JSON.stringify(session.user));
        localStorage.setItem('token', session.access_token);
      } else {
        // Handle other events with no session
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    });

    return () => {
      subscription.unsubscribe();
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
          email: user.email || user.user_metadata?.email || '',
          plan: 'Personal Plan',
          avatar: user.user_metadata?.avatar_url || user.avatar
        } : null}
      />
    </div>
  );
};

export default Layout;
