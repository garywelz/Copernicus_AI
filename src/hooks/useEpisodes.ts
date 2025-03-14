'use client';

import { useState, useEffect } from 'react';
import type { Episode } from '@/types/episode';
import { sampleEpisodes } from '@/data/sampleEpisodes';

export function useEpisodes() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setEpisodes(sampleEpisodes);
      setIsLoading(false);
    }, 500);
  }, []);

  return { episodes, isLoading, error };
} 