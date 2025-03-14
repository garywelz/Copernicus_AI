import os
import requests
import io
from openai import OpenAI
from datetime import datetime
from PIL import Image  # We'll use Pillow for image processing

# Initialize the OpenAI client with your API key
client = OpenAI(api_key="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")  # Replace with your actual API key

# Create output directory if it doesn't exist
output_dir = "output"
os.makedirs(output_dir, exist_ok=True)

# Define the image specification and prompt
image_spec = {
    "filename": "black-holes-thumbnail",
    "prompt": "A dramatic visualization of a black hole's event horizon with gravitational lensing effects, showing light bending around the black hole against a cosmic background. Include accretion disk with superheated matter in vibrant reds and oranges, with blue-shifted light on one side and red-shifted light on the other. Use deep space blues with bright yellow, red and cyan energy patterns."
}

# Add a consistent style guide to the prompt
style_guide = "Create a modern, vibrant scientific illustration with clean, professional aesthetics. The image must be designed for a 640x640 pixel square format for Spotify podcast thumbnails. Use high contrast and saturation to ensure visibility at small sizes."

# Function to resize and save image in webp format
def process_and_save_image(image_data, filename):
    try:
        # Open the image using Pillow
        img = Image.open(io.BytesIO(image_data))
        
        # Resize to 640x640
        img = img.resize((640, 640), Image.LANCZOS)
        
        # Try to save as webp
        webp_path = os.path.join(output_dir, f"{filename}.webp")
        try:
            img.save(webp_path, format="WEBP", quality=95)
            return webp_path, "webp"
        except Exception as webp_error:
            print(f"  Warning: Could not save as webp ({str(webp_error)}), falling back to PNG")
            # Fallback to PNG
            png_path = os.path.join(output_dir, f"{filename}.png")
            img.save(png_path, format="PNG")
            return png_path, "png"
            
    except Exception as e:
        raise Exception(f"Error processing image: {str(e)}")

# Function to generate and save the image
def generate_and_save_image():
    print(f"Starting image generation at {datetime.now().strftime('%H:%M:%S')}")
    
    try:
        # Combine the prompt with the style guide
        full_prompt = f"{style_guide} {image_spec['prompt']}"
        
        print(f"Generating: {image_spec['filename']}...")
        
        # Generate the image using DALL-E
        response = client.images.generate(
            model="dall-e-3",  # Use DALL-E 3 for highest quality
            prompt=full_prompt,
            size="1024x1024",  # DALL-E 3 only supports 1024x1024 or 1792x1024
            quality="standard",
            n=1,
        )
        
        # Get the image URL
        image_url = response.data[0].url
        
        # Download the image
        image_response = requests.get(image_url)
        if image_response.status_code == 200:
            # Process and save the image
            saved_path, format_used = process_and_save_image(
                image_response.content, 
                image_spec['filename']
            )
            print(f"✓ Saved: {saved_path} (format: {format_used}, size: 640x640)")
        else:
            print(f"✗ Failed to download image: {image_response.status_code}")
            
    except Exception as e:
        print(f"✗ Error generating {image_spec['filename']}: {str(e)}")
    
    print(f"Image generation completed at {datetime.now().strftime('%H:%M:%S')}")

# Run the image generation
if __name__ == "__main__":
    # Check if Pillow is installed
    try:
        import PIL
        print(f"Using Pillow version {PIL.__version__}")
    except ImportError:
        print("Pillow is not installed. Please install it with: pip install Pillow")
        exit(1)
        
    generate_and_save_image() 