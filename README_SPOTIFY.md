# Spotify Integration for Copernicus AI Podcast

This README explains how to use the Spotify integration in your Copernicus AI Podcast website.

## Overview

The Spotify integration allows you to embed Spotify podcast players in your website, providing a seamless listening experience for your users. Instead of hosting large audio files directly on Vercel (which has size limitations), this approach leverages Spotify's infrastructure for audio hosting.

## Components

The integration consists of the following components:

1. **SpotifyPlayer Component**: A React component that embeds the Spotify player for podcast episodes
2. **API Routes**: Endpoints that fetch podcast episodes from Spotify's API
3. **Demo Page**: A page that demonstrates how to use the SpotifyPlayer component

## Basic Usage

To embed a Spotify player in your website, use the `SpotifyPlayer` component:

```jsx
import SpotifyPlayer from '@/components/SpotifyPlayer';

// Basic usage
<SpotifyPlayer spotifyUri="spotify:episode:YOUR_EPISODE_ID" />

// With custom height
<SpotifyPlayer 
  spotifyUri="spotify:episode:YOUR_EPISODE_ID" 
  height={232} 
/>
```

## Finding Your Spotify URI

To find your Spotify episode URI:

1. Open Spotify and navigate to your podcast episode
2. Click the three dots (⋯) next to the episode
3. Select "Share" and then "Copy Spotify URI"
4. The URI will look like: `spotify:episode:4rOoJ6Egrf8K2IrywzwOMk`

Alternatively, you can use the episode URL (e.g., `https://open.spotify.com/episode/4rOoJ6Egrf8K2IrywzwOMk`) and the component will extract the ID automatically.

## Demo Page

Visit the `/spotify-demo` page to see examples of the SpotifyPlayer component in action.

## API Integration

For the full API integration, you'll need to:

1. Get your Spotify API credentials (see `SPOTIFY_API_SETUP.md`)
2. Add your credentials to your Vercel environment variables
3. Test your API access using the `/api/spotify-test` endpoint

## Files

- `/src/components/SpotifyPlayer.tsx`: The SpotifyPlayer component
- `/src/app/spotify-demo/page.tsx`: Demo page for the SpotifyPlayer component
- `/src/app/api/spotify-episodes/route.ts`: API route to fetch podcast episodes
- `/src/app/api/spotify-test/route.ts`: API route to test Spotify API access
- `/SPOTIFY_API_SETUP.md`: Guide for setting up Spotify API access
- `/SPOTIFY_INTEGRATION_GUIDE.md`: Comprehensive guide for the full integration

## Next Steps

1. Set up your Spotify API credentials (see `SPOTIFY_API_SETUP.md`)
2. Test your API access using the `/api/spotify-test` endpoint
3. Implement the full integration as outlined in `SPOTIFY_INTEGRATION_GUIDE.md`

## Resources

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api/)
- [Spotify for Podcasters](https://podcasters.spotify.com/)
- [Next.js Documentation](https://nextjs.org/docs) 