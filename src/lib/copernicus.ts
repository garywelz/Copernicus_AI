/**
 * Copernicus Persona Configuration
 * This module centralizes the AI persona settings used 
 * across all social platform integrations.
 */

import characterData from '../characters/copernicus.character.json';

/**
 * Gets a standardized message given a podcast URL.
 * Uses the Copernicus character data as the source of the AI persona identity.
 * @param podcastUrl The URL of the podcast.
 * @returns A string message for posting.
 */
export const getTweetMessage = (podcastUrl: string): string => {
  const { name, bio } = characterData;
  // Use the first bio entry from Copernicus as a persona summary
  const summary = bio[0];
  return `Greetings, humans! I'm ${name}. ${summary} Check out our latest podcast: ${podcastUrl}`;
};

// Additional persona functions for YouTube, Telegram, etc., can be added below. 