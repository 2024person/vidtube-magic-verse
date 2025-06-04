
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Play, Clock, Eye, History } from 'lucide-react';
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
      // First try to get actual watch history from database
      const { data: historyData, error } = await supabase
        .from('watch_history')
        .select('*')
        .eq('user_id', user.id)
        .order('watched_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching watch history:', error);
      }

      // Generate mock history data for demonstration
      const mockHistory = Array.from({ length: 10 }, (_, i) => ({
        id: `history-${i}`,
        video_id: `video-${i}`,
        user_id: user.id,
        watched_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        watch_duration: Math.floor(Math.random() * 600) + 60,
        video: {
          id: `video-${i}`,
          title: `Amazing Video ${i + 1} - ${['Tutorial', 'Entertainment', 'Music', 'Gaming', 'News'][Math.floor(Math.random() * 5)]}`,
          description: `This is an amazing video about various topics that you watched recently. Video ${i + 1} covers interesting content.`,
          thumbnail_url: `https://picsum.photos/320/180?random=${i + 20}`,
          duration: Math.floor(Math.random() * 600) + 60,
          views_count: Math.floor(Math.random() * 1000000) + 1000,
          likes_count: Math.floor(Math.random() * 10000) + 100,
          created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          channel: {
            name: `Creator ${i + 1}`,
            avatar: `https://picsum.photos/40/40?random=${i + 100}`
          }
        }
      }));

      // Combine real data with mock data for demonstration
      setWatchHistory([...(historyData || []), ...mockHistory]);
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

  const formatWatchTime = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Recently';
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return 'Recently';
    }
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-purple-900/10"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center">
            <div className="bg-gray-800/50 rounded-full p-6 w-24 h-24 mx-auto mb-4 border border-cyan-500/30">
              <History className="h-12 w-12 text-cyan-400 mx-auto" />
            </div>
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
        <div className="flex items-center gap-3 mb-8">
          <History className="h-8 w-8 text-cyan-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Watch History
          </h1>
        </div>

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
                    <Link to={`/watch/${entry.video_id}`} className="relative flex-shrink-0">
                      <div className="w-48 h-28 bg-gray-800 rounded-lg overflow-hidden relative group border border-cyan-500/20">
                        <img
                          src={entry.video?.thumbnail_url || `https://picsum.photos/320/180?random=${entry.id}`}
                          alt={entry.video?.title || 'Video'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/320x180?text=Video';
                          }}
                        />
                        
                        {entry.video?.duration && (
                          <div className="absolute bottom-2 right-2 bg-black/80 text-cyan-400 text-xs px-2 py-1 rounded">
                            {formatDuration(entry.video.duration)}
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
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <Clock className="h-4 w-4" />
                        Watched {formatWatchTime(entry.watched_at)}
                      </div>
                      
                      <Link to={`/watch/${entry.video_id}`}>
                        <h3 className="font-semibold text-lg text-white hover:text-cyan-400 transition-colors mb-2 line-clamp-2">
                          {entry.video?.title || `Video ${entry.video_id}`}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar className="h-6 w-6 border border-cyan-500/20">
                          <AvatarImage src={entry.video?.channel?.avatar} alt={entry.video?.channel?.name} />
                          <AvatarFallback className="text-xs bg-gradient-to-r from-cyan-500 to-purple-500 text-white">
                            {entry.video?.channel?.name?.charAt(0).toUpperCase() || 'C'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-cyan-300 hover:text-cyan-400 transition-colors">
                          {entry.video?.channel?.name || 'Unknown Channel'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {formatViews(entry.video?.views_count || 0)}
                        </div>
                        {entry.watch_duration > 0 && (
                          <>
                            <span>•</span>
                            <span>Watched for {Math.floor(entry.watch_duration / 60)} minutes</span>
                          </>
                        )}
                      </div>
                      
                      {entry.video?.description && (
                        <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                          {entry.video.description}
                        </p>
                      )}
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
