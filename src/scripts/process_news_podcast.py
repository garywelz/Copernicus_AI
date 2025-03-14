#!/usr/bin/env python3
import os
import argparse
import subprocess
import sys

# Valid subjects
VALID_SUBJECTS = ["biology", "chemistry", "compsci", "math", "physics", "science"]

def run_script(script_path, args):
    """Run a Python script with the given arguments."""
    cmd = [sys.executable, script_path] + args
    print(f"Running: {' '.join(cmd)}")
    
    try:
        result = subprocess.run(cmd, check=True, text=True, capture_output=True)
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error running {script_path}:")
        print(e.stderr)
        return False

def process_podcast(subject, episode=1, output_dir="output", skip_creation=False):
    """Process a podcast for a specific subject."""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Step 1: Create JSON files (unless skipped)
    if not skip_creation:
        create_script = os.path.join(script_dir, "create_news_podcast.py")
        create_args = [subject, "--episode", str(episode)]
        if output_dir:
            create_args.extend(["--output-dir", output_dir])
        
        print(f"\n=== Creating {subject.capitalize()} News podcast JSON files ===")
        if not run_script(create_script, create_args):
            print(f"Failed to create JSON files for {subject}. Aborting.")
            return False
    
    # Step 2: Generate the podcast audio
    generate_script = os.path.join(script_dir, "generate_news_podcast.py")
    generate_args = [subject, "--episode", str(episode)]
    if output_dir:
        generate_args.extend(["--output-dir", output_dir])
    
    print(f"\n=== Generating {subject.capitalize()} News podcast audio ===")
    if not run_script(generate_script, generate_args):
        print(f"Failed to generate audio for {subject}.")
        return False
    
    print(f"\n✅ {subject.capitalize()} News podcast episode {episode} processed successfully!")
    return True

def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="Process (create and generate) news podcasts")
    parser.add_argument("subject", choices=VALID_SUBJECTS + ["all"], help="Subject of the news podcast or 'all' for all subjects")
    parser.add_argument("--episode", type=int, default=1, help="Episode number (default: 1)")
    parser.add_argument("--output-dir", default="output", help="Output directory (default: output)")
    parser.add_argument("--skip-creation", action="store_true", help="Skip JSON creation and only generate audio")
    args = parser.parse_args()
    
    subjects = VALID_SUBJECTS if args.subject == "all" else [args.subject]
    
    success_count = 0
    for subject in subjects:
        if process_podcast(subject, args.episode, args.output_dir, args.skip_creation):
            success_count += 1
    
    total = len(subjects)
    print(f"\nProcessed {success_count}/{total} podcasts successfully.")
    
    if success_count < total:
        print("Some podcasts failed to process. Check the logs above for details.")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main()) 