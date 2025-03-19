import { NextResponse } from 'next/server';

// This is mock data for development
// In production, you would fetch this from the Spotify API
const mockEpisodes = [
  {
    id: 'episode1',
    name: 'Math News - Episode 1',
    description: 'The premiere episode of Math News, covering the latest breakthroughs in mathematics.',
    images: [{ url: '/images/podcast-placeholder.webp' }],
    duration_ms: 630000, // 10:30
    release_date: '2024-03-28',
    external_urls: { 
      spotify: 'https://open.spotify.com/episode/your-episode-id-1'
    },
    uri: 'spotify:episode:4rOoJ6Egrf8K2IrywzwOMk' // Example URI - replace with your actual episode
  },
  {
    id: 'episode2',
    name: 'Biology News - Episode 1',
    description: 'The premiere episode of Biology News, covering groundbreaking discoveries in molecular biology, ecology, neuroscience, and evolutionary biology.',
    images: [{ url: '/images/podcast-placeholder.webp' }],
    duration_ms: 2535000, // 42:15
    release_date: '2024-03-28',
    external_urls: { 
      spotify: 'https://open.spotify.com/episode/your-episode-id-2'
    },
    uri: 'spotify:episode:5V4XZWMZlgOBZ7PfoMGm2z' // Example URI - replace with your actual episode
  },
  {
    id: 'episode3',
    name: 'Physics News - Episode 1',
    description: 'The premiere episode of Physics News, covering the latest breakthroughs in quantum physics, astrophysics, and more.',
    images: [{ url: '/images/podcast-placeholder.webp' }],
    duration_ms: 2655000, // 44:15
    release_date: '2024-03-28',
    external_urls: { 
      spotify: 'https://open.spotify.com/episode/your-episode-id-3'
    },
    uri: 'spotify:episode:4rOoJ6Egrf8K2IrywzwOMk' // Example URI - replace with your actual episode
  }
];

export async function GET() {
  // Check if we have Spotify credentials
  const hasCredentials = process.env.SPOTIFY_CLIENT_ID && 
                         process.env.SPOTIFY_CLIENT_SECRET && 
                         process.env.SPOTIFY_SHOW_ID;
  
  // If we have credentials, try to fetch from Spotify API
  if (hasCredentials) {
    try {
      // Get Spotify access token
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')}`
        },
        body: 'grant_type=client_credentials'
      });
      
      const tokenData = await tokenResponse.json();
      
      if (!tokenResponse.ok) {
        console.error('Failed to get Spotify token:', tokenData);
        // Fall back to mock data
        return NextResponse.json(mockEpisodes);
      }
      
      // Get show episodes
      const showId = process.env.SPOTIFY_SHOW_ID;
      const episodesResponse = await fetch(
        `https://api.spotify.com/v1/shows/${showId}/episodes?limit=50`,
        {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`
          }
        }
      );
      
      const episodesData = await episodesResponse.json();
      
      if (!episodesResponse.ok) {
        console.error('Failed to get Spotify episodes:', episodesData);
        // Fall back to mock data
        return NextResponse.json(mockEpisodes);
      }
      
      // Return the actual episodes from Spotify
      return NextResponse.json(episodesData.items);
    } catch (error) {
      console.error('Error fetching from Spotify API:', error);
      // Fall back to mock data
      return NextResponse.json(mockEpisodes);
    }
  }
  
  // If no credentials, return mock data
  return NextResponse.json(mockEpisodes);
} 