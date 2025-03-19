#!/usr/bin/env python3

import os
import re
import glob
from pathlib import Path

def remove_titles_from_file(file_path):
    """Remove titles like Dr., Prof., etc. from a transcript file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Define patterns to replace
    patterns = [
        (r'Dr\.\s+([A-Z][a-z]+)', r'\1'),  # Dr. Name -> Name
        (r'Professor\s+([A-Z][a-z]+)', r'\1'),  # Professor Name -> Name
        (r'Prof\.\s+([A-Z][a-z]+)', r'\1'),  # Prof. Name -> Name
        (r'Doctor\s+([A-Z][a-z]+)', r'\1'),  # Doctor Name -> Name
    ]
    
    # Apply replacements
    modified_content = content
    for pattern, replacement in patterns:
        modified_content = re.sub(pattern, replacement, modified_content)
    
    # Check if any changes were made
    if content != modified_content:
        print(f"Modified: {file_path}")
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(modified_content)
        return True
    else:
        print(f"No changes needed: {file_path}")
        return False

def main():
    # Define directories to search
    output_dir = Path('/home/gdubs/copernicus/output')
    
    # Find all transcript files
    transcript_files = list(output_dir.glob('*-transcript.md')) + list(output_dir.glob('*-ep*-transcript.md'))
    
    print(f"Found {len(transcript_files)} transcript files")
    
    # Process each file
    modified_count = 0
    for file_path in transcript_files:
        if remove_titles_from_file(file_path):
            modified_count += 1
    
    print(f"\nSummary: Modified {modified_count} out of {len(transcript_files)} files")

if __name__ == "__main__":
    main() 