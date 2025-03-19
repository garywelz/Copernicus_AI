'use client';

import React from 'react';
import { useSpotifyEpisodes } from '@/hooks/useSpotifyEpisodes';
import EpisodeCard from './EpisodeCard';
import LoadingSpinner from './LoadingSpinner';

/**
 * Component to display episodes grouped by subject
 */
export default function EpisodesBySubject() {
  const { episodesBySubject, isLoading, error } = useSpotifyEpisodes();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md my-4">
        <p>Error loading episodes: {error}</p>
        <p className="text-sm mt-2">Please try refreshing the page.</p>
      </div>
    );
  }

  // If there are no episodes or the object is empty
  if (!episodesBySubject || Object.keys(episodesBySubject).length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md my-4">
        <p>No episodes found.</p>
        <p className="text-sm mt-2">Check back soon for new content!</p>
      </div>
    );
  }

  // Sort subjects alphabetically, but put "featured" first if it exists
  const sortedSubjects = Object.keys(episodesBySubject).sort((a, b) => {
    if (a === 'featured') return -1;
    if (b === 'featured') return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="space-y-12">
      {sortedSubjects.map((subject) => (
        <div key={subject} className="mb-8">
          <h2 className="text-2xl font-bold mb-6 capitalize border-b pb-2">
            {subject === 'featured' ? 'Featured Episodes' : `${subject} Episodes`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {episodesBySubject[subject].map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 