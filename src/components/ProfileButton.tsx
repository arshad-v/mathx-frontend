import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import { getStoredUser } from '../lib/authBridge';

interface ProfileButtonProps {
  onClick: () => void;
  user: {
    email: string;
    avatar?: string;
  } | null;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ onClick, user: propUser }) => {
  // Use local state to track user data
  const [user, setUser] = useState(propUser || getStoredUser());
  
  useEffect(() => {
    // Update user when prop changes
    if (propUser) {
      setUser(propUser);
    }
    
    // Check for user data on mount and periodically
    const checkUser = () => {
      const storedUser = getStoredUser();
      if (storedUser && (!user || JSON.stringify(storedUser) !== JSON.stringify(user))) {
        console.log('ProfileButton: User data updated from storage');
        setUser(storedUser);
      }
    };
    
    // Check immediately
    checkUser();
    
    // And set up interval to check periodically
    const interval = setInterval(checkUser, 1000);
    
    return () => clearInterval(interval);
  }, [propUser, user]);
  if (!user) {
    return (
      <button
        onClick={onClick}
        className="fixed bottom-4 left-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors z-50"
      >
        Login
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 left-4 p-2 bg-dark-200 hover:bg-dark-100 rounded-full border border-gray-800 transition-all hover:scale-110 z-50"
    >
      {user.avatar ? (
        <img
          src={user.avatar}
          alt="Profile"
          className="h-10 w-10 rounded-full"
        />
      ) : (
        <User className="h-6 w-6 text-gray-400" />
      )}
    </button>
  );
};

export default ProfileButton;