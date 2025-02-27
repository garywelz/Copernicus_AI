'use client';

import React from 'react';
import Image from 'next/image';
import type { Episode } from '@/types/episode';

type EpisodeCardProps = Episode;

export function EpisodeCard({
  title,
  description,
  thumbnailUrl,
  videoUrl
}: EpisodeCardProps) {
  const handleYouTubeClick = () => {
    if (videoUrl) {
      window.open(videoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {thumbnailUrl && (
        <div className="relative w-full h-48">
          <Image 
            src={thumbnailUrl}
            alt={title}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      )}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-700 mb-4">{description}</p>
        
        <button
          onClick={handleYouTubeClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Listen Now
        </button>
      </div>
    </div>
  );
} 