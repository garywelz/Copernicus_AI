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
  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {episodes.map(episode => (
        <EpisodeCard key={episode.id} {...episode} />
      ))}
    </div>
  );
} 