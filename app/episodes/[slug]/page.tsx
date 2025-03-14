import Link from 'next/link';
import Image from 'next/image';
import { sampleEpisodes } from '@/data/sampleEpisodes';
import { PageLayout } from '@/components/layout/PageLayout';

// This function is needed for static export
export function generateStaticParams() {
  return sampleEpisodes.map((episode) => ({
    slug: episode.url,
  }));
}

export default function EpisodePage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const episode = sampleEpisodes.find(ep => ep.url === slug);

  if (!episode) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">404</h1>
            <p className="mt-2 text-gray-600">Episode not found</p>
            <Link 
              href="/" 
              className="mt-4 text-blue-600 hover:text-blue-800 inline-block"
            >
              ← Back to Episodes
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Generate file links based on the episode URL
  const thumbnailUrl = episode.thumbnailUrl.includes('placeholder') 
    ? `/images/${episode.url}-thumbnail.webp` 
    : episode.thumbnailUrl;

  return (
    <PageLayout>
      <article className="max-w-4xl mx-auto">
        <Link 
          href="/" 
          className="text-blue-600 hover:text-blue-800 mb-8 inline-flex items-center"
        >
          <span className="mr-2">←</span> Back to Episodes
        </Link>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Thumbnail Image */}
          <div className="mb-6 rounded-lg overflow-hidden">
            <Image
              src={thumbnailUrl}
              alt={episode.title}
              width={800}
              height={450}
              className="w-full h-auto"
            />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{episode.title}</h1>
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <span>{new Date(episode.date).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span>{episode.duration}</span>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-lg text-gray-600 mb-8">{episode.description}</p>

            {/* Audio Player */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Listen to Episode</h2>
              <p className="text-sm text-gray-500 mb-2">Audio URL: {episode.audioUrl}</p>
              
              {/* Native Audio Player */}
              <div className="mt-4">
                <audio 
                  controls 
                  className="w-full" 
                  src={episode.audioUrl}
                  preload="metadata"
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
              
              <div className="mt-4">
                <a 
                  href={episode.audioUrl} 
                  download
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                >
                  Download Audio
                </a>
              </div>
            </div>

            {/* YouTube Video */}
            {episode.videoUrl && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Watch on YouTube</h2>
                <div className="relative pb-[56.25%] h-0">
                  <iframe
                    src={`https://www.youtube.com/embed/${episode.videoUrl.split('/').pop()}`}
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Descript Player */}
            {episode.descriptUrl && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Listen on Descript</h2>
                <div className="relative pb-[56.25%] h-0">
                  <iframe
                    src={episode.descriptUrl}
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Transcript Section */}
            {episode.transcript && (
              <div className="mt-12 border-t pt-8">
                <h2 className="text-2xl font-semibold mb-6">Episode Transcript</h2>
                <div className="prose max-w-none">
                  {episode.transcript.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </PageLayout>
  );
} 