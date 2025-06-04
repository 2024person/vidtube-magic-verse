
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

export const AdBanner = ({ ad, className = '' }) => {
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
      className={`cursor-pointer hover:shadow-lg transition-all duration-300 border-cyan-500/30 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-sm hover:border-purple-500/50 hover:shadow-cyan-500/20 ${className}`}
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-cyan-400 font-medium bg-cyan-500/20 px-2 py-1 rounded border border-cyan-500/30">
            Sponsored
          </span>
          {ad.click_url && (
            <ExternalLink className="h-4 w-4 text-gray-400" />
          )}
        </div>
        
        {ad.image_url && (
          <div className="mb-3 rounded-lg overflow-hidden border border-cyan-500/20">
            <img
              src={ad.image_url}
              alt={ad.title}
              className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Fallback to a placeholder image if ad image fails to load
                e.target.src = 'https://via.placeholder.com/600x200/1a1a2e/16a085?text=Advertisement';
              }}
            />
          </div>
        )}
        
        <h3 className="font-semibold text-sm mb-1 text-white">{ad.title}</h3>
        {ad.content && (
          <p className="text-xs text-gray-300 line-clamp-2">{ad.content}</p>
        )}
      </CardContent>
    </Card>
  );
};
