
import React from 'react';
import { useAds } from '@/hooks/useAds';

export const AdBanner = ({ position = 'top' }) => {
  const { data: ads, isLoading } = useAds();

  if (isLoading) {
    return (
      <div className="w-full h-24 bg-gray-800/50 border border-cyan-500/30 rounded-lg animate-pulse flex items-center justify-center mb-6">
        <div className="text-cyan-400 text-sm">Loading ad...</div>
      </div>
    );
  }

  // Updated mock ads with actual images
  const mockAds = [
    {
      id: 'ad-1',
      title: 'Premium VidTube Pro',
      description: 'Upgrade to VidTube Pro for ad-free experience!',
      image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=728&h=90&fit=crop&crop=center',
      click_url: '#',
      position: 'top'
    },
    {
      id: 'ad-2',
      title: 'Amazing Product Deal',
      description: 'Get 50% off on amazing products. Limited time offer!',
      image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=728&h=90&fit=crop&crop=center',
      click_url: '#',
      position: 'top'
    },
    {
      id: 'ad-3',
      title: 'Learn Coding Online',
      description: 'Master programming with our interactive courses.',
      image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=728&h=90&fit=crop&crop=center',
      click_url: '#',
      position: 'top'
    }
  ];

  const currentAds = ads && ads.length > 0 ? ads : mockAds;
  const filteredAds = currentAds.filter(ad => ad.position === position);
  const selectedAd = filteredAds[Math.floor(Math.random() * filteredAds.length)];

  if (!selectedAd) return null;

  return (
    <div className="w-full mb-6">
      <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-cyan-500/30 rounded-lg overflow-hidden backdrop-blur-sm">
        <div className="flex items-center justify-between p-2">
          <span className="text-xs text-gray-400 uppercase tracking-wide">Advertisement</span>
          <button className="text-gray-400 hover:text-cyan-400 text-xs">×</button>
        </div>
        
        <a 
          href={selectedAd.click_url}
          className="block hover:opacity-80 transition-opacity"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="relative">
            <img
              src={selectedAd.image_url}
              alt={selectedAd.title}
              className="w-full h-24 object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/728x90/1a1a2e/16a085?text=Advertisement';
              }}
            />
          </div>
          
          <div className="p-3 bg-gray-900/70">
            <h3 className="text-cyan-400 font-semibold text-sm mb-1">{selectedAd.title}</h3>
            <p className="text-gray-300 text-xs">{selectedAd.description}</p>
          </div>
        </a>
      </div>
    </div>
  );
};
