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

def generate_compsci_podcast():
    """Generate the CompSci News podcast with intro and outro bumpers."""
    print("Generating CompSci News podcast...")
    
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
    
    # Read the transcript
    with open(transcript_path, 'r') as f:
        transcript_content = f.read()
    
    # Extract the dialogue from the transcript
    dialogue_lines = []
    for line in transcript_content.split('\n'):
        # Look for lines with dialogue format: **Speaker:** Text
        match = re.match(r'\*\*(.*?):\*\*(.*)', line)
        if match:
            speaker = match.group(1).strip()
            text = match.group(2).strip()
            dialogue_lines.append(f"{speaker}: {text}")
    
    # Create a temporary script file for the dialogue
    temp_script_file = "temp_compsci_script.txt"
    with open(temp_script_file, 'w') as f:
        f.write('\n'.join(dialogue_lines))
    
    # Generate intro bumper
    intro_text = "Welcome to CompSci News, your monthly digest of significant developments across computer science and its applications."
    intro_file = "intro_bumper.mp3"
    run_command(f'echo "{intro_text}" | tts --text - --out_path {intro_file}')
    
    # Generate outro bumper
    outro_text = "Thank you for listening to CompSci News. Until next time, keep exploring the fascinating world of computer science."
    outro_file = "outro_bumper.mp3"
    run_command(f'echo "{outro_text}" | tts --text - --out_path {outro_file}')
    
    # Generate main content
    main_content_file = "main_content.mp3"
    run_command(f'tts --text {temp_script_file} --out_path {main_content_file}')
    
    # Combine all parts
    run_command(f'ffmpeg -i "concat:intro_bumper.mp3|main_content.mp3|outro_bumper.mp3" -acodec copy {output_file}')
    
    # Clean up temporary files
    for file in [temp_script_file, intro_file, outro_file, main_content_file]:
        if os.path.exists(file):
            os.remove(file)
    
    # Check if the output file was created
    if os.path.exists(output_file):
        file_size = os.path.getsize(output_file) / (1024 * 1024)  # Convert to MB
        print(f"Successfully generated CompSci News podcast: {output_file} ({file_size:.2f} MB)")
    else:
        print(f"Error: Failed to generate podcast file {output_file}")

if __name__ == "__main__":
    generate_compsci_podcast() 