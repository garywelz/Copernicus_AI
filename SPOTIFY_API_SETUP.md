# Spotify API Setup Guide for Copernicus AI Podcast

This guide will walk you through the process of setting up Spotify API access for your podcast website.

## Step 1: Create a Spotify Developer Account

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
2. Click "Log In" and sign in with your Spotify account
   - If you don't have a Spotify account, you'll need to create one
3. Accept the Developer Terms of Service if prompted

## Step 2: Create a New Application

1. Once logged in, click the "Create an App" button
2. Fill in the application details:
   - **App name**: "Copernicus AI Podcast Website" (or any name you prefer)
   - **App description**: "Website for the Copernicus AI Podcast"
   - **Website**: Your website URL (e.g., "https://www.copernicusai.app")
   - **Redirect URI**: For basic API usage, you can use your website URL
3. Check the box to agree to the terms and conditions
4. Click "Create"

## Step 3: Get Your API Credentials

After creating your app, you'll be taken to the app dashboard where you can find your credentials:

1. **Client ID**: This is displayed prominently on the dashboard
2. **Client Secret**: Click "Show Client Secret" to reveal this value

These two values are your API credentials that you'll need for authenticating with the Spotify API.

## Step 4: Find Your Spotify Show ID

To access your podcast episodes, you'll need your Spotify Show ID:

1. Go to your podcast page on Spotify
2. Look at the URL in your browser's address bar
3. The Show ID is the alphanumeric string after "show/" in the URL
   - Example: In "https://open.spotify.com/show/2Shpxw7dPoxRJCdfFXTWLE", the Show ID is "2Shpxw7dPoxRJCdfFXTWLE"

## Step 5: Add Credentials to Your Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add the following environment variables:
   - `SPOTIFY_CLIENT_ID`: Your Client ID from Step 3
   - `SPOTIFY_CLIENT_SECRET`: Your Client Secret from Step 3
   - `SPOTIFY_SHOW_ID`: Your Show ID from Step 4
4. Click "Save" to apply these environment variables

## Step 6: Test Your API Access

You can test your API access by creating a simple API route in your Next.js application:

```typescript
// src/app/api/spotify-test/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get Spotify access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      throw new Error(`Failed to get token: ${tokenData.error}`);
    }
    
    // Get show episodes
    const showId = process.env.SPOTIFY_SHOW_ID;
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
      throw new Error(`Failed to get episodes: ${episodesData.error?.message || 'Unknown error'}`);
    }
    
    return NextResponse.json({ success: true, episodes: episodesData.items });
  } catch (error) {
    console.error('Spotify API error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
```

Visit `/api/spotify-test` in your browser to see if you can successfully fetch your podcast episodes.

## Troubleshooting

### "Invalid Client" Error

If you receive an "invalid_client" error, double-check that:
- Your Client ID and Client Secret are correct
- You're properly encoding the Authorization header

### "Invalid Show ID" Error

If you receive an error about an invalid show ID:
- Verify that your Show ID is correct
- Make sure your podcast is public and accessible via the Spotify API

### CORS Issues

If you encounter CORS issues when calling the Spotify API from the client side:
- Always make Spotify API calls from your server-side API routes
- Never expose your Client Secret in client-side code

## Next Steps

Once you have your API credentials set up, you can:

1. Create a more robust API route to fetch and cache your podcast episodes
2. Implement the full Spotify integration as outlined in the SPOTIFY_INTEGRATION_GUIDE.md
3. Customize the player and episode display to match your website's design

## Resources

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api/)
- [Spotify for Podcasters](https://podcasters.spotify.com/)
- [Next.js API Routes Documentation](https://nextjs.org/docs/api-routes/introduction) 