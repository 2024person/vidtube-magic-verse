
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Play, Eye, ThumbsUp, Clock } from 'lucide-react';

export const VideoCard = ({ video, className }) => {
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

  const formatCreatedAt = (dateString) => {
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

  return (
    <Card className={`group cursor-pointer hover:shadow-2xl transition-all duration-300 bg-gray-900/50 border-cyan-500/30 backdrop-blur-sm hover:border-purple-500/50 hover:shadow-cyan-500/20 ${className}`}>
      <Link to={`/watch/${video.id}`}>
        <div className="relative overflow-hidden rounded-t-lg bg-gray-800 aspect-video">
          <img
            src={video.thumbnail_url || 'https://via.placeholder.com/320x180?text=Video'}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target;
              target.src = 'https://via.placeholder.com/320x180?text=Video';
            }}
          />
          
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-cyan-400 text-xs px-2 py-1 rounded flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(video.duration)}
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Play className="h-8 w-8 text-white fill-white" />
            </div>
          </div>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-9 w-9 flex-shrink-0 border border-cyan-500/20">
            <AvatarImage src="" alt={video.uploader_username} />
            <AvatarFallback className="text-xs bg-gradient-to-r from-cyan-500 to-purple-500 text-white">
              {video.uploader_username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <Link to={`/watch/${video.id}`}>
              <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-cyan-400 transition-colors mb-1 text-white">
                {video.title}
              </h3>
            </Link>
            
            <p className="text-xs text-cyan-300 mb-1 hover:text-cyan-400 transition-colors">{video.uploader_username}</p>
            
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
                <Eye className="h-3 w-3" />
                {formatViews(video.views_count)}
              </div>
              <div className="flex items-center gap-1 hover:text-purple-400 transition-colors">
                <ThumbsUp className="h-3 w-3" />
                {video.likes_count}
              </div>
              <span className="hover:text-cyan-400 transition-colors">
                {formatCreatedAt(video.created_at)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
