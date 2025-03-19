'use client';

import { useRef } from 'react';

interface SpotifyPlayerProps {
  spotifyUri: string;
  width?: number | string;
  height?: number | string;
  title?: string;
  allowTransparency?: boolean;
  allow?: string;
}

/**
 * SpotifyPlayer component for embedding Spotify podcasts
 * 
 * @param spotifyUri - The Spotify URI of the podcast episode or show
 * @param width - The width of the player (default: '100%')
 * @param height - The height of the player (default: 152)
 * @param title - The title of the player (default: 'Spotify Player')
 * @param allowTransparency - Whether to allow transparency in the player
 * @param allow - Additional permissions for the player
 */
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