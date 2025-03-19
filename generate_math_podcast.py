#!/usr/bin/env python3
import os
import re
import requests
import time
import json
import random
from pydub import AudioSegment
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get the ElevenLabs API key
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not ELEVENLABS_API_KEY:
    raise ValueError("ELEVENLABS_API_KEY not found in environment variables")

# Define voice IDs for different speakers
VOICE_IDS = {
    "Elena": "EXAVITQu4vr4xnSDxMaL",  # Female voice
    "Marcus": "pNInz6obpgDQGcFmaJgB",  # Male voice
    "Priya": "jsCqWAovK2LkecY7zXl4",   # Female voice
    "Wei": "TxGEqnHWrfWFTfGW9XjX",     # Male voice
    "Daria": "AZnzlk1XvdvUeBnXmlld"    # Female voice
}

# Function to generate audio using ElevenLabs API with retry logic
def generate_audio(text, voice_id, max_retries=3, segment_index=None):
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
    
    # Check if we already have this segment cached
    cache_dir = "/home/gdubs/copernicus/output/audio_cache"
    os.makedirs(cache_dir, exist_ok=True)
    
    if segment_index is not None:
        cache_file = os.path.join(cache_dir, f"segment_{segment_index}.mp3")
        if os.path.exists(cache_file):
            print(f"Using cached audio for segment {segment_index}")
            with open(cache_file, "rb") as f:
                return f.read()
    
    # Try to generate audio with retries
    for attempt in range(max_retries):
        try:
            response = requests.post(url, json=data, headers=headers)
            
            if response.status_code == 200:
                # If successful, cache the result
                if segment_index is not None:
                    with open(cache_file, "wb") as f:
                        f.write(response.content)
                return response.content
            elif response.status_code == 401 and "quota_exceeded" in response.text:
                print(f"API quota exceeded. Response: {response.text}")
                # If this is not the last retry, wait and try again
                if attempt < max_retries - 1:
                    wait_time = (2 ** attempt) + random.random()
                    print(f"Waiting {wait_time:.2f} seconds before retry {attempt + 1}/{max_retries}...")
                    time.sleep(wait_time)
                else:
                    print("Maximum retries reached. Unable to generate audio due to quota limits.")
                    return None
            else:
                print(f"Error: {response.status_code}")
                print(response.text)
                # If this is not the last retry, wait and try again
                if attempt < max_retries - 1:
                    wait_time = (2 ** attempt) + random.random()
                    print(f"Waiting {wait_time:.2f} seconds before retry {attempt + 1}/{max_retries}...")
                    time.sleep(wait_time)
                else:
                    print(f"Maximum retries reached. Failed to generate audio for segment.")
                    return None
        except Exception as e:
            print(f"Exception during API call: {str(e)}")
            if attempt < max_retries - 1:
                wait_time = (2 ** attempt) + random.random()
                print(f"Waiting {wait_time:.2f} seconds before retry {attempt + 1}/{max_retries}...")
                time.sleep(wait_time)
            else:
                print("Maximum retries reached. Failed to generate audio.")
                return None
    
    return None

# Function to parse the transcript
def parse_transcript(transcript_path):
    with open(transcript_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Extract segments using regex
    # Pattern matches: **Speaker** or **Speaker:** followed by text content
    pattern = r'\*\*(.*?)\*\*\s+(.*?)(?=\n\*\*|\n\[MUSIC|\Z)'
    segments = []
    
    for match in re.finditer(pattern, content, re.DOTALL):
        speaker = match.group(1).strip()
        text = match.group(2).strip()
        
        # Skip if it's a music indication or publication date
        if speaker.startswith("MUSIC") or speaker.startswith("Publication Date"):
            continue
        
        # Remove colon from speaker name if present
        if speaker.endswith(':'):
            speaker = speaker[:-1]
        
        # Check if this is a section heading (not a speaker)
        is_section_heading = speaker not in VOICE_IDS.keys()
        
        segments.append({
            "speaker": speaker,
            "text": text,
            "is_section_heading": is_section_heading
        })
    
    return segments

# Main function
def main():
    # Define paths
    transcript_path = "/home/gdubs/copernicus/output/math-news-ep1-transcript.md"
    output_folder = "/home/gdubs/copernicus/output"
    intro_bumper_path = "/home/gdubs/copernicus/assets/music/copernicus-intro.mp3"
    outro_bumper_path = "/home/gdubs/copernicus/assets/music/copernicus-outro.mp3"
    output_file = os.path.join(output_folder, "math-news-episode1.mp3")
    
    # Create output directory if it doesn't exist
    os.makedirs(output_folder, exist_ok=True)
    
    # Check if we have any cached segments
    cache_dir = "/home/gdubs/copernicus/output/audio_cache"
    os.makedirs(cache_dir, exist_ok=True)
    cached_segments = [f for f in os.listdir(cache_dir) if f.startswith("segment_") and f.endswith(".mp3")]
    
    if cached_segments:
        print(f"Found {len(cached_segments)} cached segments. Generating partial podcast...")
        
        # Create an empty audio segment
        combined_audio = AudioSegment.empty()
        
        # Add intro bumper
        print("Adding intro bumper...")
        intro_bumper = AudioSegment.from_mp3(intro_bumper_path)
        combined_audio += intro_bumper
        
        # Add a short pause after the intro
        combined_audio += AudioSegment.silent(duration=500)
        
        # Add a note about this being a partial podcast due to API limits
        print("Adding note about partial podcast...")
        combined_audio += AudioSegment.silent(duration=1000)
        
        # Sort cached segments by index
        cached_segments.sort(key=lambda x: int(x.split("_")[1].split(".")[0]))
        
        # Add each cached segment
        for segment_file in cached_segments:
            segment_index = int(segment_file.split("_")[1].split(".")[0])
            print(f"Adding cached segment {segment_index}...")
            
            segment_path = os.path.join(cache_dir, segment_file)
            segment_audio = AudioSegment.from_mp3(segment_path)
            combined_audio += segment_audio
            
            # Add a short pause between segments
            combined_audio += AudioSegment.silent(duration=300)
        
        # Add outro bumper
        print("Adding outro bumper...")
        outro_bumper = AudioSegment.from_mp3(outro_bumper_path)
        combined_audio += outro_bumper
        
        # Export the partial podcast
        partial_output_file = os.path.join(output_folder, "math-news-episode1-partial.mp3")
        print(f"Exporting partial podcast to {partial_output_file}...")
        combined_audio.export(partial_output_file, format="mp3")
        
        print(f"Partial podcast generated successfully! Saved to: {partial_output_file}")
        print("Note: This is a partial podcast due to ElevenLabs API quota limitations.")
        print("To generate the full podcast, please wait for your API quota to reset or increase your quota.")
        
        # Continue with normal processing to try to generate the full podcast
        print("\nAttempting to generate full podcast...")
    
    print("Parsing transcript...")
    segments = parse_transcript(transcript_path)
    
    print(f"Found {len(segments)} segments")
    
    # Create an empty audio segment
    combined_audio = AudioSegment.empty()
    
    # Add intro bumper
    print("Adding intro bumper...")
    intro_bumper = AudioSegment.from_mp3(intro_bumper_path)
    combined_audio += intro_bumper
    
    # Add a short pause after the intro
    combined_audio += AudioSegment.silent(duration=500)
    
    # Process each segment
    for i, segment in enumerate(segments):
        speaker = segment["speaker"]
        text = segment["text"]
        is_section_heading = segment["is_section_heading"]
        
        print(f"Processing segment {i+1}/{len(segments)}: {speaker}")
        
        # For section headings, don't generate audio
        if is_section_heading:
            print(f"Warning: No voice ID found for {speaker}. Using default voice.")
            # Add a short pause for section transitions
            combined_audio += AudioSegment.silent(duration=1000)
            continue
        
        # For actual speakers, we only want to use the text without repeating the speaker name
        # The speaker is already identified in the transcript with asterisks
        full_text = text
        
        # Get the voice ID for the speaker
        voice_id = VOICE_IDS.get(speaker)
        if not voice_id:
            print(f"Warning: No voice ID found for {speaker}. Using default voice.")
            voice_id = list(VOICE_IDS.values())[0]  # Use the first voice as default
        
        # Generate audio for the segment
        audio_data = generate_audio(full_text, voice_id, segment_index=i)
        
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
            
            # Clean up temporary file
            os.remove(temp_file)
        else:
            print(f"Failed to generate audio for segment {i+1}")
            # Add a silent segment as a placeholder
            combined_audio += AudioSegment.silent(duration=500)
    
    # Add outro bumper
    print("Adding outro bumper...")
    outro_bumper = AudioSegment.from_mp3(outro_bumper_path)
    combined_audio += outro_bumper
    
    # Export the final audio
    print(f"Exporting final audio to {output_file}...")
    combined_audio.export(output_file, format="mp3")
    
    print(f"Podcast generated successfully! Saved to: {output_file}")

if __name__ == "__main__":
    main() 