'use client';

import React from 'react';
import { EpisodeCard } from '../src/components/episodes/EpisodeCard';

const sampleEpisode = {
  id: '1',
  title: 'Understanding Black Holes',
  description: 'A mathematical exploration of black holes and their properties.',
  thumbnailUrl: 'https://img.youtube.com/vi/DB-5I8iuL3A/maxresdefault.jpg',
  videoUrl: 'https://www.youtube.com/watch?v=DB-5I8iuL3A',
};

export default function Home() {
  return (
    <main className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Copernicus AI</h1>
        <p className="text-xl text-gray-600">
          Keeping Current With Engaging AI Podcasts
        </p>
      </div>
      <div className="max-w-2xl mx-auto">
        <EpisodeCard {...sampleEpisode} />
      </div>
    </main>
  );
} 