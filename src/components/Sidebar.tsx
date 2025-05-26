import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MessageSquarePlus, 
  Search, 
  Coins, 
  Settings, 
  HelpCircle,
  CreditCard,
  Users,
  LogOut,
  X
} from 'lucide-react';

type User = {
  email: string;
  plan: string;
  avatar?: string;
};

type Chat = {
  id: number;
  title: string;
};

type ChatHistory = Record<string, Chat[]>;

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

// Mock chat history data
const CHAT_HISTORY: ChatHistory = {
  today: [
    { id: 1, title: "Sine wave animation" },
    { id: 2, title: "3D cube rotation" }
  ],
  yesterday: [
    { id: 3, title: "Fourier series" },
    { id: 4, title: "Vector field" }
  ],
  lastMonth: [
    { id: 5, title: "Matrix transformation" },
    { id: 6, title: "Complex numbers" }
  ]
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter chats based on search query
  const filteredChats = searchQuery.trim() ? 
    Object.entries(CHAT_HISTORY).reduce((acc, [period, chats]) => {
      const matches = chats.filter(chat => 
        chat.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (matches.length > 0) acc[period] = matches;
      return acc;
    }, {} as ChatHistory) : 
    CHAT_HISTORY;

  const hasResults = Object.keys(filteredChats).length > 0;

  // Action handlers
  const handleNewChat = () => {
    navigate('/create');
    onClose();
  };

  const handleSignOut = () => {
    // Clear all auth data from localStorage
    localStorage.clear(); // Clear everything to be safe
    sessionStorage.clear(); // Also clear session storage
    
    // Clear cookies that might be storing auth data
    document.cookie.split(';').forEach(cookie => {
      document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
    
    // Force a complete page reload to reset all React state
    onClose();
    window.location.href = '/login'; // Use direct URL change instead of navigate
  };

  const ChatList = () => (
    <>
      {Object.entries(filteredChats).map(([period, chats]) => (
        <div key={period} className="px-3 py-1">
          <div className="text-xs font-medium text-gray-500 uppercase mb-1">{period}</div>
          {chats.map((chat) => (
            <button 
              key={chat.id}
              onClick={() => {
                navigate(`/chat/${chat.id}`);
                onClose();
              }}
              className="w-full text-left px-2 py-1.5 text-gray-300 hover:bg-dark-100 rounded transition-colors text-sm"
            >
              {chat.title}
            </button>
          ))}
        </div>
      ))}
    </>
  );

  const ActionLink = ({ 
    to, icon: Icon, label, external, onClick = onClose 
  }: { 
    to: string; 
    icon: React.ElementType; 
    label: string; 
    external?: boolean;
    onClick?: () => void;
  }) => {
    const linkClass = "flex items-center space-x-2 px-2 py-1.5 text-sm text-gray-300 hover:bg-dark-100 rounded transition-colors";
    
    if (external) {
      return (
        <a 
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          className={linkClass}
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </a>
      );
    }
    
    return (
      <Link
        to={to}
        onClick={onClick}
        className={linkClass}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-72 bg-dark-200 border-r border-gray-800 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-3 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-gradient-to-br from-primary-500 to-secondary-600 rounded">
                  <MessageSquarePlus className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">
                  Mathx.ai
                </span>
              </div>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-dark-100 rounded transition-colors"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            {/* Search & New Chat */}
            <div className="p-3 space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 bg-dark-100 border border-gray-800 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              
              <button 
                onClick={handleNewChat}
                className="w-full px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded flex items-center justify-center space-x-1.5 transition-colors text-sm"
              >
                <MessageSquarePlus className="h-3.5 w-3.5" />
                <span>New Chat</span>
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto">
              {hasResults ? (
                <ChatList />
              ) : (
                <div className="px-3 py-2 text-gray-400 text-center text-sm">
                  No chats found
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-3 border-t border-gray-800 space-y-1">
              <ActionLink to="/pricing" icon={Coins} label="Get Free Tokens" />
              <ActionLink to="/settings" icon={Settings} label="Settings" />
              <ActionLink to="https://docs.manim.community" icon={HelpCircle} label="Help Center" external />
              <ActionLink to="/pricing" icon={CreditCard} label="My Subscription" />
              <ActionLink 
                to="/settings" 
                icon={Users} 
                label="Select Account" 
                onClick={() => {
                  navigate('/settings');
                  onClose();
                }}
              />
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center space-x-2 px-2 py-1.5 text-sm text-gray-300 hover:bg-dark-100 rounded transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>

            {/* Profile Section */}
            {user && (
              <div className="p-3 border-t border-gray-800">
                <div className="flex items-center space-x-2">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                    alt="Profile"
                    className="h-8 w-8 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-gray-400">
                      {user.plan}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
