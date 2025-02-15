'use client';

import React from 'react';
import { EpisodeList } from '@/components/episodes/EpisodeList';
import { EpisodeCardSkeleton } from '@/components/episodes/EpisodeCardSkeleton';
import { useEpisodes } from '@/hooks/useEpisodes';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <EpisodeCardSkeleton key={i} />
      ))}
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <div className="text-center py-12">
      <p className="text-red-500 mb-4">{error}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );
}

export default function Home() {
  const { episodes, isLoading, error, retry } = useEpisodes();
  const featuredEpisodes = episodes.filter(episode => episode.isFeatured);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900">Copernicus AI</h1>
            <p className="mt-2 text-xl text-gray-600">
              Making AI Research Accessible Through Engaging Podcasts
            </p>
          </header>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Featured Episodes</h2>
            {isLoading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState error={error} onRetry={retry} />
            ) : (
              <EpisodeList episodes={featuredEpisodes} />
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Recent Episodes</h2>
            {isLoading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState error={error} onRetry={retry} />
            ) : (
              <EpisodeList episodes={episodes.slice(0, 6)} />
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
} 