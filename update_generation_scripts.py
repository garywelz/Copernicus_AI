#!/usr/bin/env python3
import os
import re
import glob

def update_generation_script(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Check if the file already has the updated paths
    if "json_dir = os.path.join" in content:
        print(f"File {file_path} already updated. Skipping.")
        return
    
    # Extract the subject from the filename
    subject = os.path.basename(file_path).split('_')[1]
    
    # Replace the old file opening code with the new one
    old_pattern1 = r'with open\("' + subject + r'_news_podcast\.json", "r"\) as f:'
    new_replacement1 = 'with open(json_file1, "r") as f:'
    
    old_pattern2 = r'with open\("' + subject + r'_news_podcast_part2\.json", "r"\) as f:'
    new_replacement2 = 'with open(json_file2, "r") as f:'
    
    # Add the path definition before the file opening
    path_definition = '''
    # Define paths to JSON files
    json_dir = os.path.join("src", "data", "news_json_archive")
    json_file1 = os.path.join(json_dir, "{subject}_news_podcast.json")
    json_file2 = os.path.join(json_dir, "{subject}_news_podcast_part2.json")
    '''.format(subject=subject)
    
    # Find the position to insert the path definition
    try_pattern = r'try:'
    try_match = re.search(try_pattern, content)
    
    if try_match:
        insert_pos = content.rfind('\n', 0, try_match.start())
        updated_content = content[:insert_pos] + path_definition + content[insert_pos:]
    else:
        print(f"Could not find insertion point in {file_path}. Skipping.")
        return
    
    # Apply the replacements
    updated_content = re.sub(old_pattern1, new_replacement1, updated_content)
    updated_content = re.sub(old_pattern2, new_replacement2, updated_content)
    
    # Write the updated content back to the file
    with open(file_path, 'w') as f:
        f.write(updated_content)
    
    print(f"Updated {file_path}")

def main():
    # Get all generation scripts
    script_dir = os.path.join("src", "scripts")
    generation_scripts = glob.glob(os.path.join(script_dir, "generate_*_news_podcast.py"))
    
    for script in generation_scripts:
        update_generation_script(script)
    
    print("All generation scripts updated successfully!")

if __name__ == "__main__":
    main() 