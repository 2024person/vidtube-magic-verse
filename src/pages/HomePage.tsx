
import React, { useState } from 'react';
import { VideoGrid } from '@/components/video/VideoGrid';
import { AdBanner } from '@/components/ads/AdBanner';
import { useRecommendedVideos } from '@/hooks/useVideos';
import { useAds } from '@/hooks/useAds';

interface HomePageProps {
  searchQuery?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ searchQuery }) => {
  const { data: videos, isLoading: videosLoading } = useRecommendedVideos();
  const { data: ads } = useAds();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8 rounded-xl">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Welcome to VidTube</h1>
          <p className="text-xl opacity-90">
            Discover amazing videos from creators around the world. 
            Upload, share, and enjoy unlimited entertainment.
          </p>
        </div>
      </div>

      {/* Ads Section */}
      {ads && ads.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Sponsored Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ads.map((ad) => (
              <AdBanner key={ad.id} ad={ad} />
            ))}
          </div>
        </div>
      )}

      {/* Videos Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {searchQuery ? `Search results for "${searchQuery}"` : 'Recommended for you'}
          </h2>
        </div>

        <VideoGrid videos={videos || []} loading={videosLoading} />
      </div>
    </div>
  );
};
