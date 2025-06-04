
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { ThumbsUp, ThumbsDown, Share, Bell, Eye, MessageCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const VideoPlayer = () => {
  const { id } = useParams();
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchVideoDetails();
    if (user) {
      recordWatchHistory();
      checkUserInteractions();
      fetchComments();
    }
  }, [id, user]);

  const fetchVideoDetails = async () => {
    try {
      // Mock video data since we don't have video details API
      setVideo({
        id: id,
        title: 'Amazing Video Content - Sample Title',
        description: 'This is an amazing video that you will love to watch. Don\'t forget to like, subscribe, and hit the notification bell! This video contains incredible content that will entertain and educate you.',
        view_count: Math.floor(Math.random() * 5000000) + 100000,
        like_count: Math.floor(Math.random() * 50000) + 1000,
        channel: {
          name: 'VidTube Creator',
          subscriber_count: Math.floor(Math.random() * 500000) + 10000,
          avatar: ''
        },
        thumbnails: [],
        duration: 300
      });
    } catch (error) {
      console.error('Error fetching video details:', error);
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

  const fetchComments = async () => {
    try {
      const { data: dbComments } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id(username, avatar_url)
        `)
        .eq('video_id', id)
        .order('created_at', { ascending: false });

      const mockComments = [
        {
          id: 'mock-1',
          content: 'This video is absolutely amazing! Great content as always.',
          user_id: 'mock-user-1',
          video_id: id,
          likes_count: 24,
          created_at: new Date().toISOString(),
          profiles: { username: 'VideoEnthusiast2024', avatar_url: '' }
        },
        {
          id: 'mock-2',
          content: 'Thanks for sharing this! Very informative and well-made.',
          user_id: 'mock-user-2',
          video_id: id,
          likes_count: 18,
          created_at: new Date(Date.now() - 1800000).toISOString(),
          profiles: { username: 'ContentLover', avatar_url: '' }
        }
      ];

      setComments([...(dbComments || []), ...mockComments]);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You need to sign in to like videos.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (liked) {
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('video_id', id);
        setLiked(false);
      } else {
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
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You need to sign in to dislike videos.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (disliked) {
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('video_id', id);
        setDisliked(false);
      } else {
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

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          user_id: user.id,
          video_id: id,
          content: newComment.trim()
        })
        .select(`
          *,
          profiles:user_id(username, avatar_url)
        `)
        .single();

      if (error) throw error;

      setComments([data, ...comments]);
      setNewComment('');
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully!",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
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
            <div className="flex items-center justify-between mb-6">
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
            <div className="bg-gray-800/50 rounded-lg p-4 border border-cyan-500/20">
              <p className="text-gray-300 whitespace-pre-wrap">{video.description}</p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 border border-cyan-500/30">
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle className="h-5 w-5 text-cyan-400" />
              <h2 className="text-xl font-semibold text-white">Comments ({comments.length})</h2>
            </div>

            {/* Add Comment */}
            {user && (
              <div className="mb-6">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 border border-cyan-500/30">
                    <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full bg-gray-800/50 border border-cyan-500/30 rounded-lg p-3 text-white placeholder-gray-400 resize-none focus:border-cyan-500 focus:outline-none"
                      rows="3"
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id} className="bg-gray-800/30 border-cyan-500/20">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8 border border-cyan-500/30">
                        <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs">
                          {comment.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-cyan-300">{comment.profiles?.username || 'Anonymous'}</span>
                          <span className="text-xs text-gray-400">2h ago</span>
                        </div>
                        <p className="text-gray-300 mb-2">{comment.content}</p>
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-cyan-400 p-0">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            {comment.likes_count || 0}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
