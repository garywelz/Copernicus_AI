'use client';

import React from 'react';
import type { Episode } from '@/types/episode';

type EpisodeCardProps = Episode;

export function EpisodeCard({
  title,
  description,
  videoUrl
}: EpisodeCardProps) {
  const handleYouTubeClick = () => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-700 mb-4">{description}</p>
      
      <a 
        href={videoUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
      >
        Listen Now
      </a>
    </div>
  );
} 