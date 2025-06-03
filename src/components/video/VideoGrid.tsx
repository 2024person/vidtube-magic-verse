
import React from 'react';
import { VideoCard } from './VideoCard';

interface Video {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  duration?: number;
  views_count: number;
  likes_count: number;
  uploader_username?: string;
  created_at: string;
}

interface VideoGridProps {
  videos: Video[];
  loading?: boolean;
}

export const VideoGrid: React.FC<VideoGridProps> = ({ videos, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-video rounded-lg mb-4"></div>
            <div className="flex gap-3">
              <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No videos found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or browse different categories</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};
