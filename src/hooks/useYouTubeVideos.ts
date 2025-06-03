
import { useQuery } from '@tanstack/react-query';

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  duration: number;
  views_count: number;
  likes_count: number;
  uploader_username: string;
  created_at: string;
}

const RAPIDAPI_KEY = '8b468e9896msh42105a591d71b6dp155212jsn5988e0e9f851';

export const useYouTubeVideos = (searchQuery?: string) => {
  return useQuery({
    queryKey: ['youtube-videos', searchQuery],
    queryFn: async (): Promise<YouTubeVideo[]> => {
      try {
        const url = searchQuery 
          ? `https://youtube-v2.p.rapidapi.com/search/?query=${encodeURIComponent(searchQuery)}`
          : 'https://youtube-v2.p.rapidapi.com/trending/';
        
        const response = await fetch(url, {
          headers: {
            'X-RapidAPI-Host': 'youtube-v2.p.rapidapi.com',
            'X-RapidAPI-Key': RAPIDAPI_KEY,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch YouTube videos');
        }

        const data = await response.json();
        
        // Transform YouTube API data to our format
        return (data.videos || data.results || []).map((video: any) => ({
          id: video.video_id || video.id || Math.random().toString(),
          title: video.title || 'Untitled Video',
          description: video.description || '',
          thumbnail_url: video.thumbnail || video.thumbnails?.[0]?.url || 'https://via.placeholder.com/320x180?text=Video',
          video_url: `https://www.youtube.com/watch?v=${video.video_id || video.id}`,
          duration: video.duration || 0,
          views_count: video.view_count || Math.floor(Math.random() * 1000000),
          likes_count: video.like_count || Math.floor(Math.random() * 10000),
          uploader_username: video.channel?.name || video.uploader || 'Unknown Channel',
          created_at: video.published_time || new Date().toISOString(),
        }));
      } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        // Return mock data if API fails
        return Array.from({ length: 12 }, (_, i) => ({
          id: `mock-${i}`,
          title: `Sample Video ${i + 1}`,
          description: 'This is a sample video description',
          thumbnail_url: `https://picsum.photos/320/180?random=${i}`,
          video_url: '#',
          duration: Math.floor(Math.random() * 600) + 60,
          views_count: Math.floor(Math.random() * 1000000),
          likes_count: Math.floor(Math.random() * 10000),
          uploader_username: `Creator ${i + 1}`,
          created_at: new Date().toISOString(),
        }));
      }
    },
  });
};
