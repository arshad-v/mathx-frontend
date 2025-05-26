import React from 'react';
import { User } from 'lucide-react';

interface ProfileButtonProps {
  onClick: () => void;
  user: {
    email: string;
    avatar?: string;
  } | null;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ onClick, user }) => {
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
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
          alt="Profile"
          className="h-10 w-10 rounded-full"
        />
      )}
    </button>
  );
};

export default ProfileButton;
