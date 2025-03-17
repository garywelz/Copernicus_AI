interface SpotifyEpisode {
  id: string;
  name: string;
  description: string;
  duration_ms: number;
  release_date: string;
  uri: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
}

interface SpotifyShow {
  id: string;
  name: string;
  description: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  episodes: {
    items: SpotifyEpisode[];
    total: number;
  };
}

export async function getSpotifyAccessToken(): Promise<string> {
  const clientId = import.meta.env.SPOTIFY_CLIENT_ID;
  const clientSecret = import.meta.env.SPOTIFY_CLIENT_SECRET;

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error('Failed to get Spotify access token');
  }

  const data = await response.json();
  return data.access_token;
}

export async function getShowEpisodes(showId: string): Promise<SpotifyEpisode[]> {
  const accessToken = await getSpotifyAccessToken();
  const response = await fetch(
    `https://api.spotify.com/v1/shows/${showId}/episodes?limit=50`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch show episodes');
  }

  const data = await response.json();
  return data.items;
}

export async function getShowInfo(showId: string): Promise<SpotifyShow> {
  const accessToken = await getSpotifyAccessToken();
  const response = await fetch(
    `https://api.spotify.com/v1/shows/${showId}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch show info');
  }

  return response.json();
}

export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
} 