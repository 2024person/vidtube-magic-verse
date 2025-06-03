
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, ThumbsUp, Clock, TrendingUp, Users, Video } from 'lucide-react';

export const DashboardPage = () => {
  const { user, isGuest } = useAuth();
  const [stats, setStats] = useState({
    totalWatched: 0,
    totalWatchTime: 0,
    totalLikes: 0,
    subscribedChannels: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isGuest && user) {
      fetchUserStats();
    } else {
      setLoading(false);
    }
  }, [user, isGuest]);

  const fetchUserStats = async () => {
    try {
      // Fetch watch history count and total watch time
      const { data: watchData, error: watchError } = await supabase
        .from('watch_history')
        .select('watch_duration')
        .eq('user_id', user.id);

      if (watchError) throw watchError;

      const totalWatched = watchData?.length || 0;
      const totalWatchTime = watchData?.reduce((sum, entry) => sum + (entry.watch_duration || 0), 0) || 0;

      // Fetch likes count
      const { count: likesCount, error: likesError } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_like', true);

      if (likesError) throw likesError;

      // Fetch subscriptions count
      const { count: subsCount, error: subsError } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('subscriber_id', user.id);

      if (subsError) throw subsError;

      // Fetch recent activity
      const { data: recentData, error: recentError } = await supabase
        .from('watch_history')
        .select(`
          *,
          videos (
            title,
            thumbnail_url,
            profiles:uploader_id(username)
          )
        `)
        .eq('user_id', user.id)
        .order('watched_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      setStats({
        totalWatched,
        totalWatchTime,
        totalLikes: likesCount || 0,
        subscribedChannels: subsCount || 0,
        recentActivity: recentData || []
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatWatchTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
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
              Dashboard
            </h1>
            <p className="text-cyan-200 mb-6">Sign in to view your dashboard and statistics</p>
            <a 
              href="/auth" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-300"
            >
              Sign In
            </a>
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
          Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-cyan-500/30 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-cyan-400">Videos Watched</CardTitle>
              <Video className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalWatched}</div>
              <p className="text-xs text-gray-400">Total videos watched</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-purple-500/30 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-400">Watch Time</CardTitle>
              <Clock className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatWatchTime(stats.totalWatchTime)}</div>
              <p className="text-xs text-gray-400">Total watch time</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-pink-500/30 backdrop-blur-sm hover:border-pink-500/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-pink-400">Likes Given</CardTitle>
              <ThumbsUp className="h-4 w-4 text-pink-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalLikes}</div>
              <p className="text-xs text-gray-400">Videos you liked</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-green-500/30 backdrop-blur-sm hover:border-green-500/50 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-400">Subscriptions</CardTitle>
              <Users className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.subscribedChannels}</div>
              <p className="text-xs text-gray-400">Subscribed channels</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-gray-900/50 border-cyan-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-gray-400">
              Your latest watched videos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <Eye className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
                    <div className="w-16 h-12 bg-gray-700 rounded overflow-hidden">
                      <img
                        src={activity.videos.thumbnail_url || 'https://via.placeholder.com/320x180?text=Video'}
                        alt={activity.videos.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium line-clamp-1">{activity.videos.title}</h4>
                      <p className="text-sm text-gray-400">{activity.videos.profiles?.username || 'Unknown Channel'}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(activity.watched_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
