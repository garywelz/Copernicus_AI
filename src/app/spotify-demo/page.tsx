'use client';

import React from 'react';
import SpotifyPlayer from '@/components/SpotifyPlayer';
import Link from 'next/link';

export default function SpotifyDemoPage() {
  // Example Spotify URIs - replace these with your actual podcast episodes
  const exampleEpisodes = [
    {
      title: 'Example Episode 1',
      uri: 'spotify:episode:4rOoJ6Egrf8K2IrywzwOMk', // This is an example URI
      description: 'This is an example episode from Spotify. Replace with your actual podcast episode.'
    },
    {
      title: 'Example Episode 2',
      uri: 'spotify:episode:5V4XZWMZlgOBZ7PfoMGm2z', // This is an example URI
      description: 'Another example episode from Spotify. Replace with your actual podcast episode.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Spotify Player Demo</h1>
      
      <div className="mb-8">
        <p className="text-lg mb-4">
          This page demonstrates how to embed Spotify podcast episodes in your Next.js application.
        </p>
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to home
        </Link>
      </div>

      <div className="space-y-12">
        {exampleEpisodes.map((episode, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{episode.title}</h2>
            <p className="text-gray-700 mb-4">{episode.description}</p>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Standard Player (default height: 152px)</h3>
              <SpotifyPlayer 
                spotifyUri={episode.uri} 
                title={episode.title}
              />
            </div>
            
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Compact Player (80px height)</h3>
              <SpotifyPlayer 
                spotifyUri={episode.uri} 
                title={episode.title}
                height={80}
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Full Player (232px height)</h3>
              <SpotifyPlayer 
                spotifyUri={episode.uri} 
                title={episode.title}
                height={232}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">How to Use the SpotifyPlayer Component</h2>
        
        <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto mb-4">
          <pre className="text-sm">
{`import SpotifyPlayer from '@/components/SpotifyPlayer';

// Basic usage
<SpotifyPlayer spotifyUri="spotify:episode:YOUR_EPISODE_ID" />

// With custom height
<SpotifyPlayer 
  spotifyUri="spotify:episode:YOUR_EPISODE_ID" 
  height={232} 
/>

// With all options
<SpotifyPlayer 
  spotifyUri="spotify:episode:YOUR_EPISODE_ID" 
  width="100%" 
  height={152} 
  title="My Podcast Episode" 
  allowTransparency={true} 
  allow="encrypted-media" 
/>`}
          </pre>
        </div>
        
        <h3 className="font-semibold mb-2">Finding Your Spotify URI</h3>
        <p className="mb-4">
          To find your Spotify episode URI:
        </p>
        <ol className="list-decimal list-inside space-y-2 mb-4">
          <li>Open Spotify and navigate to your podcast episode</li>
          <li>Click the three dots (⋯) next to the episode</li>
          <li>Select "Share" and then "Copy Spotify URI"</li>
          <li>The URI will look like: <code className="bg-gray-100 px-2 py-1 rounded">spotify:episode:4rOoJ6Egrf8K2IrywzwOMk</code></li>
        </ol>
        
        <p>
          Alternatively, you can use the episode URL (e.g., <code className="bg-gray-100 px-2 py-1 rounded">https://open.spotify.com/episode/4rOoJ6Egrf8K2IrywzwOMk</code>)
          and the component will extract the ID automatically.
        </p>
      </div>
    </div>
  );
} 