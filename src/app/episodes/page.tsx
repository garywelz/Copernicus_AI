'use client';

import React from 'react';
import { EpisodeList } from '@/components/episodes/EpisodeList';

// Sample data - replace with real data later
const sampleEpisodes = [
  {
    id: '1',
    title: 'Understanding Large Language Models',
    description: 'An in-depth look at how large language models work and their impact on AI research.',
    thumbnailUrl: '/images/episode-1-thumb.jpg',
    duration: '32:15',
    date: '2024-01-15',
    url: 'https://youtube.com/watch?v=...'
  },
  {
    id: '2',
    title: 'The Future of AI Research',
    description: 'Exploring upcoming trends and breakthrough possibilities in artificial intelligence.',
    thumbnailUrl: '/images/episode-2-thumb.jpg',
    duration: '28:45',
    date: '2024-01-22',
    url: 'https://youtube.com/watch?v=...'
  }
];

export default function EpisodesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Episodes</h1>
      <EpisodeList episodes={sampleEpisodes} />
    </div>
  );
} 