// app/page.tsx
import PodcastHeader from "@/components/podcast-header"

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

  return (
    <main className="container mx-auto px-4 py-8">
      <PodcastHeader podcast={mockPodcast} />
      
      <div className="my-8 p-4 bg-green-100 rounded-md">
        <p>If you can see this, your podcast header component is working correctly!</p>
      </div>
    </main>
  )
}