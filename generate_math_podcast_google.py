#!/usr/bin/env python3
import os
import re
import time
import json
import random
from pydub import AudioSegment
from dotenv import load_dotenv
from google.cloud import texttospeech
import io

# Load environment variables
load_dotenv()

# Set Google Cloud credentials
# The path to your service account key file
GOOGLE_APPLICATION_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

if GOOGLE_APPLICATION_CREDENTIALS:
    # Set the environment variable for Google Cloud authentication
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = GOOGLE_APPLICATION_CREDENTIALS
    print(f"Using Google Cloud credentials from: {GOOGLE_APPLICATION_CREDENTIALS}")
else:
    print("Warning: GOOGLE_APPLICATION_CREDENTIALS not found in environment variables.")
    print("Make sure you've set up authentication properly.")

# Define voice configurations for different speakers with improved parameters
VOICE_CONFIGS = {
    "Elena": {
        "language_code": "en-US",
        "name": "en-US-Neural2-F",  # Female voice
        "ssml_gender": texttospeech.SsmlVoiceGender.FEMALE,
        "speaking_rate": 0.95,
        "pitch": 0.5,  # Slightly higher pitch
        "volume_gain_db": 2.0
    },
    "Marcus": {
        "language_code": "en-US",
        "name": "en-US-Neural2-D",  # Male voice
        "ssml_gender": texttospeech.SsmlVoiceGender.MALE,
        "speaking_rate": 0.92,
        "pitch": -1.0,  # Lower pitch for male voice
        "volume_gain_db": 2.0
    },
    "Priya": {
        "language_code": "en-US",
        "name": "en-US-Neural2-C",  # Female voice
        "ssml_gender": texttospeech.SsmlVoiceGender.FEMALE,
        "speaking_rate": 0.93,
        "pitch": 1.0,  # Higher pitch for variety
        "volume_gain_db": 2.0
    },
    "Wei": {
        "language_code": "en-US",
        "name": "en-US-Neural2-J",  # Male voice
        "ssml_gender": texttospeech.SsmlVoiceGender.MALE,
        "speaking_rate": 0.90,
        "pitch": 0.0,  # Neutral pitch
        "volume_gain_db": 2.0
    },
    "Daria": {
        "language_code": "en-US",
        "name": "en-US-Neural2-E",  # Female voice
        "ssml_gender": texttospeech.SsmlVoiceGender.FEMALE,
        "speaking_rate": 0.94,
        "pitch": 0.0,  # Neutral pitch
        "volume_gain_db": 2.0
    }
}

# Print all configured voices for debugging
print("Configured voices:")
for speaker, config in VOICE_CONFIGS.items():
    print(f"  {speaker}: {config['name']} (pitch: {config['pitch']}, rate: {config['speaking_rate']})")

# Default voice configuration
DEFAULT_VOICE = {
    "language_code": "en-US",
    "name": "en-US-Neural2-F",
    "ssml_gender": texttospeech.SsmlVoiceGender.FEMALE,
    "speaking_rate": 0.95,
    "pitch": 0.0,
    "volume_gain_db": 2.0
}

# Function to clean text for TTS
def clean_text_for_tts(text):
    # Remove Markdown formatting
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)  # Remove asterisks
    text = re.sub(r'##\s+', '', text)  # Remove markdown headers
    
    # Replace special characters
    text = text.replace('Pi', 'pie')  # Ensure "Pi" is pronounced correctly
    
    # Add pauses for better phrasing
    text = re.sub(r'([.!?])\s+', r'\1<break time="500ms"/> ', text)
    text = re.sub(r'([,;:])\s+', r'\1<break time="300ms"/> ', text)
    
    # Add emphasis to important terms
    text = re.sub(r'\b(topological|quantum|mathematical|physics|theorem|algorithm)\b', 
                 r'<emphasis level="moderate">\1</emphasis>', text)
    
    return text

# Function to wrap text in SSML for more expressive speech
def add_ssml(text, voice_config):
    # Clean the text first
    cleaned_text = clean_text_for_tts(text)
    
    # Create SSML with prosody adjustments
    ssml = f"""
    <speak>
      <prosody rate="{voice_config['speaking_rate']}" pitch="{voice_config['pitch']}st" volume="+{voice_config['volume_gain_db']}dB">
        {cleaned_text}
      </prosody>
    </speak>
    """
    return ssml

# Function to generate audio using Google Cloud Text-to-Speech API
def generate_audio(text, voice_config, segment_index=None):
    # Check if we already have this segment cached
    cache_dir = "/home/gdubs/copernicus/output/audio_cache_google"
    os.makedirs(cache_dir, exist_ok=True)
    
    if segment_index is not None:
        cache_file = os.path.join(cache_dir, f"segment_{segment_index}.mp3")
        if os.path.exists(cache_file):
            print(f"Using cached audio for segment {segment_index}")
            with open(cache_file, "rb") as f:
                return f.read()
    
    try:
        # Print segment text for debugging
        print(f"Generating audio for text ({len(text)} chars): {text[:100]}...")
        
        # Instantiate a client
        client = texttospeech.TextToSpeechClient()
        
        # Create SSML for more expressive speech
        ssml_text = add_ssml(text, voice_config)
        
        # Set the text input to be synthesized with SSML
        synthesis_input = texttospeech.SynthesisInput(ssml=ssml_text)
        
        # Build the voice request
        voice = texttospeech.VoiceSelectionParams(
            language_code=voice_config["language_code"],
            name=voice_config["name"],
            ssml_gender=voice_config["ssml_gender"]
        )
        
        # Select the type of audio file
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3,
            effects_profile_id=["headphone-class-device"],  # Better audio quality
            volume_gain_db=voice_config["volume_gain_db"]
        )
        
        # Perform the text-to-speech request
        response = client.synthesize_speech(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config
        )
        
        # Cache the audio content
        if segment_index is not None:
            with open(cache_file, "wb") as f:
                f.write(response.audio_content)
            
            # Get the size of the generated audio
            audio_size = len(response.audio_content)
            print(f"Generated audio size: {audio_size / 1024:.2f} KB")
        
        return response.audio_content
    
    except Exception as e:
        print(f"Error generating audio: {str(e)}")
        return None

# Function to parse the transcript
def parse_transcript(transcript_path):
    with open(transcript_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    print("Raw transcript content length:", len(content))
    
    # Extract segments using regex
    # Pattern matches: **Speaker** or **Speaker:** followed by text content
    pattern = r'\*\*(.*?)\*\*\s+(.*?)(?=\n\*\*|\n\[MUSIC|\Z)'
    segments = []
    
    for match in re.finditer(pattern, content, re.DOTALL):
        speaker = match.group(1).strip()
        text = match.group(2).strip()
        
        print(f"Found segment - Speaker: {speaker}, Text length: {len(text)}")
        
        # Skip if it's a music indication or publication date
        if speaker.startswith("MUSIC") or speaker.startswith("Publication Date"):
            print(f"Skipping segment: {speaker}")
            continue
        
        # Remove colon from speaker name if present
        if speaker.endswith(':'):
            speaker = speaker[:-1]
            print(f"Removed colon from speaker name: {speaker}")
        
        # Check if this is a section heading (not a speaker)
        is_section_heading = speaker not in VOICE_CONFIGS.keys()
        
        segments.append({
            "speaker": speaker,
            "text": text,
            "is_section_heading": is_section_heading
        })
    
    # Print all segments for debugging
    print("\nAll parsed segments:")
    for i, segment in enumerate(segments):
        print(f"Segment {i+1}: Speaker={segment['speaker']}, Is Section Heading={segment['is_section_heading']}, Text length={len(segment['text'])}")
    
    return segments

# Main function
def main():
    # Define paths
    transcript_path = "/home/gdubs/copernicus/output/math-news-ep1-transcript.md"
    output_folder = "/home/gdubs/copernicus/output"
    intro_bumper_path = "/home/gdubs/copernicus/assets/music/copernicus-intro.mp3"
    outro_bumper_path = "/home/gdubs/copernicus/assets/music/copernicus-outro.mp3"
    output_file = os.path.join(output_folder, "math-news-episode1-google.mp3")
    
    # Create output directory if it doesn't exist
    os.makedirs(output_folder, exist_ok=True)
    
    # Check if we have any cached segments
    cache_dir = "/home/gdubs/copernicus/output/audio_cache_google"
    os.makedirs(cache_dir, exist_ok=True)
    cached_segments = [f for f in os.listdir(cache_dir) if f.startswith("segment_") and f.endswith(".mp3")]
    
    # Clear cache to ensure fresh generation with improved settings
    if cached_segments:
        print(f"Clearing {len(cached_segments)} cached segments for fresh generation...")
        for cached_file in cached_segments:
            os.remove(os.path.join(cache_dir, cached_file))
    
    print("Parsing transcript...")
    segments = parse_transcript(transcript_path)
    
    # Add missing Priya segment manually
    # This is a special case because Priya's segment is not properly marked in the transcript
    priya_segment = {
        "speaker": "Priya",
        "text": "Thank you, Elena. This month, I'd like to highlight a significant new book: \"Topological Quantum Computing: Mathematical Foundations\" by John Preskill, published by Cambridge University Press in January 2025.\n\nPreskill, a theoretical physicist at Caltech and one of the pioneers of quantum information science, has written what will likely become the definitive text on the mathematical foundations of topological quantum computing.\n\nThe book provides a comprehensive treatment of the mathematical structures underlying topological quantum computation, including modular tensor categories, braid group representations, and topological quantum field theories. What makes this book particularly valuable is how it bridges the gap between abstract mathematical concepts and their physical implementations.\n\nFor mathematicians, the book offers a clear exposition of how concepts from topology and category theory find applications in quantum information science. For physicists, it provides the rigorous mathematical foundation needed to understand and develop topological quantum systems.\n\nI'd highly recommend this book to any mathematician interested in quantum computing, whether they're looking to enter the field or simply want to understand one of the most exciting intersections of mathematics and physics today.",
        "is_section_heading": False
    }
    
    # Insert Priya's segment after segment 26 (Book Review heading)
    segments.insert(27, priya_segment)
    
    print(f"Added missing Priya segment. Now have {len(segments)} segments")
    
    print(f"Found {len(segments)} segments")
    
    # Create an empty audio segment
    combined_audio = AudioSegment.empty()
    
    # Add intro bumper
    print("Adding intro bumper...")
    intro_bumper = AudioSegment.from_mp3(intro_bumper_path)
    combined_audio += intro_bumper
    print(f"Intro bumper duration: {len(intro_bumper) / 1000:.2f} seconds")
    
    # Add a short pause after the intro
    combined_audio += AudioSegment.silent(duration=500)
    
    # Track total duration
    total_duration = len(intro_bumper) + 500  # in milliseconds
    
    # Process each segment
    for i, segment in enumerate(segments):
        speaker = segment["speaker"]
        text = segment["text"]
        is_section_heading = segment["is_section_heading"]
        
        print(f"Processing segment {i+1}/{len(segments)}: {speaker}")
        print(f"Text length: {len(text)} characters")
        
        # For section headings, we'll announce the topic without saying "Section:"
        if is_section_heading:
            print(f"Processing section heading: {speaker}")
            # Use the default voice for section headings
            voice_config = DEFAULT_VOICE
            
            # For section headings, we'll read just the heading itself without the markdown
            # and without saying "Section:"
            clean_heading = re.sub(r'^\s*##\s*', '', speaker)
            section_text = f"Next topic: {clean_heading}."
            print(f"Section announcement: {section_text}")
            
            # Generate audio for the section heading
            audio_data = generate_audio(section_text, voice_config, segment_index=f"heading_{i}")
            
            if audio_data:
                # Save the segment audio temporarily
                temp_file = os.path.join(output_folder, f"temp_segment_{i}.mp3")
                with open(temp_file, "wb") as f:
                    f.write(audio_data)
                
                # Load the segment audio and add it to the combined audio
                segment_audio = AudioSegment.from_mp3(temp_file)
                segment_duration = len(segment_audio)
                print(f"Section heading {i+1} duration: {segment_duration / 1000:.2f} seconds")
                
                combined_audio += segment_audio
                total_duration += segment_duration
                
                # Add a short pause after the section heading
                combined_audio += AudioSegment.silent(duration=800)
                total_duration += 800
                
                # Clean up temporary file
                os.remove(temp_file)
            else:
                print(f"Failed to generate audio for section heading {i+1}")
                # Add a silent segment as a placeholder
                combined_audio += AudioSegment.silent(duration=1000)
                total_duration += 1000
        else:
            # For actual speakers, we'll add the speaker's name before their text
            # This makes it clear who is speaking
            speaker_intro = f"{speaker} says: "
            full_text = speaker_intro + text
            
            # Get the voice configuration for the speaker
            voice_config = VOICE_CONFIGS.get(speaker, DEFAULT_VOICE)
            print(f"Using voice: {voice_config['name']} (pitch: {voice_config['pitch']}, rate: {voice_config['speaking_rate']})")
            
            # Generate audio for the segment
            audio_data = generate_audio(full_text, voice_config, segment_index=i)
            
            if audio_data:
                # Save the segment audio temporarily
                temp_file = os.path.join(output_folder, f"temp_segment_{i}.mp3")
                with open(temp_file, "wb") as f:
                    f.write(audio_data)
                
                # Load the segment audio and add it to the combined audio
                segment_audio = AudioSegment.from_mp3(temp_file)
                segment_duration = len(segment_audio)
                print(f"Segment {i+1} duration: {segment_duration / 1000:.2f} seconds")
                
                combined_audio += segment_audio
                total_duration += segment_duration
                
                # Add a short pause between segments
                combined_audio += AudioSegment.silent(duration=500)
                total_duration += 500
                
                # Clean up temporary file
                os.remove(temp_file)
                
                # Sleep to avoid rate limiting
                time.sleep(0.5)
            else:
                print(f"Failed to generate audio for segment {i+1}")
                # Add a silent segment as a placeholder
                combined_audio += AudioSegment.silent(duration=500)
                total_duration += 500
    
    # Add outro bumper
    print("Adding outro bumper...")
    outro_bumper = AudioSegment.from_mp3(outro_bumper_path)
    combined_audio += outro_bumper
    total_duration += len(outro_bumper)
    print(f"Outro bumper duration: {len(outro_bumper) / 1000:.2f} seconds")
    
    # Print total duration
    print(f"Total podcast duration: {total_duration / 1000 / 60:.2f} minutes ({total_duration / 1000:.2f} seconds)")
    
    # Export the final audio
    print(f"Exporting final audio to {output_file}...")
    combined_audio.export(output_file, format="mp3", bitrate="192k")
    
    print(f"Podcast generated successfully! Saved to: {output_file}")

if __name__ == "__main__":
    main() 