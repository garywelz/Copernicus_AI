'use client';

import { useState, useEffect } from 'react';
import type { Episode } from '@/types/episode';
import { PodcastPlatformDistributor } from '@/services/podcast/PodcastPlatformDistributor';
import type { PodcastFeed, PodcastEpisode } from '@/types/podcast';

export function useEpisodes() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEpisodes() {
      try {
        const distributor = new PodcastPlatformDistributor();
        const feed: PodcastFeed = await distributor.generateRssFeed({
          title: "Copernicus AI",
          description: "Making AI Research Accessible",
          language: "en",
          episodes: []
        });
        
        // Convert feed to episodes
        const convertedEpisodes: Episode[] = feed.episodes.map(ep => ({
          id: ep.id || String(Date.now()),
          title: ep.title,
          description: ep.description || '',
          thumbnailUrl: ep.thumbnailUrl || '/images/default-thumbnail.jpg',
          duration: ep.duration || '0:00',
          date: ep.date || new Date().toISOString(),
          url: ep.url,
          audioUrl: ep.audioUrl
        }));
        
        setEpisodes(convertedEpisodes);
      } catch (err) {
        setError('Failed to fetch episodes');
      } finally {
        setIsLoading(false);
      }
    }

    fetchEpisodes();
  }, []);

  return { episodes, isLoading, error };
} 