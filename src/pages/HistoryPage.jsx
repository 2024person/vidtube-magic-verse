
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Play, Clock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HistoryPage = () => {
  const { user, isGuest } = useAuth();
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isGuest && user) {
      fetchWatchHistory();
    } else {
      setLoading(false);
    }
  }, [user, isGuest]);

  const fetchWatchHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('watch_history')
        .select(`
          *,
          videos (
            id,
            title,
            thumbnail_url,
            duration,
            views_count,
            uploader_id,
            profiles:uploader_id(username)
          )
        `)
        .eq('user_id', user.id)
        .order('watched_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setWatchHistory(data || []);
    } catch (error) {
      console.error('Error fetching watch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`;
    }
    return `${count} views`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/80 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (isGuest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/80 to-black p-8">
        <div className="container mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Watch History
            </h1>
            <p className="text-cyan-200 mb-6">Sign in to view your watch history</p>
            <Link 
              to="/auth" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/80 to-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-purple-900/10"></div>
      <div className="container mx-auto px-4 py-6 relative z-10">
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Watch History
        </h1>

        {watchHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-800/50 rounded-full p-6 w-24 h-24 mx-auto mb-4 border border-cyan-500/30">
              <Clock className="h-12 w-12 text-cyan-400 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No watch history yet</h3>
            <p className="text-gray-400">Videos you watch will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {watchHistory.map((entry) => (
              <Card key={entry.id} className="bg-gray-900/50 border-cyan-500/30 backdrop-blur-sm hover:border-purple-500/50 hover:shadow-cyan-500/20 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Link to={`/watch/${entry.videos.id}`} className="relative">
                      <div className="w-48 h-28 bg-gray-800 rounded-lg overflow-hidden relative group">
                        <img
                          src={entry.videos.thumbnail_url || 'https://via.placeholder.com/320x180?text=Video'}
                          alt={entry.videos.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {entry.videos.duration && (
                          <div className="absolute bottom-2 right-2 bg-black/80 text-cyan-400 text-xs px-2 py-1 rounded">
                            {formatDuration(entry.videos.duration)}
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <div className="bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Play className="h-6 w-6 text-white fill-white" />
                          </div>
                        </div>
                      </div>
                    </Link>
                    
                    <div className="flex-1 min-w-0">
                      <Link to={`/watch/${entry.videos.id}`}>
                        <h3 className="font-semibold text-lg text-white hover:text-cyan-400 transition-colors mb-2 line-clamp-2">
                          {entry.videos.title}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-6 w-6 border border-cyan-500/20">
                          <AvatarImage src="" alt={entry.videos.profiles?.username} />
                          <AvatarFallback className="text-xs bg-gradient-to-r from-cyan-500 to-purple-500 text-white">
                            {entry.videos.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-cyan-300 hover:text-cyan-400 transition-colors">
                          {entry.videos.profiles?.username || 'Unknown Channel'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {formatViews(entry.videos.views_count)}
                        </div>
                        <span>
                          Watched {formatDistanceToNow(new Date(entry.watched_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
