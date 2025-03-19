# Copernicus Content Integration Guide

This guide explains how to integrate your podcast content (audio files, transcripts, show notes, and images) into your Vercel-deployed Next.js application.

## Overview

Due to Vercel's deployment size limitations, large audio files and other content should be stored externally. This guide covers:

1. Setting up external storage for your content
2. Modifying your Next.js application to load content from external sources
3. Organizing your podcasts by subject
4. Testing and troubleshooting

## Setting Up External Storage

### Option 1: AWS S3 (Recommended)

1. Create an AWS S3 bucket
2. Configure CORS to allow access from your Vercel domain
3. Upload your content files with the following structure:
   ```
   your-bucket/
   ├── audio/
   │   ├── math-news-episode1.mp3
   │   ├── biology-news-ep1.mp3
   │   └── ...
   ├── markdown/
   │   ├── transcripts/
   │   │   ├── math-news-ep1-transcript.md
   │   │   └── ...
   │   ├── descriptions/
   │   │   ├── math-news-ep1-description.md
   │   │   └── ...
   │   └── show-notes/
   │       ├── math-news-ep1-show-notes.md
   │       └── ...
   └── images/
       ├── math-news-thumbnail.webp
       └── ...
   ```
4. Make the bucket publicly accessible for read operations

### Option 2: Cloudinary

1. Create a Cloudinary account
2. Create folders for audio, markdown, and images
3. Upload your content using the Cloudinary dashboard or API
4. Note the URLs for your uploaded content

### Option 3: GitHub LFS (Large File Storage)

1. Set up Git LFS in your repository
2. Configure LFS to track large files (audio, images)
3. Push your content to GitHub
4. Use raw GitHub URLs to access your content

## Modifying Your Next.js Application

### 1. Environment Variables

Add the following environment variables to your Vercel project:

```
CONTENT_BASE_URL=https://your-storage-url.com
AUDIO_FILES_PATH=audio
MARKDOWN_FILES_PATH=markdown
IMAGE_FILES_PATH=images
```

### 2. Update the Episode Data Structure

Modify your episode data structure to include subject categorization:

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
  subject: string; // e.g., "math", "biology", "physics", etc.
}
```

### 3. Create a Content Loading Hook

Create a hook to load content from your external storage:

```typescript
// src/hooks/useContent.ts
import { useState, useEffect } from 'react';

export function useContent(path: string) {
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_CONTENT_BASE_URL || '';
        const response = await fetch(`${baseUrl}/${path}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.statusText}`);
        }
        
        const text = await response.text();
        setContent(text);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    }

    if (path) {
      fetchContent();
    }
  }, [path]);

  return { content, isLoading, error };
}
```

### 4. Update the Episode Loading Hook

Modify your `useEpisodes` hook to load episodes from an external source and group them by subject:

```typescript
// src/hooks/useEpisodes.ts
'use client';

import { useState, useEffect } from 'react';
import type { Episode } from '@/types/episode';

export function useEpisodes() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [episodesBySubject, setEpisodesBySubject] = useState<Record<string, Episode[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEpisodes() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_CONTENT_BASE_URL || '';
        const response = await fetch(`${baseUrl}/episodes.json`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch episodes: ${response.statusText}`);
        }
        
        const data = await response.json();
        setEpisodes(data);
        
        // Group episodes by subject
        const grouped = data.reduce((acc: Record<string, Episode[]>, episode: Episode) => {
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

### 5. Create an Episodes JSON File

Create a JSON file with your episode data and upload it to your storage:

```json
[
  {
    "id": "1",
    "title": "Math News - Episode 1",
    "description": "The premiere episode of Math News, covering the latest breakthroughs in mathematics.",
    "thumbnailUrl": "https://your-storage-url.com/images/math-news-thumbnail.webp",
    "duration": "10:30",
    "date": "2024-03-28",
    "url": "math-news-ep1",
    "audioUrl": "https://your-storage-url.com/audio/math-news-episode1.mp3",
    "videoUrl": null,
    "descriptUrl": null,
    "isFeatured": true,
    "subject": "math"
  },
  {
    "id": "2",
    "title": "Biology News - Episode 1",
    "description": "The premiere episode of Biology News, covering groundbreaking discoveries in molecular biology, ecology, neuroscience, and evolutionary biology.",
    "thumbnailUrl": "https://your-storage-url.com/images/biology-news-thumbnail.webp",
    "duration": "42:15",
    "date": "2024-03-28",
    "url": "biology-news-ep1",
    "audioUrl": "https://your-storage-url.com/audio/biology-news-ep1.mp3",
    "videoUrl": null,
    "descriptUrl": null,
    "isFeatured": true,
    "subject": "biology"
  }
]
```

### 6. Update Your Components to Display Episodes by Subject

Modify your components to display episodes grouped by subject:

```tsx
// src/components/EpisodesBySubject.tsx
'use client';

import { useEpisodes } from '@/hooks/useEpisodes';
import EpisodeCard from './EpisodeCard';

export default function EpisodesBySubject() {
  const { episodesBySubject, isLoading, error } = useEpisodes();

  if (isLoading) return <div>Loading episodes...</div>;
  if (error) return <div>Error loading episodes: {error}</div>;

  return (
    <div>
      {Object.entries(episodesBySubject).map(([subject, episodes]) => (
        <div key={subject} className="mb-8">
          <h2 className="text-2xl font-bold mb-4 capitalize">{subject}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {episodes.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 7. Update the Audio Player Component

Modify your audio player component to handle external audio URLs:

```tsx
// src/components/AudioPlayer.tsx
'use client';

import { useRef, useEffect, useState } from 'react';

interface AudioPlayerProps {
  src: string;
  title: string;
}

export default function AudioPlayer({ src, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setError('Failed to load audio file');
      setIsLoading(false);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [src]);

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {isLoading && <div>Loading audio...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <audio ref={audioRef} controls className="w-full" preload="metadata">
        <source src={src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
```

## Testing and Troubleshooting

### Testing Content Loading

1. Deploy your application to Vercel
2. Check the browser console for any errors related to content loading
3. Verify that your environment variables are correctly set in Vercel
4. Check that your storage CORS settings allow access from your Vercel domain

### Common Issues and Solutions

#### Audio Files Not Loading

- Check that the audio file URL is correct
- Verify that the audio file is publicly accessible
- Check the CORS configuration of your storage provider
- Try adding the `crossorigin="anonymous"` attribute to your audio element

#### Markdown Files Not Rendering

- Check that the markdown file URL is correct
- Verify that the markdown file is publicly accessible
- Check for any syntax errors in your markdown files

#### Images Not Displaying

- Check that the image URL is correct
- Verify that the image is publicly accessible
- Try using the Next.js Image component with proper configuration

## Using the Chrome Extension

To simplify the process of managing your content files, you can use the Copernicus Content Manager Chrome extension:

1. Install the extension from the `vercel-large-files-extension` directory
2. Configure your storage provider in the extension
3. Use the extension to upload your content files
4. Add the content URLs to your Vercel environment variables

For detailed instructions, see the extension's README file.

## Conclusion

By following this guide, you should be able to successfully integrate your podcast content into your Vercel-deployed Next.js application, even with large audio files and other content that exceeds Vercel's deployment size limitations. 