# Podcast Generation Scripts

This directory contains all scripts for generating and managing science podcasts.

## Directory Structure

- `core/`: Core podcast generation scripts
- `news/`: Science news podcast generation scripts
- `utils/`: Utility and maintenance scripts
- `batch/`: Batch processing scripts
- `legacy_news_scripts/`: Original individual news scripts (for reference)

## Quick Start

1. Set up API keys:
   ```bash
   python utils/set_api_key.py
   ```

2. Generate a single podcast:
   ```bash
   python core/generate_podcast.py --subject physics
   ```

3. Generate news podcasts:
   ```bash
   python news/generate_news.py --subject physics
   ```

4. Generate all podcasts:
   ```bash
   python batch/generate_all_podcasts.py
   ```

## Dependencies

- Python 3.8+
- OpenAI API
- ElevenLabs API
- News API
- Various audio and image processing libraries

## Environment Variables

Required environment variables:
- `OPENAI_API_KEY`
- `ELEVENLABS_API_KEY`
- `NEWS_API_KEY`
- `GOOGLE_APPLICATION_CREDENTIALS`

## Documentation

Each subdirectory contains its own README with detailed information about its scripts and usage. 