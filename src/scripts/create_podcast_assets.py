#!/usr/bin/env python3
import os
import requests
import time
from pydub import AudioSegment
from pydub.generators import Sine

def create_assets_directory():
    """Create the assets directory if it doesn't exist."""
    assets_dir = "assets"
    if not os.path.exists(assets_dir):
        os.makedirs(assets_dir)
        print(f"Created assets directory: {assets_dir}")
    else:
        print(f"Assets directory already exists: {assets_dir}")
    return assets_dir

def create_placeholder_music(assets_dir, filename, duration_ms=15000, is_intro=True):
    """Create a placeholder music file with a simple melody."""
    filepath = os.path.join(assets_dir, filename)
    
    # Check if file already exists
    if os.path.exists(filepath):
        print(f"Music file already exists: {filepath}")
        return filepath
    
    # Create a simple melody using sine waves
    audio = AudioSegment.silent(duration=duration_ms)
    
    # Different notes for intro and outro
    if is_intro:
        # Intro music - more energetic
        notes = [440, 523, 659, 784]  # A4, C5, E5, G5
        beat_duration = 250  # milliseconds
    else:
        # Outro music - more mellow
        notes = [392, 440, 523, 587]  # G4, A4, C5, D5
        beat_duration = 300  # milliseconds
    
    # Create a simple melody
    current_position = 0
    for i in range(int(duration_ms / beat_duration)):
        note = notes[i % len(notes)]
        # Create a sine wave for this note
        sine_wave = Sine(note).to_audio_segment(duration=beat_duration)
        # Adjust volume
        sine_wave = sine_wave - 10  # reduce volume by 10 dB
        # Add to the audio at the current position
        audio = audio.overlay(sine_wave, position=current_position)
        current_position += beat_duration
    
    # Add fade in/out
    if is_intro:
        audio = audio.fade_in(1000).fade_out(3000)
    else:
        audio = audio.fade_in(3000).fade_out(1000)
    
    # Export as MP3
    audio.export(filepath, format="mp3", bitrate="192k")
    print(f"Created placeholder music file: {filepath}")
    return filepath

def download_music_if_available(assets_dir, filename, url):
    """Try to download music from a URL if available."""
    filepath = os.path.join(assets_dir, filename)
    
    # Check if file already exists
    if os.path.exists(filepath):
        print(f"Music file already exists: {filepath}")
        return filepath
    
    # Try to download the file
    try:
        print(f"Attempting to download music from: {url}")
        response = requests.get(url, timeout=30)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                f.write(response.content)
            print(f"Downloaded music file: {filepath}")
            return filepath
        else:
            print(f"Failed to download music. Status code: {response.status_code}")
            return None
    except Exception as e:
        print(f"Error downloading music: {e}")
        return None

def main():
    # Create assets directory
    assets_dir = create_assets_directory()
    
    # Define music filenames
    intro_music_file = "podcast_intro_music.mp3"
    outro_music_file = "podcast_outro_music.mp3"
    
    # Try to download music from URLs (replace with actual URLs if available)
    intro_music_url = os.getenv("INTRO_MUSIC_URL", "")
    outro_music_url = os.getenv("OUTRO_MUSIC_URL", "")
    
    # Try to download intro music
    if intro_music_url:
        if not download_music_if_available(assets_dir, intro_music_file, intro_music_url):
            # If download fails, create placeholder
            create_placeholder_music(assets_dir, intro_music_file, is_intro=True)
    else:
        # Create placeholder intro music
        create_placeholder_music(assets_dir, intro_music_file, is_intro=True)
    
    # Try to download outro music
    if outro_music_url:
        if not download_music_if_available(assets_dir, outro_music_file, outro_music_url):
            # If download fails, create placeholder
            create_placeholder_music(assets_dir, outro_music_file, is_intro=False)
    else:
        # Create placeholder outro music
        create_placeholder_music(assets_dir, outro_music_file, is_intro=False)
    
    print("Podcast assets setup complete!")

if __name__ == "__main__":
    main() 