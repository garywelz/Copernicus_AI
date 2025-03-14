import React from 'react';
import { EpisodeCard } from '../src/components/episodes/EpisodeCard';
import { sampleEpisodes } from '../src/data/sampleEpisodes';
import { PageLayout } from '@/components/layout/PageLayout';

export default function Home() {
  return (
    <PageLayout>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Copernicus AI</h1>
        <p className="text-xl text-gray-600">
          Keeping Current With Engaging AI Podcasts
        </p>
      </div>
      
      {/* Featured Episodes */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Featured Episodes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleEpisodes
            .filter(episode => episode.isFeatured)
            .map(episode => (
              <EpisodeCard key={episode.id} {...episode} />
            ))}
        </div>
      </div>
      
      {/* All Episodes */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">All Episodes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleEpisodes.map(episode => (
            <EpisodeCard key={episode.id} {...episode} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
} 