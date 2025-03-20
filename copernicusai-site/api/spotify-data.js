// api/spotify-data.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get environment variables
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const showId = process.env.SPOTIFY_SHOW_ID;

    if (!clientId || !clientSecret || !showId) {
      console.error('Missing required environment variables');
      return res.status(500).json({
        error: 'Server configuration error',
        message: 'Missing required Spotify credentials'
      });
    }
    
    // Get Spotify access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });

    if (!tokenResponse.ok) {
      console.error('Failed to get Spotify token:', await tokenResponse.text());
      return res.status(500).json({
        error: 'Spotify authentication failed',
        message: 'Could not obtain access token'
      });
    }
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    // Get show data
    const showResponse = await fetch(`https://api.spotify.com/v1/shows/${showId}?market=US`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!showResponse.ok) {
      console.error('Failed to get show data:', await showResponse.text());
      return res.status(500).json({
        error: 'Spotify API error',
        message: 'Could not fetch show data'
      });
    }
    
    const showData = await showResponse.json();
    
    // Get episodes
    const episodesResponse = await fetch(`https://api.spotify.com/v1/shows/${showId}/episodes?market=US&limit=50`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!episodesResponse.ok) {
      console.error('Failed to get episodes:', await episodesResponse.text());
      return res.status(500).json({
        error: 'Spotify API error',
        message: 'Could not fetch episodes'
      });
    }
    
    const episodesData = await episodesResponse.json();
    
    // Return combined data
    return res.status(200).json({
      show: showData,
      episodes: episodesData.items
    });
    
  } catch (error) {
    console.error('Spotify API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};