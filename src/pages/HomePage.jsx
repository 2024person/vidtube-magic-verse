
import React from 'react';
import { VideoGrid } from '@/components/video/VideoGrid';
import { AdBanner } from '@/components/ads/AdBanner';
import { useYouTubeVideos } from '@/hooks/useYouTubeVideos';
import { useAds } from '@/hooks/useAds';
import { useAuth } from '@/components/auth/AuthProvider';

export const HomePage = ({ searchQuery }) => {
  const { data: videos, isLoading } = useYouTubeVideos(searchQuery);
  const { data: ads } = useAds();
  const { user, isGuest } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/80 to-black">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/10 via-transparent to-purple-900/10"></div>
      <div className="container mx-auto px-4 py-6 relative z-10">
        {!searchQuery && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {isGuest ? 'Trending Videos' : 'Welcome back!'}
            </h1>
            {ads && ads.length > 0 && <AdBanner ad={ads[0]} />}
          </div>
        )}
        
        {searchQuery && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">
              Search results for "<span className="text-cyan-400">{searchQuery}</span>"
            </h2>
          </div>
        )}

        <VideoGrid videos={videos || []} loading={isLoading} />
        
        {!isLoading && videos && videos.length > 6 && ads && ads.length > 1 && (
          <div className="mt-8">
            <AdBanner ad={ads[1]} />
          </div>
        )}
      </div>
    </div>
  );
};
