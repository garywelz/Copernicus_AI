cat > copernicusai-site/app/api/spotify-data/route.ts << 'EOF'
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Spotify API credentials
    const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
    const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

    // Check if credentials are available
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
      return NextResponse.json({ error: "Missing Spotify credentials" }, { status: 500 })
    }

    // Get access token
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
      cache: "no-store",
    })

    if (!tokenResponse.ok) {
      return NextResponse.json(
        {
          error: `Failed to get access token: ${tokenResponse.status} ${tokenResponse.statusText}`,
        },
        { status: 500 },
      )
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // First, search for the podcast by name
    const searchQuery = "Copernicus AI"
    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=show&market=US&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      },
    )

    if (!searchResponse.ok) {
      return NextResponse.json(
        {
          error: `Failed to search podcasts: ${searchResponse.status} ${searchResponse.statusText}`,
        },
        { status: 500 },
      )
    }

    const searchData = await searchResponse.json()

    if (!searchData.shows || !searchData.shows.items || searchData.shows.items.length === 0) {
      return NextResponse.json(
        {
          error: "No podcasts found with the name 'Copernicus AI'",
        },
        { status: 404 },
      )
    }

    // Use the first result's ID
    const PODCAST_ID = searchData.shows.items[0].id

    // Fetch podcast data
    const showResponse = await fetch(`https://api.spotify.com/v1/shows/${PODCAST_ID}?market=US`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    })

    if (!showResponse.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch podcast: ${showResponse.status} ${showResponse.statusText}`,
        },
        { status: 500 },
      )
    }

    const show = await showResponse.json()

    // Fetch episodes
    const episodesResponse = await fetch(`https://api.spotify.com/v1/shows/${PODCAST_ID}/episodes?market=US&limit=50`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    })

    if (!episodesResponse.ok) {
      return NextResponse.json(
        {
          error: `Failed to fetch episodes: ${episodesResponse.status} ${episodesResponse.statusText}`,
        },
        { status: 500 },
      )
    }

    const episodesData = await episodesResponse.json()
    const episodes = episodesData.items

    // Return the data
    return NextResponse.json({ show, episodes })
  } catch (error: any) {
    console.error("Error in API route:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to fetch podcast data",
      },
      { status: 500 },
    )
  }
}
EOF