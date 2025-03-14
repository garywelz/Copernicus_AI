# Math News - Episode 1: Transcript

**Publication Date:** March 28, 2025

## Introduction

**Elena:** Welcome to the premiere episode of Math News, your monthly digest of significant developments across pure and applied mathematics. It's Friday, March 28, 2025, 11:11 AM Eastern Standard Time, and I'm Elena, your host. Today we're bringing you a program designed specifically for mathematics professionals, researchers, and educators. Each month, we'll deliver concise, rigorous coverage of breakthrough theorems, novel proof techniques, and computational advances that matter to your research and teaching.

Before we dive in, let me introduce our team of correspondents. Marcus specializes in topology and geometric structures. Priya focuses on applied mathematics and its intersections with other disciplines. Wei covers computational mathematics and algorithmic developments. And Daria brings expertise in mathematical physics and the interplay between mathematics and theoretical physics.

Today's episode features several groundbreaking developments: Microsoft's recent announcement of topological qubits based on a new state of matter, the discovery of the largest known prime number with over 41 million digits, a revolutionary new formula for calculating pi derived from string theory, and Oxford University's demonstration of distributed quantum computing with significant mathematical implications.

Let's begin with one of the most exciting developments at the intersection of physics and mathematics. Daria, tell us about Microsoft's topological qubit breakthrough.

## Topological Qubits and a New State of Matter

**Daria:** Thanks, Elena. On February 19th, Microsoft made a remarkable announcement claiming they've created what they call "topological qubits" based on a new state of matter. This is potentially a major breakthrough in quantum computing with significant mathematical implications.

Traditional quantum computing approaches face a fundamental challenge: qubits are extremely sensitive to environmental noise, which causes errors in calculations. Microsoft's approach uses topology—a branch of mathematics that studies properties preserved under continuous deformations—to create more stable qubits.

**Elena:** Could you explain the mathematical foundations of this approach?

**Daria:** Certainly. The key mathematical concept here is topological protection. In topology, certain properties remain invariant under continuous transformations. Microsoft's approach leverages this by encoding quantum information in topological states of matter, specifically what are called Majorana quasiparticles.

These quasiparticles exist at the ends of superconducting nanowires. The quantum information is stored non-locally, spread across both ends of the wire. This non-locality is what provides protection against local noise—a disturbance at one point can't easily destroy the quantum information.

The mathematics behind this involves concepts from algebraic topology, particularly the theory of anyons, which are quasiparticles that can exist in two-dimensional systems. The braiding operations of these anyons form a representation of the braid group, which has deep connections to knot theory.

**Elena:** What are the implications for computational complexity theory?

**Daria:** That's where things get really interesting. If Microsoft's claims hold up—and I should note that some physicists remain skeptical—this could dramatically change our understanding of what's computationally feasible.

Certain problems that are intractable on classical computers might become solvable with topological quantum computers. This includes simulating quantum systems, which has applications in materials science and drug discovery, as well as certain optimization problems.

From a complexity theory perspective, topological quantum computing could potentially solve problems in the complexity class BQP (Bounded-error Quantum Polynomial time) more reliably than other quantum computing approaches. The error correction advantages might even allow us to tackle problems at the boundary of BQP and more complex classes.

**Elena:** Thank you, Daria. Now let's turn to a significant development in number theory. I'll be discussing the recent discovery of the largest known prime number.

## The Largest Known Prime Number

**Elena:** After a six-year drought in the discovery of record-breaking prime numbers, mathematicians participating in the Great Internet Mersenne Prime Search, or GIMPS, have discovered a new largest known prime number with an astonishing 41,024,320 digits.

This prime number can be written as 2^136,274,885 minus 1, making it what's known as a Mersenne prime—a prime number that can be expressed as 2 raised to a power, minus 1. It's the 52nd known Mersenne prime and the first discovered since December 2018.

**Wei:** That's an incredible number of digits. How was this discovery made?

**Elena:** The discovery involved a distributed computing effort where volunteers around the world contributed their computers' processing power. The GIMPS software ran the Lucas-Lehmer primality test, which is specifically designed for testing whether Mersenne numbers are prime.

What's mathematically interesting is that the Lucas-Lehmer test is deterministic—it always gives the correct answer—unlike some probabilistic primality tests. The test involves creating a sequence of numbers and checking if a specific term in the sequence is divisible by the Mersenne number being tested.

The computational resources required were substantial. The primary verification took 34 days of continuous computing on a high-performance system with specialized hardware.

**Wei:** And what are the implications for number theory?

**Elena:** While discovering record-breaking primes doesn't directly solve open problems in mathematics, it does provide valuable data points for conjectures about the distribution of Mersenne primes.

For instance, there's a conjecture that there are infinitely many Mersenne primes, but this remains unproven. Each new discovery provides evidence supporting this conjecture.

There are also interesting patterns in the exponents of Mersenne primes. The exponent 136,274,885 continues to support observations about the distribution of these exponents, which might eventually lead to deeper theoretical insights.

From a practical perspective, large primes are crucial for cryptographic systems, though primes of this size are far larger than what's typically used in current cryptography.

**Wei:** Thank you, Elena. Now let's move to another fascinating discovery that connects string theory with one of mathematics' most famous constants. I'll be discussing a new formula for calculating pi.

## A New Formula for Pi from String Theory

**Wei:** In January 2024, physicists Arnab Priya Saha and Aninda Sinha from the Indian Institute of Science published a paper in Physical Review Letters presenting a completely new formula for calculating pi. What makes this discovery particularly interesting is that they weren't looking for a new way to calculate pi—they were working on string theory.

String theory attempts to unify the fundamental forces of nature by proposing that the basic building blocks of the universe are tiny vibrating strings rather than point-like particles. While developing equations to describe how these strings interact, Saha and Sinha discovered that their formulas could be used to express pi in a novel way.

**Elena:** How does this new formula compare to traditional methods for calculating pi?

**Wei:** The new formula is remarkably efficient. Traditional series for calculating pi, like the one discovered by the Indian mathematician Madhava in the 15th century, converge very slowly. Madhava's series requires about 5 billion terms to calculate pi to just 10 decimal places.

In contrast, Saha and Sinha's formula with certain parameter values can achieve the same precision with just 30 terms. Their formula is actually a family of formulas, parameterized by a value they call lambda. Different values of lambda give different convergence rates, allowing mathematicians to choose the most efficient version for their needs.

**Elena:** And there's a connection to the Riemann zeta function as well, correct?

**Wei:** Yes, that's one of the most intriguing aspects. The same approach that led to the new pi formula also yielded a new representation of the Riemann zeta function, which is central to one of the most famous unsolved problems in mathematics—the Riemann hypothesis.

While this doesn't directly solve the Riemann hypothesis, new representations of the zeta function can provide fresh perspectives that might eventually contribute to progress on this problem.

What's particularly elegant about this discovery is how it emerged from physics. The formula arose from calculating scattering amplitudes of closed strings, showing once again how deeply interconnected mathematics and theoretical physics are.

**Elena:** Thank you, Wei. Now let's turn to Marcus for a discussion of recent advances in distributed quantum computing and their mathematical implications.

## Distributed Quantum Computing and Mathematical Implications

**Marcus:** Thanks, Elena. On February 5th, researchers at Oxford University Physics published a groundbreaking paper in Nature demonstrating the first instance of distributed quantum computing. They successfully linked two separate quantum processors to form a single, fully connected quantum computer using a photonic network interface.

What makes this particularly interesting from a mathematical perspective is how they achieved quantum teleportation of logical gates—the fundamental operations of quantum computing—across the network link.

**Elena:** Could you explain the mathematical framework behind this achievement?

**Marcus:** The key mathematical innovation involves extending quantum teleportation from state transfer to operation transfer. Traditional quantum teleportation, first proposed in 1993, allows the transfer of quantum states between distant systems using entanglement and classical communication.

What the Oxford team demonstrated is teleporting the actual quantum operations—the logical gates—rather than just the states. This requires a sophisticated mathematical framework combining elements of category theory, operator algebra, and quantum information theory.

The mathematical structure involves what's called a "categorical quantum circuit" model, where quantum operations are viewed as morphisms in a symmetric monoidal category. This abstract framework allows for a rigorous description of how quantum operations can be distributed across physically separated systems.

**Elena:** What are the potential applications in mathematics?

**Marcus:** There are several exciting implications. First, in algebraic topology, this work provides concrete physical realizations of certain topological quantum field theories, potentially offering new insights into invariants of manifolds.

Second, in quantum information theory, it establishes new bounds on the resources required for distributed quantum computing, answering open questions about the communication complexity of quantum protocols.

Perhaps most intriguingly, this work suggests a path toward a "quantum internet" where distributed quantum systems could collectively solve problems beyond the reach of any single quantum computer. This has implications for computational complexity theory, potentially expanding the class of problems that can be efficiently solved using quantum resources.

The mathematical framework developed for this distributed architecture might also find applications in other areas of mathematics, such as the study of operator algebras and non-local games.

**Elena:** Thank you, Marcus. Now let's turn to Priya for a review of a timely new book on topological quantum computing.

## Book Review: "Topological Quantum Computing: Mathematical Foundations"

**Priya:** Thanks, Elena. Given the recent breakthrough from Microsoft that Daria discussed earlier, it's fitting that John Preskill's new book, "Topological Quantum Computing: Mathematical Foundations," was published this year by Cambridge University Press.

Preskill, a theoretical physicist at Caltech and one of the pioneers of quantum information science, has written what will likely become the definitive text on the mathematical foundations of topological quantum computing.

The book begins with an accessible introduction to the basic concepts of topology and quantum computation before delving into the more advanced material. What makes this book special is how it bridges the gap between the abstract mathematical theory and the physical implementations.

**Elena:** How accessible is the book for mathematicians who aren't specialists in quantum information?

**Priya:** That's one of the book's strengths. Preskill has a gift for explaining complex ideas with clarity. While the book doesn't shy away from mathematical rigor, it provides intuitive explanations that make the concepts accessible to mathematicians from diverse backgrounds.

For topologists, there's a fascinating chapter on how concepts from knot theory and braid groups find applications in quantum computation. For algebraic geometers, the connections to modular functors and conformal field theory are particularly well explained.

For applied mathematicians, there's substantial material on error correction, fault tolerance, and the practical advantages of topological approaches to quantum computing. Preskill carefully explains how the topological protection of quantum information translates into concrete advantages for algorithm implementation.

I'd highly recommend this book to any mathematician interested in quantum computing, whether they're looking to enter the field or simply want to understand one of the most exciting intersections of mathematics and physics today.

**Elena:** Thank you, Priya. And that brings us to the end of our first episode of Math News.

## Closing

**Elena:** We've covered some remarkable developments today: Microsoft's announcement of topological qubits based on a new state of matter, the discovery of the largest known prime number with over 41 million digits, a revolutionary new formula for calculating pi derived from string theory, and Oxford University's demonstration of distributed quantum computing.

Next month, we'll be focusing on recent advances in algebraic geometry, including developments in the minimal model program and applications to mirror symmetry.

We'll also be covering the upcoming International Congress of Mathematicians, which begins on July 7th. This quadrennial gathering is the largest and most prestigious conference in mathematics, and we'll bring you highlights from the plenary lectures and the announcement of the 2026 Fields Medals.

Thank you for joining us for this premiere episode of Math News. I'm Elena, and on behalf of our correspondents Marcus, Priya, Wei, and Daria, we look forward to bringing you the latest mathematical developments next month.

For a complete list of references and further reading, please visit our website at mathnews.podcast.edu. You can also reach us by email at feedback@mathnews.podcast.edu or follow us on social media @MathNewsPod.

Until next time, keep exploring the beautiful world of mathematics.

[End of transcript] 