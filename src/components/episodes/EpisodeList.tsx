'use client';

import React from 'react';
import { EpisodeCard } from './EpisodeCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import type { Episode } from '@/types/episode';

interface EpisodeListProps {
  episodes: Episode[];
  isLoading?: boolean;
  error?: string | null;
}

export function EpisodeList({ episodes, isLoading, error }: EpisodeListProps) {
  if (isLoading) {
    return (
      <div className="py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {episodes.map((episode) => (
          <EpisodeCard
            key={episode.id}
            title={episode.title}
            description={episode.description}
            thumbnailUrl={episode.thumbnailUrl}
            duration={episode.duration}
            date={episode.date}
            url={episode.url}
          />
        ))}
        {episodes.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">
              No episodes available yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
} 