'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Episode } from '@/types/episode';
import SpotifyPlayer from './SpotifyPlayer';

interface EpisodeCardProps {
  episode: Episode;
}

export default function EpisodeCard({ episode }: EpisodeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={episode.thumbnailUrl}
          alt={episode.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          onError={(e) => {
            // Fallback image if the thumbnail fails to load
            const target = e.target as HTMLImageElement;
            target.src = '/images/podcast-placeholder.webp';
          }}
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{episode.title}</h3>
        
        <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
          <span>{episode.date}</span>
          <span>{episode.duration}</span>
        </div>
        
        <p className="text-gray-700 mb-4 line-clamp-3">{episode.description}</p>
        
        <SpotifyPlayer 
          spotifyUri={episode.spotifyUri} 
          title={episode.title}
          height={80}
        />
        
        <div className="mt-4 flex justify-between items-center">
          <Link 
            href={`/episodes/${episode.url}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Details
          </Link>
          
          <a 
            href={episode.spotifyUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-800 font-medium flex items-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="w-4 h-4 mr-1"
            >
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.059 14.406c-.192.192-.459.3-.726.3s-.534-.108-.726-.3a1.028 1.028 0 0 1 0-1.452c.192-.192.459-.3.726-.3s.534.108.726.3a1.028 1.028 0 0 1 0 1.452zm-6.6-1.8L5.294 10.44c-.192-.192-.3-.459-.3-.726s.108-.534.3-.726c.192-.192.459-.3.726-.3s.534.108.726.3l3.465 3.465L13.676 9c.192-.192.459-.3.726-.3s.534.108.726.3c.192.192.3.459.3.726s-.108.534-.3.726l-4.243 4.243c-.192.192-.459.3-.726.3s-.534-.108-.726-.3z" />
            </svg>
            Open in Spotify
          </a>
        </div>
      </div>
    </div>
  );
} 