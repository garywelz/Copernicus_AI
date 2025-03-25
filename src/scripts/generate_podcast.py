#!/usr/bin/env python3
import os
import json
import argparse
import base64
from typing import List, Dict
import requests
from dotenv import load_dotenv
from pydub import AudioSegment
from openai import OpenAI
import io

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Validate required environment variables
required_vars = ['OPENAI_API_KEY']
missing_vars = [var for var in required_vars if not os.getenv(var)]
if missing_vars:
    raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

# Valid subjects and their ArXiv categories
SUBJECT_CATEGORIES = {
    "physics": ["physics", "quant-ph", "hep-th"],
    "mathematics": ["math", "math-ph"],
    "computer_science": ["cs.AI", "cs.LG", "cs.CL"],
    "biology": ["q-bio"],
    "chemistry": ["cond-mat.mtrl-sci", "physics.chem-ph", "q-bio.BM"]
}

def fetch_papers(subject: str, max_papers: int = 3) -> List[Dict]:
    """Fetch recent papers from ArXiv based on subject categories."""
    categories = SUBJECT_CATEGORIES.get(subject)
    if not categories:
        raise ValueError(f"Invalid subject. Choose from: {list(SUBJECT_CATEGORIES.keys())}")
    
    # For now, return sample data
    return [
        {
            "id": "2401.12345",
            "title": "Recent Advances in Green Hydrogen Catalysis: A Comprehensive Review",
            "authors": ["John Smith", "Jane Doe"],
            "summary": "This paper reviews recent breakthroughs in water splitting catalysts for green hydrogen production...",
            "published": "2024-01-15",
            "categories": ["cond-mat.mtrl-sci"]
        },
        {
            "id": "2401.67890",
            "title": "Novel Methods for PFAS Degradation Using Advanced Oxidation Processes",
            "authors": ["Alice Johnson", "Bob Wilson"],
            "summary": "We present new approaches to breaking down per- and polyfluoroalkyl substances (PFAS) using advanced oxidation...",
            "published": "2024-01-14",
            "categories": ["physics.chem-ph"]
        }
    ]

def analyze_papers(papers: List[Dict]) -> Dict:
    """Analyze papers using GPT-4."""
    prompt = f"""Analyze these research papers and provide a structured analysis suitable for a podcast:

Papers:
{json.dumps(papers, indent=2)}

Focus on:
1. Key findings and breakthroughs
2. Real-world implications
3. Technical concepts explained simply
4. Connections between papers
5. Future research directions

Format the response as JSON with the following structure:
{{
    "title": "Engaging podcast title",
    "summary": "Overview of the main themes",
    "keyFindings": ["List of key findings"],
    "methodology": "Research approaches used",
    "implications": "Real-world impact",
    "technicalConcepts": ["List of concepts with simple explanations"],
    "futureDirections": "Potential future developments",
    "discussionPoints": ["Interesting points for discussion"],
    "references": [
        {{
            "authors": ["Author names"],
            "title": "Paper title",
            "publication": "ArXiv",
            "date": "Publication date",
            "id": "Paper ID"
        }}
    ]
}}"""

    response = client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=[
            {"role": "system", "content": "You are a science communicator specializing in making complex research accessible."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"}
    )
    
    return json.loads(response.choices[0].message.content)

def generate_podcast_script(analysis: Dict, options: Dict) -> Dict:
    """Generate podcast script using GPT-4."""
    prompt = f"""Create an engaging podcast script based on this research analysis:

Analysis:
{json.dumps(analysis, indent=2)}

Options:
{json.dumps(options, indent=2)}

The script should be approximately 10 minutes long with multiple voices:
- Host (main narrator): Professional, journalistic style with clear transitions
- Expert (explains technical concepts): Deep technical knowledge with accessible explanations
- Questioner (asks clarifying questions): Curious and engaging, helps explain complex concepts

Include:
1. Clear introduction with topic overview
2. Multiple segments with smooth transitions
3. Technical details explained simply
4. Real-world applications and implications
5. Future directions and challenges
6. Professional closing remarks

Format the response as JSON with:
{{
    "title": "Podcast title",
    "introduction": "Opening segment (45-60 seconds)",
    "segments": [
        {{
            "speaker": "host/expert/questioner",
            "content": "Speech content",
            "duration": "estimated seconds",
            "tone": "speaking style instructions"
        }}
    ],
    "conclusion": "Closing thoughts (30-45 seconds)",
    "references": [
        {{
            "authors": ["Author names"],
            "title": "Paper title",
            "publication": "ArXiv",
            "date": "Publication date",
            "id": "Paper ID",
            "url": "ArXiv URL"
        }}
    ],
    "hashtags": ["Start with subject area", "Other relevant tags"]
}}"""

    response = client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=[
            {"role": "system", "content": "You are a podcast scriptwriter specializing in science communication."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"}
    )
    
    return json.loads(response.choices[0].message.content)

def generate_audio(script: Dict) -> str:
    """Generate audio using OpenAI TTS."""
    output_dir = os.path.join(os.getcwd(), 'output', 'audio')
    os.makedirs(output_dir, exist_ok=True)
    
    # Voice configurations with tone adjustments
    voices = {
        "host": {
            "model": "tts-1",
            "voice": "onyx",
            "speed": 1.1,  # Slightly faster for engagement
            "style": "<speak>This is an engaging science podcast about {topic}...</speak>"
        },
        "expert": {
            "model": "tts-1",
            "voice": "nova",
            "speed": 1.0,  # Normal speed for clarity
            "style": "<speak>Let me explain this fascinating concept...</speak>"
        },
        "questioner": {
            "model": "tts-1",
            "voice": "shimmer",
            "speed": 1.05,  # Slightly faster for curiosity
            "style": "<speak>I'm curious about...</speak>"
        }
    }
    
    # Generate audio segments with improved pacing and tone
    audio_segments = []
    
    # Add intro music (silent for now)
    intro = AudioSegment.silent(duration=3000)  # 3 seconds
    audio_segments.append(intro)
    
    # Generate introduction with dynamic tone
    intro_speech = client.audio.speech.create(
        model=voices["host"]["model"],
        voice=voices["host"]["voice"],
        input=f"{voices['host']['style'].format(topic=script['title'])}\n\n{script['introduction']}"
    )
    intro_segment = AudioSegment.from_file(io.BytesIO(intro_speech.content), format="mp3")
    audio_segments.append(intro_segment)
    
    # Generate segments with appropriate pacing and tone
    for segment in script["segments"]:
        # Add natural pause
        pause_duration = 800 if segment.get("tone") == "reflection" else 500
        audio_segments.append(AudioSegment.silent(duration=pause_duration))
        
        # Generate speech with style
        voice_config = voices[segment["speaker"]]
        speech_input = f"{voice_config['style']}\n\n{segment['content']}"
        speech = client.audio.speech.create(
            model=voice_config["model"],
            voice=voice_config["voice"],
            input=speech_input
        )
        segment_audio = AudioSegment.from_file(io.BytesIO(speech.content), format="mp3")
        audio_segments.append(segment_audio)
    
    # Add reflection pause before conclusion
    audio_segments.append(AudioSegment.silent(duration=1500))
    
    # Generate conclusion with wrap-up tone
    conclusion_speech = client.audio.speech.create(
        model=voices["host"]["model"],
        voice=voices["host"]["voice"],
        input=f"<speak>To wrap up today's fascinating discussion...</speak>\n\n{script['conclusion']}"
    )
    conclusion_segment = AudioSegment.from_file(io.BytesIO(conclusion_speech.content), format="mp3")
    audio_segments.append(conclusion_segment)
    
    # Add outro music (silent for now)
    outro = AudioSegment.silent(duration=3000)  # 3 seconds
    audio_segments.append(outro)
    
    # Combine all segments
    final_audio = sum(audio_segments)
    
    # Export final audio
    output_file = os.path.join(output_dir, f"{script['title'].lower().replace(' ', '-')}.mp3")
    final_audio.export(output_file, format="mp3")
    
    return output_file

def generate_thumbnail(script: Dict) -> str:
    """Generate thumbnail using DALL-E."""
    output_dir = os.path.join(os.getcwd(), 'output', 'images')
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate image prompt
    prompt = f"""Create a modern, professional podcast thumbnail for a science podcast titled "{script['title']}".
The image should be clean and minimalist, featuring scientific elements related to {script['hashtags'][0]}.
Use a color scheme that suggests innovation and discovery. Include the podcast title in modern typography."""

    response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size="1024x1024",
        quality="standard",
        n=1
    )
    
    # Download and save the image
    image_url = response.data[0].url
    image_response = requests.get(image_url)
    
    output_file = os.path.join(output_dir, f"{script['title'].lower().replace(' ', '-')}.png")
    with open(output_file, 'wb') as f:
        f.write(image_response.content)
    
    return output_file

def generate_description(script: Dict) -> str:
    """Generate podcast description suitable for Spotify (max 4000 chars)."""
    # Format references with links
    references = []
    for ref in script["references"]:
        arxiv_url = f"https://arxiv.org/abs/{ref['id']}"
        ref_text = f"{', '.join(ref['authors'])}. {ref['title']}. arXiv:{ref['id']} ({ref['date']}). {arxiv_url}"
        references.append(ref_text)
    
    # Create description without title or publication date
    description = f"""In this episode, we explore {script['title'].lower()}, diving deep into the latest research and its implications for our understanding of the field.

Key topics covered:
{chr(10).join(f"• {point}" for point in script.get('keyFindings', []))}

Technical concepts explained:
{chr(10).join(f"• {concept}" for concept in script.get('technicalConcepts', []))}

Real-world applications:
{script.get('implications', '')}

Future directions:
{script.get('futureDirections', '')}

References:
{chr(10).join(references)}

Learn more at copernicusai.org

{chr(10).join(f"#{tag}" for tag in script['hashtags'])}"""

    # Ensure description is within Spotify's 4000 character limit
    if len(description) > 4000:
        # Truncate while preserving complete sentences
        description = description[:3997] + "..."
    
    return description

def ensure_output_dirs():
    """Create output directories if they don't exist."""
    os.makedirs('output/audio', exist_ok=True)
    os.makedirs('output/images', exist_ok=True)
    os.makedirs('output/descriptions', exist_ok=True)

def main():
    # Load environment variables from .env file
    load_dotenv()
    
    # Create output directories
    ensure_output_dirs()
    
    # Initialize OpenAI client with API key from .env
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    
    parser = argparse.ArgumentParser(description="Generate a research discussion podcast")
    parser.add_argument("subject", choices=list(SUBJECT_CATEGORIES.keys()), help="Subject area")
    parser.add_argument("--papers", type=int, default=3, help="Number of papers to include")
    parser.add_argument("--complexity", choices=['beginner', 'intermediate', 'advanced'], 
                       default='intermediate', help="Target audience complexity")
    args = parser.parse_args()
    
    try:
        print("Fetching papers...")
        papers = fetch_papers(args.subject, args.papers)
        
        print("Analyzing papers...")
        analysis = analyze_papers(papers)
        
        print("Generating podcast script...")
        script = generate_podcast_script(analysis, {
            "type": "research",
            "subject": args.subject,
            "targetDuration": 10,  # minutes
            "complexity": args.complexity,
            "style": "engaging and dynamic"
        })
        
        print("Generating audio...")
        audio_file = generate_audio(script)
        
        print("Generating thumbnail...")
        thumbnail_file = generate_thumbnail(script)
        
        print("Generating description...")
        description = generate_description(script)
        
        print(f"\nPodcast generated successfully!")
        print(f"Audio: {audio_file}")
        print(f"Thumbnail: {thumbnail_file}")
        print(f"Description: {description}")
        
    except Exception as e:
        print(f"Error generating podcast: {str(e)}")
        raise

if __name__ == "__main__":
    main() 