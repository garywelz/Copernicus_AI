#!/usr/bin/env python3
import os
import json
import tempfile
import openai
from generate_video import VideoGenerator

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

def generate_space_image(prompt):
    """Generate an image using DALL-E 3."""
    try:
        response = openai.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1792x1024",
            quality="standard",
            n=1,
            style="vivid"
        )
        return response.data[0].url
    except Exception as e:
        print(f"Error generating image: {str(e)}")
        return None

def create_black_holes_video():
    # Path to the audio file
    audio_path = "output/audio/final_audio/black-holes-show.wav"
    
    # Generate space-related images
    black_hole_image = generate_space_image(
        "A stunning visualization of a supermassive black hole with accretion disk, "
        "showing gravitational lensing effects and intense radiation, ultra detailed, "
        "space photography, 8k resolution"
    )
    
    galaxy_image = generate_space_image(
        "A beautiful spiral galaxy with bright stars and nebulae, "
        "showing cosmic dust and gas clouds, ultra detailed, space photography, 8k resolution"
    )
    
    event_horizon_image = generate_space_image(
        "A detailed visualization of a black hole's event horizon, "
        "showing the boundary where light cannot escape, with intense gravitational effects, "
        "ultra detailed, space photography, 8k resolution"
    )
    
    # Create a temporary directory for our files
    with tempfile.TemporaryDirectory() as temp_dir:
        # Define video elements
        elements = [
            {
                'type': 'text',
                'content': 'Black Holes: The Cosmic Mysteries',
                'startTime': 0,
                'duration': 5,
                'style': {
                    'fontSize': 60,
                    'textColor': 'white',
                    'backgroundColor': None,
                    'position': 'center'
                }
            },
            {
                'type': 'image',
                'content': black_hole_image,
                'startTime': 5,
                'duration': 15,
                'style': {
                    'position': 'center',
                    'size': 'large'
                }
            },
            {
                'type': 'text',
                'content': 'Understanding Black Holes',
                'startTime': 20,
                'duration': 5,
                'style': {
                    'fontSize': 50,
                    'textColor': 'white',
                    'backgroundColor': None,
                    'position': 'center'
                }
            },
            {
                'type': 'image',
                'content': galaxy_image,
                'startTime': 25,
                'duration': 15,
                'style': {
                    'position': 'center',
                    'size': 'large'
                }
            },
            {
                'type': 'formula',
                'content': 'G_{\\mu\\nu} + \\Lambda g_{\\mu\\nu} = \\frac{8\\pi G}{c^4}T_{\\mu\\nu}',  # Einstein's field equations
                'startTime': 40,
                'duration': 8,
                'style': {
                    'position': 'center'
                }
            },
            {
                'type': 'text',
                'content': "Einstein's Field Equations",
                'startTime': 48,
                'duration': 5,
                'style': {
                    'fontSize': 40,
                    'textColor': 'white',
                    'backgroundColor': None,
                    'position': 'bottom'
                }
            },
            {
                'type': 'formula',
                'content': 'R_s = \\frac{2GM}{c^2}',  # Schwarzschild radius formula
                'startTime': 53,
                'duration': 8,
                'style': {
                    'position': 'center'
                }
            },
            {
                'type': 'text',
                'content': "The Schwarzschild Radius",
                'startTime': 61,
                'duration': 5,
                'style': {
                    'fontSize': 40,
                    'textColor': 'white',
                    'backgroundColor': None,
                    'position': 'bottom'
                }
            },
            {
                'type': 'image',
                'content': event_horizon_image,
                'startTime': 66,
                'duration': 15,
                'style': {
                    'position': 'center',
                    'size': 'large'
                }
            },
            {
                'type': 'text',
                'content': "The Event Horizon",
                'startTime': 81,
                'duration': 5,
                'style': {
                    'fontSize': 40,
                    'textColor': 'white',
                    'backgroundColor': None,
                    'position': 'bottom'
                }
            }
        ]

        # Save elements to JSON file
        elements_path = os.path.join(temp_dir, 'elements.json')
        with open(elements_path, 'w') as f:
            json.dump(elements, f, indent=2)

        # Define video options with proper color format
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

        try:
            # Create video generator
            generator = VideoGenerator(audio_path, elements_path, options_path)
            
            # Generate the video
            output_path = generator.generate()
            print(f"Video generated successfully at: {output_path}")
            
            # Move the output file to a permanent location
            final_output = "output/video/black-holes-show.mp4"
            os.makedirs(os.path.dirname(final_output), exist_ok=True)
            os.rename(output_path, final_output)
            print(f"Video saved to: {final_output}")
            
        except Exception as e:
            print(f"Error generating video: {str(e)}")
        finally:
            if 'generator' in locals():
                generator.cleanup()

if __name__ == "__main__":
    create_black_holes_video() 