#!/usr/bin/env python3
import os
import glob
from add_bumpers import add_bumpers

def main():
    # Directory containing podcast audio files
    podcast_dir = "output"
    
    # Directory to save processed files
    output_dir = "output/final"
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Find all WAV and MP3 files
    podcast_files = glob.glob(f"{podcast_dir}/*.wav") + glob.glob(f"{podcast_dir}/*.mp3")
    
    if not podcast_files:
        print(f"No podcast files found in {podcast_dir}")
        return
    
    print(f"Found {len(podcast_files)} podcast files to process")
    
    # Process each file
    success_count = 0
    for podcast_file in podcast_files:
        # Skip files in the final directory
        if "/final/" in podcast_file:
            continue
            
        # Generate output filename
        filename = os.path.basename(podcast_file)
        output_file = os.path.join(output_dir, filename)
        
        # Add bumpers
        if add_bumpers(podcast_file, output_file):
            success_count += 1
    
    print(f"\nProcessed {success_count} of {len(podcast_files)} files successfully")
    print(f"Output files are in: {output_dir}")

if __name__ == "__main__":
    main() 