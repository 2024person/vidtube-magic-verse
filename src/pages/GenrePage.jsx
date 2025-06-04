
import React from 'react';
import { useParams } from 'react-router-dom';
import { VideoGrid } from '@/components/video/VideoGrid';
import { useYouTubeVideos } from '@/hooks/useYouTubeVideos';

export const GenrePage = () => {
  const { genre } = useParams();
  const { data: videos, isLoading } = useYouTubeVideos(genre);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/80 to-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-purple-900/10"></div>
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent capitalize">
            {genre} Videos
          </h1>
          <p className="text-gray-400">Discover the best {genre} content on VidTube</p>
        </div>

        <VideoGrid videos={videos || []} loading={isLoading} />
      </div>
    </div>
  );
};
