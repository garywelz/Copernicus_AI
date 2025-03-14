#!/usr/bin/env python3
import json
import os
import requests
import time
import sys
from pydub import AudioSegment
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get the ElevenLabs API key
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not ELEVENLABS_API_KEY:
    raise ValueError("ELEVENLABS_API_KEY not found in environment variables")

# Maximum number of retries for API calls
MAX_RETRIES = 3
# Delay between retries (in seconds)
RETRY_DELAY = 5
# Delay between API calls to avoid rate limiting (in seconds)
API_CALL_DELAY = 2

# Function to generate audio using ElevenLabs API with retry logic
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
    
    for attempt in range(MAX_RETRIES):
    # Define paths to JSON files
    json_dir = os.path.join("src", "data", "news_json_archive")
    json_file1 = os.path.join(json_dir, "science_news_podcast.json")
    json_file2 = os.path.join(json_dir, "science_news_podcast_part2.json")
    
        try:
            response = requests.post(url, json=data, headers=headers, timeout=60)
            
            if response.status_code == 200:
                return response.content
            elif response.status_code == 429:  # Rate limit exceeded
                wait_time = int(response.headers.get('Retry-After', RETRY_DELAY * (attempt + 1)))
                print(f"Rate limit exceeded. Waiting {wait_time} seconds before retry...")
                time.sleep(wait_time)
            else:
                print(f"Error: {response.status_code}")
                print(response.text)
                time.sleep(RETRY_DELAY * (attempt + 1))
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            time.sleep(RETRY_DELAY * (attempt + 1))
    
    print(f"Failed to generate audio after {MAX_RETRIES} attempts")
    return None

# Function to process a podcast part with progress tracking
def process_podcast_part(podcast_data, output_folder, part_name, start_from=0):
    segments = podcast_data["segments"]
    combined_audio = AudioSegment.empty()
    progress_file = os.path.join(output_folder, f"{part_name}_progress.json")
    
    # Load progress if exists
    if os.path.exists(progress_file) and start_from == 0:
        try:
            with open(progress_file, 'r') as f:
                progress_data = json.load(f)
                start_from = progress_data.get('last_processed_segment', 0) + 1
                print(f"Resuming from segment {start_from}")
                
                # Load previously combined audio if it exists
                temp_combined_file = os.path.join(output_folder, f"{part_name}_combined_temp.mp3")
                if os.path.exists(temp_combined_file):
                    combined_audio = AudioSegment.from_mp3(temp_combined_file)
        except Exception as e:
            print(f"Error loading progress: {e}")
            start_from = 0
    
    for i in range(start_from, len(segments)):
        segment = segments[i]
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
            
            # Save progress
            with open(progress_file, 'w') as f:
                json.dump({'last_processed_segment': i}, f)
            
            # Save combined audio so far
            temp_combined_file = os.path.join(output_folder, f"{part_name}_combined_temp.mp3")
            combined_audio.export(temp_combined_file, format="mp3", bitrate="192k")
            
            # Sleep to avoid rate limiting
            time.sleep(API_CALL_DELAY)
            
            # Remove the temporary segment file
            try:
                os.remove(temp_file)
            except Exception as e:
                print(f"Warning: Could not remove temp file: {e}")
        else:
            print(f"Failed to generate audio for segment {i+1}. Saving progress and exiting.")
            sys.exit(1)
    
    # Clean up progress files
    try:
        if os.path.exists(progress_file):
            os.remove(progress_file)
        temp_combined_file = os.path.join(output_folder, f"{part_name}_combined_temp.mp3")
        if os.path.exists(temp_combined_file):
            os.remove(temp_combined_file)
    except Exception as e:
        print(f"Warning: Could not clean up temporary files: {e}")
    
    return combined_audio

# Function to add intro and outro bumpers
def add_bumpers(audio, crossfade_ms=500):
    """Add intro and outro bumpers to the podcast audio"""
    try:
        # Load intro and outro
        intro = AudioSegment.from_mp3("assets/music/copernicus-intro.mp3")
        outro = AudioSegment.from_mp3("assets/music/copernicus-outro.mp3")
        
        print(f"Adding intro with {crossfade_ms}ms crossfade...")
        combined = intro.append(audio, crossfade=crossfade_ms)
        
        print(f"Adding outro with {crossfade_ms}ms crossfade...")
        combined = combined.append(outro, crossfade=crossfade_ms)
        
        return combined
    except Exception as e:
        print(f"Error adding bumpers: {e}")
        # Return original audio if bumpers can't be added
        return audio

# Main function
def main():
    # Create output directory
    output_folder = "output"
    os.makedirs(output_folder, exist_ok=True)
    
    # Load the podcast parts
    try:
        with open(json_file1, "r") as f:
            podcast_part1 = json.load(f)
        
        with open(json_file2, "r") as f:
            podcast_part2 = json.load(f)
    except FileNotFoundError as e:
        print(f"Error: {e}")
        print("Please run create_science_news_podcast.py and create_science_news_podcast_part2.py first")
        return
    
    # Check if final output already exists
    output_file = os.path.join(output_folder, "science-news-episode1.mp3")
    if os.path.exists(output_file):
        print(f"Output file {output_file} already exists. Regenerating...")
        # No interactive prompt, just proceed with regeneration
    
    # Process part 1
    print("Processing part 1...")
    part1_file = os.path.join(output_folder, "science-news-part1.mp3")
    if os.path.exists(part1_file):
        print(f"Part 1 already processed. Loading from {part1_file}")
        audio_part1 = AudioSegment.from_mp3(part1_file)
    else:
        audio_part1 = process_podcast_part(podcast_part1, output_folder, "science_part1")
        audio_part1.export(part1_file, format="mp3", bitrate="192k")
        print(f"Part 1 completed and saved to {part1_file}")
    
    # Process part 2
    print("Processing part 2...")
    part2_file = os.path.join(output_folder, "science-news-part2.mp3")
    if os.path.exists(part2_file):
        print(f"Part 2 already processed. Loading from {part2_file}")
        audio_part2 = AudioSegment.from_mp3(part2_file)
    else:
        audio_part2 = process_podcast_part(podcast_part2, output_folder, "science_part2")
        audio_part2.export(part2_file, format="mp3", bitrate="192k")
        print(f"Part 2 completed and saved to {part2_file}")
    
    # Combine the parts and add bumpers
    print("Combining parts and adding bumpers...")
    try:
        # Make sure both audio parts are loaded
        if not audio_part1 or len(audio_part1) == 0:
            print("Reloading part 1 audio...")
            audio_part1 = AudioSegment.from_mp3(part1_file)
        
        if not audio_part2 or len(audio_part2) == 0:
            print("Reloading part 2 audio...")
            audio_part2 = AudioSegment.from_mp3(part2_file)
        
        # Add a slightly longer pause between parts
        combined_audio = audio_part1 + AudioSegment.silent(duration=1000) + audio_part2
        
        # Add intro and outro bumpers
        final_audio = add_bumpers(combined_audio)
        
        # Export the final audio as MP3
        final_audio.export(output_file, format="mp3", bitrate="192k")
        
        # Verify the file was created successfully
        if os.path.exists(output_file) and os.path.getsize(output_file) > 0:
            print(f"Podcast generated successfully! Saved to: {output_file}")
        else:
            print(f"Error: Failed to create podcast file or file is empty.")
    except Exception as e:
        print(f"Error combining audio parts: {e}")
        # Try a different approach using system commands
        try:
            print("Attempting to combine files using system command...")
            import subprocess
            
            # First combine the two parts
            temp_combined = os.path.join(output_folder, "science-news-combined-temp.mp3")
            cmd1 = f"ffmpeg -y -i {part1_file} -i {part2_file} -filter_complex '[0:0][1:0]concat=n=2:v=0:a=1[out]' -map '[out]' {temp_combined}"
            subprocess.run(cmd1, shell=True, check=True)
            
            # Then add bumpers
            intro_file = "assets/music/copernicus-intro.mp3"
            outro_file = "assets/music/copernicus-outro.mp3"
            cmd2 = f"ffmpeg -y -i {intro_file} -i {temp_combined} -i {outro_file} -filter_complex '[0:0][1:0][2:0]concat=n=3:v=0:a=1[out]' -map '[out]' {output_file}"
            subprocess.run(cmd2, shell=True, check=True)
            
            # Clean up
            if os.path.exists(temp_combined):
                os.remove(temp_combined)
            
            if os.path.exists(output_file) and os.path.getsize(output_file) > 0:
                print(f"Podcast generated successfully using ffmpeg! Saved to: {output_file}")
            else:
                print(f"Error: Failed to create podcast file using ffmpeg.")
        except Exception as e2:
            print(f"Error using ffmpeg: {e2}")

if __name__ == "__main__":
    main() 