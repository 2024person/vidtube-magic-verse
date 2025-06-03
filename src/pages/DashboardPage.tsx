
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Eye, ThumbsUp, Video, Clock, TrendingUp } from 'lucide-react';

export const DashboardPage = () => {
  const { user, isGuest } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['user-stats', user?.id],
    queryFn: async () => {
      if (isGuest || !user) return null;

      // Get watch history count
      const { count: watchCount } = await supabase
        .from('watch_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get total watch time
      const { data: watchTime } = await supabase
        .from('watch_history')
        .select('watch_duration')
        .eq('user_id', user.id);

      // Get uploaded videos count
      const { count: videosCount } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true })
        .eq('uploader_id', user.id);

      // Get total views on uploaded videos
      const { data: videoStats } = await supabase
        .from('videos')
        .select('views_count, likes_count')
        .eq('uploader_id', user.id);

      // Get recent activity
      const { data: recentVideos } = await supabase
        .from('watch_history')
        .select(`
          *,
          videos(title, thumbnail_url)
        `)
        .eq('user_id', user.id)
        .order('watched_at', { ascending: false })
        .limit(5);

      const totalWatchTime = watchTime?.reduce((sum, item) => sum + (item.watch_duration || 0), 0) || 0;
      const totalViews = videoStats?.reduce((sum, video) => sum + (video.views_count || 0), 0) || 0;
      const totalLikes = videoStats?.reduce((sum, video) => sum + (video.likes_count || 0), 0) || 0;

      return {
        watchedVideos: watchCount || 0,
        totalWatchTime: Math.floor(totalWatchTime / 60), // in minutes
        uploadedVideos: videosCount || 0,
        totalViews,
        totalLikes,
        recentVideos: recentVideos || []
      };
    },
    enabled: !!user && !isGuest,
  });

  if (isGuest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black p-8">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-4">Dashboard</h1>
          <p className="text-gray-400 mb-6">Sign in to view your dashboard</p>
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
          <BarChart3 className="h-8 w-8 text-purple-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="bg-gray-900/50 border-purple-500/20 animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-8 bg-gray-700 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Videos Watched</CardTitle>
                  <Eye className="h-4 w-4 text-cyan-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats?.watchedVideos || 0}</div>
                  <p className="text-xs text-gray-400">Total videos viewed</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Watch Time</CardTitle>
                  <Clock className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats?.totalWatchTime || 0}m</div>
                  <p className="text-xs text-gray-400">Minutes watched</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Uploaded Videos</CardTitle>
                  <Video className="h-4 w-4 text-pink-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats?.uploadedVideos || 0}</div>
                  <p className="text-xs text-gray-400">Your content</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Views</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats?.totalViews || 0}</div>
                  <p className="text-xs text-gray-400">On your videos</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-gray-400">Your latest watched videos</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats?.recentVideos && stats.recentVideos.length > 0 ? (
                    <div className="space-y-4">
                      {stats.recentVideos.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <img
                            src={item.videos?.thumbnail_url || 'https://via.placeholder.com/60x40'}
                            alt={item.videos?.title}
                            className="w-16 h-10 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                              {item.videos?.title || 'Unknown Video'}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(item.watched_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No recent activity</p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-purple-500/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Quick Stats</CardTitle>
                  <CardDescription className="text-gray-400">Your engagement overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Likes Received</span>
                    <span className="text-white font-semibold">{stats?.totalLikes || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Average Watch Time</span>
                    <span className="text-white font-semibold">
                      {stats?.watchedVideos ? Math.round((stats?.totalWatchTime || 0) / stats.watchedVideos) : 0}m
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Content Created</span>
                    <span className="text-white font-semibold">{stats?.uploadedVideos || 0} videos</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
