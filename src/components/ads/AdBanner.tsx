
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface Ad {
  id: string;
  title: string;
  content?: string;
  image_url?: string;
  click_url?: string;
  ad_type: string;
}

interface AdBannerProps {
  ad: Ad;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ ad, className }) => {
  if (!ad) {
    return null;
  }

  const handleClick = () => {
    if (ad.click_url) {
      window.open(ad.click_url, '_blank');
    }
  };

  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-shadow border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 ${className}`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-yellow-600 font-medium bg-yellow-100 px-2 py-1 rounded">
            Sponsored
          </span>
          {ad.click_url && (
            <ExternalLink className="h-4 w-4 text-gray-400" />
          )}
        </div>
        
        {ad.image_url && (
          <div className="mb-3 rounded-lg overflow-hidden">
            <img
              src={ad.image_url}
              alt={ad.title}
              className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <h3 className="font-semibold text-sm mb-1">{ad.title}</h3>
        {ad.content && (
          <p className="text-xs text-gray-600 line-clamp-2">{ad.content}</p>
        )}
      </CardContent>
    </Card>
  );
};
