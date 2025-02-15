'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Episode, EpisodeList } from '@/types/episode';

export function useEpisodes() {
  const [episodes, setEpisodes] = useState<EpisodeList>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEpisodes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/episodes');
      if (!response.ok) throw new Error('Failed to fetch episodes');
      const data = await response.json();
      setEpisodes(data);
    } catch (err) {
      setError('Failed to fetch episodes');
      console.error('Error fetching episodes:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEpisodes();
  }, [fetchEpisodes]);

  return { episodes, isLoading, error, retry: fetchEpisodes };
} 