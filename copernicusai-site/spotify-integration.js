// Declare variables for elements used in the script
const episodesContainer = document.getElementById('episodes-container');
const showDescription = document.getElementById('show-description');
const spotifyFollowLink = document.getElementById('spotify-follow-link');
const loadingSpinner = document.getElementById('loading-spinner');

// Function to render episodes (implementation not provided in the original code)
// Assuming it takes an array of episode objects as input
function renderEpisodes(episodes) {
    // Example implementation (replace with actual rendering logic)
    episodesContainer.innerHTML = episodes.map(episode => `<div>${episode.name}</div>`).join('');
}

// Update the fetchPodcastData function in spotify-integration.js
document.addEventListener('DOMContentLoaded', function() {
    const episodesContainer = document.getElementById('episodes-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    const showDescription = document.getElementById('show-description');
    const spotifyFollowLink = document.getElementById('spotify-follow-link');
    
    // Fetch podcast data from server API
    fetchPodcastData();
    
    async function fetchPodcastData() {
        let fallbackUsed = false; // Flag to track if fallback episodes are used
        try {
            console.log('Fetching podcast data...');
            // Make sure to use /api/spotify-data
            const response = await fetch('/api/spotify-data');
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                
                // Display error message on the page for debugging
                const notice = document.createElement('div');
                notice.className = 'col-span-full text-center text-red-600 mb-8';
                notice.innerHTML = `Error: ${errorData.error || response.statusText}<br>
                               Status: ${response.status}<br>
                               Details: ${JSON.stringify(errorData)}`;
                episodesContainer.parentNode.insertBefore(notice, episodesContainer);
                
                throw new Error(`API Error: ${errorData.error || response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Podcast data received:', data);
            
            // Update show description and follow link
            if (data.show) {
                showDescription.textContent = data.show.description;
                spotifyFollowLink.href = data.show.external_urls.spotify;
                console.log('Show description updated');
            } else {
                showDescription.textContent = "Copernicus AI is a podcast exploring the latest developments in artificial intelligence, machine learning, and their impact on society.";
                console.warn('No show data received, using fallback description');
            }
            
            // Render episodes
            if (data.episodes && data.episodes.length > 0) {
                console.log(`Rendering ${data.episodes.length} episodes`);
                renderEpisodes(data.episodes);
            } else {
                console.warn('No episodes received');
                fallbackUsed = true;
            }
            
        } catch (error) {
            console.error('Error fetching podcast data:', error);
            showDescription.textContent = "Copernicus AI is a podcast exploring the latest developments in artificial intelligence, machine learning, and their impact on society.";
            fallbackUsed = true;
        } finally {
            // Hide loading spinner
            if (loadingSpinner) {
                loadingSpinner.style.display = 'none';
            }
            useFallbackEpisodes(fallbackUsed);
        }
    }
    
    function useFallbackEpisodes(fallbackUsed) {
        console.log('Using fallback episodes');
        // Provide some static fallback content when API fails
        const fallbackEpisodes = [
            {
                name: "The Future of AI in Healthcare",
                description: "In this episode, we explore how artificial intelligence is transforming healthcare, from diagnosis to treatment planning and beyond.",
                release_date: "2023-05-15",
                duration_ms: 1800000,
                images: [{ url: "/images/episode-placeholder.jpg" }],
                external_urls: { spotify: "https://open.spotify.com/show/1NYjnHtTBY1KRXkVIwUzjr" }
            },
            {
                name: "Machine Learning Ethics",
                description: "We discuss the ethical considerations of implementing machine learning systems and how to ensure AI is developed responsibly.",
                release_date: "2023-04-30",
                duration_ms: 1920000,
                images: [{ url: "/images/episode-placeholder.jpg" }],
                external_urls: { spotify: "https://open.spotify.com/show/1NYjnHtTBY1KRXkVIwUzjr" }
            },
            {
                name: "AI and Creative Industries",
                description: "How is AI changing creative fields like art, music, and writing? We talk with experts about the intersection of creativity and artificial intelligence.",
                release_date: "2023-04-15",
                duration_ms: 1740000,
                images: [{ url: "/images/episode-placeholder.jpg" }],
                external_urls: { spotify: "https://open.spotify.com/show/1NYjnHtTBY1KRXkVIwUzjr" }
            }
        ];
        
        renderEpisodes(fallbackEpisodes);
        
        // Add a notice about using fallback data
        const notice = document.createElement('div');
        notice.className = 'col-span-full text-center text-amber-600 mb-8';
        notice.innerHTML = 'Note: We\'re currently experiencing issues connecting to Spotify. Showing placeholder content.';
        episodesContainer.parentNode.insertBefore(notice, episodesContainer);
    }
    
    function renderEpisodes(episodes) {
        episodesContainer.innerHTML = '';
        
        episodes.forEach(episode => {
            const episodeCard = document.createElement('div');
            episodeCard.className = 'podcast-card bg-white rounded-lg shadow-md overflow-hidden';
            
            const releaseDate = new Date(episode.release_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            const duration = formatDuration(episode.duration_ms);
            
            episodeCard.innerHTML = `
                <img src="${episode.images && episode.images[0]?.url || '/images/episode-placeholder.jpg'}" alt="${episode.name}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">${episode.name}</h3>
                    <div class="flex items-center text-sm text-gray-500 mb-3">
                        <span>${releaseDate}</span>
                        <span class="mx-2">•</span>
                        <span>${duration}</span>
                    </div>
                    <div class="episode-description text-gray-600 mb-4">${episode.html_description || episode.description}</div>
                    <div class="flex items-center justify-between">
                        ${episode.audio_preview_url ? `
                            <button class="play-preview-btn flex items-center text-sm font-medium text-gray-700 hover:text-gray-900" data-audio="${episode.audio_preview_url}">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                                </svg>
                                Play Preview
                            </button>
                        ` : ''}
                        <a href="${episode.external_urls.spotify}" target="_blank" class="listen-button text-sm font-medium text-white px-4 py-2 rounded-full">
                            Listen on Spotify
                        </a>
                    </div>
                </div>
                <button class="read-more-btn text-sm text-green-600 hover:text-green-700 px-6 pb-4" data-episode-id="${episode.id || 'fallback-' + episodes.indexOf(episode)}">
                    Read More
                </button>
            `;
            
            episodesContainer.appendChild(episodeCard);
        });
        
        // Add event listeners for audio preview buttons
        setupAudioPlayers();
        
        // Add event listeners for read more buttons
        setupReadMoreButtons(episodes);
    }
    
    function setupAudioPlayers() {
        let currentAudio = null;
        let currentButton = null;
        
        document.querySelectorAll('.play-preview-btn').forEach(button => {
            button.addEventListener('click', function() {
                const audioUrl = this.getAttribute('data-audio');
                if (!audioUrl) return;
                
                // If there's already audio playing, stop it
                if (currentAudio) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                    currentButton.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                        </svg>
                        Play Preview
                    `;
                }
                
                // If clicking the same button that's currently playing, just stop
                if (currentButton === this) {
                    currentAudio = null;
                    currentButton = null;
                    return;
                }
                
                // Create new audio element
                const audio = new Audio(audioUrl);
                audio.addEventListener('ended', () => {
                    this.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                        </svg>
                        Play Preview
                    `;
                    currentAudio = null;
                    currentButton = null;
                });
                
                // Handle errors
                audio.addEventListener('error', (e) => {
                    console.error('Audio playback error:', e);
                    this.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                        </svg>
                        Error Playing
                    `;
                    currentAudio = null;
                    currentButton = null;
                });
                
                // Play the audio
                audio.play().catch(err => {
                    console.error('Failed to play audio:', err);
                    this.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                        </svg>
                        Playback Failed
                    `;
                });
                
                this.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                Pause
                `;
                
                currentAudio = audio;
                currentButton = this;
            });
        });
    }
    
    function setupReadMoreButtons(episodes) {
        // Create modal if it doesn't exist
        if (!document.getElementById('episode-modal')) {
            const modal = document.createElement('div');
            modal.id = 'episode-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2 id="modal-title" class="text-2xl font-bold mb-2"></h2>
                    <div class="flex items-center text-sm text-gray-500 mb-4">
                        <span id="modal-date"></span>
                        <span class="mx-2">•</span>
                        <span id="modal-duration"></span>
                    </div>
                    <div id="modal-description" class="full-description"></div>
                    <div class="mt-6">
                        <a id="modal-spotify-link" href="#" target="_blank" class="listen-button inline-block text-sm font-medium text-white px-4 py-2 rounded-full">
                            Listen on Spotify
                        </a>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Close modal when clicking the X
            document.querySelector('.close').addEventListener('click', function() {
                document.getElementById('episode-modal').style.display = 'none';
            });
            
            // Close modal when clicking outside the content
            window.addEventListener('click', function(event) {
                if (event.target === document.getElementById('episode-modal')) {
                    document.getElementById('episode-modal').style.display = 'none';
                }
            });
        }
        
        // Add click event to read more buttons
        document.querySelectorAll('.read-more-btn').forEach(button => {
            button.addEventListener('click', function() {
                const episodeId = this.getAttribute('data-episode-id');
                const episode = episodes.find(ep => (ep.id || 'fallback-' + episodes.indexOf(ep)) === episodeId);
                
                if (episode) {
                    const modal = document.getElementById('episode-modal');
                    const modalTitle = document.getElementById('modal-title');
                    const modalDate = document.getElementById('modal-date');
                    const modalDuration = document.getElementById('modal-duration');
                    const modalDescription = document.getElementById('modal-description');
                    const modalSpotifyLink = document.getElementById('modal-spotify-link');
                    
                    modalTitle.textContent = episode.name;
                    modalDate.textContent = new Date(episode.release_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    modalDuration.textContent = formatDuration(episode.duration_ms);
                    modalDescription.innerHTML = episode.html_description || episode.description;
                    modalSpotifyLink.href = episode.external_urls.spotify;
                    
                    modal.style.display = 'block';
                }
            });
        });
    }
    
    // Tab switching functionality
    window.switchTab = function(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });
        
        if (tabName === 'all') {
            document.getElementById('all-episodes-tab').style.display = 'block';
        } else if (tabName === 'categories') {
            document.getElementById('categories-episodes-tab').style.display = 'block';
            // If switching to categories tab and it hasn't been populated yet
            if (!document.querySelector('.category-section')) {
                organizeCategoriesTab();
            }
        }
    };
    
    function organizeCategoriesTab() {
        // This would organize episodes by category
        // For now, just create a placeholder
        const categoriesTab = document.getElementById('categories-episodes-tab');
        if (categoriesTab) {
            categoriesTab.innerHTML = '<p class="text-center text-gray-500">Categories coming soon...</p>';
        }
    }
    
    // Format duration from milliseconds to MM:SS
    function formatDuration(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
});