import { PodcastScript } from '../types/podcast.js';

export const scientificPodcastTemplate: PodcastScript = {
  title: 'Scientific Discovery Podcast',
  introduction: 'Welcome to the Scientific Discovery Podcast, where we explore groundbreaking research and innovations.',
  segments: [
    {
      title: 'Overview',
      content: 'Today we\'ll be discussing a fascinating new study...',
      speaker: 'en_US-male-medium',
      pauseAfter: true
    },
    {
      title: 'Technical Analysis',
      content: 'The methodology used in this research...',
      speaker: 'en_US-female-medium',
      pauseAfter: true
    },
    {
      title: 'Implications',
      content: 'The implications of this research are far-reaching...',
      speaker: 'en_US-male-light'
    }
  ],
  conclusion: 'Thank you for joining us in exploring this fascinating research.',
  targetDuration: 15,
  complexity: 'intermediate'
};

export const technicalPodcastTemplate: PodcastScript = {
  title: 'Technical Deep Dive',
  introduction: 'Welcome to Technical Deep Dive, where we explore complex topics in detail.',
  segments: [
    {
      title: 'Background',
      content: 'Let\'s start with some essential background information...',
      speaker: 'en_US-male-medium',
      pauseAfter: true
    },
    {
      title: 'Core Concepts',
      content: 'The key concepts we need to understand are...',
      speaker: 'en_US-female-medium',
      pauseAfter: true
    },
    {
      title: 'Advanced Topics',
      content: 'Now let\'s dive into the more advanced aspects...',
      speaker: 'en_US-male-light'
    }
  ],
  conclusion: 'Thanks for joining us for this technical exploration.',
  targetDuration: 20,
  complexity: 'advanced'
};

export const shortSamplePodcastTemplate = {
  title: "The Hidden Mathematics of Black Holes",
  backgroundMusic: "science-contemplative",
  segments: [
    {
      speaker: "en_US-male-medium",
      text: "Welcome to Copernicus AI. I'm Antoni Kowalski, and today we're diving into one of the most fascinating mathematical puzzles in the universe: the geometry of black holes.",
      isMainBreak: true,
      isIntro: true
    },
    {
      speaker: "en_US-female-medium",
      text: "A black hole represents a point in space where gravity is so strong that nothing, not even light, can escape. But what's truly remarkable is how mathematics predicted their existence long before we had any observational evidence."
    },
    {
      speaker: "en_US-male-medium",
      text: "The story begins with Einstein's field equations of general relativity. These elegant mathematical formulas describe how space and time curve in response to matter and energy. In 1915, just months after Einstein published his theory, Karl Schwarzschild found a solution that described what we now call a black hole."
    },
    {
      speaker: "en_US-male-light",
      text: "The mathematics revealed something extraordinary: a spherical boundary in space-time called the event horizon. Cross this boundary, and the laws of physics as we know them begin to break down."
    },
    {
      speaker: "en_US-male-medium",
      text: "Let's explore how these mathematical concepts translate to physical reality. The event horizon's radius, known as the Schwarzschild radius, is given by a deceptively simple formula: R = 2GM/c². Here, G is Newton's gravitational constant, M is the mass of the black hole, and c is the speed of light."
    },
    {
      speaker: "en_US-female-medium",
      text: "To put this in perspective, if Earth were somehow compressed to become a black hole, its Schwarzschild radius would be just 9 millimeters. For our Sun, it would be about 3 kilometers. But supermassive black holes at the centers of galaxies can have event horizons larger than our entire solar system."
    },
    {
      speaker: "en_US-male-medium",
      text: "But the real mathematical beauty emerges when we consider what happens near the event horizon. Time itself begins to warp, leading to what we call gravitational time dilation. This effect was actually first predicted by Einstein's equations before we had any way to measure it."
    },
    {
      speaker: "en_US-male-light",
      text: "From the perspective of an outside observer, time appears to slow down for anything approaching the event horizon. Mathematically, this is described by the Schwarzschild metric, which shows that time intervals stretch to infinity at the horizon itself."
    },
    {
      speaker: "en_US-male-medium",
      text: "Perhaps most intriguing is what mathematics tells us about the center of a black hole - the singularity. Here, our current mathematical models predict that space-time curvature becomes infinite, suggesting a point where our understanding of physics breaks down completely."
    },
    {
      speaker: "en_US-female-medium",
      text: "Recent mathematical work in quantum gravity and string theory has begun to suggest ways we might resolve this singularity paradox. These approaches hint at exotic new physics that could prevent the formation of true mathematical infinities."
    },
    {
      speaker: "en_US-male-medium",
      text: "As we conclude our exploration today, we're reminded that mathematics isn't just a tool for describing the universe - it's a flashlight that illuminates the darkest corners of reality, even those parts that seem to swallow light itself."
    },
    {
      speaker: "en_US-male-medium",
      text: "But before we delve deeper, let's understand why this mathematical framework is so crucial to our understanding of the universe.",
      isMainBreak: true
    },
    {
      speaker: "en_US-male-medium",
      text: "This is Antoni Kowalski for Copernicus AI. Until next time, keep questioning, keep exploring.",
      isOutro: true
    }
  ]
}; 