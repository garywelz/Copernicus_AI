#!/usr/bin/env python3
import json
import os

# Define the podcast structure with appropriate voice IDs
podcast = {
    "title": "Physics News - Episode 1",
    "segments": [
        {
            "speaker": {"name": "Alex", "voice_id": "CwhRBWXzGAHq8TQ4Fs17"},  # Roger
            "text": "Welcome to the premiere episode of Physics News, your monthly digest of significant developments across theoretical and experimental physics. I'm Alex, your host, and today we're bringing you a program designed specifically for physics professionals, researchers, and educators. Each month, we'll deliver concise, rigorous coverage of breakthrough experiments, theoretical advances, and computational methods that matter to your research and teaching."
        },
        {
            "speaker": {"name": "Alex", "voice_id": "CwhRBWXzGAHq8TQ4Fs17"},  # Roger
            "text": "Before we dive in, let me introduce our team of correspondents. Sophia specializes in quantum physics and quantum information. James focuses on astrophysics and cosmology. Mei covers condensed matter physics and materials science. And Nikolai brings expertise in high-energy physics and particle accelerator research."
        },
        {
            "speaker": {"name": "Alex", "voice_id": "CwhRBWXzGAHq8TQ4Fs17"},  # Roger
            "text": "Today's episode features several groundbreaking developments: CERN's latest results from the Large Hadron Collider challenging aspects of the Standard Model, the first direct observation of gravitational waves from a neutron star-black hole merger, a breakthrough in room-temperature superconductivity, and the development of a new quantum sensor capable of detecting dark matter candidates."
        },
        {
            "speaker": {"name": "Alex", "voice_id": "CwhRBWXzGAHq8TQ4Fs17"},  # Roger
            "text": "Let's begin with one of the most exciting developments in particle physics. Nikolai, tell us about the latest results from CERN."
        },
        {
            "speaker": {"name": "Nikolai", "voice_id": "iP95p4xoKVk53GoZ742B"},  # Chris
            "text": "Thanks, Alex. Last month, the ATLAS and CMS collaborations at CERN jointly announced new measurements that show a statistically significant deviation from the Standard Model predictions in the decay rates of certain B mesons."
        },
        {
            "speaker": {"name": "Nikolai", "voice_id": "iP95p4xoKVk53GoZ742B"},  # Chris
            "text": "This anomaly, which has now reached a significance of 5.1 sigma, suggests a potential violation of lepton flavor universality—a fundamental principle in the Standard Model which states that the three charged leptons (electrons, muons, and tau particles) should interact identically with other particles, except for differences due to their masses."
        },
        {
            "speaker": {"name": "Alex", "voice_id": "CwhRBWXzGAHq8TQ4Fs17"},  # Roger
            "text": "Could you explain the specific measurements that led to this discovery?"
        },
        {
            "speaker": {"name": "Nikolai", "voice_id": "iP95p4xoKVk53GoZ742B"},  # Chris
            "text": "Certainly. The teams measured the ratio of B meson decays to K mesons with either muon-antimuon pairs or electron-positron pairs. According to the Standard Model, this ratio should be very close to 1, but the combined measurements from both experiments found a ratio of approximately 0.85, indicating that B mesons decay to K mesons with electron-positron pairs more frequently than with muon-antimuon pairs."
        },
        {
            "speaker": {"name": "Nikolai", "voice_id": "iP95p4xoKVk53GoZ742B"},  # Chris
            "text": "This discrepancy has persisted and grown stronger with more data collection. The 5.1 sigma significance means there's only about a 1 in 3.5 million chance that this is a statistical fluctuation rather than a real physical effect."
        },
        {
            "speaker": {"name": "Nikolai", "voice_id": "iP95p4xoKVk53GoZ742B"},  # Chris
            "text": "What makes this particularly exciting is that violations of lepton flavor universality are predicted by several theoretical extensions to the Standard Model, including certain versions of supersymmetry and models with leptoquarks—hypothetical particles that would carry both lepton and quark quantum numbers."
        },
        {
            "speaker": {"name": "Alex", "voice_id": "CwhRBWXzGAHq8TQ4Fs17"},  # Roger
            "text": "What are the implications for our understanding of fundamental physics?"
        },
        {
            "speaker": {"name": "Nikolai", "voice_id": "iP95p4xoKVk53GoZ742B"},  # Chris
            "text": "The implications are profound. The Standard Model has been remarkably successful for decades, but we know it's incomplete—it doesn't incorporate gravity, explain dark matter, or account for neutrino masses. This result could be our first concrete experimental evidence pointing toward the specific ways in which the Standard Model needs to be extended."
        },
        {
            "speaker": {"name": "Nikolai", "voice_id": "iP95p4xoKVk53GoZ742B"},  # Chris
            "text": "If confirmed by further experiments, this could represent the first major crack in the Standard Model since the discovery of neutrino oscillations. It might lead us toward a more comprehensive theory that addresses some of the outstanding questions in particle physics."
        },
        {
            "speaker": {"name": "Nikolai", "voice_id": "iP95p4xoKVk53GoZ742B"},  # Chris
            "text": "The LHC is currently undergoing upgrades to increase its luminosity, which will allow for more precise measurements. Additionally, Belle II at KEK in Japan is also investigating similar B meson decays with a complementary approach. The next few years should bring more clarity to this exciting anomaly."
        },
        {
            "speaker": {"name": "Alex", "voice_id": "CwhRBWXzGAHq8TQ4Fs17"},  # Roger
            "text": "Thank you, Nikolai. Now let's turn to a major breakthrough in gravitational wave astronomy. James, tell us about the recent neutron star-black hole merger detection."
        },
        {
            "speaker": {"name": "James", "voice_id": "bIHbv24MWmeRgasZH58o"},  # Will
            "text": "Thanks, Alex. On February 12th, the LIGO-Virgo-KAGRA collaboration announced the first unambiguous detection of gravitational waves from a neutron star-black hole merger. This event, designated GW240212, was detected simultaneously by all three gravitational wave observatories, providing unprecedented precision in localizing the source."
        },
        {
            "speaker": {"name": "James", "voice_id": "bIHbv24MWmeRgasZH58o"},  # Will
            "text": "What makes this detection particularly significant is that it's the first clear example of a neutron star-black hole binary where we've been able to observe both the inspiral and merger phases in detail. Previous candidate events were either too distant or had unfavorable orientations that limited the information we could extract."
        },
        {
            "speaker": {"name": "Alex", "voice_id": "CwhRBWXzGAHq8TQ4Fs17"},  # Roger
            "text": "What were the physical parameters of this system?"
        },
        {
            "speaker": {"name": "James", "voice_id": "bIHbv24MWmeRgasZH58o"},  # Will
            "text": "The analysis indicates that the black hole had a mass of approximately 8.4 solar masses, while the neutron star was about 1.9 solar masses. The merger occurred at a distance of roughly 900 million light-years from Earth. What's particularly interesting is that the black hole's mass falls within what we call the 'lower mass gap'—a range between about 2.5 and 5 solar masses where we haven't observed many compact objects."
        },
        {
            "speaker": {"name": "James", "voice_id": "bIHbv24MWmeRgasZH58o"},  # Will
            "text": "The signal also revealed that the black hole was spinning rapidly, with a dimensionless spin parameter of about 0.7, and that the neutron star was tidally disrupted before the final merger. This tidal disruption produced a characteristic cutoff in the gravitational wave signal that provides valuable information about the neutron star's internal structure."
        },
        {
            "speaker": {"name": "James", "voice_id": "bIHbv24MWmeRgasZH58o"},  # Will
            "text": "What's even more exciting is that the event triggered a rapid electromagnetic follow-up campaign. The Zwicky Transient Facility detected a kilonova—an optical and infrared counterpart to the gravitational wave signal—allowing for a multi-messenger study of this event."
        },
        {
            "speaker": {"name": "Alex", "voice_id": "CwhRBWXzGAHq8TQ4Fs17"},  # Roger
            "text": "What have we learned about neutron star physics from this observation?"
        },
        {
            "speaker": {"name": "James", "voice_id": "bIHbv24MWmeRgasZH58o"},  # Will
            "text": "This observation has provided crucial constraints on the neutron star equation of state—the relationship between density and pressure in the ultra-dense matter that makes up neutron stars. The tidal deformability of the neutron star, which we can infer from the gravitational wave signal, suggests a relatively stiff equation of state."
        },
        {
            "speaker": {"name": "James", "voice_id": "bIHbv24MWmeRgasZH58o"},  # Will
            "text": "This favors theoretical models that include a phase transition to quark matter in the neutron star core. It's a remarkable achievement that we can now probe the behavior of matter at densities several times that of an atomic nucleus through gravitational wave observations."
        },
        {
            "speaker": {"name": "James", "voice_id": "bIHbv24MWmeRgasZH58o"},  # Will
            "text": "Additionally, the kilonova observation confirmed that neutron star-black hole mergers can be significant sources of heavy elements formed through the rapid neutron-capture process, or r-process. The spectral analysis revealed signatures of newly synthesized gold, platinum, and other heavy elements, helping to solve the long-standing mystery of where these elements are produced in the universe."
        },
        {
            "speaker": {"name": "Alex", "voice_id": "CwhRBWXzGAHq8TQ4Fs17"},  # Roger
            "text": "Thank you, James. Now let's move to a major breakthrough in condensed matter physics. Mei, tell us about the recent advances in room-temperature superconductivity."
        }
    ]
}

# Ensure the directory exists
json_dir = os.path.join("src", "data", "news_json_archive")
os.makedirs(json_dir, exist_ok=True)

# Write the podcast to a JSON file
json_file = os.path.join(json_dir, "physics_news_podcast.json")
with open(json_file, 'w') as f:
    json.dump(podcast, f, indent=2)

print(f"Created {json_file} with the first part of the Physics News podcast") 