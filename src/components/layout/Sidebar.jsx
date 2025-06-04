
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, History, BarChart3, X } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, isGuest } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: TrendingUp, label: 'Trending', path: '/trending' },
    { icon: History, label: 'History', path: '/history' },
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 
        bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-sm
        border-r border-cyan-500/30
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:top-16
      `}>
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/30 md:hidden">
          <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            VidTube
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive(item.path) 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30' 
                    : 'text-gray-300 hover:text-cyan-400 hover:bg-gray-800/50'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-800/50 rounded-lg p-3 border border-cyan-500/30">
            <p className="text-sm text-cyan-400 font-medium">
              {isGuest ? 'Guest User' : user?.email || 'Signed In'}
            </p>
            <p className="text-xs text-gray-400">
              {isGuest ? 'Limited access' : 'Full access'}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
