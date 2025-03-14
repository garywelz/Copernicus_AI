#!/usr/bin/env python3
import json
import os

# Define the podcast structure for part 2 with appropriate voice IDs
podcast_part2 = {
    "title": "Physics News - Episode 1 (Part 2)",
    "segments": [
        {
            "speaker": {"name": "Mei", "voice_id": "XB0fDUnXU5powFXDhCwa"},  # Charlotte
            "text": "Thanks, Alex. In January 2024, a team led by researchers at the University of Rochester and the University of Nevada Las Vegas published a paper in Nature reporting the synthesis of a nitrogen-doped lutetium hydride compound that exhibits superconductivity at 21 degrees Celsius (70 degrees Fahrenheit) and a pressure of about 10 kilobars."
        },
        {
            "speaker": {"name": "Mei", "voice_id": "XB0fDUnXU5powFXDhCwa"},  # Charlotte
            "text": "While this pressure is still high—about 10,000 times atmospheric pressure—it's significantly lower than previous room-temperature superconductors, which required pressures in the megabar range, comparable to those at the Earth's core."
        },
        {
            "speaker": {"name": "Alex", "voice_id": "CwhRBWXzGAHq8TQ4Fs17"},  # Roger
            "text": "Could you explain the significance of this breakthrough?"
        },
        {
            "speaker": {"name": "Mei", "voice_id": "XB0fDUnXU5powFXDhCwa"},  # Charlotte
            "text": "This represents a major step toward the holy grail of condensed matter physics: a material that superconducts at ambient temperature and pressure. The previous record for a room-temperature superconductor required pressures about 100 times higher. At 10 kilobars, we're entering a pressure range that can be achieved with relatively simple mechanical devices rather than specialized diamond anvil cells."
        },
        {
            "speaker": {"name": "Mei", "voice_id": "XB0fDUnXU5powFXDhCwa"},  # Charlotte
            "text": "What's particularly interesting about this material is that it combines three elements—lutetium, hydrogen, and nitrogen—in a complex crystal structure. The researchers found that the nitrogen doping stabilizes the structure and enhances the electron-phonon coupling that underlies conventional superconductivity."
        },
        {
            "speaker": {"name": "Mei", "voice_id": "XB0fDUnXU5powFXDhCwa"},  # Charlotte
            "text": "The team verified superconductivity through multiple independent measurements: zero electrical resistance, the Meissner effect (magnetic field expulsion), and the isotope effect. They also observed the characteristic energy gap in the electronic density of states using scanning tunneling spectroscopy."
        },
        {
            "speaker": {"name": "Alex", "voice_id": "CwhRBWXzGAHq8TQ4Fs17"},  # Roger
            "text": "What theoretical insights have we gained from this discovery?"
        },
        {
            "speaker": {"name": "Mei", "voice_id": "XB0fDUnXU5powFXDhCwa"},  # Charlotte
            "text": "The results strongly support the theoretical predictions made by Neil Ashcroft in the 1970s that hydrogen-rich compounds—hydrides—could be high-temperature superconductors. The current understanding is that this material follows the conventional Bardeen-Cooper-Schrieffer (BCS) mechanism of superconductivity, where electron pairing is mediated by phonons."
        },
        {
            "speaker": {"name": "Mei", "voice_id": "XB0fDUnXU5powFXDhCwa"},  # Charlotte
            "text": "However, the critical temperature is higher than what simple BCS theory would predict, suggesting that there might be additional mechanisms at play. Theoretical calculations indicate that the light hydrogen atoms create high-frequency phonon modes that enhance the electron-phonon coupling strength."
        },
        {
            "speaker": {"name": "Mei", "voice_id": "XB0fDUnXU5powFXDhCwa"},  # Charlotte
            "text": "This discovery has also spurred new theoretical work on designing similar materials with even lower pressure requirements. Several research groups are now exploring other rare earth hydrides with various dopants to optimize the superconducting properties."
        },
        {
            "speaker": {"name": "Alex", "voice_id": "CwhRBWXzGAHq8TQ4Fs17"},  # Roger
            "text": "What are the potential applications if we can further reduce the pressure requirements?"
        },
        {
            "speaker": {"name": "Mei", "voice_id": "XB0fDUnXU5powFXDhCwa"},  # Charlotte
            "text": "The applications would be revolutionary. Room-temperature superconductors would eliminate the need for expensive cooling systems in technologies that currently use superconductors, such as MRI machines and particle accelerators."
        },
        {
            "speaker": {"name": "Mei", "voice_id": "XB0fDUnXU5powFXDhCwa"},  # Charlotte
            "text": "They would enable lossless power transmission, potentially saving billions in energy costs and reducing carbon emissions. We could see dramatic improvements in energy storage, more powerful and efficient electric motors, and magnetic levitation for transportation systems."
        },
        {
            "speaker": {"name": "Mei", "voice_id": "XB0fDUnXU5powFXDhCwa"},  # Charlotte
            "text": "In quantum computing, room-temperature superconducting qubits could make large-scale quantum computers more practical. And in medical imaging, smaller and less expensive MRI and MEG devices could become widely available, revolutionizing healthcare access."
        },
        {
            "speaker": {"name": "Alex", "voice_id": "CwhRBWXzGAHq8TQ4Fs17"},  # Roger
            "text": "Thank you, Mei. Now let's turn to a fascinating development in quantum sensing technology. Sophia, tell us about the new quantum sensor for dark matter detection."
        },
        {
            "speaker": {"name": "Sophia", "voice_id": "EXAVITQu4vr4xnSDxMaL"},  # Sarah
            "text": "Thanks, Alex. Researchers at MIT, in collaboration with scientists at the University of California, Berkeley, have developed a new type of quantum sensor that could revolutionize the search for axions—hypothetical particles that are leading candidates for dark matter."
        },
        {
            "speaker": {"name": "Sophia", "voice_id": "EXAVITQu4vr4xnSDxMaL"},  # Sarah
            "text": "Traditional axion detection experiments, like the Axion Dark Matter Experiment (ADMX), use microwave cavities to search for axions converting into photons in a strong magnetic field. However, these experiments are limited in the mass range they can probe because the cavity dimensions must match the Compton wavelength of the axion."
        },
        {
            "speaker": {"name": "Alex", "voice_id": "CwhRBWXzGAHq8TQ4Fs17"},  # Roger
            "text": "How does this new quantum sensor overcome these limitations?"
        },
        {
            "speaker": {"name": "Sophia", "voice_id": "EXAVITQu4vr4xnSDxMaL"},  # Sarah
            "text": "The innovation lies in using an array of superconducting qubits as the detection medium. Each qubit is designed to be sensitive to the tiny magnetic field fluctuations that would be produced if axions convert to photons. By using quantum entanglement between the qubits, the researchers have achieved a sensitivity that surpasses the standard quantum limit by a factor of about 25."
        },
        {
            "speaker": {"name": "Sophia", "voice_id": "EXAVITQu4vr4xnSDxMaL"},  # Sarah
            "text": "The key advantage is that this approach doesn't rely on resonant cavities, so it can search for axions across a much broader mass range simultaneously. The current prototype operates at millikelvin temperatures and has demonstrated sensitivity to magnetic fields as small as 10^-19 tesla—about a trillion times weaker than Earth's magnetic field."
        },
        {
            "speaker": {"name": "Sophia", "voice_id": "EXAVITQu4vr4xnSDxMaL"},  # Sarah
            "text": "What's particularly elegant about this approach is that it leverages techniques developed for quantum computing. The qubits are essentially being used as a quantum processor that performs a very specific computation: detecting the signature of axion-photon conversion."
        },
        {
            "speaker": {"name": "Alex", "voice_id": "CwhRBWXzGAHq8TQ4Fs17"},  # Roger
            "text": "Have they detected any axion candidates yet?"
        },
        {
            "speaker": {"name": "Sophia", "voice_id": "EXAVITQu4vr4xnSDxMaL"},  # Sarah
            "text": "Not yet. The current experiment has set new upper limits on the axion-photon coupling in the mass range of 40 to 400 microelectronvolts, which corresponds to frequencies of about 10 to 100 gigahertz. This range was previously difficult to probe with traditional techniques."
        },
        {
            "speaker": {"name": "Sophia", "voice_id": "EXAVITQu4vr4xnSDxMaL"},  # Sarah
            "text": "The team is now working on scaling up the detector with more qubits and improving the coherence time, which should further enhance the sensitivity. They're also developing techniques to distinguish potential axion signals from background noise, which is crucial for making a definitive detection."
        },
        {
            "speaker": {"name": "Sophia", "voice_id": "EXAVITQu4vr4xnSDxMaL"},  # Sarah
            "text": "If axions are detected, it would not only solve the dark matter mystery but also address the strong CP problem in quantum chromodynamics—explaining why the strong nuclear force appears to preserve CP symmetry when the Standard Model suggests it shouldn't."
        },
        {
            "speaker": {"name": "Alex", "voice_id": "CwhRBWXzGAHq8TQ4Fs17"},  # Roger
            "text": "Beyond axions, could this quantum sensing technology have other applications?"
        },
        {
            "speaker": {"name": "Sophia", "voice_id": "EXAVITQu4vr4xnSDxMaL"},  # Sarah
            "text": "Absolutely. The extreme sensitivity to magnetic fields could enable new forms of medical imaging, particularly for brain activity, with much higher spatial and temporal resolution than current techniques like MEG (magnetoencephalography)."
        },
        {
            "speaker": {"name": "Sophia", "voice_id": "EXAVITQu4vr4xnSDxMaL"},  # Sarah
            "text": "In geophysics, these sensors could detect subtle changes in the Earth's magnetic field that might precede earthquakes or reveal underground structures. For navigation, they could provide precise positioning in environments where GPS doesn't work, such as underwater or in space."
        },
        {
            "speaker": {"name": "Sophia", "voice_id": "EXAVITQu4vr4xnSDxMaL"},  # Sarah
            "text": "There are also potential applications in fundamental physics beyond dark matter, such as searching for exotic spin-dependent interactions or testing quantum gravity models at small scales."
        },
        {
            "speaker": {"name": "Alex", "voice_id": "CwhRBWXzGAHq8TQ4Fs17"},  # Roger
            "text": "Thank you, Sophia. And that brings us to the end of our first episode of Physics News."
        },
        {
            "speaker": {"name": "Alex", "voice_id": "CwhRBWXzGAHq8TQ4Fs17"},  # Roger
            "text": "We've covered some remarkable developments today: CERN's latest results challenging aspects of the Standard Model, the first direct observation of gravitational waves from a neutron star-black hole merger, a breakthrough in room-temperature superconductivity, and the development of a new quantum sensor for dark matter detection."
        },
        {
            "speaker": {"name": "Alex", "voice_id": "CwhRBWXzGAHq8TQ4Fs17"},  # Roger
            "text": "Next month, we'll be focusing on recent advances in quantum computing, including the latest developments in topological qubits, quantum error correction, and quantum algorithms for simulating complex physical systems."
        },
        {
            "speaker": {"name": "Alex", "voice_id": "CwhRBWXzGAHq8TQ4Fs17"},  # Roger
            "text": "We'll also be covering the upcoming International Conference on High Energy Physics, which begins on June 15th. This biennial gathering brings together particle physicists from around the world, and we'll bring you highlights from the plenary sessions and any major announcements."
        },
        {
            "speaker": {"name": "Alex", "voice_id": "CwhRBWXzGAHq8TQ4Fs17"},  # Roger
            "text": "Thank you for joining us for this premiere episode of Physics News. I'm Alex, and on behalf of our correspondents Sophia, James, Mei, and Nikolai, we look forward to bringing you the latest physics developments next month."
        },
        {
            "speaker": {"name": "Alex", "voice_id": "CwhRBWXzGAHq8TQ4Fs17"},  # Roger
            "text": "Until next time, keep exploring the fascinating world of physics."
        }
    ]
}

# Ensure the directory exists
json_dir = os.path.join("src", "data", "news_json_archive")
os.makedirs(json_dir, exist_ok=True)

# Write the podcast to a JSON file
json_file = os.path.join(json_dir, "physics_news_podcast_part2.json")
with open(json_file, 'w') as f:
    json.dump(podcast_part2, f, indent=2)

print(f"Created {json_file} with the second part of the Physics News podcast") 