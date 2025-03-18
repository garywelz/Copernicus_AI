// api/spotify-data.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get environment variables
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const showId = process.env.SPOTIFY_SHOW_ID;
    
    // Get Spotify access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });
    
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;
    
    // Get show data
    const showResponse = await fetch(`https://api.spotify.com/v1/shows/${showId}?market=US`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    const showData = await showResponse.json();
    
    // Get episodes
    const episodesResponse = await fetch(`https://api.spotify.com/v1/shows/${showId}/episodes?market=US&limit=10`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    const episodesData = await episodesResponse.json();
    
    // Return combined data
    return res.status(200).json({
      show: showData,
      episodes: episodesData.items
    });
    
  } catch (error) {
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message
    });
  }
};