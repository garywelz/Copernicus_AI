import characterData from '../characters/copernicus.character.json';

/**
 * Returns the complete Copernicus configuration.
 * @returns The Copernicus character data.
 */
export const getCopernicusConfig = () => characterData;

/**
 * Returns the main biography for Copernicus.
 * Uses the first bio entry as the primary summary.
 * @returns A string containing the primary bio.
 */
export const getCopernicusBio = (): string => {
  return characterData.bio[0] || '';
};

/**
 * Returns the voice configuration for a given role.
 * @param roleName The role identifier (e.g., 'host', 'expert', or 'questioner').
 * @returns The voice configuration or undefined if not found.
 */
export const getVoiceConfig = (roleName: string) => characterData.voices?.[roleName]; 