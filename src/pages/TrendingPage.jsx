
import React from 'react';
import { VideoGrid } from '@/components/video/VideoGrid';
import { useYouTubeVideos } from '@/hooks/useYouTubeVideos';
import { TrendingUp } from 'lucide-react';

export const TrendingPage = () => {
  const { data: videos, isLoading } = useYouTubeVideos();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/80 to-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-purple-900/10"></div>
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="h-8 w-8 text-cyan-400" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Trending Now
          </h1>
        </div>

        <VideoGrid videos={videos || []} loading={isLoading} />
      </div>
    </div>
  );
};
