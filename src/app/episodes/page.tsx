import React from 'react';
import EpisodesBySubject from '@/components/EpisodesBySubject';

export const metadata = {
  title: 'All Episodes | Copernicus AI Podcast',
  description: 'Browse all episodes of the Copernicus AI podcast, organized by subject.',
};

export default function EpisodesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Episodes</h1>
      <EpisodesBySubject />
    </div>
  );
} 