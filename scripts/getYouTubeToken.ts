import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import open from 'open';
import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getAuthToken() {
  try {
    // Read OAuth2 credentials
    const credentialsPath = path.join(__dirname, '../client_secret.json');
    const credentials = JSON.parse(await fs.readFile(credentialsPath, 'utf8'));
    
    // Log the structure to debug
    console.log('Credentials file structure:', JSON.stringify(credentials, null, 2));

    // Handle both web and installed app credentials
    const { client_id, client_secret, redirect_uris } = credentials.web || credentials.installed || credentials;

    const oauth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    // Generate auth url
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.force-ssl'
      ]
    });

    console.log('Authorize this app by visiting:', authUrl);
    await open(authUrl); // Opens the URL in your default browser

    // Create temporary server to handle the OAuth2 callback
    const server = http.createServer(async (req, res) => {
      try {
        const url = new URL(req.url!, `http://${req.headers.host}`);
        const code = url.searchParams.get('code');

        if (code) {
          const { tokens } = await oauth2Client.getToken(code);
          
          // Save tokens to a file
          const tokenPath = path.join(__dirname, '../youtube_tokens.json');
          await fs.writeFile(tokenPath, JSON.stringify(tokens, null, 2));
          
          console.log('\nTokens saved to youtube_tokens.json');
          res.end('Authorization successful! You can close this window.');
          server.close();
        }
      } catch (error) {
        console.error('Error getting tokens:', error);
        res.end('Authorization failed! Check the console for more details.');
        server.close();
      }
    });

    server.listen(3457, () => {
      console.log('\nWaiting for authorization...');
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

getAuthToken(); 