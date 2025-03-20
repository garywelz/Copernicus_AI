import { Suspense } from "react"
import { searchSpotifyPodcast, getSpotifyPodcast, getSpotifyEpisodes } from "@/lib/spotify"
import PodcastHeader from "@/components/podcast-header"
import CategoryTabs from "@/components/category-tabs"
import Loading from "@/components/loading"

export default async function HomePage() {
  try {
    // First, search for the podcast by name to find the correct ID
    const searchResults = await searchSpotifyPodcast("Copernicus AI")

    if (!searchResults || searchResults.length === 0) {
      throw new Error("No podcasts found with the name 'Copernicus AI'")
    }

    // Use the first result's ID
    const podcastId = searchResults[0].id

    // Now fetch the podcast data and episodes using the found ID
    const podcastData = await getSpotifyPodcast(podcastId)
    const episodes = await getSpotifyEpisodes(podcastId)

    return (
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <PodcastHeader podcast={podcastData} />

        <Suspense fallback={<Loading />}>
          <CategoryTabs episodes={episodes} />
        </Suspense>
      </main>
    )
  } catch (error: any) {
    console.error("Error fetching podcast data:", error)
    return (
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline">
            {" "}
            Failed to load podcast data from Spotify. Please check your API credentials and try again.
          </span>
          <p className="mt-2 text-sm">Details: {error?.message || "Unknown error"}</p>
        </div>
      </main>
    )
  }
}