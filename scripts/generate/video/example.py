#!/usr/bin/env python3
import os
import json
import tempfile
from generate_video import VideoGenerator

def create_example_video():
    # Create a temporary directory for our files
    with tempfile.TemporaryDirectory() as temp_dir:
        # Create a dummy audio file (replace with your actual audio file)
        audio_path = os.path.join(temp_dir, 'audio.mp3')
        with open(audio_path, 'wb') as f:
            f.write(b'dummy audio content')

        # Define video elements
        elements = [
            {
                'type': 'text',
                'content': 'Welcome to the Video',
                'startTime': 0,
                'duration': 5,
                'style': {
                    'fontSize': 60,
                    'textColor': 'white',
                    'backgroundColor': 'transparent',
                    'position': 'center'
                }
            },
            {
                'type': 'image',
                'content': 'https://example.com/your-image.jpg',  # Replace with your image URL
                'startTime': 5,
                'duration': 5,
                'style': {
                    'size': 'medium',
                    'position': 'center'
                }
            },
            {
                'type': 'formula',
                'content': 'E = mc^2',
                'startTime': 10,
                'duration': 5,
                'style': {
                    'position': 'center'
                }
            },
            {
                'type': 'diagram',
                'content': 'mandelbrot',
                'startTime': 15,
                'duration': 5,
                'style': {
                    'position': 'center'
                }
            },
            {
                'type': 'text',
                'content': 'Thank you for watching!',
                'startTime': 20,
                'duration': 5,
                'style': {
                    'fontSize': 50,
                    'textColor': 'white',
                    'backgroundColor': 'transparent',
                    'position': 'center'
                }
            }
        ]

        # Save elements to JSON file
        elements_path = os.path.join(temp_dir, 'elements.json')
        with open(elements_path, 'w') as f:
            json.dump(elements, f, indent=2)

        # Define video options
        options = {
            'width': 1920,
            'height': 1080,
            'fps': 30,
            'backgroundColor': '#000000',
            'elements': elements
        }

        # Save options to JSON file
        options_path = os.path.join(temp_dir, 'options.json')
        with open(options_path, 'w') as f:
            json.dump(options, f, indent=2)

        # Create video generator
        generator = VideoGenerator(audio_path, elements_path, options_path)

        try:
            # Generate the video
            output_path = generator.generate()
            print(f"Video generated successfully at: {output_path}")
            
            # Here you would typically move the output file to your desired location
            # For example:
            # import shutil
            # shutil.move(output_path, 'final_video.mp4')
            
        except Exception as e:
            print(f"Error generating video: {str(e)}")
        finally:
            # Clean up temporary files
            generator.cleanup()

if __name__ == "__main__":
    create_example_video() 