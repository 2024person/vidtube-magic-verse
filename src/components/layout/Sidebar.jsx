
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, TrendingUp, Clock, ThumbsUp, User, Upload, History } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: TrendingUp, label: 'Trending', path: '/trending' },
    ...(user ? [
      { icon: Clock, label: 'Watch Later', path: '/watch-later' },
      { icon: History, label: 'History', path: '/history' },
      { icon: ThumbsUp, label: 'Liked Videos', path: '/liked' },
      { icon: Upload, label: 'Upload', path: '/upload' },
      { icon: User, label: 'Your Channel', path: '/channel' },
    ] : [])
  ];

  const genres = [
    'music', 'gaming', 'news', 'sports', 'entertainment', 
    'education', 'comedy', 'action', 'drama', 'documentary'
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-black/90 backdrop-blur-lg border-r border-cyan-500/30 transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-4 space-y-6">
          {/* Main Menu */}
          <div>
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                    location.pathname === item.path
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30"
                      : "text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border hover:border-cyan-500/20"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">
              Categories
            </h3>
            <nav className="space-y-1">
              {genres.map((genre) => (
                <Link
                  key={genre}
                  to={`/genre/${genre}`}
                  onClick={onClose}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border hover:border-cyan-500/20 transition-all duration-300 capitalize"
                >
                  {genre}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
};
