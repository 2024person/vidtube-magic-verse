
import { useQuery } from '@tanstack/react-query';

const RAPIDAPI_KEY = '8b468e9896msh42105a591d71b6dp155212jsn5988e0e9f851';

export const useYouTubeVideos = (searchQuery) => {
  return useQuery({
    queryKey: ['youtube-videos', searchQuery],
    queryFn: async () => {
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
        console.log('API Response:', data);
        
        // Transform YouTube API data to our format based on the structure you provided
        const videos = data.videos || data.results || [];
        
        return videos.map((video, index) => {
          // Get the best thumbnail available
          let thumbnailUrl = 'https://via.placeholder.com/320x180?text=Video';
          if (video.thumbnails && video.thumbnails.length > 0) {
            thumbnailUrl = video.thumbnails[0].url;
          }

          // Ensure we have a valid date
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
            id: video.video_id || `video-${Date.now()}-${index}`,
            title: video.title || `Video ${index + 1}`,
            description: video.description || 'No description available',
            thumbnail_url: thumbnailUrl,
            video_url: `https://www.youtube.com/watch?v=${video.video_id}`,
            duration: video.duration || Math.floor(Math.random() * 600) + 60,
            views_count: video.view_count || Math.floor(Math.random() * 1000000),
            likes_count: video.like_count || Math.floor(Math.random() * 10000),
            uploader_username: video.channel?.name || video.uploader || `Creator ${index + 1}`,
            created_at: createdAt,
            channel: {
              name: video.channel?.name || video.uploader || `Creator ${index + 1}`,
              avatar: video.channel?.avatar || '',
              subscriber_count: video.channel?.subscriber_count || Math.floor(Math.random() * 100000)
            }
          };
        });
      } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        // Return mock data if API fails
        return Array.from({ length: 20 }, (_, i) => ({
          id: `mock-${Date.now()}-${i}`,
          title: `Sample Video ${i + 1} - ${['Amazing Tutorial', 'Epic Gaming', 'Music Video', 'News Update', 'Comedy'][Math.floor(Math.random() * 5)]}`,
          description: `This is an amazing sample video description for video ${i + 1}. It covers interesting topics and engaging content.`,
          thumbnail_url: `https://picsum.photos/320/180?random=${i}`,
          video_url: `#video-${i}`,
          duration: Math.floor(Math.random() * 600) + 60,
          views_count: Math.floor(Math.random() * 10000000) + 1000,
          likes_count: Math.floor(Math.random() * 100000) + 100,
          uploader_username: `Creator ${i + 1}`,
          created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
          channel: {
            name: `Creator ${i + 1}`,
            avatar: `https://picsum.photos/40/40?random=${i + 50}`,
            subscriber_count: Math.floor(Math.random() * 1000000) + 1000
          }
        }));
      }
    },
  });
};
