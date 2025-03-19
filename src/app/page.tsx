import EpisodesBySubject from '@/components/EpisodesBySubject';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Copernicus AI Podcast</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Exploring the frontiers of science, mathematics, and technology through engaging discussions and expert insights.
        </p>
      </div>
      
      <EpisodesBySubject />
    </main>
  );
} 