
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, TrendingUp, Clock, ThumbsUp, User, Upload, History } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
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
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto",
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
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === item.path
                      ? "bg-red-50 text-red-600"
                      : "text-gray-700 hover:bg-gray-100"
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
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Categories
            </h3>
            <nav className="space-y-1">
              {genres.map((genre) => (
                <Link
                  key={genre}
                  to={`/genre/${genre}`}
                  onClick={onClose}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors capitalize"
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
