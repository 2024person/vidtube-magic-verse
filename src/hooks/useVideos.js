
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export const useVideos = (searchQuery, genre) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['videos', searchQuery, genre],
    queryFn: async () => {
      let query = supabase
        .from('videos')
        .select(`
          *,
          profiles:uploader_id(username)
        `)
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      if (genre) {
        query = query.eq('genre', genre);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data?.map(video => ({
        ...video,
        uploader_username: video.profiles?.username || 'Unknown'
      })) || [];
    },
  });
};

export const useRecommendedVideos = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['recommended-videos', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        // If no user, get trending videos
        const { data, error } = await supabase
          .from('videos')
          .select(`
            *,
            profiles:uploader_id(username)
          `)
          .order('views_count', { ascending: false })
          .limit(10);

        if (error) throw error;

        return data?.map(video => ({
          ...video,
          uploader_username: video.profiles?.username || 'Unknown'
        })) || [];
      }

      // Use the database function for personalized recommendations
      const { data, error } = await supabase.rpc('get_recommended_videos', {
        user_id: user.id,
        limit_count: 10
      });

      if (error) throw error;
      return data || [];
    },
    enabled: true,
  });
};
