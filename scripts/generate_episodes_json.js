#!/usr/bin/env node

/**
 * This script generates an episodes.json file based on the content files in the output directory.
 * It scans for audio files, markdown files, and images, and creates a structured JSON file
 * that can be used by the Next.js application.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const OUTPUT_DIR = path.join(__dirname, 'output');
const CONTENT_BASE_URL = process.env.CONTENT_BASE_URL || 'https://your-storage-url.com';
const OUTPUT_JSON_FILE = path.join(__dirname, 'output', 'episodes.json');

// Subject mapping based on filename patterns
const SUBJECT_MAPPING = {
  'math': ['math-news', 'continuum-hypothesis', 'godels-incompleteness', 'independence-results-peano', 'poincare-conjecture', 'mathematical-logic-frontiers'],
  'physics': ['physics-news', 'black-holes', 'higgs-boson', 'string-theory', 'quantum-entanglement'],
  'biology': ['biology-news', 'organoids', 'spatial-biology', 'synthetic-biology'],
  'chemistry': ['chemistry-news', 'green-chemistry', 'crispr-chemistry', 'molecular-machines', 'catalysis-revolution', 'computational-chemistry'],
  'computer-science': ['compsci-news', 'edge-computing', 'neuromorphic-computing', 'quantum-machine-learning', 'quantum-cryptography', 'artificial-general-intelligence'],
  'science': ['science-news']
};

// Helper function to get the subject based on filename
function getSubject(filename) {
  for (const [subject, patterns] of Object.entries(SUBJECT_MAPPING)) {
    if (patterns.some(pattern => filename.includes(pattern))) {
      return subject;
    }
  }
  return 'uncategorized';
}

// Helper function to format duration from seconds
function formatDuration(seconds) {
  if (!seconds) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Helper function to get audio duration using ffprobe
function getAudioDuration(filePath) {
  try {
    const output = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`);
    return parseFloat(output.toString().trim());
  } catch (error) {
    console.error(`Error getting duration for ${filePath}:`, error.message);
    return 0;
  }
}

// Main function to generate episodes.json
async function generateEpisodesJson() {
  console.log('Generating episodes.json...');
  
  // Get all audio files
  const audioFiles = fs.readdirSync(OUTPUT_DIR)
    .filter(file => file.endsWith('.mp3') || file.endsWith('.wav'))
    .filter(file => !file.includes('partial') && !file.includes('cache'));
  
  console.log(`Found ${audioFiles.length} audio files`);
  
  // Generate episodes data
  const episodes = audioFiles.map((audioFile, index) => {
    const baseName = audioFile.replace(/\.(mp3|wav)$/, '');
    const subject = getSubject(baseName);
    
    // Find corresponding markdown files
    const transcriptFile = `${baseName}-transcript.md`;
    const descriptionFile = `${baseName}-description.md`;
    const showNotesFile = `${baseName}-show-notes.md`;
    
    // Find corresponding image file
    const imageBaseName = baseName.split('-')[0]; // Get the first part of the name
    const imageFile = `${imageBaseName}-thumbnail.webp`;
    
    // Get audio duration
    const audioPath = path.join(OUTPUT_DIR, audioFile);
    const durationSeconds = getAudioDuration(audioPath);
    const duration = formatDuration(durationSeconds);
    
    // Get description from file if available
    let description = '';
    try {
      if (fs.existsSync(path.join(OUTPUT_DIR, descriptionFile))) {
        const descContent = fs.readFileSync(path.join(OUTPUT_DIR, descriptionFile), 'utf8');
        description = descContent.trim();
      }
    } catch (error) {
      console.error(`Error reading description file for ${baseName}:`, error.message);
    }
    
    // Format title
    const title = baseName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return {
      id: (index + 1).toString(),
      title,
      description: description || `${title} - A Copernicus AI podcast episode`,
      thumbnailUrl: `${CONTENT_BASE_URL}/images/${imageFile}`,
      duration,
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      url: baseName,
      audioUrl: `${CONTENT_BASE_URL}/audio/${audioFile}`,
      videoUrl: null,
      descriptUrl: null,
      isFeatured: index < 5, // First 5 episodes are featured
      subject
    };
  });
  
  // Write to file
  fs.writeFileSync(OUTPUT_JSON_FILE, JSON.stringify(episodes, null, 2));
  console.log(`Generated episodes.json with ${episodes.length} episodes`);
  
  // Group by subject for logging
  const episodesBySubject = {};
  episodes.forEach(episode => {
    if (!episodesBySubject[episode.subject]) {
      episodesBySubject[episode.subject] = [];
    }
    episodesBySubject[episode.subject].push(episode.title);
  });
  
  console.log('\nEpisodes by subject:');
  for (const [subject, titles] of Object.entries(episodesBySubject)) {
    console.log(`\n${subject.toUpperCase()} (${titles.length} episodes):`);
    titles.forEach(title => console.log(`- ${title}`));
  }
}

// Run the main function
generateEpisodesJson().catch(error => {
  console.error('Error generating episodes.json:', error);
  process.exit(1);
}); 