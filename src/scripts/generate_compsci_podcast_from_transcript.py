#!/usr/bin/env python3
import os
import subprocess
import re
import sys
from pathlib import Path

def run_command(command, check=True):
    """Run a shell command and return its output."""
    try:
        result = subprocess.run(
            command,
            check=check,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"Error executing command: {command}")
        print(f"Error message: {e.stderr}")
        if check:
            sys.exit(1)
        return None

def generate_compsci_podcast_from_transcript():
    """Generate the CompSci News podcast directly from the transcript file with intro and outro bumpers."""
    print("Generating CompSci News podcast from transcript...")
    
    # Define paths
    transcript_path = "CompSci-News-Episode1-Transcript.md"
    output_dir = "output"
    output_file = os.path.join(output_dir, "compsci-news-episode1.mp3")
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Check if transcript file exists
    if not os.path.exists(transcript_path):
        print(f"Error: Transcript file {transcript_path} not found.")
        sys.exit(1)
    
    # Extract the dialogue from the transcript
    with open(transcript_path, 'r') as f:
        transcript_content = f.read()
    
    # Create a temporary script file for the dialogue
    temp_script_file = "temp_compsci_script.txt"
    with open(temp_script_file, 'w') as f:
        f.write(transcript_content)
    
    # Generate the podcast using the existing script
    print("Using the generate_all_podcasts.py script to create the podcast...")
    run_command(f"python generate_all_podcasts.py --podcast compsci")
    
    # Check if the output file was created
    if os.path.exists(output_file):
        file_size = os.path.getsize(output_file) / (1024 * 1024)  # Convert to MB
        print(f"Successfully generated CompSci News podcast: {output_file} ({file_size:.2f} MB)")
    else:
        print(f"Error: Failed to generate podcast file {output_file}")
        
    # Clean up temporary files
    if os.path.exists(temp_script_file):
        os.remove(temp_script_file)

if __name__ == "__main__":
    generate_compsci_podcast_from_transcript() 