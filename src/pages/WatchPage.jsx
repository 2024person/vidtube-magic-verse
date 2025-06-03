
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { ThumbsUp, ThumbsDown, Share, Bell, Eye, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

export const WatchPage = () => {
  const { id } = useParams();
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (isGuest) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to watch videos",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    fetchVideo();
    if (user) {
      checkUserInteractions();
      recordWatchHistory();
    }
  }, [id, user, isGuest]);

  const fetchVideo = async () => {
    try {
      // For now, we'll use mock data since we're using YouTube API
      // In a real app, you'd fetch from your database
      setVideo({
        id: id,
        title: "Sample Video Title",
        description: "This is a sample video description that would normally come from your database or the YouTube API.",
        video_url: `https://www.youtube.com/embed/${id}`,
        views_count: Math.floor(Math.random() * 1000000),
        likes_count: Math.floor(Math.random() * 10000),
        dislikes_count: Math.floor(Math.random() * 1000),
        uploader_username: "Sample Creator",
        created_at: new Date().toISOString(),
        duration: 180,
      });
    } catch (error) {
      console.error('Error fetching video:', error);
      toast({
        title: "Error",
        description: "Failed to load video",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkUserInteractions = async () => {
    if (!user || !video) return;

    try {
      // Check if user liked/disliked the video
      const { data: likeData } = await supabase
        .from('likes')
        .select('is_like')
        .eq('user_id', user.id)
        .eq('video_id', video.id)
        .maybeSingle();

      if (likeData) {
        setLiked(likeData.is_like);
        setDisliked(!likeData.is_like);
      }

      // Check if user is subscribed to the channel
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('subscriber_id', user.id)
        .eq('channel_id', video.uploader_id)
        .maybeSingle();

      setSubscribed(!!subData);
    } catch (error) {
      console.error('Error checking user interactions:', error);
    }
  };

  const recordWatchHistory = async () => {
    if (!user || !video) return;

    try {
      await supabase.from('watch_history').insert({
        user_id: user.id,
        video_id: video.id,
        watch_duration: 0, // This would be updated as the user watches
      });

      // Increment view count
      await supabase.rpc('increment_video_views', { video_id: video.id });
    } catch (error) {
      console.error('Error recording watch history:', error);
    }
  };

  const handleLike = async (isLike) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like videos",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('likes')
        .upsert({
          user_id: user.id,
          video_id: video.id,
          is_like: isLike,
        });

      if (error) throw error;

      setLiked(isLike);
      setDisliked(!isLike);

      toast({
        title: "Success",
        description: isLike ? "Video liked!" : "Video disliked!",
      });
    } catch (error) {
      console.error('Error liking video:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe",
        variant: "destructive",
      });
      return;
    }

    try {
      if (subscribed) {
        // Unsubscribe
        await supabase
          .from('subscriptions')
          .delete()
          .eq('subscriber_id', user.id)
          .eq('channel_id', video.uploader_id);
        
        setSubscribed(false);
        toast({
          title: "Unsubscribed",
          description: "You have unsubscribed from this channel",
        });
      } else {
        // Subscribe
        await supabase.from('subscriptions').insert({
          subscriber_id: user.id,
          channel_id: video.uploader_id,
        });
        
        setSubscribed(true);
        toast({
          title: "Subscribed",
          description: "You are now subscribed to this channel",
        });
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      });
    }
  };

  const formatViews = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/80 to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/80 to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Video not found</h2>
          <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-cyan-500 to-purple-500">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/80 to-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-purple-900/10"></div>
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Video Player */}
          <Card className="mb-6 bg-black/70 border-cyan-500/30 backdrop-blur-lg">
            <CardContent className="p-0">
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={video.video_url}
                  title={video.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Video Info */}
              <Card className="mb-6 bg-black/70 border-cyan-500/30 backdrop-blur-lg">
                <CardContent className="p-6">
                  <h1 className="text-2xl font-bold text-white mb-4">{video.title}</h1>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-gray-400">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{formatViews(video.views_count)} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDistanceToNow(new Date(video.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLike(true)}
                        className={`${liked ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'border-gray-600 text-gray-400 hover:border-cyan-500 hover:text-cyan-400'} transition-all duration-300`}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {formatViews(video.likes_count)}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLike(false)}
                        className={`${disliked ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-gray-600 text-gray-400 hover:border-red-500 hover:text-red-400'} transition-all duration-300`}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        {formatViews(video.dislikes_count)}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-400 hover:border-cyan-500 hover:text-cyan-400 transition-all duration-300"
                      >
                        <Share className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>

                  {/* Channel Info */}
                  <div className="flex items-center justify-between border-t border-gray-700 pt-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border border-cyan-500/30">
                        <AvatarImage src="" alt={video.uploader_username} />
                        <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white">
                          {video.uploader_username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-white">{video.uploader_username}</h3>
                        <p className="text-sm text-gray-400">1.2M subscribers</p>
                      </div>
                    </div>
                    
                    <Button
                      onClick={handleSubscribe}
                      className={`${subscribed 
                        ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                      } transition-all duration-300`}
                    >
                      <Bell className="h-4 w-4 mr-1" />
                      {subscribed ? 'Subscribed' : 'Subscribe'}
                    </Button>
                  </div>

                  {/* Description */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-white mb-2">Description</h4>
                    <p className="text-gray-300 leading-relaxed">{video.description}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Related Videos */}
            <div className="lg:col-span-1">
              <Card className="bg-black/70 border-cyan-500/30 backdrop-blur-lg">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-white mb-4">Related Videos</h3>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex gap-3 cursor-pointer hover:bg-gray-800/50 p-2 rounded transition-colors">
                        <div className="w-24 h-16 bg-gray-800 rounded flex-shrink-0"></div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-white line-clamp-2 mb-1">
                            Related Video Title {i}
                          </h4>
                          <p className="text-xs text-gray-400">Creator Name</p>
                          <p className="text-xs text-gray-400">{formatViews(Math.floor(Math.random() * 1000000))} views</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
