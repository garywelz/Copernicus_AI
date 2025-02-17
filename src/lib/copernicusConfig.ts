import characterData from '../characters/copernicus.character.json';
import type { CharacterData, VoiceConfig } from '../types/character';

const typedCharacterData = characterData as CharacterData;

/**
 * Returns the complete Copernicus configuration.
 * @returns The Copernicus character data.
 */
export const getCopernicusConfig = () => typedCharacterData;

/**
 * Returns the main biography for Copernicus.
 * Uses the first bio entry as the primary summary.
 * @returns A string containing the primary bio.
 */
export const getCopernicusBio = () => typedCharacterData.bio[0] || '';

/**
 * Returns the voice configuration for a given role.
 * @param roleName The role identifier (e.g., 'host', 'expert', or 'questioner').
 * @returns The voice configuration or undefined if not found.
 */
export const getVoiceConfig = (roleName: string): VoiceConfig | undefined => 
  typedCharacterData.voices?.[roleName]; 