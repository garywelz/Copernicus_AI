# Protein Folding: The Molecular Origami of Life
## Full Transcript

[MUSIC: Opening theme]

**Priya**: Welcome to BioFrontiers, the podcast where we explore the cutting-edge of biological science. I'm Dr. Priya Sharma, your host and molecular biologist at the Institute for Integrative Biology. Today, we're diving into the fascinating world of protein folding – a process fundamental to life that has challenged scientists for decades. Joining me are Dr. Mei Lin, a computational biologist specializing in protein structure prediction algorithms, and Dr. Carlos Vega, a biochemist whose lab studies protein misfolding diseases.

**Mei**: Thanks for having us, Priya. Protein folding is such a fascinating intersection of biology, chemistry, physics, and computer science.

**Carlos**: Absolutely. And understanding it has enormous implications for medicine and biotechnology. I'm excited to discuss this topic today.

**Priya**: Let's start with the basics. What exactly are proteins, and why is their folding so important?

**Carlos**: Proteins are large, complex molecules that are essential for virtually everything that happens in our bodies. They're made up of chains of smaller molecules called amino acids – typically hundreds or thousands of them linked together. There are 20 different amino acids that our bodies use as building blocks, and the specific sequence of these amino acids determines what protein is made.

You can think of proteins as the workhorses of cells. They serve as structural components, transport molecules, catalyze biochemical reactions as enzymes, defend against pathogens as antibodies, and perform countless other functions. Hemoglobin carries oxygen in your blood, collagen provides structure to your skin and bones, insulin regulates your blood sugar – all of these are proteins with specific jobs.

**Mei**: And what makes proteins so remarkable is that to perform these functions, they need to fold into specific three-dimensional shapes. When a protein is first synthesized in the cell, it's just a linear chain of amino acids – like a string of beads. But within milliseconds to seconds, this chain folds into a complex, precisely defined structure. This folding process is what we call "protein folding."

The shape of a protein is crucial because it determines its function – the old saying "structure equals function" is particularly true for proteins. A protein's shape determines what other molecules it can interact with and what chemical reactions it can participate in. If a protein doesn't fold correctly, it typically can't perform its job properly.

**Priya**: That's a great explanation. So the sequence of amino acids somehow contains all the information needed for the protein to fold into the right shape. How does this folding process actually work?

**Carlos**: That's the fascinating part. The folding is driven primarily by the chemical properties of the amino acids and their interactions with each other and with the surrounding environment, which is usually water in biological systems.

Some amino acids are hydrophobic – they repel water – while others are hydrophilic – they interact favorably with water. In an aqueous environment like a cell, the hydrophobic amino acids tend to cluster together in the interior of the protein to avoid contact with water, while the hydrophilic ones often remain on the surface where they can interact with water. This hydrophobic collapse is often one of the first steps in protein folding.

There are also various types of chemical bonds and interactions that form between different parts of the protein chain. Hydrogen bonds, ionic interactions, van der Waals forces, and disulfide bridges all help stabilize the folded structure. The sum of all these interactions guides the protein toward its most energetically favorable conformation.

**Mei**: What's remarkable is that this process happens spontaneously and usually very quickly. Cyrus Levinthal pointed out in the 1960s that if a protein were to randomly sample all possible conformations to find the correct one, it would take longer than the age of the universe to fold. Yet proteins fold in milliseconds to seconds. This became known as Levinthal's paradox.

The resolution to this paradox is that protein folding isn't a random search but a directed process following an energy landscape – often visualized as a funnel – that guides the protein toward its native structure. The protein doesn't try every possible configuration; it follows pathways that progressively lower its energy until it reaches the most stable state.

**Priya**: That's fascinating. So if protein folding is so crucial, what happens when it goes wrong?

**Carlos**: When proteins misfold, it can lead to serious diseases. In my lab, we study several conditions caused by protein misfolding. Alzheimer's disease, Parkinson's disease, and Huntington's disease all involve misfolded proteins that aggregate and form toxic deposits in the brain.

Similarly, prion diseases like Creutzfeldt-Jakob disease and bovine spongiform encephalopathy (or mad cow disease) occur when a normally folded protein called PrP adopts an abnormal conformation that can then trigger the same misfolding in other PrP molecules, creating a cascade effect.

Type 2 diabetes involves the aggregation of a misfolded protein called amylin in the pancreas. Cystic fibrosis is caused by a misfolded protein that can't perform its normal function of transporting chloride ions across cell membranes.

**Mei**: And it's not just these well-known diseases. We're increasingly recognizing that protein misfolding plays a role in many other conditions, from certain types of cancer to various forms of heart disease. Understanding protein folding and misfolding is therefore crucial for developing treatments for these conditions.

**Priya**: Given its importance, how do scientists study protein folding? What techniques do we use to understand this process?

**Mei**: We use a combination of experimental and computational approaches. On the experimental side, techniques like X-ray crystallography, nuclear magnetic resonance (NMR) spectroscopy, and more recently, cryo-electron microscopy allow us to determine the three-dimensional structures of folded proteins with atomic-level precision.

Other experimental methods like circular dichroism, fluorescence spectroscopy, and hydrogen-deuterium exchange can provide information about the folding process itself – the intermediate states and the kinetics of folding.

On the computational side, which is my area, we use molecular dynamics simulations to model how proteins fold over time. These simulations apply the laws of physics to predict how each atom in the protein will move and interact with other atoms. We also develop algorithms that can predict a protein's final folded structure based solely on its amino acid sequence.

**Carlos**: In my lab, we combine these approaches with cellular and animal models of misfolding diseases. We can introduce specific mutations that cause proteins to misfold and then study the consequences at the cellular and organismal level. We also test potential therapeutic strategies that might prevent misfolding or help cells clear misfolded proteins.

It's worth noting that studying protein folding is challenging because it happens so quickly and involves such complex interactions. Many of the intermediate states during folding are transient and difficult to capture. That's why combining multiple techniques gives us the most complete picture.

[MUSIC: Transition]

**Priya**: Let's talk about some of the major breakthroughs in protein folding research. Mei, you mentioned computational approaches – there's been some exciting progress in that area recently, hasn't there?

**Mei**: Absolutely. One of the most significant recent breakthroughs has been the development of AI systems that can predict protein structures with remarkable accuracy. The most famous example is AlphaFold 2, developed by DeepMind, which achieved unprecedented accuracy in the CASP14 protein structure prediction competition in 2020.

AlphaFold 2 uses deep learning – specifically, a type of neural network architecture that's been trained on the thousands of protein structures that have been experimentally determined over the years. It learns patterns and relationships between amino acid sequences and their corresponding structures, allowing it to predict how new proteins will fold.

What's remarkable is that AlphaFold 2 can predict structures that are comparable in accuracy to those determined by experimental methods like X-ray crystallography. This is a game-changer because experimental structure determination is time-consuming and doesn't work for all proteins. With computational prediction, we can potentially determine the structures of all proteins in the human body and in other organisms.

**Carlos**: And the implications of this are enormous. For drug discovery, knowing a protein's structure helps us design molecules that can bind to specific sites on the protein – either to enhance its function or to inhibit it if it's involved in disease. For understanding disease mechanisms, we can see how disease-causing mutations might alter a protein's structure and function. And for basic biology, having structural information for all proteins will help us understand cellular processes at an unprecedented level of detail.

**Mei**: Exactly. And it's not just AlphaFold. Other groups have developed powerful prediction tools as well, like RoseTTAFold from the Baker lab at the University of Washington. There's been a real revolution in this field in the past few years.

**Priya**: That's incredible progress. Beyond structure prediction, what other advances have been significant in protein folding research?

**Carlos**: One area that's seen tremendous progress is our understanding of how cells handle protein folding. Proteins don't fold in isolation – cells have elaborate machinery to assist in this process and to deal with proteins that misfold.

Molecular chaperones, for instance, are proteins that help other proteins fold correctly. The discovery and characterization of chaperones like the Hsp70 family and the GroEL/GroES complex have revealed how cells actively manage protein folding rather than leaving it entirely to spontaneous processes.

Cells also have quality control systems that can detect and either refold or degrade misfolded proteins. The ubiquitin-proteasome system and autophagy are two major pathways for clearing misfolded proteins. Understanding these systems has opened up new therapeutic possibilities for diseases involving protein misfolding.

**Mei**: Another exciting area has been the engineering of proteins with new functions. Now that we better understand the principles of protein folding, scientists can design proteins from scratch that fold into specific structures and perform specific functions – even functions that don't exist in nature.

David Baker's lab at the University of Washington has been pioneering in this area. They've designed proteins that can catalyze chemical reactions, bind to specific targets, serve as vaccines, and even form complex nanoscale structures. This field of de novo protein design has enormous potential for creating new medicines, materials, and biotechnological tools.

**Priya**: Those are fascinating developments. Let's talk a bit more about the medical implications. Carlos, you mentioned several diseases caused by protein misfolding. How is our growing understanding of protein folding influencing approaches to treating these conditions?

**Carlos**: It's opening up several promising therapeutic strategies. One approach is to develop small molecules that can bind to proteins and stabilize their correct folded state, preventing misfolding. This strategy has shown promise for conditions like transthyretin amyloidosis, where the drug tafamidis works by stabilizing the normal tetrameric form of the transthyretin protein.

Another approach is to enhance the cell's own quality control systems – boosting chaperone function or increasing the clearance of misfolded proteins through the ubiquitin-proteasome system or autophagy. Several drugs in development for neurodegenerative diseases aim to work this way.

For some conditions, it might be possible to use gene therapy to correct mutations that cause proteins to misfold, or to use RNA-based therapies to reduce the production of proteins prone to misfolding.

And with the advances in computational structure prediction that Mei mentioned, we can now better understand how specific mutations affect protein structure, which helps in designing targeted therapies. We can also use computational methods to screen for drugs that might prevent misfolding or promote proper folding.

**Mei**: I'd add that the computational advances are particularly valuable for rare diseases caused by protein misfolding. Previously, it might not have been economically viable to develop drugs for very rare conditions. But with computational tools that can rapidly predict how different molecules might interact with a misfolded protein, the drug discovery process becomes more efficient and potentially more affordable, even for rare conditions.

[MUSIC: Contemplative interlude]

**Priya**: Looking to the future, what are the big questions or challenges that remain in protein folding research?

**Mei**: Despite the remarkable progress with tools like AlphaFold, there are still significant challenges. One is predicting the structures of proteins that don't have a single stable structure – what we call intrinsically disordered proteins. Many important proteins in our cells are partially or completely disordered, meaning they don't fold into a fixed structure but remain flexible and can adopt different conformations depending on their environment or binding partners.

Another challenge is predicting how proteins interact with each other to form complexes. AlphaFold 2 has been extended to predict some protein-protein interactions, but accurately modeling the full range of protein complexes in a cell remains difficult.

We also need to better understand the dynamics of proteins – how they move and change shape to perform their functions. A static structure is just a snapshot, but proteins are constantly in motion, and these movements are often essential to their function.

**Carlos**: From a biomedical perspective, a major challenge is translating our understanding of protein folding into effective therapies for misfolding diseases. While we've made progress, conditions like Alzheimer's and Parkinson's remain extremely difficult to treat.

Part of the challenge is that by the time these diseases are diagnosed, significant damage has often already occurred. We need better ways to detect and intervene in protein misfolding processes at much earlier stages.

Another challenge is delivery – getting therapeutic agents to the right tissues and cells where misfolding is occurring. This is particularly difficult for brain disorders due to the blood-brain barrier.

**Priya**: Those are significant challenges. What new technologies or approaches might help address them?

**Mei**: I think the continued advancement of AI and computational methods will be crucial. As we gather more experimental data and develop more sophisticated algorithms, our ability to model protein dynamics, disorder, and interactions will improve.

Quantum computing could potentially revolutionize protein folding simulations. Classical computers struggle with the computational complexity of simulating all the atoms in a protein and their interactions, but quantum computers might eventually be able to handle these calculations much more efficiently.

Single-molecule techniques that allow us to observe individual proteins as they fold in real-time are also providing new insights that couldn't be obtained from bulk measurements. As these techniques become more powerful, they'll help validate and refine our computational models.

**Carlos**: In the medical realm, I'm excited about the potential of combining advanced imaging techniques with biomarkers to detect protein misfolding in living patients at early stages. This could enable intervention before significant symptoms develop.

I also think personalized medicine approaches will be increasingly important. As we understand how specific genetic variations affect protein folding, we can tailor treatments to an individual's particular protein misfolding risk factors.

And the convergence of multiple technologies – gene editing, drug delivery nanotechnology, AI-driven drug design – could create new possibilities for treating protein misfolding diseases that we can't even imagine today.

**Priya**: As we wrap up, what would each of you say is the most exciting aspect of protein folding research today?

**Mei**: For me, it's the convergence of AI, big data, and biological understanding that's happening right now. We're at a point where we have enough experimental data to train powerful AI systems, and enough computational power to run sophisticated algorithms. This is enabling predictions and insights that weren't possible before. I believe we're entering a new era where computational approaches will accelerate biological discovery in ways we've never seen before.

**Carlos**: What excites me most is how our fundamental understanding of protein folding is being translated into practical applications that can improve human health. From new diagnostic tools to innovative therapies, the impact on medicine is just beginning to be felt. I'm particularly hopeful about what this means for currently untreatable conditions caused by protein misfolding. The basic science breakthroughs of recent decades are now bearing fruit in ways that could transform patients' lives.

**Priya**: Thank you both for this fascinating discussion. We've covered the fundamentals of protein folding, recent breakthroughs in prediction and understanding, medical implications, and future challenges and opportunities. What's clear is that protein folding research sits at an exciting intersection of basic science and practical applications, with implications ranging from evolutionary biology to medicine to biotechnology.

To our listeners, I hope this conversation has given you a glimpse into why protein folding – this molecular origami happening in your cells right now – is such a fascinating and important area of modern science. Understanding how proteins fold is not just an intellectual puzzle; it's key to understanding life itself and to developing new solutions for some of our most challenging diseases.

[MUSIC: Closing theme]

Join us next time on BioFrontiers as we continue to explore the cutting-edge of biological science. Until then, I'm Dr. Priya Sharma, thanking you for listening. 