#!/usr/bin/env python3
import os
import shutil
from pathlib import Path

def create_directory_structure(base_dir):
    """Create the organized directory structure."""
    directories = [
        # Main content directories
        "audio/final_audio/news",
        "audio/final_audio/podcasts",
        "descriptions",
        "images",
        "show_notes",
        "transcripts",
        "episode_scripts"
    ]
    
    for directory in directories:
        full_path = os.path.join(base_dir, directory)
        os.makedirs(full_path, exist_ok=True)
        print(f"Created directory: {full_path}")

def categorize_file(filename: str) -> tuple[str, str, str]:
    """
    Categorize a file based on its name.
    Returns (category, subject, filetype)
    """
    # Special case for Copernicus images
    if filename.startswith('copernicus-') and any(filename.endswith(ext) for ext in ['.jpg', '.webp', '.jfif', '.jpg:Zone.Identifier']):
        return 'images', '', 'image'

    # Extract base name without extension
    base = filename.lower().split('.')[0]
    
    # Determine file type and category
    if filename.endswith(('.mp3', '.wav')):
        if 'news' in base:
            return 'audio', '', 'final_audio/news'
        else:
            return 'audio', '', 'final_audio/podcasts'
    elif filename.endswith(('.webp', '.png', '.jpg', '.jfif')):
        filetype = 'images'
    elif filename.endswith('-description.md'):
        filetype = 'descriptions'
    elif filename.endswith(('-show-notes.md', '-notes.md')):
        filetype = 'show_notes'
    elif filename.endswith(('-transcript.md', '-show-transcript.md')):
        filetype = 'transcripts'
    else:
        filetype = ''

    return '', '', filetype  # Return empty category and subject since we're not using them

def move_files(base_dir):
    """Move files to their appropriate locations."""
    print("\nMoving files to appropriate locations...")
    
    # Get all files in the base directory
    for filename in os.listdir(base_dir):
        # Skip directories and hidden files
        if os.path.isdir(os.path.join(base_dir, filename)) or filename.startswith('.'):
            continue
        
        # Categorize the file
        category, subject, filetype = categorize_file(filename)
        if not filetype:
            print(f"Skipping file (couldn't categorize): {filename}")
            continue
        
        # Determine destination
        if category == 'images':
            dest_dir = os.path.join(base_dir, 'images')
        elif filetype.startswith("audio"):
            dest_dir = os.path.join(base_dir, filetype)
        else:
            dest_dir = os.path.join(base_dir, filetype)
        
        # Create destination directory if it doesn't exist
        os.makedirs(dest_dir, exist_ok=True)
        
        # Move the file
        src = os.path.join(base_dir, filename)
        dest = os.path.join(dest_dir, filename)
        try:
            shutil.move(src, dest)
            print(f"Moved: {filename} -> {dest}")
        except Exception as e:
            print(f"Error moving {filename}: {str(e)}")

def main():
    # Get the output directory path
    output_dir = os.path.join(os.getcwd(), "output")
    if not os.path.exists(output_dir):
        print(f"Error: Output directory not found at {output_dir}")
        return
    
    print("Creating directory structure...")
    create_directory_structure(output_dir)
    
    print("\nMoving files to appropriate locations...")
    move_files(output_dir)
    
    print("\nReorganization complete!")

if __name__ == "__main__":
    main() 