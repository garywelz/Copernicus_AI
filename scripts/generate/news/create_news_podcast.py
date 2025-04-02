#!/usr/bin/env python3
import json
import os
import argparse
import importlib.util
import sys

# Valid subjects
VALID_SUBJECTS = ["biology", "chemistry", "compsci", "math", "physics", "science"]

def load_podcast_data(subject, part=1):
    """
    Load podcast data from the existing creation scripts.
    This allows us to reuse the existing podcast content without duplicating it.
    """
    script_name = f"create_{subject}_news_podcast{'_part2' if part == 2 else ''}.py"
    script_path = os.path.join(os.path.dirname(__file__), script_name)
    
    if not os.path.exists(script_path):
        print(f"Error: Script {script_path} not found.")
        return None
    
    # Load the module dynamically
    spec = importlib.util.spec_from_file_location(f"{subject}_podcast_part{part}", script_path)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    
    # Get the podcast data from the module
    # The variable name might be 'podcast' or 'podcast_data' depending on the script
    podcast_data = getattr(module, 'podcast', None)
    if podcast_data is None:
        podcast_data = getattr(module, 'podcast_data', None)
    
    if podcast_data is None:
        print(f"Error: Could not find podcast data in {script_name}")
        return None
    
    return podcast_data

def create_podcast_json(subject, part, output_dir=None, episode=1):
    """Create a JSON file for a specific subject and part."""
    # Load the podcast data
    podcast_data = load_podcast_data(subject, part)
    if podcast_data is None:
        return False
    
    # Ensure the directory exists
    if output_dir is None:
        json_dir = os.path.join("src", "data", "news_json_archive")
    else:
        json_dir = output_dir
    
    os.makedirs(json_dir, exist_ok=True)
    
    # Create the JSON file
    json_filename = f"{subject}_news_podcast{'_part2' if part == 2 else ''}.json"
    json_file = os.path.join(json_dir, json_filename)
    
    with open(json_file, 'w') as f:
        json.dump(podcast_data, f, indent=2)
    
    print(f"Created {json_file} with the {'second' if part == 2 else 'first'} part of the {subject.capitalize()} News podcast")
    return True

def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="Create JSON files for news podcasts")
    parser.add_argument("subject", choices=VALID_SUBJECTS + ["all"], help="Subject of the news podcast or 'all' for all subjects")
    parser.add_argument("--part", type=int, choices=[1, 2, 0], default=0, help="Podcast part (1, 2, or 0 for both, default: 0)")
    parser.add_argument("--output-dir", help="Output directory (default: src/data/news_json_archive)")
    parser.add_argument("--episode", type=int, default=1, help="Episode number (default: 1)")
    args = parser.parse_args()
    
    subjects = VALID_SUBJECTS if args.subject == "all" else [args.subject]
    parts = [1, 2] if args.part == 0 else [args.part]
    
    for subject in subjects:
        print(f"Creating {subject.capitalize()} News podcast JSON files...")
        for part in parts:
            success = create_podcast_json(subject, part, args.output_dir, args.episode)
            if not success:
                print(f"Failed to create JSON for {subject} part {part}")
    
    print("JSON creation completed.")

if __name__ == "__main__":
    main() 