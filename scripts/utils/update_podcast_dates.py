#!/usr/bin/env python3
import os
import re
import glob

def add_date_to_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if the file already has a publication date
    if "Publication Date:" in content:
        # Update existing date
        content = re.sub(r'Publication Date:.*', 'Publication Date: March 28, 2025', content)
    else:
        # Add date after the title (assuming the title is the first line starting with #)
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if line.startswith('# '):
                lines.insert(i + 1, '**Publication Date:** March 28, 2025\n')
                break
        content = '\n'.join(lines)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated {file_path}")

def main():
    output_dir = "/home/gdubs/copernicus/output"
    
    # Get all non-news podcast description files
    description_files = glob.glob(os.path.join(output_dir, "*-description.md"))
    description_files = [f for f in description_files if "-news-" not in f]
    
    # Get all non-news podcast show notes files
    show_notes_files = glob.glob(os.path.join(output_dir, "*-show-notes.md"))
    show_notes_files = [f for f in show_notes_files if "-news-" not in f]
    
    # Update all files
    for file_path in description_files + show_notes_files:
        add_date_to_file(file_path)
    
    print(f"Updated {len(description_files)} description files and {len(show_notes_files)} show notes files.")

if __name__ == "__main__":
    main() 