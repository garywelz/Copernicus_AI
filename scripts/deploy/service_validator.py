#!/usr/bin/env python3
import os
import json
import requests
from typing import Dict, List, Optional
from pathlib import Path
from dotenv import load_dotenv

class ServiceValidator:
    """Validates service configurations and connectivity."""
    
    def __init__(self):
        load_dotenv()
        self.services_status: Dict[str, bool] = {}
        
    def check_elevenlabs(self) -> bool:
        """Check ElevenLabs API connectivity."""
        api_key = os.getenv("ELEVENLABS_API_KEY")
        if not api_key:
            print("❌ ElevenLabs API key not found")
            return False
            
        try:
            response = requests.get(
                "https://api.elevenlabs.io/v1/voices",
                headers={"xi-api-key": api_key}
            )
            valid = response.status_code == 200
            print("✓ ElevenLabs API connection successful" if valid else "❌ ElevenLabs API check failed")
            return valid
        except Exception as e:
            print(f"❌ ElevenLabs API error: {e}")
            return False
            
    def check_openai(self) -> bool:
        """Check OpenAI API connectivity."""
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            print("❌ OpenAI API key not found")
            return False
            
        try:
            response = requests.get(
                "https://api.openai.com/v1/models",
                headers={"Authorization": f"Bearer {api_key}"}
            )
            valid = response.status_code == 200
            print("✓ OpenAI API connection successful" if valid else "❌ OpenAI API check failed")
            return valid
        except Exception as e:
            print(f"❌ OpenAI API error: {e}")
            return False
            
    def check_google_cloud(self) -> bool:
        """Check Google Cloud credentials."""
        creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        if not creds_path:
            print("❌ Google Cloud credentials path not found")
            return False
            
        try:
            with open(creds_path) as f:
                creds = json.load(f)
            valid = all(k in creds for k in ["type", "project_id", "private_key"])
            print("✓ Google Cloud credentials valid" if valid else "❌ Google Cloud credentials invalid")
            return valid
        except Exception as e:
            print(f"❌ Google Cloud credentials error: {e}")
            return False
            
    def check_huggingface_hub(self) -> bool:
        """Check Hugging Face Hub access."""
        token = os.getenv("HUGGINGFACE_TOKEN")
        if not token:
            print("❌ Hugging Face token not found")
            return False
            
        try:
            response = requests.get(
                "https://huggingface.co/api/whoami",
                headers={"Authorization": f"Bearer {token}"}
            )
            valid = response.status_code == 200
            print("✓ Hugging Face Hub access confirmed" if valid else "❌ Hugging Face Hub access failed")
            return valid
        except Exception as e:
            print(f"❌ Hugging Face Hub error: {e}")
            return False
            
    def check_spotify(self) -> bool:
        """Check Spotify API credentials."""
        client_id = os.getenv("SPOTIFY_CLIENT_ID")
        client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
        if not (client_id and client_secret):
            print("❌ Spotify credentials not found")
            return False
            
        try:
            response = requests.post(
                "https://accounts.spotify.com/api/token",
                data={"grant_type": "client_credentials"},
                auth=(client_id, client_secret)
            )
            valid = response.status_code == 200
            print("✓ Spotify API credentials valid" if valid else "❌ Spotify API credentials invalid")
            return valid
        except Exception as e:
            print(f"❌ Spotify API error: {e}")
            return False
            
    def validate_all(self) -> Dict[str, bool]:
        """Run all service validations."""
        self.services_status = {
            "elevenlabs": self.check_elevenlabs(),
            "openai": self.check_openai(),
            "google_cloud": self.check_google_cloud(),
            "huggingface": self.check_huggingface_hub(),
            "spotify": self.check_spotify()
        }
        return self.services_status

if __name__ == "__main__":
    validator = ServiceValidator()
    validator.validate_all() 