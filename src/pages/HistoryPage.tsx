
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { VideoCard } from '@/components/video/VideoCard';
import { formatDistanceToNow } from 'date-fns';
import { History, Clock } from 'lucide-react';

export const HistoryPage = () => {
  const { user, isGuest } = useAuth();

  const { data: watchHistory, isLoading } = useQuery({
    queryKey: ['watch-history', user?.id],
    queryFn: async () => {
      if (isGuest || !user) return [];
      
      const { data, error } = await supabase
        .from('watch_history')
        .select(`
          *,
          videos!inner(
            id,
            title,
            description,
            thumbnail_url,
            video_url,
            duration,
            views_count,
            likes_count,
            genre,
            created_at,
            profiles:uploader_id(username)
          )
        `)
        .eq('user_id', user.id)
        .order('watched_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user && !isGuest,
  });

  if (isGuest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black p-8">
        <div className="text-center">
          <History className="h-16 w-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">Watch History</h1>
          <p className="text-gray-400 mb-6">Sign in to view your watch history</p>
          <a href="/auth" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-8">
          <History className="h-8 w-8 text-purple-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Watch History
          </h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-700 aspect-video rounded-lg mb-4"></div>
                <div className="flex gap-3">
                  <div className="w-9 h-9 bg-gray-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : watchHistory && watchHistory.length > 0 ? (
          <div className="space-y-6">
            {watchHistory.map((item: any) => (
              <div key={item.id} className="flex gap-4 bg-gray-900/50 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex-shrink-0">
                  <VideoCard
                    video={{
                      ...item.videos,
                      uploader_username: item.videos.profiles?.username || 'Unknown'
                    }}
                    className="w-80"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Clock className="h-4 w-4" />
                    Watched {formatDistanceToNow(new Date(item.watched_at), { addSuffix: true })}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                    {item.videos.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {item.videos.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    <span>{item.videos.views_count.toLocaleString()} views</span>
                    <span>•</span>
                    <span>{item.videos.likes_count.toLocaleString()} likes</span>
                    {item.watch_duration > 0 && (
                      <>
                        <span>•</span>
                        <span>Watched for {Math.floor(item.watch_duration / 60)} minutes</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <History className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No watch history yet</p>
            <p className="text-gray-500 text-sm">Start watching videos to see them here</p>
          </div>
        )}
      </div>
    </div>
  );
};
