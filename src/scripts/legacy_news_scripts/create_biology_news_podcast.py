#!/usr/bin/env python3
import json
import os

# Define the podcast structure with appropriate voice IDs
podcast = {
    "title": "Biology News - Episode 1",
    "segments": [
        {
            "speaker": {"name": "Maya", "voice_id": "XrExE9yKIg1WjnnlVkGX"},  # Matilda
            "text": "Welcome to the premiere episode of Biology News, your monthly digest of groundbreaking discoveries across all branches of biological sciences. I'm Maya, your host, and today we're bringing you a program designed specifically for biology professionals, researchers, and educators. Each month, we'll deliver concise, rigorous coverage of significant advances in molecular biology, ecology, neuroscience, and evolutionary biology that matter to your research and teaching."
        },
        {
            "speaker": {"name": "Maya", "voice_id": "XrExE9yKIg1WjnnlVkGX"},  # Matilda
            "text": "Before we dive in, let me introduce our team of correspondents. Dr. James specializes in genomics and molecular biology. Dr. Sophia focuses on ecology and conservation biology. Dr. Noah covers neuroscience and behavioral biology. And Dr. Aisha brings expertise in evolutionary biology and biodiversity."
        },
        {
            "speaker": {"name": "Maya", "voice_id": "XrExE9yKIg1WjnnlVkGX"},  # Matilda
            "text": "Today's episode features several groundbreaking developments: a revolutionary CRISPR-based gene therapy for sickle cell disease, a comprehensive study on coral reef resilience in the face of climate change, a breakthrough in mapping neural circuits involved in decision-making, and a remarkable discovery about rapid evolutionary adaptation in urban wildlife."
        },
        {
            "speaker": {"name": "Maya", "voice_id": "XrExE9yKIg1WjnnlVkGX"},  # Matilda
            "text": "Let's begin with one of the most exciting developments in molecular biology and medicine. James, tell us about the new CRISPR-based gene therapy for sickle cell disease."
        },
        {
            "speaker": {"name": "James", "voice_id": "JBFqnCBsd6RMkjVDRZzb"},  # George
            "text": "Thanks, Maya. The FDA has recently approved a groundbreaking CRISPR-based gene therapy for sickle cell disease, marking a historic milestone as the first approved treatment using this revolutionary gene-editing technology in the United States."
        },
        {
            "speaker": {"name": "James", "voice_id": "JBFqnCBsd6RMkjVDRZzb"},  # George
            "text": "This therapy, developed through a collaboration between Vertex Pharmaceuticals and CRISPR Therapeutics, represents a potential functional cure for patients with sickle cell disease, a debilitating genetic blood disorder that affects approximately 100,000 Americans and millions worldwide, predominantly those of African descent."
        },
        {
            "speaker": {"name": "Maya", "voice_id": "XrExE9yKIg1WjnnlVkGX"},  # Matilda
            "text": "Could you explain the mechanism behind this therapy and what makes it different from previous treatments?"
        },
        {
            "speaker": {"name": "James", "voice_id": "JBFqnCBsd6RMkjVDRZzb"},  # George
            "text": "The therapy, called exa-cel or CASGEVY, uses CRISPR-Cas9 gene editing to modify a patient's own hematopoietic stem cells. Rather than directly correcting the mutation in the beta-globin gene that causes sickle cell disease, this approach targets a different gene called BCL11A, which normally suppresses the production of fetal hemoglobin after birth."
        },
        {
            "speaker": {"name": "James", "voice_id": "JBFqnCBsd6RMkjVDRZzb"},  # George
            "text": "By editing the BCL11A gene in stem cells, the therapy reactivates fetal hemoglobin production, which can effectively compensate for the defective adult hemoglobin in sickle cell patients. The edited stem cells are then infused back into the patient, where they can produce healthy red blood cells."
        },
        {
            "speaker": {"name": "James", "voice_id": "JBFqnCBsd6RMkjVDRZzb"},  # George
            "text": "This approach is particularly elegant because fetal hemoglobin naturally prevents sickling of red blood cells, and some individuals with sickle cell disease who naturally produce higher levels of fetal hemoglobin experience milder symptoms. The therapy essentially leverages this natural protective mechanism."
        },
        {
            "speaker": {"name": "Maya", "voice_id": "XrExE9yKIg1WjnnlVkGX"},  # Matilda
            "text": "What has the clinical data shown regarding the efficacy and safety of this treatment?"
        },
        {
            "speaker": {"name": "James", "voice_id": "JBFqnCBsd6RMkjVDRZzb"},  # George
            "text": "The clinical results have been remarkable. In the pivotal trial involving 31 patients with severe sickle cell disease, all patients remained free from vaso-occlusive crises—the painful and life-threatening events caused by sickled cells blocking blood vessels—for at least 12 months following treatment."
        },
        {
            "speaker": {"name": "James", "voice_id": "JBFqnCBsd6RMkjVDRZzb"},  # George
            "text": "The therapy led to substantial increases in fetal hemoglobin levels, with patients achieving an average of about 40% fetal hemoglobin in their red blood cells. This level is more than sufficient to prevent sickling under most conditions. Additionally, patients showed significant improvements in quality of life measures and reduced hospitalizations."
        },
        {
            "speaker": {"name": "James", "voice_id": "JBFqnCBsd6RMkjVDRZzb"},  # George
            "text": "Regarding safety, the main concerns are associated with the conditioning regimen required before the gene-edited cells are infused. Patients must undergo myeloablative conditioning with busulfan to clear space in the bone marrow for the edited stem cells, which carries risks including infertility and potential for secondary malignancies. However, no CRISPR-related adverse events have been reported so far."
        },
        {
            "speaker": {"name": "Maya", "voice_id": "XrExE9yKIg1WjnnlVkGX"},  # Matilda
            "text": "What are the implications of this approval for the broader field of gene therapy and genetic medicine?"
        },
        {
            "speaker": {"name": "James", "voice_id": "JBFqnCBsd6RMkjVDRZzb"},  # George
            "text": "This approval represents a watershed moment for genetic medicine. It validates CRISPR technology as a therapeutic approach and will likely accelerate the development of similar treatments for other genetic disorders. There are already clinical trials underway using CRISPR-based approaches for conditions like beta-thalassemia, hemophilia, and certain forms of inherited blindness."
        },
        {
            "speaker": {"name": "James", "voice_id": "JBFqnCBsd6RMkjVDRZzb"},  # George
            "text": "The approval also highlights the remarkably rapid translation of CRISPR technology from basic science to clinical application. It's worth remembering that CRISPR-Cas9 gene editing was first described for use in mammalian cells just a decade ago, in 2012, and now it's an approved therapeutic modality. This is an unprecedented pace for a new treatment paradigm."
        },
        {
            "speaker": {"name": "James", "voice_id": "JBFqnCBsd6RMkjVDRZzb"},  # George
            "text": "However, significant challenges remain, particularly regarding accessibility. The treatment is extremely expensive—estimated at $2-3 million per patient—and requires specialized facilities and expertise. Ensuring equitable access to this therapy, especially in regions where sickle cell disease is most prevalent, will be a critical challenge moving forward."
        },
        {
            "speaker": {"name": "Maya", "voice_id": "XrExE9yKIg1WjnnlVkGX"},  # Matilda
            "text": "Thank you, James. Now let's turn to an important development in ecology and conservation biology. Sophia, tell us about the new comprehensive study on coral reef resilience."
        },
        {
            "speaker": {"name": "Sophia", "voice_id": "EXAVITQu4vr4xnSDxMaL"},  # Sarah
            "text": "Thanks, Maya. An international team of marine biologists has published the most comprehensive study to date on coral reef resilience in the face of climate change, revealing surprising patterns of adaptation and identifying potential 'super reefs' that may survive warming oceans."
        },
        {
            "speaker": {"name": "Sophia", "voice_id": "EXAVITQu4vr4xnSDxMaL"},  # Sarah
            "text": "This landmark study, published in Science, combined data from over 2,500 reef sites across 44 countries, tracking coral health and recovery patterns over a 15-year period. The researchers integrated satellite data on ocean temperatures, acidity levels, and extreme weather events with on-site monitoring of coral species composition, genetic diversity, and recovery rates after bleaching events."
        },
        {
            "speaker": {"name": "Maya", "voice_id": "XrExE9yKIg1WjnnlVkGX"},  # Matilda
            "text": "What were the key findings regarding coral adaptation to warming waters?"
        },
        {
            "speaker": {"name": "Sophia", "voice_id": "EXAVITQu4vr4xnSDxMaL"},  # Sarah
            "text": "The study revealed that approximately 15% of coral reefs globally are showing significant signs of thermal adaptation, with corals in these regions able to withstand temperature increases of up to 2°C above historical maximums without bleaching. This is substantially higher than the 5-10% that previous models had predicted."
        },
        {
            "speaker": {"name": "Sophia", "voice_id": "EXAVITQu4vr4xnSDxMaL"},  # Sarah
            "text": "Interestingly, these resilient reefs aren't randomly distributed. They tend to be located in regions that experience high temperature variability but not extreme peaks. This suggests that regular exposure to moderate temperature fluctuations may promote adaptive responses in both the coral animal and its symbiotic algae."
        },
        {
            "speaker": {"name": "Sophia", "voice_id": "EXAVITQu4vr4xnSDxMaL"},  # Sarah
            "text": "The researchers identified several mechanisms contributing to this resilience. First, they found evidence of genetic adaptation in the coral host, with certain genotypes showing higher heat tolerance. Second, they observed shifts in the composition of symbiotic algae communities toward more heat-resistant Symbiodiniaceae species. And third, they documented changes in the coral microbiome that appear to enhance thermal tolerance."
        },
        {
            "speaker": {"name": "Maya", "voice_id": "XrExE9yKIg1WjnnlVkGX"},  # Matilda
            "text": "Did the study identify specific 'super reefs' that might survive future warming, and what characteristics do they share?"
        }
    ]
}

# Ensure the directory exists
json_dir = os.path.join("src", "data", "news_json_archive")
os.makedirs(json_dir, exist_ok=True)

# Write the podcast to a JSON file
json_file = os.path.join(json_dir, "biology_news_podcast.json")
with open(json_file, 'w') as f:
    json.dump(podcast, f, indent=2)

print(f"Created {json_file} with the first part of the Biology News podcast") 