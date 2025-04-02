#!/usr/bin/env python3
import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get the ElevenLabs API key
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not ELEVENLABS_API_KEY:
    raise ValueError("ELEVENLABS_API_KEY not found in environment variables")

# Function to get available voices
def get_voices():
    url = "https://api.elevenlabs.io/v1/voices"
    
    headers = {
        "Accept": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        return None

# Main function
def main():
    voices = get_voices()
    
    if voices:
        print("Available voices:")
        print("=================")
        
        for voice in voices.get("voices", []):
            print(f"Name: {voice.get('name')}")
            print(f"Voice ID: {voice.get('voice_id')}")
            print(f"Category: {voice.get('category', 'N/A')}")
            print(f"Description: {voice.get('description', 'N/A')}")
            print("-" * 50)
        
        # Save the voices to a JSON file for reference
        with open("elevenlabs_voices.json", "w") as f:
            json.dump(voices, f, indent=2)
        
        print(f"Saved voice information to elevenlabs_voices.json")
    else:
        print("Failed to retrieve voices")

if __name__ == "__main__":
    main() 