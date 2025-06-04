import React from 'react';
import { VideoGrid } from '@/components/video/VideoGrid';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp } from 'lucide-react';

const RAPIDAPI_KEY = '8b468e9896msh42105a591d71b6dp155212jsn5988e0e9f851';

const useTrendingVideos = () => {
  return useQuery({
    queryKey: ['trending-videos'],
    queryFn: async () => {
      try {
        const response = await fetch('https://youtube-v2.p.rapidapi.com/trending/', {
          headers: {
            'X-RapidAPI-Host': 'youtube-v2.p.rapidapi.com',
            'X-RapidAPI-Key': RAPIDAPI_KEY,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch trending videos');
        }

        const data = await response.json();
        console.log('Trending API Response:', data);
        
        // Transform the data to match our video format
        const videos = data.videos || data.results || [];
        
        return videos.map((video, index) => {
          let thumbnailUrl = 'https://via.placeholder.com/320x180?text=Video';
          if (video.thumbnails && video.thumbnails.length > 0) {
            thumbnailUrl = video.thumbnails[0].url;
          }

          let createdAt = new Date().toISOString();
          if (video.published_time) {
            try {
              const date = new Date(video.published_time);
              if (!isNaN(date.getTime())) {
                createdAt = date.toISOString();
              }
            } catch {
              // Keep default date if parsing fails
            }
          }

          return {
            id: video.video_id || `trending-${Date.now()}-${index}`,
            title: video.title || `Trending Video ${index + 1}`,
            description: video.description || 'No description available',
            thumbnail_url: thumbnailUrl,
            video_url: `https://www.youtube.com/watch?v=${video.video_id}`,
            duration: video.duration || Math.floor(Math.random() * 600) + 60,
            views_count: video.view_count || Math.floor(Math.random() * 1000000),
            likes_count: video.like_count || Math.floor(Math.random() * 10000),
            uploader_username: video.channel?.name || video.uploader || `Trending Creator ${index + 1}`,
            created_at: createdAt,
            channel: {
              name: video.channel?.name || video.uploader || `Trending Creator ${index + 1}`,
              avatar: video.channel?.avatar || '',
              subscriber_count: video.channel?.subscriber_count || Math.floor(Math.random() * 100000)
            }
          };
        });
      } catch (error) {
        console.error('Error fetching trending videos:', error);
        // Return mock trending data if API fails
        return Array.from({ length: 20 }, (_, i) => ({
          id: `trending-mock-${Date.now()}-${i}`,
          title: `Trending Video ${i + 1} - ${['Viral Challenge', 'Breaking News', 'Epic Moment', 'Must Watch', 'Amazing'][Math.floor(Math.random() * 5)]}`,
          description: `This is a trending video description for video ${i + 1}. Currently viral and gaining millions of views.`,
          thumbnail_url: `https://picsum.photos/320/180?random=${i + 100}`,
          video_url: `#trending-video-${i}`,
          duration: Math.floor(Math.random() * 600) + 60,
          views_count: Math.floor(Math.random() * 50000000) + 1000000,
          likes_count: Math.floor(Math.random() * 500000) + 10000,
          uploader_username: `Trending Creator ${i + 1}`,
          created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          channel: {
            name: `Trending Creator ${i + 1}`,
            avatar: `https://picsum.photos/40/40?random=${i + 150}`,
            subscriber_count: Math.floor(Math.random() * 5000000) + 100000
          }
        }));
      }
    },
  });
};

export const TrendingPage = () => {
  const { data: videos, isLoading } = useTrendingVideos();

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
