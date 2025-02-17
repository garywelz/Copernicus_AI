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
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Copernicus AI</h1>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">Making AI Research Accessible Through Engaging Podcasts</h2>
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-6">Latest Episodes</h3>
          <EpisodeList 
            episodes={episodes} 
            isLoading={isLoading} 
            error={error} 
          />
        </section>
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-gray-500">© 2025 Copernicus AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 