#!/usr/bin/env python3
import os
import sys
import subprocess
import time
import argparse

def run_command(command, description):
    """Run a command and handle errors."""
    print(f"\n{'='*80}")
    print(f"RUNNING: {description}")
    print(f"COMMAND: {command}")
    print(f"{'='*80}\n")
    
    try:
        result = subprocess.run(command, shell=True, check=True, text=True, capture_output=True)
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"ERROR: Command failed with exit code {e.returncode}")
        print(f"STDOUT: {e.stdout}")
        print(f"STDERR: {e.stderr}")
        return False

def generate_podcast(podcast_type):
    """Generate a specific podcast type."""
    print(f"\n{'#'*80}")
    print(f"GENERATING {podcast_type.upper()} NEWS PODCAST")
    print(f"{'#'*80}\n")
    
    # Use the consolidated script to process the podcast
    if not run_command(
        f"python src/scripts/process_news_podcast.py {podcast_type}", 
        f"Processing {podcast_type} news podcast"
    ):
        return False
    
    print(f"\n{podcast_type.upper()} NEWS PODCAST GENERATED SUCCESSFULLY!")
    return True

def main():
    parser = argparse.ArgumentParser(description="Generate science podcasts")
    parser.add_argument("--podcast", choices=["biology", "chemistry", "compsci", "math", "physics", "science", "all"], 
                        default="all", help="Specify which podcast to generate")
    args = parser.parse_args()
    
    # Determine which podcasts to generate
    podcasts_to_generate = ["biology", "chemistry", "compsci", "math", "physics", "science"] if args.podcast == "all" else [args.podcast]
    
    # Generate each podcast
    results = {}
    for podcast in podcasts_to_generate:
        results[podcast] = generate_podcast(podcast)
        # Add a small delay between podcast generations
        if podcast != podcasts_to_generate[-1]:
            time.sleep(2)
    
    # Print summary
    print("\n" + "="*80)
    print("PODCAST GENERATION SUMMARY")
    print("="*80)
    
    all_success = True
    for podcast, success in results.items():
        status = "SUCCESS" if success else "FAILED"
        print(f"{podcast.upper()} News Podcast: {status}")
        if not success:
            all_success = False
    
    # List generated files
    print("\nGenerated podcast files:")
    output_dir = "output"
    if os.path.exists(output_dir):
        podcast_files = [f for f in os.listdir(output_dir) if f.endswith((".mp3", ".wav")) and "episode" in f]
        for file in podcast_files:
            file_path = os.path.join(output_dir, file)
            size_mb = os.path.getsize(file_path) / (1024 * 1024)
            print(f"  - {file} ({size_mb:.2f} MB)")
    
    # Exit with appropriate code
    sys.exit(0 if all_success else 1)

if __name__ == "__main__":
    main() 