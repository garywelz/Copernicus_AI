# Core Podcast Generation Scripts

This directory contains the core scripts responsible for generating and enhancing podcasts.

## Files

- `generate_podcast.py`: Main script for generating podcasts using GPT-4 and TTS
- `enhance_podcast.py`: Adds visual enhancements to podcasts
- `add_bumpers.py`: Handles audio bumpers and transitions
- `create_podcast_assets.py`: Creates necessary assets for podcast production

## Usage

These scripts work together to create high-quality podcasts:
1. `create_podcast_assets.py` should be run first to ensure all required assets are available
2. `generate_podcast.py` creates the main podcast content
3. `add_bumpers.py` adds audio transitions and bumpers
4. `enhance_podcast.py` adds visual elements to the podcast

## Dependencies

- OpenAI API (GPT-4)
- Text-to-Speech Service
- Audio processing libraries
- Image processing libraries 