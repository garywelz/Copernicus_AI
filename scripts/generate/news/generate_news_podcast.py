#!/usr/bin/env python3
import json
import os
import requests
import time
import argparse
from pydub import AudioSegment
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get the ElevenLabs API key
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not ELEVENLABS_API_KEY:
    raise ValueError("ELEVENLABS_API_KEY not found in environment variables")

# Valid subjects
VALID_SUBJECTS = ["biology", "chemistry", "compsci", "math", "physics", "science"]

# Function to generate audio using ElevenLabs API
def generate_audio(text, voice_id):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }
    
    data = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }
    
    response = requests.post(url, json=data, headers=headers)
    
    if response.status_code == 200:
        return response.content
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        return None

# Function to process a podcast part
def process_podcast_part(podcast_data, output_folder):
    segments = podcast_data["segments"]
    combined_audio = AudioSegment.empty()
    
    for i, segment in enumerate(segments):
        print(f"Processing segment {i+1}/{len(segments)}: {segment['speaker']['name']}")
        
        # Generate audio for the segment
        audio_data = generate_audio(segment["text"], segment["speaker"]["voice_id"])
        
        if audio_data:
            # Save the segment audio temporarily
            temp_file = os.path.join(output_folder, f"temp_segment_{i}.mp3")
            with open(temp_file, "wb") as f:
                f.write(audio_data)
            
            # Load the segment audio and add it to the combined audio
            segment_audio = AudioSegment.from_mp3(temp_file)
            combined_audio += segment_audio
            
            # Add a short pause between segments
            combined_audio += AudioSegment.silent(duration=300)
            
            # Remove the temporary file
            os.remove(temp_file)
            
            # Sleep to avoid rate limiting
            time.sleep(1)
        else:
            print(f"Failed to generate audio for segment {i+1}")
    
    return combined_audio

# Main function
def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="Generate a news podcast for a specific subject")
    parser.add_argument("subject", choices=VALID_SUBJECTS, help="Subject of the news podcast")
    parser.add_argument("--episode", type=int, default=1, help="Episode number (default: 1)")
    parser.add_argument("--output-dir", default="output", help="Output directory (default: output)")
    args = parser.parse_args()
    
    subject = args.subject
    episode_num = args.episode
    output_folder = args.output_dir
    
    print(f"Generating {subject.capitalize()} News podcast episode {episode_num}...")
    
    # Create output directory
    os.makedirs(output_folder, exist_ok=True)
    
    # Define paths to JSON files
    json_dir = os.path.join("src", "data", "news_json_archive")
    json_file1 = os.path.join(json_dir, f"{subject}_news_podcast.json")
    json_file2 = os.path.join(json_dir, f"{subject}_news_podcast_part2.json")
    
    # Load the podcast parts
    try:
        with open(json_file1, "r") as f:
            podcast_part1 = json.load(f)
        
        with open(json_file2, "r") as f:
            podcast_part2 = json.load(f)
    except FileNotFoundError as e:
        print(f"Error: {e}")
        print(f"Please run create_{subject}_news_podcast.py and create_{subject}_news_podcast_part2.py first")
        return
    
    # Process each part
    print("Processing part 1...")
    audio_part1 = process_podcast_part(podcast_part1, output_folder)
    
    print("Processing part 2...")
    audio_part2 = process_podcast_part(podcast_part2, output_folder)
    
    # Combine the parts
    combined_audio = audio_part1 + audio_part2
    
    # Export the final audio
    output_file = os.path.join(output_folder, f"{subject}-news-episode{episode_num}.wav")
    combined_audio.export(output_file, format="wav")
    
    print(f"Podcast generated successfully! Saved to: {output_file}")

if __name__ == "__main__":
    main() 