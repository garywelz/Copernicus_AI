#!/usr/bin/env python3
import os
import json
import tempfile
import numpy as np
from moviepy.editor import (
    VideoFileClip,
    AudioFileClip,
    ImageClip,
    TextClip,
    CompositeVideoClip,
    ColorClip,
    concatenate_videoclips
)
from moviepy.video.tools.segmenting import findObjects
from moviepy.video.VideoClip import TextClip
from moviepy.video.fx import all as vfx
import cv2
from PIL import Image, ImageDraw, ImageFont
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import sympy as sp
from sympy.printing import pretty
import requests
from io import BytesIO
import logging
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class VideoGenerator:
    def __init__(self, audio_path, elements_path, options_path):
        self.audio_path = audio_path
        self.elements = self._load_json(elements_path)
        self.options = self._load_json(options_path)
        self.temp_dir = tempfile.mkdtemp()
        self.clips = []

    def _load_json(self, path):
        with open(path, 'r') as f:
            return json.load(f)

    def generate(self):
        try:
            # Create background with proper color space
            width = self.options['width']
            height = self.options['height']
            color = self._hex_to_rgb(self.options['backgroundColor'])
            background = ColorClip(
                size=(width, height),
                color=color,
                duration=self.options['elements'][-1]['startTime'] + 
                        self.options['elements'][-1]['duration']
            )
            self.clips.append(background)

            # Add formula clips synced with text references
            formula_clips = [
                {
                    'type': 'formula',
                    'content': 'Rμν - ½Rgμν + Λgμν = 8πG/c⁴ Tμν',
                    'startTime': 65,  # When Einstein's equations are mentioned
                    'duration': 10,
                    'style': {'position': 'center'}
                },
                {
                    'type': 'formula',
                    'content': 'rs = 2GM/c²',
                    'startTime': 75,  # First mention of Schwarzschild radius
                    'duration': 10,
                    'style': {'position': 'center'}
                },
                {
                    'type': 'formula',
                    'content': 'rs = 2GM/c²',
                    'startTime': 85,  # Second mention of Schwarzschild radius
                    'duration': 10,
                    'style': {'position': 'center'}
                }
            ]

            # Add black hole images for the remaining time
            black_hole_images = [
                {
                    'type': 'image',
                    'content': 'https://www.nasa.gov/wp-content/uploads/2023/05/black-hole.jpg',
                    'startTime': 0,
                    'duration': 65,
                    'style': {'position': 'center', 'size': 'large'}
                },
                {
                    'type': 'image',
                    'content': 'https://www.nasa.gov/wp-content/uploads/2023/05/black-hole.jpg',
                    'startTime': 75,
                    'duration': 10,
                    'style': {'position': 'center', 'size': 'large'}
                },
                {
                    'type': 'image',
                    'content': 'https://www.nasa.gov/wp-content/uploads/2023/05/black-hole.jpg',
                    'startTime': 85,
                    'duration': 10,
                    'style': {'position': 'center', 'size': 'large'}
                }
            ]

            # Process each element
            for element in self.options['elements'] + formula_clips + black_hole_images:
                clip = self._create_element_clip(element)
                if clip:
                    self.clips.append(clip)

            # Combine all clips
            final_clip = CompositeVideoClip(self.clips)

            # Add audio
            audio = AudioFileClip(self.audio_path)
            final_clip = final_clip.set_audio(audio)

            # Write output
            output_path = os.path.join(self.temp_dir, 'output.mp4')
            final_clip.write_videofile(
                output_path,
                fps=self.options['fps'],
                codec='libx264',
                audio_codec='aac'
            )

            # Clean up
            final_clip.close()
            audio.close()
            for clip in self.clips:
                clip.close()

            return output_path

        except Exception as e:
            logger.error(f"Error generating video: {str(e)}")
            raise

    def _create_element_clip(self, element):
        try:
            if element['type'] == 'image':
                return self._create_image_clip(element)
            elif element['type'] == 'text':
                return self._create_text_clip(element)
            elif element['type'] == 'formula':
                return self._create_formula_clip(element)
            elif element['type'] == 'diagram':
                return self._create_diagram_clip(element)
            elif element['type'] == 'screenshot':
                return self._create_screenshot_clip(element)
            else:
                logger.warning(f"Unknown element type: {element['type']}")
                return None

        except Exception as e:
            logger.error(f"Error creating {element['type']} clip: {str(e)}")
            return None

    def _create_image_clip(self, element):
        try:
            # Download or load image
            if element['content'].startswith('http'):
                response = requests.get(element['content'])
                if response.status_code != 200:
                    logger.error(f"Failed to download image: {response.status_code}")
                    return None
                try:
                    img = Image.open(BytesIO(response.content))
                except Exception as e:
                    logger.error(f"Failed to open image: {str(e)}")
                    return None
            else:
                try:
                    img = Image.open(element['content'])
                except Exception as e:
                    logger.error(f"Failed to open local image: {str(e)}")
                    return None

            # Resize image if needed
            style = element.get('style', {})
            if style.get('size'):
                size = self._get_size_from_style(style['size'])
                img = img.resize(size, Image.Resampling.LANCZOS)

            # Create clip
            clip = ImageClip(np.array(img))
            clip = clip.set_duration(element['duration'])
            clip = clip.set_start(element['startTime'])

            # Apply positioning
            if style.get('position'):
                clip = self._position_clip(clip, style['position'])

            return clip
        except Exception as e:
            logger.error(f"Error creating image clip: {str(e)}")
            return None

    def _create_text_clip(self, element):
        style = element.get('style', {})
        
        # Create text using PIL for better control
        font_size = style.get('fontSize', 40)
        text = element['content']
        padding = style.get('padding', 40)
        
        # Create a temporary image with text
        img = Image.new('RGBA', (self.options['width'], self.options['height']), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        # Load a font (you might want to specify a specific font file)
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
        except:
            font = ImageFont.load_default()
        
        # Get text size
        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
        
        # Calculate position
        x = (self.options['width'] - text_width) // 2
        y = (self.options['height'] - text_height) // 2
        
        # Draw text
        draw.text((x, y), text, font=font, fill=style.get('textColor', 'white'))
        
        # Convert to numpy array and create clip
        clip = ImageClip(np.array(img))
        clip = clip.set_duration(element['duration'])
        clip = clip.set_start(element['startTime'])
        
        # Apply positioning
        if style.get('position'):
            clip = self._position_clip(clip, style['position'])
        
        return clip

    def _create_formula_clip(self, element):
        try:
            # Create a white text on transparent background
            formula = element['content']
            
            # Create a new image with transparent background
            img = Image.new('RGBA', (self.options['width'], self.options['height']), (0, 0, 0, 0))
            draw = ImageDraw.Draw(img)
            
            # Use a large font size for formulas
            font_size = 72
            try:
                font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
            except:
                font = ImageFont.load_default()
            
            # Get text size
            text_bbox = draw.textbbox((0, 0), formula, font=font)
            text_width = text_bbox[2] - text_bbox[0]
            text_height = text_bbox[3] - text_bbox[1]
            
            # Calculate position to center the formula
            x = (self.options['width'] - text_width) // 2
            y = (self.options['height'] - text_height) // 2
            
            # Draw the formula in white
            draw.text((x, y), formula, font=font, fill='white')
            
            # Create clip from the image
            clip = ImageClip(np.array(img))
            clip = clip.set_duration(element['duration'])
            clip = clip.set_start(element['startTime'])
            
            # Apply positioning if specified
            if element.get('style', {}).get('position'):
                clip = self._position_clip(clip, element['style']['position'])
            
            return clip
            
        except Exception as e:
            logger.error(f"Error creating formula clip: {str(e)}")
            return None

    def _create_diagram_clip(self, element):
        # Create matplotlib figure for diagram
        fig, ax = plt.subplots(figsize=(10, 6))
        fig.patch.set_alpha(0.0)
        ax.patch.set_alpha(0.0)
        
        # Example: Create a simple diagram
        # This should be customized based on the diagram type
        if 'mandelbrot' in element['content'].lower():
            self._create_mandelbrot_diagram(ax)
        else:
            # Add more diagram types here
            pass

        # Save to temporary file
        temp_path = os.path.join(self.temp_dir, f'diagram_{element["startTime"]}.png')
        plt.savefig(temp_path, bbox_inches='tight', pad_inches=0, transparent=True)
        plt.close()

        # Create clip from diagram image
        return self._create_image_clip({
            **element,
            'content': temp_path
        })

    def _create_screenshot_clip(self, element):
        # This would handle paper title/abstract screenshots
        # Implementation depends on how screenshots are provided
        return self._create_image_clip(element)

    def _create_mandelbrot_diagram(self, ax):
        # Generate Mandelbrot set
        def mandelbrot(h, w, max_iter):
            y, x = np.ogrid[-1.4:1.4:h*1j, -2:0.8:w*1j]
            c = x + y*1j
            z = c
            divtime = max_iter + np.zeros(z.shape, dtype=int)
            
            for i in range(max_iter):
                z = z**2 + c
                diverge = z*np.conj(z) > 2**2
                div_now = diverge & (divtime == max_iter)
                divtime[div_now] = i
                z[diverge] = 2
            
            return divtime

        # Generate and plot Mandelbrot set
        h, w = 1000, 1000
        mandelbrot_set = mandelbrot(h, w, 100)
        ax.imshow(mandelbrot_set, cmap='viridis')
        ax.axis('off')

    def _get_size_from_style(self, size):
        if size == 'small':
            return (640, 360)
        elif size == 'medium':
            return (960, 540)
        else:  # large
            return (1280, 720)

    def _position_clip(self, clip, position):
        if position == 'center':
            return clip.set_position('center')
        elif position == 'top':
            return clip.set_position(('center', 20))
        elif position == 'bottom':
            return clip.set_position(('center', self.options['height'] - clip.h - 20))
        elif position == 'left':
            return clip.set_position((20, 'center'))
        elif position == 'right':
            return clip.set_position((self.options['width'] - clip.w - 20, 'center'))
        return clip

    def _hex_to_rgb(self, hex_color):
        # Remove the '#' if present
        hex_color = hex_color.lstrip('#')
        # Convert hex to RGB
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

    def cleanup(self):
        """Clean up temporary files and directories."""
        try:
            import shutil
            shutil.rmtree(self.temp_dir)
        except Exception as e:
            logger.error(f"Error during cleanup: {str(e)}")

def main():
    import sys
    if len(sys.argv) != 4:
        print("Usage: python generate_video.py <audio_path> <elements_path> <options_path>")
        sys.exit(1)

    audio_path = sys.argv[1]
    elements_path = sys.argv[2]
    options_path = sys.argv[3]

    generator = VideoGenerator(audio_path, elements_path, options_path)
    output_path = generator.generate()
    print(output_path)

if __name__ == "__main__":
    main() 