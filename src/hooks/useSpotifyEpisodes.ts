'use client';

import { useState, useEffect } from 'react';
import type { Episode } from '@/types/episode';

interface SpotifyEpisode {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  duration_ms: number;
  release_date: string;
  external_urls: { spotify: string };
  uri: string;
  subject?: string; // Custom field we'll add for categorization
}

export function useSpotifyEpisodes() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [episodesBySubject, setEpisodesBySubject] = useState<Record<string, Episode[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subject mapping based on episode title patterns
  const SUBJECT_MAPPING: Record<string, string[]> = {
    'math': ['Math News', 'Continuum Hypothesis', 'Gödel', 'Peano', 'Poincaré', 'Mathematical Logic'],
    'physics': ['Physics News', 'Black Holes', 'Higgs Boson', 'String Theory', 'Quantum Entanglement'],
    'biology': ['Biology News', 'Organoids', 'Spatial Biology', 'Synthetic Biology'],
    'chemistry': ['Chemistry News', 'Green Chemistry', 'CRISPR Chemistry', 'Molecular Machines', 'Catalysis'],
    'computer-science': ['Computer Science', 'Edge Computing', 'Neuromorphic', 'Quantum Machine Learning', 'Cryptography', 'AI'],
    'science': ['Science News']
  };

  // Helper function to determine subject based on episode title
  const getSubject = (title: string): string => {
    for (const [subject, patterns] of Object.entries(SUBJECT_MAPPING)) {
      if (patterns.some(pattern => title.includes(pattern))) {
        return subject;
      }
    }
    return 'uncategorized';
  };

  // Format duration from milliseconds to MM:SS
  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    async function fetchEpisodes() {
      try {
        // In a real implementation, you would fetch this from your backend
        // which would use the Spotify API with proper authentication
        // For now, we'll use a static JSON file with your Spotify episodes
        const response = await fetch('/api/spotify-episodes');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch episodes: ${response.statusText}`);
        }
        
        const data: SpotifyEpisode[] = await response.json();
        
        // Map Spotify episodes to our Episode format
        const mappedEpisodes = data.map((spotifyEpisode): Episode => {
          const subject = getSubject(spotifyEpisode.name);
          
          return {
            id: spotifyEpisode.id,
            title: spotifyEpisode.name,
            description: spotifyEpisode.description,
            thumbnailUrl: spotifyEpisode.images[0]?.url || '',
            duration: formatDuration(spotifyEpisode.duration_ms),
            date: spotifyEpisode.release_date,
            url: spotifyEpisode.id,
            audioUrl: spotifyEpisode.external_urls.spotify,
            spotifyUrl: spotifyEpisode.external_urls.spotify,
            spotifyUri: spotifyEpisode.uri,
            isFeatured: false, // You can set this based on your criteria
            subject
          };
        });
        
        setEpisodes(mappedEpisodes);
        
        // Group episodes by subject
        const grouped = mappedEpisodes.reduce((acc: Record<string, Episode[]>, episode: Episode) => {
          const subject = episode.subject || 'uncategorized';
          if (!acc[subject]) {
            acc[subject] = [];
          }
          acc[subject].push(episode);
          return acc;
        }, {});
        
        setEpisodesBySubject(grouped);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching episodes:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    }

    fetchEpisodes();
  }, []);

  return { episodes, episodesBySubject, isLoading, error };
} 