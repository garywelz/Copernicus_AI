const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '..')));

// Spotify API routes
app.use('/api/spotify-data', require('./spotify-data'));
app.use('/api/spotify-token', require('./spotify-token'));
app.use('/api/test', require('./test'));

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Start server if not in Vercel environment
if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

// Export for Vercel serverless deployment
module.exports = app; 