#!/usr/bin/env python3
import json
import os

# Define the podcast structure
podcast_data = {
    "title": "Science News - Episode 1 (Part 1)",
    "segments": [
        {
            "speaker": {
                "name": "Daniel",
                "voice_id": "pNInz6obpgDQGcFmaJgB"  # Adam voice
            },
            "text": "Welcome to Science News, your comprehensive source for the latest breakthroughs and developments across all scientific disciplines. I'm Daniel, your host, and today we're bringing you a diverse range of stories from the frontiers of research, as well as important updates from government agencies and industry partners that are shaping the scientific landscape."
        },
        {
            "speaker": {
                "name": "Daniel",
                "voice_id": "pNInz6obpgDQGcFmaJgB"  # Adam voice
            },
            "text": "In today's episode, we'll explore a groundbreaking fusion energy milestone, a major NASA announcement about the Artemis program, a pharmaceutical breakthrough in Alzheimer's treatment, and a concerning report on global biodiversity loss. Let me introduce our team of correspondents who will be bringing you these stories."
        },
        {
            "speaker": {
                "name": "Daniel",
                "voice_id": "pNInz6obpgDQGcFmaJgB"  # Adam voice
            },
            "text": "First, we have Elena, our physics and energy correspondent, who will discuss the recent fusion breakthrough at the National Ignition Facility. Then, Sarah will cover NASA's latest Artemis program update. Michael will report on a pharmaceutical industry advancement in Alzheimer's treatment, and finally, James will discuss a new international report on biodiversity loss."
        },
        {
            "speaker": {
                "name": "Elena",
                "voice_id": "21m00Tcm4TlvDq8ikWAM"  # Rachel voice
            },
            "text": "Thanks, Daniel. I'm excited to share news of what many are calling a historic milestone in fusion energy research. The National Ignition Facility at Lawrence Livermore National Laboratory has announced they've achieved a sustained fusion reaction with a Q-factor of 1.5, meaning they produced 50% more energy than was put into the reaction."
        },
        {
            "speaker": {
                "name": "Elena",
                "voice_id": "21m00Tcm4TlvDq8ikWAM"  # Rachel voice
            },
            "text": "This breakthrough builds on their previous achievement of fusion ignition in 2022, but the key difference here is the sustained nature of the reaction, which lasted for nearly 30 seconds. This is orders of magnitude longer than previous attempts and represents a critical step toward practical fusion energy."
        },
        {
            "speaker": {
                "name": "Elena",
                "voice_id": "21m00Tcm4TlvDq8ikWAM"  # Rachel voice
            },
            "text": "The Department of Energy has called this a 'quantum leap' in fusion research and has announced a $1.8 billion funding package to accelerate the development of commercial fusion technologies. Energy Secretary Jennifer Granholm stated that this breakthrough 'puts us on a clear path toward fusion as a viable clean energy source within the next two decades.'"
        },
        {
            "speaker": {
                "name": "Daniel",
                "voice_id": "pNInz6obpgDQGcFmaJgB"  # Adam voice
            },
            "text": "That's remarkable, Elena. A sustained fusion reaction has been a holy grail in energy research for decades. What are the practical implications of this breakthrough?"
        },
        {
            "speaker": {
                "name": "Elena",
                "voice_id": "21m00Tcm4TlvDq8ikWAM"  # Rachel voice
            },
            "text": "The implications are profound, Daniel. Fusion energy promises virtually limitless clean energy with no greenhouse gas emissions and minimal radioactive waste compared to conventional nuclear fission. The fuel—primarily isotopes of hydrogen—is abundant, and the process is inherently safe, with no risk of meltdown."
        },
        {
            "speaker": {
                "name": "Elena",
                "voice_id": "21m00Tcm4TlvDq8ikWAM"  # Rachel voice
            },
            "text": "What's particularly exciting is that this breakthrough has triggered a wave of private investment. Three major energy companies—Chevron, BP, and General Atomic—have announced a joint venture with $2 billion in initial funding to commercialize this technology. They're projecting the first commercial fusion power plant could be operational by 2035."
        },
        {
            "speaker": {
                "name": "Daniel",
                "voice_id": "pNInz6obpgDQGcFmaJgB"  # Adam voice
            },
            "text": "Thank you, Elena, for that insightful report. Now let's turn to Sarah for an update on NASA's Artemis program. Sarah, I understand there's been a significant announcement?"
        },
        {
            "speaker": {
                "name": "Sarah",
                "voice_id": "EXAVITQu4vr4xnSDxMaL"  # Bella voice
            },
            "text": "That's right, Daniel. NASA has officially announced the crew for the Artemis III mission, which will mark humanity's return to the lunar surface and will include the first woman and person of color to walk on the Moon. The four-person crew consists of veteran astronauts Christina Koch and Victor Glover, who will be the surface team, along with Reid Wiseman and Jessica Meir, who will remain in lunar orbit."
        }
    ]
}

# Ensure the directory exists
json_dir = os.path.join("src", "data", "news_json_archive")
os.makedirs(json_dir, exist_ok=True)

# Create the JSON file
json_file = os.path.join(json_dir, "science_news_podcast.json")
with open(json_file, "w") as f:
    json.dump(podcast_data, f, indent=4)

print(f"Created {json_file} with the first part of the Science News podcast") 