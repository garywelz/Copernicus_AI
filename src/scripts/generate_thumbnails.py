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

# Define the image specifications and prompts
image_specs = [
    # News program thumbnails
    {
        "filename": "math-news-thumbnail",
        "prompt": "A dynamic visualization of mathematical concepts with equations, geometric shapes, and number patterns flowing in an abstract space. Include mathematical symbols like pi, infinity, and complex equations with vibrant colors. The image should convey the excitement of mathematical discoveries and news."
    },
    {
        "filename": "physics-news-thumbnail",
        "prompt": "A dramatic visualization of physics phenomena with particle collisions, wave patterns, and quantum effects. Include elements of both theoretical and experimental physics with equations floating in space. Use vibrant colors showing energy transfers and fundamental forces of nature."
    },
    {
        "filename": "chemistry-news-thumbnail",
        "prompt": "A modern visualization of molecular structures and chemical reactions with atoms bonding and transforming. Show colorful molecular models, laboratory equipment, and reaction energy diagrams. Use vibrant colors representing different elements and chemical processes."
    },
    {
        "filename": "biology-news-thumbnail",
        "prompt": "A vibrant visualization of biological systems with DNA strands, cells, and organism structures. Include microscopic and macroscopic elements of life sciences with bright colors representing different biological processes and structures. Show the dynamic nature of living systems."
    },
    {
        "filename": "compsci-news-thumbnail",
        "prompt": "A futuristic visualization of computer science concepts with code structures, algorithms, and data flows. Include abstract representations of AI, networks, and computational processes. Use electric blues, vibrant greens, and digital patterns to convey cutting-edge technology news."
    },
    {
        "filename": "black-holes-thumbnail",
        "prompt": "A dramatic visualization of a black hole's event horizon with gravitational lensing effects, showing light bending around the black hole against a cosmic background. Include accretion disk with superheated matter in vibrant reds and oranges, with blue-shifted light on one side and red-shifted light on the other. Use deep space blues with bright yellow, red and cyan energy patterns."
    },
    {
        "filename": "copernicus-show-image",
        "prompt": "A modern, artistic portrait of Nicolas Copernicus, the great astronomer, surrounded by celestial elements like stars, planets, and orbital paths. The image should convey scientific discovery and intellectual pursuit. Include warm golden sunlight and vibrant planetary colors."
    },
    {
        "filename": "quantum-machine-learning-thumbnail",
        "prompt": "Quantum computer circuit board with neural network overlay, showing quantum bits in superposition connected to AI nodes. The image should represent the merging of quantum computing and artificial intelligence. Use electric blues with bright yellow and red energy patterns."
    },
    {
        "filename": "neuromorphic-computing-thumbnail",
        "prompt": "Brain-inspired computer chip with neural connections, showing a stylized half-brain transitioning into electronic circuitry with spiking neural network patterns. Include warm organic colors for the brain portion and vibrant electric blues for the circuitry."
    },
    {
        "filename": "synthetic-biology-thumbnail",
        "prompt": "DNA double helix transforming into engineered circuit-like patterns, with molecular building blocks being assembled in a precise, engineered manner. Use vibrant greens and blues with bright yellow and orange highlights."
    },
    {
        "filename": "organoids-thumbnail",
        "prompt": "Miniature 3D organ-like structures floating in a laboratory environment, showing cellular complexity and self-organization. Use rich reds and pinks for the biological structures with bright blue highlights."
    },
    {
        "filename": "green-chemistry-thumbnail",
        "prompt": "Molecular structures and chemical reactions surrounded by leaves and natural elements, showing sustainable chemical processes. Use vibrant greens with bright yellow energy flows and warm amber reaction sites."
    },
    {
        "filename": "molecular-machines-thumbnail",
        "prompt": "Nanoscale molecular machines and motors with mechanical components at the atomic level, showing rotors, switches, or walking molecules. Use metallic blues and silvers with bright red and yellow energy indicators."
    },
    {
        "filename": "artificial-general-intelligence-thumbnail",
        "prompt": "Advanced AI system with multiple cognitive abilities represented by interconnected nodes forming a brain-like structure, with abstract representations of reasoning, learning, and consciousness. Use electric blues with bright yellow, orange and red neural pathways."
    },
    {
        "filename": "continuum-hypothesis-thumbnail",
        "prompt": "Abstract mathematical visualization of infinite sets and cardinality, showing the gap between countable and uncountable infinities with nested structures and number line representations. Use deep blues with bright gold and red mathematical symbols."
    },
    {
        "filename": "crispr-chemistry-thumbnail",
        "prompt": "DNA double helix being precisely edited by CRISPR-Cas9 molecular scissors, with guide RNA and targeted gene sequences highlighted. Use vibrant blues and greens with bright yellow and red highlighting the editing sites."
    },
    {
        "filename": "edge-computing-thumbnail",
        "prompt": "Distributed network of computing nodes at the periphery of a larger network, processing data locally near IoT devices and sensors rather than in a central cloud. Use warm oranges and reds for edge devices transitioning to cool blues for the central cloud."
    },
    {
        "filename": "godels-incompleteness-thumbnail",
        "prompt": "Mathematical paradox visualized through impossible geometric structures and self-referential equations, with mathematical symbols forming an incomplete circle or spiral. Use deep blues with bright yellow and red mathematical symbols creating visual tension."
    },
    {
        "filename": "higgs-boson-thumbnail",
        "prompt": "Particle collision in a high-energy physics detector revealing the Higgs boson, with particle tracks and energy signatures emanating from a central collision point. Use dark background with vibrant particle tracks in bright yellows, reds, and electric blues."
    },
    {
        "filename": "independence-results-peano-thumbnail",
        "prompt": "Abstract mathematical visualization of axiomatic systems with highlighted unprovable statements, showing the limitations of formal systems through geometric or network representations. Use deep blues with bright gold, red and yellow highlighting key mathematical concepts."
    },
    {
        "filename": "mathematical-logic-frontiers-thumbnail",
        "prompt": "Abstract visualization of formal logical systems with symbols, proof structures, and the boundaries of provability represented through geometric or network patterns. Use deep blues with bright yellow, orange and red logical structures."
    },
    {
        "filename": "poincare-conjecture-thumbnail",
        "prompt": "Topological transformation of a three-dimensional sphere with abstract mathematical representations of manifolds and continuous deformations. Use vibrant blues with bright yellow, red and orange topological structures."
    },
    {
        "filename": "quantum-batteries-thumbnail",
        "prompt": "Energy storage device utilizing quantum mechanical principles, with entangled particles storing and releasing energy in a coordinated manner. Use deep blues with bright yellow and red energy patterns flowing between quantum elements."
    },
    {
        "filename": "quantum-entanglement-thumbnail",
        "prompt": "Pairs of entangled quantum particles connected across space, with complementary properties visualized through abstract representations of spin or polarization states. Use deep space blues with entangled particles in complementary bright colors (red/yellow or orange/cyan)."
    },
    {
        "filename": "spatial-biology-thumbnail",
        "prompt": "Three-dimensional tissue architecture with cells mapped in their spatial context, showing different cell types color-coded within a complex biological structure. Use rich biological colors with different cell types in distinct bright hues (reds, yellows, cyans) against a darker background."
    },
    {
        "filename": "string-theory-thumbnail",
        "prompt": "Vibrating strings and branes in multiple dimensions, showing how fundamental particles emerge from different vibrational patterns in higher-dimensional space. Use cosmic purples and blues with vibrating strings in bright gold, red and yellow against the fabric of spacetime."
    }
]

# Add a consistent style guide to each prompt
style_guide = "Create a modern, vibrant scientific illustration with clean, professional aesthetics. The image must be designed for a 640x640 pixel square format for Spotify podcast thumbnails. Use high contrast and saturation to ensure visibility at small sizes. Create a consistent visual style across all images."

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

# Function to generate and save images
def generate_and_save_images():
    print(f"Starting batch image generation at {datetime.now().strftime('%H:%M:%S')}")
    
    for i, image_spec in enumerate(image_specs):
        try:
            # Combine the prompt with the style guide
            full_prompt = f"{style_guide} {image_spec['prompt']}"
            
            print(f"[{i+1}/{len(image_specs)}] Generating: {image_spec['filename']}...")
            
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
    
    print(f"Batch image generation completed at {datetime.now().strftime('%H:%M:%S')}")

# Run the image generation
if __name__ == "__main__":
    # Check if Pillow is installed
    try:
        import PIL
        print(f"Using Pillow version {PIL.__version__}")
    except ImportError:
        print("Pillow is not installed. Please install it with: pip install Pillow")
        exit(1)
        
    generate_and_save_images() 