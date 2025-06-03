
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Menu, Play, User, Upload, History, LogOut } from 'lucide-react';

interface NavbarProps {
  onSearch: (query: string) => void;
  onMenuToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, onMenuToggle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onMenuToggle} className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-red-600 p-2 rounded-lg">
                <Play className="h-6 w-6 text-white fill-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">VidTube</span>
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
                className="w-full pl-4 pr-12 py-2 rounded-full border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full px-3"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                  <Link to="/upload">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" alt="User" />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/history" className="cursor-pointer">
                        <History className="mr-2 h-4 w-4" />
                        Watch History
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="sm:hidden">
                      <Link to="/upload" className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Video
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
