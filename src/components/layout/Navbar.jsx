
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Menu, Play, User, Upload, History, LogOut, BarChart3 } from 'lucide-react';

export const Navbar = ({ onSearch, onMenuToggle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isGuest, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <nav className="bg-black/90 backdrop-blur-lg shadow-lg border-b border-cyan-500/30 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onMenuToggle} className="md:hidden text-white hover:bg-cyan-500/20 hover:text-cyan-400 transition-all duration-300">
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-2 rounded-lg shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/30 transition-all duration-300">
                <Play className="h-6 w-6 text-white fill-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent hidden sm:block group-hover:from-cyan-300 group-hover:to-purple-300 transition-all duration-300">
                VidTube
              </span>
            </Link>
          </div>

          {/* Center section - Search */}
          <div className="flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2 rounded-full bg-gray-900/80 border-cyan-500/30 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-full px-3 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-300"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {!isGuest && user ? (
              <>
                <Button variant="ghost" size="sm" asChild className="hidden sm:flex text-white hover:bg-cyan-500/20 hover:text-cyan-400 transition-all duration-300">
                  <Link to="/upload">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-cyan-500/20 transition-all duration-300">
                      <Avatar className="h-8 w-8 border border-cyan-500/30">
                        <AvatarImage src="" alt="User" />
                        <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-900/90 backdrop-blur-lg border-cyan-500/30 text-white" align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer hover:text-cyan-400 transition-colors">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer hover:text-cyan-400 transition-colors">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/history" className="cursor-pointer hover:text-cyan-400 transition-colors">
                        <History className="mr-2 h-4 w-4" />
                        Watch History
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="sm:hidden">
                      <Link to="/upload" className="cursor-pointer hover:text-cyan-400 transition-colors">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Video
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-cyan-500/30" />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer hover:text-red-400 transition-colors">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-300">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
