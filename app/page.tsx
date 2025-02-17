'use client';

import React from 'react';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { EpisodeList } from '@/components/episodes/EpisodeList';
import { useEpisodes } from '@/hooks/useEpisodes';

export default function Home() {
  const { episodes, isLoading, error } = useEpisodes();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Copernicus AI</h1>
          <p className="mt-2 text-xl text-gray-600">
            Making AI Research Accessible Through Engaging Podcasts
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Latest Episodes</h2>
          <EpisodeList 
            episodes={episodes} 
            isLoading={isLoading} 
            error={error} 
          />
        </section>
      </main>
      <Footer />
    </div>
  );
} 