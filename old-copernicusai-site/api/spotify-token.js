// api/spotify-data.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Spotify API request received');
    
    // Get show ID from query parameter
    const showId = req.query.showId || '4TmKRzJxgLgECXLKZUu0d5';
    console.log(`Fetching data for show ID: ${showId}`);
    
    // Get Spotify credentials
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      console.error('Missing Spotify credentials');
      return res.status(500).json({ 
        error: 'Missing Spotify credentials', 
        clientIdExists: !!clientId,
        clientSecretExists: !!clientSecret
      });
    }
    
    console.log('Requesting Spotify access token');
    
    // Get Spotify access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials'
      })
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error(`Token request failed: ${tokenResponse.status} ${tokenResponse.statusText}`);
      console.error(`Error details: ${errorText}`);
      return res.status(tokenResponse.status).json({ 
        error: 'Failed to get Spotify access token',
        status: tokenResponse.status,
        details: errorText
      });
    }
    
    const tokenData = await tokenResponse.json();
    console.log('Access token received');
    
    // Get show details
    console.log('Fetching show details');
    const showResponse = await fetch(`https://api.spotify.com/v1/shows/${showId}?market=US`, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`
      }
    });
    
    if (!showResponse.ok) {
      const errorText = await showResponse.text();
      console.error(`Show request failed: ${showResponse.status} ${showResponse.statusText}`);
      console.error(`Error details: ${errorText}`);
      return res.status(showResponse.status).json({ 
        error: 'Failed to fetch show details',
        status: showResponse.status,
        details: errorText
      });
    }
    
    const show = await showResponse.json();
    console.log('Show details received');
    
    // Get episodes
    console.log('Fetching episodes');
    const episodesResponse = await fetch(
      `https://api.spotify.com/v1/shows/${showId}/episodes?market=US&limit=50`,
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`
        }
      }
    );
    
    if (!episodesResponse.ok) {
      const errorText = await episodesResponse.text();
      console.error(`Episodes request failed: ${episodesResponse.status} ${episodesResponse.statusText}`);
      console.error(`Error details: ${errorText}`);
      return res.status(episodesResponse.status).json({ 
        error: 'Failed to fetch episodes',
        status: episodesResponse.status,
        details: errorText
      });
    }
    
    const episodesData = await episodesResponse.json();
    console.log(`Received ${episodesData.items.length} episodes`);
    
    // Return combined data
    console.log('Sending response to client');
    return res.status(200).json({
      show,
      episodes: episodesData.items
    });
  } catch (error) {
    console.error('Spotify API error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch podcast data',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};