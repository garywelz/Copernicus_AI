import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if environment variables are set
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const showId = process.env.SPOTIFY_SHOW_ID;
    
    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Spotify credentials not configured. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables.' 
        }, 
        { status: 500 }
      );
    }
    
    if (!showId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Spotify show ID not configured. Please set SPOTIFY_SHOW_ID environment variable.' 
        }, 
        { status: 500 }
      );
    }
    
    // Get Spotify access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to get token: ${tokenData.error}`,
          details: tokenData
        }, 
        { status: tokenResponse.status }
      );
    }
    
    // Get show episodes
    const episodesResponse = await fetch(
      `https://api.spotify.com/v1/shows/${showId}/episodes?limit=10`,
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      }
    );
    
    const episodesData = await episodesResponse.json();
    
    if (!episodesResponse.ok) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to get episodes: ${episodesData.error?.message || 'Unknown error'}`,
          details: episodesData
        }, 
        { status: episodesResponse.status }
      );
    }
    
    // Success! Return the episodes
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully connected to Spotify API and retrieved episodes',
      episodeCount: episodesData.items.length,
      episodes: episodesData.items.map((episode: any) => ({
        id: episode.id,
        name: episode.name,
        description: episode.description.substring(0, 100) + '...',
        releaseDate: episode.release_date,
        durationMs: episode.duration_ms,
        uri: episode.uri
      }))
    });
  } catch (error) {
    console.error('Spotify API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 