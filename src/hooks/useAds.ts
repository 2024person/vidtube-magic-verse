
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export const useAds = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['ads', user?.id],
    queryFn: async () => {
      let query = supabase
        .from('ads')
        .select('*')
        .eq('is_active', true);

      if (user?.id) {
        // Get user's preferred genres for targeted ads
        const { data: profile } = await supabase
          .from('profiles')
          .select('preferred_genres')
          .eq('id', user.id)
          .single();

        if (profile?.preferred_genres && profile.preferred_genres.length > 0) {
          query = query.overlaps('target_genres', profile.preferred_genres);
        }
      }

      const { data, error } = await query.limit(3);

      if (error) throw error;
      return data || [];
    },
  });
};
