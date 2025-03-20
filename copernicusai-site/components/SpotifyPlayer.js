import React, { useState, useEffect } from 'react';

const SpotifyPlayer = () => {
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/spotify-data');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setEpisodes(data.episodes || []);
      } catch (err) {
        console.error('Error fetching Spotify data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, []);

  if (loading) {
    return <div className="loading">Loading episodes...</div>;
  }

  if (error) {
    return <div className="error">Error loading episodes: {error}</div>;
  }

  return (
    <div className="spotify-player">
      <h2>Latest Episodes</h2>
      <div className="episodes-grid">
        {episodes.map((episode) => (
          <div key={episode.id} className="episode-card">
            {episode.images && episode.images[0] && (
              <img 
                src={episode.images[0].url} 
                alt={episode.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-episode.png';
                }}
              />
            )}
            <h3>{episode.name}</h3>
            <p>{episode.description}</p>
            <iframe
              src={`https://open.spotify.com/embed/episode/${episode.id}`}
              width="100%"
              height="152"
              frameBorder="0"
              allowtransparency="true"
              allow="encrypted-media"
              loading="lazy"
              title={episode.name}
            />
          </div>
        ))}
      </div>
      <style jsx>{`
        .spotify-player {
          padding: 2rem;
        }
        .episodes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }
        .episode-card {
          background: #fff;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .episode-card img {
          width: 100%;
          height: auto;
          border-radius: 4px;
          margin-bottom: 1rem;
        }
        .episode-card h3 {
          margin: 0.5rem 0;
          font-size: 1.2rem;
        }
        .episode-card p {
          margin: 0.5rem 0 1rem;
          font-size: 0.9rem;
          color: #666;
        }
        .loading {
          text-align: center;
          padding: 2rem;
          font-size: 1.2rem;
          color: #666;
        }
        .error {
          text-align: center;
          padding: 2rem;
          color: #e74c3c;
          background: #fde8e7;
          border-radius: 4px;
          margin: 1rem 0;
        }
      `}</style>
    </div>
  );
};

export default SpotifyPlayer; 