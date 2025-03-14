'use client';

import React from 'react';
import { EpisodeCard } from './EpisodeCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { Episode } from '@/types/episode';

interface EpisodeListProps {
  episodes: Episode[];
  isLoading?: boolean;
  error?: string | null;
}

export function EpisodeList({ episodes, isLoading, error }: EpisodeListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-12">
        {error}
      </div>
    );
  }
  
  return (
    <>
      {episodes.map(episode => (
        <div key={episode.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <EpisodeCard {...episode} />
        </div>
      ))}
    </>
  );
} 