#!/usr/bin/env python3
import os
import sys
from pydub import AudioSegment

def add_bumpers(podcast_file, output_file=None, crossfade_ms=500):
    """
    Add intro and outro bumpers to a podcast audio file.
    
    Args:
        podcast_file: Path to the podcast audio file
        output_file: Path to save the output file (if None, will use podcast_file with '_with_bumpers' added)
        crossfade_ms: Milliseconds to crossfade between segments
    """
    print(f"Processing: {podcast_file}")
    
    # Determine output file name if not provided
    if output_file is None:
        base, ext = os.path.splitext(podcast_file)
        output_file = f"{base}_with_bumpers{ext}"
    
    # Load audio files
    try:
        intro = AudioSegment.from_mp3("assets/music/copernicus-intro.mp3")
        outro = AudioSegment.from_mp3("assets/music/copernicus-outro.mp3")
        
        # Detect format of podcast file
        _, ext = os.path.splitext(podcast_file)
        if ext.lower() == '.mp3':
            podcast = AudioSegment.from_mp3(podcast_file)
        elif ext.lower() == '.wav':
            podcast = AudioSegment.from_wav(podcast_file)
        else:
            print(f"Unsupported file format: {ext}")
            return False
        
        print(f"  Loaded intro ({len(intro)/1000:.1f}s), outro ({len(outro)/1000:.1f}s), and podcast ({len(podcast)/1000:.1f}s)")
        
        # Adjust volumes if needed (optional)
        # intro = intro - 3  # Reduce intro volume by 3dB
        # outro = outro - 3  # Reduce outro volume by 3dB
        
        # Combine with crossfades
        print(f"  Adding intro with {crossfade_ms}ms crossfade...")
        combined = intro.append(podcast, crossfade=crossfade_ms)
        
        print(f"  Adding outro with {crossfade_ms}ms crossfade...")
        combined = combined.append(outro, crossfade=crossfade_ms)
        
        # Export
        print(f"  Exporting to: {output_file}")
        combined.export(output_file, format=ext.replace('.', ''))
        
        print(f"✓ Successfully created: {output_file}")
        return True
        
    except Exception as e:
        print(f"✗ Error: {str(e)}")
        return False

def main():
    if len(sys.argv) < 2:
        print("Usage: python add_bumpers.py <podcast_file> [output_file]")
        print("Example: python add_bumpers.py assets/audio/exports/black-holes-show.wav")
        return
    
    podcast_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None
    
    add_bumpers(podcast_file, output_file)

if __name__ == "__main__":
    main() 