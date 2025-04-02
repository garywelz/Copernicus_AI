# Math News - Episode 1: Transcript

**Publication Date:** March 28, 2025

**Introduction**

**Elena:** Welcome to the premiere episode of Math News, your monthly digest of significant developments across pure and applied mathematics. It's Friday, March 28, 2025, 11:11 AM Eastern Standard Time, and I'm Elena, your host. Today we're bringing you a program designed specifically for mathematics professionals, researchers, and educators. Each month, we'll deliver concise, rigorous coverage of breakthrough theorems, novel proof techniques, and computational advances that matter to your research and teaching.

Before we dive in, let me introduce our team of correspondents. Marcus specializes in topology and geometric structures. Priya focuses on applied mathematics and its intersections with other disciplines. Wei covers computational mathematics and algorithmic developments. And Daria brings expertise in mathematical physics and the interplay between mathematics and theoretical physics.

Today's episode features several groundbreaking developments: Microsoft's recent announcement of topological qubits based on a new state of matter, the discovery of the largest known prime number with over 41 million digits, a revolutionary new formula for calculating Pi derived from string theory, and Oxford University's demonstration of distributed quantum computing with significant mathematical implications.

Let's begin with one of the most exciting developments at the intersection of physics and mathematics. Daria, tell us about Microsoft's topological qubit breakthrough.

**Topological Qubits and a New State of Matter**

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

**The Largest Known Prime Number**

**Elena:** After a six-year drought in the discovery of record-breaking prime numbers, mathematicians participating in the Great Internet Mersenne Prime Search, or GIMPS, have discovered a new largest known prime number with an astonishing 41,024,320 digits.

This prime number can be written as two to the power 136,274,885 minus 1, making it what's known as a Mersenne prime—a prime number that can be expressed as 2 raised to a power, minus 1. It's the 52nd known Mersenne prime and the first discovered since December 2018.

**Wei:** That's an incredible number of digits. How was this discovery made?

**Elena:** The discovery involved a distributed computing effort where volunteers around the world contributed their computers' processing power. The GIMPS software ran the Lucas-Lehmer primality test, which is specifically designed for testing whether Mersenne numbers are prime.

What's mathematically interesting is that the Lucas-Lehmer test is deterministic—it always gives the correct answer—unlike some probabilistic primality tests. The test involves creating a sequence of numbers and checking if a specific term in the sequence is divisible by the Mersenne number being tested.

**Wei:** What's the significance of finding such large prime numbers?

**Elena:** While there's certainly an element of mathematical sport to finding record-breaking primes, these discoveries have deeper significance. They help us understand the distribution of primes, which remains one of the most fundamental questions in number theory.

Large prime searches also drive advances in computational number theory and distributed computing techniques. The algorithms developed for these searches often find applications in other areas of mathematics and computer science.

From a practical perspective, large primes are crucial for cryptographic systems, though primes of this size are far larger than what's typically used in current cryptography.

**Wei:** Thank you, Elena. Now let's move to another fascinating discovery that connects string theory with one of mathematics' most famous constants. I'll be discussing a new formula for calculating Pi.

**A New Formula for Pi from String Theory**

**Wei:** In January 2024, physicists Arnab Priya Saha and Aninda Sinha from the Indian Institute of Science published a paper in Physical Review Letters presenting a completely new formula for calculating Pi. What makes this discovery particularly interesting is that they weren't looking for a new way to calculate Pi—they were working on string theory.

String theory attempts to unify the fundamental forces of nature by proposing that the basic building blocks of the universe are tiny vibrating strings rather than point-like particles. While developing equations to describe how these strings interact, Saha and Sinha discovered that their formulas could be used to express Pi in a novel way.

**Elena:** How does this new formula compare to traditional methods for calculating Pi?

**Wei:** The new formula is remarkably efficient. Traditional series for calculating Pi, like the one discovered by the Indian mathematician Madhava in the 15th century, converge very slowly. Madhava's series requires about 5 billion terms to calculate Pi to just 10 decimal places.

In contrast, the new formula derived from string theory converges exponentially faster. It can achieve 10 decimal places of accuracy with just 20 terms, and 100 decimal places with about 150 terms. This represents a dramatic improvement in computational efficiency.

The formula itself is quite elegant, involving what mathematicians call "multiple zeta values," which are generalizations of the Riemann zeta function. These values appear naturally in the study of string theory amplitudes—essentially, the probabilities of different ways strings can interact.

**Elena:** Does this discovery have implications beyond calculating Pi more efficiently?

**Wei:** Yes, that's one of the most intriguing aspects. The same approach that led to the new Pi formula also yielded a new representation of the Riemann zeta function, which is central to one of the most famous unsolved problems in mathematics—the Riemann hypothesis.

While this doesn't directly solve the Riemann hypothesis, it provides a new perspective that might contribute to our understanding of this problem. It's a beautiful example of how research in theoretical physics can lead to unexpected advances in pure mathematics.

Moreover, the techniques developed in this work might be applicable to other mathematical constants and special functions. The connection between string theory and these fundamental mathematical objects suggests there may be deeper relationships waiting to be discovered.

**Elena:** Thank you, Wei. Now let's turn to Marcus, who will discuss a recent breakthrough in distributed quantum computing with significant mathematical implications.

**Distributed Quantum Computing and Mathematical Implications**

**Marcus:** Thanks, Elena. In February 2025, researchers at Oxford University demonstrated the first successful implementation of a distributed quantum computing protocol that allows quantum computers in different locations to work together on a single problem.

This breakthrough has profound implications for mathematics, particularly in computational complexity theory and cryptography. The Oxford team used a protocol based on quantum teleportation to enable secure communication between quantum processors located 50 kilometers apart.

**Elena:** How does this differ from traditional quantum computing approaches?

**Marcus:** Traditional quantum computing focuses on building increasingly powerful single quantum processors. The distributed approach instead connects multiple smaller quantum computers into a network, similar to how classical supercomputers use parallel processing.

What makes this mathematically interesting is that it introduces a new computational model that combines aspects of quantum computing with distributed systems theory. This hybrid model has unique properties that could potentially solve certain problems more efficiently than either classical distributed computing or standalone quantum computing.

The mathematical framework for this involves tensor networks, which are mathematical structures used to represent quantum many-body systems. The Oxford team developed new algorithms for optimizing these tensor networks across distributed quantum processors.

**Elena:** What kinds of mathematical problems could benefit from this approach?

**Marcus:** Several areas of computational mathematics could see significant advances. One is large-scale optimization problems, which are ubiquitous in operations research, machine learning, and financial modeling. The distributed quantum approach seems particularly well-suited to problems with a hierarchical or modular structure.

Another area is simulation of complex quantum systems, which is relevant to materials science and quantum chemistry. The distributed approach allows for simulating larger systems than would be possible on a single quantum processor.

Perhaps most intriguingly, this work has implications for post-quantum cryptography. The researchers demonstrated a distributed implementation of Shor's algorithm, which can factor large numbers exponentially faster than the best known classical algorithms. This reinforces the need for cryptographic systems that are resistant to quantum attacks.

**Elena:** Thank you, Marcus. Finally, let's turn to Priya for a review of an important new book in mathematical physics.

**Book Review: "Topological Quantum Computing: Mathematical Foundations"**

**Priya:** Thank you, Elena. This month, I'd like to highlight a significant new book: "Topological Quantum Computing: Mathematical Foundations" by John Preskill, published by Cambridge University Press in January 2025.

Preskill, a theoretical physicist at Caltech and one of the pioneers of quantum information science, has written what will likely become the definitive text on the mathematical foundations of topological quantum computing.

The book provides a comprehensive treatment of the mathematical structures underlying topological quantum computation, including modular tensor categories, braid group representations, and topological quantum field theories. What makes this book particularly valuable is how it bridges the gap between abstract mathematical concepts and their physical implementations.

For mathematicians, the book offers a clear exposition of how concepts from topology and category theory find applications in quantum information science. For physicists, it provides the rigorous mathematical foundation needed to understand and develop topological quantum systems.

I'd highly recommend this book to any mathematician interested in quantum computing, whether they're looking to enter the field or simply want to understand one of the most exciting intersections of mathematics and physics today.

**Elena:** Thank you, Priya. And that brings us to the end of our first episode of Math News.

**Closing**

**Elena:** We've covered some remarkable developments today: Microsoft's announcement of topological qubits based on a new state of matter, the discovery of the largest known prime number with over 41 million digits, a revolutionary new formula for calculating Pi derived from string theory, and Oxford University's demonstration of distributed quantum computing.

Next month, we'll be focusing on recent advances in algebraic geometry, including developments in the minimal model program and applications to mirror symmetry.

We'll also be covering the upcoming International Congress of Mathematicians, which begins on July 7th. This quadrennial gathering is the largest and most prestigious conference in mathematics, and we'll bring you highlights from the plenary lectures and the announcement of the 2026 Fields Medals.

Thank you for joining us for this premiere episode of Math News. I'm Elena, and on behalf of our correspondents Marcus, Priya, Wei, and Daria, we look forward to bringing you the latest mathematical developments next month.

Until next time, keep exploring the beautiful world of mathematics. 