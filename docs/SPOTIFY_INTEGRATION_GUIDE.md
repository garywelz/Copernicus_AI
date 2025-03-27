# Copernicus AI Podcast: Spotify Integration Guide

This guide explains how to integrate your Spotify podcast content into your Vercel-deployed Next.js application.

## Overview

Instead of hosting large audio files directly on Vercel (which has size limitations), we'll leverage your existing Spotify podcast content. This approach has several advantages:

1. **No storage concerns**: Spotify hosts all your audio files
2. **Professional player**: Use Spotify's well-designed, feature-rich player
3. **Analytics**: Access Spotify's analytics for your podcast
4. **Discoverability**: Listeners can easily follow your podcast on Spotify
5. **Simplified deployment**: No need to manage large files in your Vercel deployment

## Implementation Steps

### 1. Set Up Your Spotify Podcast

If you haven't already, upload your podcast episodes to Spotify:

1. Create a Spotify for Podcasters account at [podcasters.spotify.com](https://podcasters.spotify.com/)
2. Set up your podcast show
3. Upload your episodes with proper metadata (titles, descriptions, images)
4. Note the Spotify URIs for each episode (format: `spotify:episode:EPISODE_ID`)

### 2. Update Your Next.js Application

#### Step 1: Create the Episode Type

Create or update your Episode type to include Spotify information:

```typescript
// src/types/episode.ts
export interface Episode {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  date: string;
  url: string;
  audioUrl: string;
  videoUrl?: string | null;
  descriptUrl?: string | null;
  isFeatured: boolean;
  transcript?: string;
  subject?: string;
  spotifyUri?: string; // Spotify URI for embedding
}
```

#### Step 2: Create a Spotify Player Component

Create a component to embed the Spotify player:

```typescript
// src/components/SpotifyPlayer.tsx
'use client';

import { useEffect, useRef } from 'react';

interface SpotifyPlayerProps {
  spotifyUri: string;
  width?: number | string;
  height?: number | string;
  title?: string;
  allowTransparency?: boolean;
  allow?: string;
}

export default function SpotifyPlayer({
  spotifyUri,
  width = '100%',
  height = 152,
  title = 'Spotify Player',
  allowTransparency = true,
  allow = 'encrypted-media'
}: SpotifyPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Extract the episode ID from the Spotify URI
  const getEpisodeId = (uri: string): string => {
    if (uri.includes('spotify:episode:')) {
      return uri.split('spotify:episode:')[1];
    }
    if (uri.includes('/episode/')) {
      return uri.split('/episode/')[1].split('?')[0];
    }
    return uri;
  };
  
  const episodeId = getEpisodeId(spotifyUri);
  const embedUrl = `https://open.spotify.com/embed/episode/${episodeId}`;
  
  return (
    <div className="spotify-player-container">
      <iframe
        ref={iframeRef}
        src={embedUrl}
        width={width}
        height={height}
        frameBorder="0"
        title={title}
        allowTransparency={allowTransparency}
        allow={allow}
        loading="lazy"
        className="rounded-md shadow-md"
      ></iframe>
    </div>
  );
}
```

#### Step 3: Create a Hook to Load Spotify Episodes

Create a hook to load your Spotify episodes:

```typescript
// src/hooks/useSpotifyEpisodes.ts
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
  subject?: string;
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
            spotifyUri: spotifyEpisode.uri,
            isFeatured: false,
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
```

#### Step 4: Create an API Route for Spotify Episodes

Create an API route to serve your Spotify episodes:

```typescript
// src/app/api/spotify-episodes/route.ts
import { NextResponse } from 'next/server';

// In a production environment, you would fetch this from the Spotify API
// using the Spotify Web API with proper authentication
const spotifyEpisodes = [
  {
    id: '1',
    name: 'Math News - Episode 1',
    description: 'The premiere episode of Math News, covering the latest breakthroughs in mathematics.',
    images: [{ url: '/images/math-news-thumbnail.webp' }],
    duration_ms: 630000, // 10:30
    release_date: '2024-03-28',
    external_urls: { 
      spotify: 'https://open.spotify.com/episode/your-episode-id-1'
    },
    uri: 'spotify:episode:your-episode-id-1'
  },
  // Add all your episodes here
];

export async function GET() {
  return NextResponse.json(spotifyEpisodes);
}
```

#### Step 5: Create Components to Display Episodes

Create components to display your episodes:

```typescript
// src/components/EpisodeCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import SpotifyPlayer from './SpotifyPlayer';
import type { Episode } from '@/types/episode';

interface EpisodeCardProps {
  episode: Episode;
}

export default function EpisodeCard({ episode }: EpisodeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-video">
        <Image
          src={episode.thumbnailUrl}
          alt={episode.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={episode.isFeatured}
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold line-clamp-2">{episode.title}</h3>
          <span className="text-sm text-gray-500 whitespace-nowrap ml-2">{episode.duration}</span>
        </div>
        
        <p className={`text-gray-600 text-sm mb-4 ${isExpanded ? '' : 'line-clamp-3'}`}>
          {episode.description}
        </p>
        
        {episode.description && episode.description.length > 150 && (
          <button
            onClick={toggleExpand}
            className="text-blue-600 text-sm font-medium mb-4 hover:underline focus:outline-none"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
        
        {episode.spotifyUri && (
          <div className="mt-4">
            <SpotifyPlayer spotifyUri={episode.spotifyUri} />
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">{episode.date}</span>
          <Link
            href={`/episodes/${episode.url}`}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}
```

```typescript
// src/components/EpisodesBySubject.tsx
'use client';

import { useSpotifyEpisodes } from '@/hooks/useSpotifyEpisodes';
import EpisodeCard from './EpisodeCard';
import LoadingSpinner from './LoadingSpinner';

export default function EpisodesBySubject() {
  const { episodesBySubject, isLoading, error } = useSpotifyEpisodes();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <p>Error loading episodes: {error}</p>
        <p className="text-sm mt-2">Please try refreshing the page.</p>
      </div>
    );
  }

  // Sort subjects alphabetically, but put "math" first
  const sortedSubjects = Object.keys(episodesBySubject).sort((a, b) => {
    if (a === 'math') return -1;
    if (b === 'math') return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="space-y-12">
      {sortedSubjects.map((subject) => (
        <div key={subject} className="mb-8">
          <h2 className="text-2xl font-bold mb-6 capitalize border-b pb-2">
            {subject.replace('-', ' ')} Podcasts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {episodesBySubject[subject].map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

#### Step 6: Update Your Main Page

Update your main page to display episodes:

```typescript
// src/app/page.tsx
import EpisodesBySubject from '@/components/EpisodesBySubject';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Copernicus AI Podcast</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Exploring the frontiers of science, mathematics, and technology through engaging discussions and expert insights.
        </p>
      </div>
      
      <EpisodesBySubject />
    </main>
  );
}
```

### 3. Customize the API Route for Production

For a production environment, you should fetch episodes from the Spotify API:

1. Create a Spotify Developer account at [developer.spotify.com](https://developer.spotify.com/)
2. Create a new application to get a Client ID and Client Secret
3. Update your API route to use the Spotify Web API:

```typescript
// src/app/api/spotify-episodes/route.ts
import { NextResponse } from 'next/server';

// Cache the token to avoid unnecessary requests
let spotifyToken: string | null = null;
let tokenExpiry: number = 0;

async function getSpotifyToken() {
  // Check if we have a valid token
  if (spotifyToken && tokenExpiry > Date.now()) {
    return spotifyToken;
  }
  
  // Get a new token
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('Spotify credentials not configured');
  }
  
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    },
    body: 'grant_type=client_credentials'
  });
  
  if (!response.ok) {
    throw new Error(`Failed to get Spotify token: ${response.statusText}`);
  }
  
  const data = await response.json();
  spotifyToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in * 1000);
  
  return spotifyToken;
}

async function getShowEpisodes(showId: string) {
  const token = await getSpotifyToken();
  
  const response = await fetch(`https://api.spotify.com/v1/shows/${showId}/episodes?limit=50`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to get show episodes: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.items;
}

export async function GET() {
  try {
    // Replace with your Spotify show ID
    const showId = process.env.SPOTIFY_SHOW_ID;
    
    if (!showId) {
      throw new Error('Spotify show ID not configured');
    }
    
    const episodes = await getShowEpisodes(showId);
    return NextResponse.json(episodes);
  } catch (error) {
    console.error('Error fetching Spotify episodes:', error);
    return NextResponse.json({ error: 'Failed to fetch episodes' }, { status: 500 });
  }
}
```

### 4. Deploy to Vercel

1. Add the necessary environment variables to your Vercel project:
   - `SPOTIFY_CLIENT_ID`: Your Spotify API client ID
   - `SPOTIFY_CLIENT_SECRET`: Your Spotify API client secret
   - `SPOTIFY_SHOW_ID`: Your Spotify show ID

2. Deploy your application to Vercel:
   ```
   vercel deploy
   ```

## Benefits of This Approach

1. **Simplified Deployment**: No need to worry about large file uploads or storage limits
2. **Professional Player**: Leverage Spotify's well-designed player with all its features
3. **Cross-Platform Compatibility**: Works on all devices and browsers
4. **Analytics**: Access Spotify's analytics for your podcast
5. **Discoverability**: Listeners can easily follow your podcast on Spotify
6. **Monetization**: Potential for monetization through Spotify

## Troubleshooting

### Spotify Player Not Loading

- Check that your Spotify URIs are correct
- Ensure your Spotify show and episodes are public
- Verify that your browser allows third-party cookies for Spotify

### API Route Errors

- Check your Spotify API credentials
- Verify that your Spotify show ID is correct
- Check the Spotify API rate limits

## Conclusion

By integrating your Spotify podcast content into your Next.js application, you can provide a seamless listening experience for your users without worrying about Vercel's deployment size limitations. This approach leverages Spotify's infrastructure for audio hosting while allowing you to maintain control over your website's design and user experience. 