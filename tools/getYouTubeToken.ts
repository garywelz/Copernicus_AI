import { google } from 'googleapis';
import open from 'open';
import dotenv from 'dotenv';
import http from 'http';
import { AddressInfo } from 'net';

dotenv.config();

async function getRefreshToken() {
  const PORT = 8591;
  
  const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    `http://localhost:${PORT}/callback`
  );

  const scopes = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.force-ssl'
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });

  const server = http.createServer(async (req, res) => {
    try {
      if (req.url?.startsWith('/callback')) {
        const url = new URL(req.url, `http://localhost:${PORT}`);
        const code = url.searchParams.get('code');

        if (code) {
          const { tokens } = await oauth2Client.getToken(code);
          console.log('\nRefresh Token:', tokens.refresh_token);
          console.log('\nAdd this to your .env file as YOUTUBE_REFRESH_TOKEN\n');
          res.end('Success! You can close this window.');
          server.close();
        }
      } else {
        res.end('Waiting for OAuth callback...');
      }
    } catch (error) {
      console.error('Error getting token:', error);
      res.end('Error getting token');
    }
  });

  server.listen(PORT, () => {
    const address = server.address() as AddressInfo;
    console.log(`\nListening on http://localhost:${address.port}`);
    console.log('\nOpening browser for authorization...\n');
    open(authUrl);
  });
}

getRefreshToken(); 