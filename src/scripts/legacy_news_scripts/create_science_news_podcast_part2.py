#!/usr/bin/env python3
import json
import os

# Define the podcast structure for part 2
podcast_data = {
    "title": "Science News - Episode 1 (Part 2)",
    "segments": [
        {
            "speaker": {
                "name": "Sarah",
                "voice_id": "EXAVITQu4vr4xnSDxMaL"  # Bella voice
            },
            "text": "The mission is scheduled for September 2026 and will involve a week-long stay on the lunar south pole, where the crew will conduct experiments related to lunar geology, search for water ice, and test technologies for future Mars missions. NASA Administrator Bill Nelson called it 'a historic moment for humanity's return to deep space exploration.'"
        },
        {
            "speaker": {
                "name": "Sarah",
                "voice_id": "EXAVITQu4vr4xnSDxMaL"  # Bella voice
            },
            "text": "What's particularly significant about this announcement is that it comes alongside a new international agreement. Five additional countries—India, South Korea, Brazil, New Zealand, and Singapore—have signed the Artemis Accords, bringing the total number of signatories to 28 nations committed to peaceful lunar exploration."
        },
        {
            "speaker": {
                "name": "Sarah",
                "voice_id": "EXAVITQu4vr4xnSDxMaL"  # Bella voice
            },
            "text": "The economic implications are substantial as well. NASA estimates that the Artemis program will generate over $150 billion in economic activity and create approximately 70,000 jobs across the aerospace sector and supporting industries. Several commercial partners, including SpaceX, Blue Origin, and Lockheed Martin, have secured contracts totaling $8.2 billion for various components of the mission architecture."
        },
        {
            "speaker": {
                "name": "Daniel",
                "voice_id": "pNInz6obpgDQGcFmaJgB"  # Adam voice
            },
            "text": "Thank you, Sarah. It's exciting to see the Artemis program moving forward with such momentum. Now, let's turn to Michael for news from the pharmaceutical industry. Michael, I understand there's been a significant breakthrough in Alzheimer's treatment?"
        },
        {
            "speaker": {
                "name": "Michael",
                "voice_id": "flq6f7yk4E4fJM5XTYuZ"  # Antoni voice
            },
            "text": "Yes, Daniel. The FDA has granted full approval to Neuregen Therapeutics' drug Memorate, making it the first disease-modifying treatment for Alzheimer's disease to receive full approval rather than accelerated approval. This represents a major milestone in neurodegenerative disease research."
        },
        {
            "speaker": {
                "name": "Michael",
                "voice_id": "flq6f7yk4E4fJM5XTYuZ"  # Antoni voice
            },
            "text": "Memorate works through a novel dual mechanism that both reduces amyloid plaque buildup and modulates neuroinflammation. In phase 3 clinical trials involving over 2,800 patients with early-stage Alzheimer's, the drug demonstrated a 42% reduction in cognitive decline compared to placebo over an 18-month period."
        },
        {
            "speaker": {
                "name": "Michael",
                "voice_id": "flq6f7yk4E4fJM5XTYuZ"  # Antoni voice
            },
            "text": "What's particularly noteworthy is that this approval comes with fewer restrictions than previous Alzheimer's treatments. The drug can be administered as a monthly infusion in outpatient settings, and importantly, Medicare has announced it will provide full coverage, making it accessible to millions of patients."
        },
        {
            "speaker": {
                "name": "Daniel",
                "voice_id": "pNInz6obpgDQGcFmaJgB"  # Adam voice
            },
            "text": "That sounds like a significant advancement, Michael. What has been the response from the medical community and patient advocacy groups?"
        },
        {
            "speaker": {
                "name": "Michael",
                "voice_id": "flq6f7yk4E4fJM5XTYuZ"  # Antoni voice
            },
            "text": "The response has been overwhelmingly positive, Daniel. The Alzheimer's Association called it a 'watershed moment' in the fight against the disease. Neurologists are particularly encouraged by the safety profile, with significantly fewer instances of the brain swelling and microhemorrhages that have plagued earlier treatments."
        },
        {
            "speaker": {
                "name": "Michael",
                "voice_id": "flq6f7yk4E4fJM5XTYuZ"  # Antoni voice
            },
            "text": "Industry analysts project that Memorate could generate up to $12 billion in annual sales by 2028, making it potentially one of the most commercially successful drugs in history. This has triggered increased investment across the neurodegenerative disease space, with venture capital funding for related startups increasing by 65% in the last quarter alone."
        },
        {
            "speaker": {
                "name": "Daniel",
                "voice_id": "pNInz6obpgDQGcFmaJgB"  # Adam voice
            },
            "text": "Thank you, Michael, for that comprehensive update. Finally, let's turn to James for a report on global biodiversity. James, I understand there's a concerning new international report?"
        },
        {
            "speaker": {
                "name": "James",
                "voice_id": "SOYHLrjzK2X1ezoPC6cr"  # Josh voice
            },
            "text": "That's right, Daniel. The Intergovernmental Science-Policy Platform on Biodiversity and Ecosystem Services, or IPBES, has released its most comprehensive assessment to date, and the findings are alarming. The report, which synthesizes data from over 15,000 scientific studies, concludes that the current rate of species extinction is at least 100 times higher than the natural background rate."
        },
        {
            "speaker": {
                "name": "James",
                "voice_id": "SOYHLrjzK2X1ezoPC6cr"  # Josh voice
            },
            "text": "The assessment identifies five primary drivers of biodiversity loss: habitat destruction, climate change, pollution, overexploitation of resources, and invasive species. What's particularly concerning is the acceleration of these trends despite increased awareness and conservation efforts."
        },
        {
            "speaker": {
                "name": "James",
                "voice_id": "SOYHLrjzK2X1ezoPC6cr"  # Josh voice
            },
            "text": "The report estimates that approximately 1 million animal and plant species are now threatened with extinction, many within decades. This includes 40% of amphibian species, 33% of reef-forming corals, and 33% of marine mammals. The implications for ecosystem services that humans depend on—such as pollination, water purification, and carbon sequestration—are profound."
        },
        {
            "speaker": {
                "name": "Daniel",
                "voice_id": "pNInz6obpgDQGcFmaJgB"  # Adam voice
            },
            "text": "Those statistics are certainly concerning, James. Has the report proposed any solutions or policy recommendations?"
        },
        {
            "speaker": {
                "name": "James",
                "voice_id": "SOYHLrjzK2X1ezoPC6cr"  # Josh voice
            },
            "text": "Yes, Daniel. The report outlines a series of 'transformative changes' needed across economic, social, political, and technological domains. These include expanding protected areas to cover at least 30% of land and sea by 2030, reforming agricultural subsidies that harm biodiversity, strengthening environmental regulations, and integrating biodiversity considerations into all aspects of development planning."
        },
        {
            "speaker": {
                "name": "James",
                "voice_id": "SOYHLrjzK2X1ezoPC6cr"  # Josh voice
            },
            "text": "In response to the report, a coalition of 93 countries has pledged to increase biodiversity funding to $200 billion annually by 2025. Additionally, major corporations including Unilever, Nestlé, and Walmart have committed to eliminating deforestation from their supply chains by 2028 and investing in nature-based solutions."
        },
        {
            "speaker": {
                "name": "Daniel",
                "voice_id": "pNInz6obpgDQGcFmaJgB"  # Adam voice
            },
            "text": "Thank you, James, for that sobering but important report. And thank you to all our correspondents for bringing us these significant scientific developments. Today we've covered a historic fusion energy breakthrough, NASA's Artemis III mission announcement, a groundbreaking Alzheimer's treatment approval, and a critical report on global biodiversity loss."
        },
        {
            "speaker": {
                "name": "Daniel",
                "voice_id": "pNInz6obpgDQGcFmaJgB"  # Adam voice
            },
            "text": "These stories highlight both the remarkable progress being made across scientific disciplines and the significant challenges we still face. They also underscore the crucial role that government agencies, private industry, and international cooperation play in advancing scientific knowledge and applying it to solve global problems."
        },
        {
            "speaker": {
                "name": "Daniel",
                "voice_id": "pNInz6obpgDQGcFmaJgB"  # Adam voice
            },
            "text": "That's all for this episode of Science News. I'm Daniel, and we'll be back next week with more updates from the world of science. Thank you for listening."
        }
    ]
}

# Ensure the directory exists
json_dir = os.path.join("src", "data", "news_json_archive")
os.makedirs(json_dir, exist_ok=True)

# Create the JSON file
json_file = os.path.join(json_dir, "science_news_podcast_part2.json")
with open(json_file, "w") as f:
    json.dump(podcast_data, f, indent=4)

print(f"Created {json_file} with the second part of the Science News podcast") 