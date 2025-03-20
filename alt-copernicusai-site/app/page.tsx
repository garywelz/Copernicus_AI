// app/page.tsx
import PodcastHeader from "../components/podcast-header"
import CategoryTabs from "../components/category-tabs"

export default function Home() {
  // Mock data for testing
  const mockPodcast = {
    name: "Copernicus AI Podcast",
    description: "Keeping Current With Engaging AI Podcasts",
    images: [{ url: "/placeholder.svg?height=300&width=300" }],
    publisher: "Copernicus AI",
    total_episodes: 42,
    external_urls: { spotify: "https://open.spotify.com" }
  }
  
  const mockEpisodes = [
    {
      id: "1",
      name: "Test Episode",
      description: "This is a test episode",
      release_date: new Date().toISOString(),
      duration_ms: 1800000, // 30 minutes
      images: [{ url: "/placeholder.svg?height=300&width=300" }],
      external_urls: { spotify: "https://open.spotify.com" }
    }
  ]

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <PodcastHeader podcast={mockPodcast} />
      
      <div className="my-8">
        <h2 className="text-2xl font-bold mb-4">Using Mock Data</h2>
        <p className="mb-4">
          This page is currently using mock data. Once we confirm this works, 
          we'll restore the Spotify API integration.
        </p>
      </div>
      
      <CategoryTabs episodes={mockEpisodes} />
    </main>
  )
}