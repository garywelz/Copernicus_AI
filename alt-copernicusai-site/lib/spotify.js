const SPOTIFY_API_URL = "https://api.spotify.com/v1"

// Function to get Spotify access token
async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("Missing Spotify credentials")
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to get Spotify access token: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error("Error getting access token:", error)
    throw error
  }
}

// Function to search for a podcast by name
export async function searchSpotifyPodcast(query) {
  try {
    const token = await getAccessToken()

    const response = await fetch(
      `${SPOTIFY_API_URL}/search?q=${encodeURIComponent(query)}&type=show&market=US&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to search podcasts: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.shows.items
  } catch (error) {
    console.error("Error searching podcasts:", error)
    throw error
  }
}

// Function to fetch podcast data
export async function getSpotifyPodcast(podcastId) {
  try {
    const token = await getAccessToken()

    const response = await fetch(`${SPOTIFY_API_URL}/shows/${podcastId}?market=US`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch podcast: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching podcast:", error)
    throw error
  }
}

// Function to fetch all podcast episodes
export async function getSpotifyEpisodes(podcastId) {
  try {
    const token = await getAccessToken()
    let allEpisodes = []
    let offset = 0
    const limit = 50
    let hasMore = true

    // Fetch all episodes using pagination
    while (hasMore) {
      const response = await fetch(
        `${SPOTIFY_API_URL}/shows/${podcastId}/episodes?market=US&limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch episodes: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      allEpisodes = [...allEpisodes, ...data.items]

      // Check if there are more episodes to fetch
      if (data.items.length < limit) {
        hasMore = false
      } else {
        offset += limit
      }
    }

    return allEpisodes
  } catch (error) {
    console.error("Error fetching episodes:", error)
    throw error
  }
}