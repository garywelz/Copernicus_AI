import React from 'react';
import type { Episode } from '@/types/episode';
import Link from 'next/link';

type EpisodeCardProps = Episode;

export function EpisodeCard({
  title,
  description,
  videoUrl,
  url,
  date,
  duration
}: EpisodeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div className="text-sm text-gray-500 mb-3">
        <span>{new Date(date).toLocaleDateString()}</span>
        <span className="mx-2">•</span>
        <span>{duration}</span>
      </div>
      <p className="text-gray-700 mb-4 line-clamp-3">{description}</p>
      
      <div className="flex space-x-3">
        <Link 
          href={`/episodes/${url}`}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Listen Now
        </Link>
        
        {videoUrl && (
          <a 
            href={videoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded"
          >
            Watch on YouTube
          </a>
        )}
      </div>
    </div>
  );
} 