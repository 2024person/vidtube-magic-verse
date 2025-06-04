
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThumbsUp, ThumbsDown, Share, Bell, Eye } from 'lucide-react';

const RAPIDAPI_KEY = '8b468e9896msh42105a591d71b6dp155212jsn5988e0e9f851';

export const VideoPlayer = () => {
  const { id } = useParams();
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (isGuest) {
      navigate('/auth');
      return;
    }
    fetchVideoDetails();
    if (user) {
      recordWatchHistory();
      checkUserInteractions();
    }
  }, [id, user, isGuest]);

  const fetchVideoDetails = async () => {
    try {
      const response = await fetch(`https://youtube-v2.p.rapidapi.com/video/details?video_id=${id}`, {
        headers: {
          'X-RapidAPI-Host': 'youtube-v2.p.rapidapi.com',
          'X-RapidAPI-Key': RAPIDAPI_KEY,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch video details');
      }

      const data = await response.json();
      console.log('Video details:', data);
      
      setVideo({
        id: data.video_id || id,
        title: data.title || 'Video Title',
        description: data.description || 'No description available',
        view_count: data.view_count || 0,
        like_count: data.like_count || 0,
        channel: {
          name: data.channel?.name || 'Unknown Channel',
          subscriber_count: data.channel?.subscriber_count || 0,
          avatar: data.channel?.avatar?.[0]?.url || ''
        },
        thumbnails: data.thumbnails || [],
        duration: data.duration || 0
      });
    } catch (error) {
      console.error('Error fetching video details:', error);
      // Fallback to mock data
      setVideo({
        id: id,
        title: 'Sample Video',
        description: 'This is a sample video description.',
        view_count: Math.floor(Math.random() * 1000000),
        like_count: Math.floor(Math.random() * 10000),
        channel: {
          name: 'Sample Channel',
          subscriber_count: Math.floor(Math.random() * 100000),
          avatar: ''
        },
        thumbnails: [],
        duration: 300
      });
    } finally {
      setLoading(false);
    }
  };

  const recordWatchHistory = async () => {
    if (!user) return;
    
    try {
      await supabase
        .from('watch_history')
        .upsert({
          user_id: user.id,
          video_id: id,
          watched_at: new Date().toISOString(),
          watch_duration: 0
        });
    } catch (error) {
      console.error('Error recording watch history:', error);
    }
  };

  const checkUserInteractions = async () => {
    if (!user) return;

    try {
      // Check if user liked/disliked the video
      const { data: likeData } = await supabase
        .from('likes')
        .select('is_like')
        .eq('user_id', user.id)
        .eq('video_id', id)
        .single();

      if (likeData) {
        setLiked(likeData.is_like);
        setDisliked(!likeData.is_like);
      }
    } catch (error) {
      console.error('Error checking user interactions:', error);
    }
  };

  const handleLike = async () => {
    if (!user) return;

    try {
      if (liked) {
        // Remove like
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('video_id', id);
        setLiked(false);
      } else {
        // Add like
        await supabase
          .from('likes')
          .upsert({
            user_id: user.id,
            video_id: id,
            is_like: true
          });
        setLiked(true);
        setDisliked(false);
      }
    } catch (error) {
      console.error('Error handling like:', error);
    }
  };

  const handleDislike = async () => {
    if (!user) return;

    try {
      if (disliked) {
        // Remove dislike
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('video_id', id);
        setDisliked(false);
      } else {
        // Add dislike
        await supabase
          .from('likes')
          .upsert({
            user_id: user.id,
            video_id: id,
            is_like: false
          });
        setDisliked(true);
        setLiked(false);
      }
    } catch (error) {
      console.error('Error handling dislike:', error);
    }
  };

  const formatViews = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`;
    }
    return `${count} views`;
  };

  const formatSubscribers = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M subscribers`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K subscribers`;
    }
    return `${count} subscribers`;
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
          <div className="mb-6">
            <div className="aspect-video bg-black rounded-lg overflow-hidden border border-cyan-500/30 relative">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                title={video.title}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>

          {/* Video Info */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-cyan-500/30 mb-6">
            <h1 className="text-2xl font-bold text-white mb-4">{video.title}</h1>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Eye className="h-4 w-4" />
                <span>{formatViews(video.view_count)}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`flex items-center gap-2 ${liked ? 'text-cyan-400' : 'text-gray-400'} hover:text-cyan-400`}
                >
                  <ThumbsUp className="h-4 w-4" />
                  {video.like_count}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDislike}
                  className={`flex items-center gap-2 ${disliked ? 'text-red-400' : 'text-gray-400'} hover:text-red-400`}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-gray-400 hover:text-cyan-400"
                >
                  <Share className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            {/* Channel Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border border-cyan-500/30">
                  <AvatarImage src={video.channel.avatar} alt={video.channel.name} />
                  <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white">
                    {video.channel.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-semibold text-white">{video.channel.name}</h3>
                  <p className="text-sm text-gray-400">{formatSubscribers(video.channel.subscriber_count)}</p>
                </div>
              </div>
              
              <Button 
                className={`${subscribed ? 'bg-gray-600' : 'bg-gradient-to-r from-cyan-500 to-purple-500'} hover:from-cyan-600 hover:to-purple-600`}
                onClick={() => setSubscribed(!subscribed)}
              >
                <Bell className="h-4 w-4 mr-2" />
                {subscribed ? 'Subscribed' : 'Subscribe'}
              </Button>
            </div>

            {/* Description */}
            <div className="mt-6 bg-gray-800/50 rounded-lg p-4 border border-cyan-500/20">
              <p className="text-gray-300 whitespace-pre-wrap">{video.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
