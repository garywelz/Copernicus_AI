import { getCopernicusConfig, getCopernicusBio, getVoiceConfig } from './copernicusConfig';

describe('Copernicus Configuration Module', () => {
  test('getCopernicusConfig returns the complete configuration', () => {
    const config = getCopernicusConfig();
    expect(config).toBeDefined();
    expect(typeof config).toBe('object');
    // Check that the name is correct
    expect(config.name).toBe('Copernicus');
    // Verify that bio is an array with at least one entry
    expect(Array.isArray(config.bio)).toBe(true);
    expect(config.bio.length).toBeGreaterThan(0);
  });

  test('getCopernicusBio returns the first bio entry', () => {
    const bio = getCopernicusBio();
    expect(typeof bio).toBe('string');
    expect(bio.length).toBeGreaterThan(0);
  });

  test('getVoiceConfig returns valid configuration for valid roles', () => {
    // Testing "host" role
    const hostVoice = getVoiceConfig('host');
    expect(hostVoice).toBeDefined();
    expect(hostVoice.model).toBe('en_US-male-medium');
    expect(hostVoice.role).toBe('Main host and scientific analyst');

    // Testing "expert" role
    const expertVoice = getVoiceConfig('expert');
    expect(expertVoice).toBeDefined();
    expect(expertVoice.model).toBe('en_US-female-medium');
    expect(expertVoice.role).toBe('Technical expert and deep dive specialist');

    // Testing "questioner" role
    const questionerVoice = getVoiceConfig('questioner');
    expect(questionerVoice).toBeDefined();
    expect(questionerVoice.model).toBe('en_US-male-light');
    expect(questionerVoice.role).toBe('Audience perspective and clarifying questions');

    // Testing for a non-existent role should return undefined
    const nonExistent = getVoiceConfig('nonExistentRole');
    expect(nonExistent).toBeUndefined();
  });
}); 