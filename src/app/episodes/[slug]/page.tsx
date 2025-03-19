'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import SpotifyPlayer from '@/components/SpotifyPlayer';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { Episode } from '@/types/episode';

export default function EpisodePage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchEpisode() {
      try {
        // Fetch all episodes and find the one with matching slug
        const response = await fetch('/api/spotify-episodes');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch episodes: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Find the episode with the matching slug
        const foundEpisode = data.find((ep: any) => ep.id === slug);
        
        if (!foundEpisode) {
          throw new Error('Episode not found');
        }
        
        // Map to our Episode type
        const subject = getSubject(foundEpisode.name);
        
        setEpisode({
          id: foundEpisode.id,
          title: foundEpisode.name,
          description: foundEpisode.description,
          thumbnailUrl: foundEpisode.images[0]?.url || '',
          duration: formatDuration(foundEpisode.duration_ms),
          date: foundEpisode.release_date,
          url: foundEpisode.id,
          audioUrl: foundEpisode.external_urls.spotify,
          spotifyUrl: foundEpisode.external_urls.spotify,
          spotifyUri: foundEpisode.uri,
          isFeatured: false,
          subject
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching episode:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    }
    
    fetchEpisode();
  }, [slug]);
  
  // Helper function to determine subject based on episode title
  const getSubject = (title: string): string => {
    const SUBJECT_MAPPING: Record<string, string[]> = {
      'math': ['Math News', 'Continuum Hypothesis', 'Gödel', 'Peano', 'Poincaré', 'Mathematical Logic'],
      'physics': ['Physics News', 'Black Holes', 'Higgs Boson', 'String Theory', 'Quantum Entanglement'],
      'biology': ['Biology News', 'Organoids', 'Spatial Biology', 'Synthetic Biology'],
      'chemistry': ['Chemistry News', 'Green Chemistry', 'CRISPR Chemistry', 'Molecular Machines', 'Catalysis'],
      'computer-science': ['Computer Science', 'Edge Computing', 'Neuromorphic', 'Quantum Machine Learning', 'Cryptography', 'AI'],
      'science': ['Science News']
    };
    
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
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (error || !episode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>Error: {error || 'Episode not found'}</p>
          <p className="mt-4">
            <Link href="/episodes" className="text-blue-600 hover:underline">
              ← Back to all episodes
            </Link>
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/episodes" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to all episodes
      </Link>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 relative h-64 md:h-auto">
            <Image
              src={episode.thumbnailUrl}
              alt={episode.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              priority
              onError={(e) => {
                // Fallback image if the thumbnail fails to load
                const target = e.target as HTMLImageElement;
                target.src = '/images/podcast-placeholder.webp';
              }}
            />
          </div>
          
          <div className="md:w-2/3 p-6">
            <div className="flex flex-wrap justify-between items-start mb-4">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 md:mb-0 flex-grow">
                {episode.title}
              </h1>
              <span className="text-gray-600 whitespace-nowrap ml-2">
                {episode.duration}
              </span>
            </div>
            
            <div className="flex items-center text-gray-600 mb-6">
              <span className="mr-4">{episode.date}</span>
              <span className="capitalize px-3 py-1 bg-gray-100 rounded-full text-sm">
                {episode.subject.replace('-', ' ')}
              </span>
            </div>
            
            <div className="prose max-w-none mb-8">
              <p>{episode.description}</p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Listen to this episode</h2>
              <SpotifyPlayer 
                spotifyUri={episode.spotifyUri} 
                title={episode.title}
                height={232}
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <a 
                href={episode.spotifyUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-5 h-5 mr-2"
                >
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.059 14.406c-.192.192-.459.3-.726.3s-.534-.108-.726-.3a1.028 1.028 0 0 1 0-1.452c.192-.192.459-.3.726-.3s.534.108.726.3a1.028 1.028 0 0 1 0 1.452zm-6.6-1.8L5.294 10.44c-.192-.192-.3-.459-.3-.726s.108-.534.3-.726c.192-.192.459-.3.726-.3s.534.108.726.3l3.465 3.465L13.676 9c.192-.192.459-.3.726-.3s.534.108.726.3c.192.192.3.459.3.726s-.108.534-.3.726l-4.243 4.243c-.192.192-.459.3-.726.3s-.534-.108-.726-.3z" />
                </svg>
                Open in Spotify
              </a>
              
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: episode.title,
                      text: episode.description,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-5 h-5 mr-2"
                >
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16 6 12 2 8 6"></polyline>
                  <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
                Share Episode
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 