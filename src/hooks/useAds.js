
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export const useAds = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['ads', user?.id],
    queryFn: async () => {
      try {
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
        
        // If we have ads from database, return them
        if (data && data.length > 0) {
          return data;
        }
        
        // Fallback to mock ads with images
        return [
          {
            id: 'mock-ad-1',
            title: 'Discover Amazing Content',
            content: 'Join millions of users exploring the best videos online. Sign up today!',
            image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=200&fit=crop',
            click_url: 'https://example.com',
            ad_type: 'banner',
            is_active: true
          },
          {
            id: 'mock-ad-2',
            title: 'Premium Video Experience',
            content: 'Upgrade to premium for ad-free viewing and exclusive content.',
            image_url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&h=200&fit=crop',
            click_url: 'https://example.com/premium',
            ad_type: 'banner',
            is_active: true
          },
          {
            id: 'mock-ad-3',
            title: 'Create Your Channel',
            content: 'Start your journey as a content creator. Easy tools, great audience.',
            image_url: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=200&fit=crop',
            click_url: 'https://example.com/create',
            ad_type: 'banner',
            is_active: true
          }
        ];
      } catch (error) {
        console.error('Error fetching ads:', error);
        // Return mock ads as fallback
        return [
          {
            id: 'fallback-ad-1',
            title: 'Welcome to VidTube',
            content: 'Experience the best video platform with amazing features.',
            image_url: 'https://via.placeholder.com/600x200/1a1a2e/16a085?text=VidTube+Advertisement',
            click_url: '#',
            ad_type: 'banner',
            is_active: true
          }
        ];
      }
    },
  });
};
