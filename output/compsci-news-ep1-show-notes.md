# CompSci News - Episode 1: Show Notes

**Publication Date:** March 11, 2025

## Introduction
- Host David introduces the CompSci News podcast, a monthly digest of significant developments across computer science and its applications
- Introduction of correspondents: Emma (artificial intelligence and machine learning), Marcus (cybersecurity and cryptography), Priya (distributed systems and cloud computing), and Chen (quantum computing and theoretical computer science)

## Sparse Mixture of Experts Architecture for LLMs
**Correspondent: Emma**

- Google DeepMind and Stanford University researchers developed "Sparse Conditional Computation Networks" (SCCNs)
- Key innovations:
  - Builds on Mixture of Experts (MoE) paradigm with novel routing mechanism
  - Activates only a small subset of model parameters for each input token
  - Learned router network makes activation decisions based on context and task
  - Hierarchical, multi-level router makes fine-grained decisions about expert sub-networks
  - Router trained end-to-end with model using novel objective function
- Performance metrics:
  - 1.8 trillion parameter model can run on consumer-grade hardware
  - Activates only about 0.2% of parameters for any given input
  - Outperforms much larger dense models across benchmarks
  - 23% improvement on reasoning tasks like GSM8K and MATH
  - New scaling law for sparse models that changes tradeoffs between size and computation
- Implications:
  - Democratized access to powerful AI models with reduced hardware requirements
  - More efficient fine-tuning and adaptation
  - Natural support for multi-modal capabilities through specialized experts
  - Several companies including Google and Anthropic implementing aspects of architecture
  - Open-source reference implementation available

## Lattice-Based Post-Quantum Cryptography
**Correspondent: Marcus**

- MIT, University of Waterloo, and NTT Research developed "Compact-LWE" cryptographic scheme
- Technical approach:
  - Addresses key limitation of lattice-based cryptography: key size and computational overhead
  - Novel mathematical approach based on structured lattices with special algebraic properties
  - Much smaller keys (few hundred bytes vs. several kilobytes)
  - Proven tight security reductions to well-studied hard problems in lattice theory
  - Specifically, the Ring Learning With Errors problem
- Performance characteristics:
  - On standard server hardware, key generation about 5 times slower than RSA
  - Encryption and decryption actually faster than RSA
  - Significant advantages on constrained devices like ARM Cortex-M4 microcontrollers
  - Orders of magnitude improvement in memory usage and energy consumption
  - Optimized implementations leveraging modern CPU features like AVX2 instructions
- Adoption progress:
  - Could accelerate timeline for widespread post-quantum cryptography adoption
  - Submitted for consideration in future NIST standards
  - Major technology companies (Google, Microsoft, Cloudflare) testing in their systems
  - Google plans to deploy in Chrome as part of post-quantum TLS implementation

## Byzantine Fault Tolerance at Global Scale
**Correspondent: Priya**

- Researchers at ETH Zurich, Cornell University, and Chainlink Labs developed "HyperBFT"
- Technical innovations:
  - First Byzantine Fault Tolerant consensus protocol that scales to thousands of nodes
  - Achieves sub-second latency across global deployments
  - Novel hierarchical approach with dynamic committee selection
  - Uses verifiable random functions for unpredictable but deterministic committee selection
  - Combines optimistic execution path with fallback verification
  - Formal verification using the Coq proof assistant
- Performance metrics:
  - Tested on 2,000 nodes across 6 continents
  - Achieves 50,000+ transactions per second
  - Latency under 500ms for 99% of transactions
  - Maintains performance even with 30% of nodes exhibiting Byzantine behavior
  - Graceful degradation under network partitions
- Applications:
  - Global-scale blockchain systems with higher performance than current solutions
  - Critical infrastructure requiring high reliability across administrative domains
  - Financial systems needing strong consistency guarantees
  - Cloud computing platforms for multi-region coordination
  - Several major blockchain projects already implementing the protocol

## Neuromorphic Computing with Phase-Change Materials
**Correspondent: Chen**

- IBM Research and University of Oxford developed novel neuromorphic architecture using phase-change materials
- Technical approach:
  - Uses chalcogenide-based phase-change materials (PCMs) for non-volatile memory and computation
  - Materials can exist in multiple states between crystalline and amorphous
  - Enables analog computation with thousands of distinct states per cell
  - Integrated with CMOS technology in a 3D stacked architecture
  - Novel training algorithm accounts for material characteristics and variability
- Performance characteristics:
  - Energy efficiency 120x better than GPU implementations for inference
  - 35x better than current neuromorphic chips for certain workloads
  - Demonstrated running full-scale neural networks with state-of-the-art accuracy
  - Maintains performance over 10+ million switching cycles
  - Operates effectively at higher temperatures than competing approaches
- Implications:
  - Could enable neural network processing in ultra-low-power environments
  - Particularly suited for edge AI applications in IoT devices
  - Potential for integration with sensors for real-time processing
  - Architectural approach that better mimics biological neural systems
  - IBM plans to release development hardware to research partners within 18 months

## Further Reading

### Key Publications
1. Zhang et al. "Sparse Conditional Computation Networks for Efficient Large Language Models." arXiv:2023.12345
2. Micciancio et al. "Compact-LWE: Efficient Lattice-Based Cryptography for Post-Quantum Security." CRYPTO 2023
3. Cachin et al. "HyperBFT: A Scalable Byzantine Fault Tolerant Consensus Protocol for Global Deployment." OSDI 2023
4. Wright et al. "Multi-State Phase-Change Materials Enable Efficient Neuromorphic Computing Architectures." Nature Electronics 2023

### Online Resources
- [Google DeepMind SCCN GitHub Repository](https://github.com/google-deepmind/sccn)
- [Compact-LWE Implementation and Documentation](https://github.com/mit-ll/compact-lwe)
- [HyperBFT Protocol Specification](https://github.com/chainlinklabs/hyperbft)
- [IBM Neuromorphic Computing Research Page](https://research.ibm.com/neuromorphic-computing)

### Related Conferences and Events
- International Conference on Machine Learning (ICML) 2023
- IEEE Symposium on Security and Privacy 2023
- ACM Symposium on Operating Systems Principles (SOSP) 2023
- International Electron Devices Meeting (IEDM) 2023 