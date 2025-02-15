import { jest, describe, test, expect } from '@jest/globals';
import { AudioProcessor, type AudioProcessingOptions } from '../../utils/audio';
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

jest.mock('child_process');
jest.mock('fs/promises');
jest.mock('os');

describe('AudioProcessor', () => {
  const mockOptions: AudioProcessingOptions = {
    sampleRate: 44100,
    bitDepth: 16,
    channels: 2
  };

  const mockExec = exec as jest.MockedFunction<typeof exec>;
  const mockTmpdir = os.tmpdir as jest.MockedFunction<typeof os.tmpdir>;
  const mockMkdtemp = fs.mkdtemp as jest.MockedFunction<typeof fs.mkdtemp>;
  const mockWriteFile = fs.writeFile as jest.MockedFunction<typeof fs.writeFile>;
  const mockReadFile = fs.readFile as jest.MockedFunction<typeof fs.readFile>;
  const mockRm = fs.rm as jest.MockedFunction<typeof fs.rm>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockTmpdir.mockReturnValue('/tmp');
    mockMkdtemp.mockResolvedValue('/tmp/test-dir');
    mockWriteFile.mockResolvedValue();
    mockReadFile.mockResolvedValue(Buffer.from('test audio'));
    mockRm.mockResolvedValue();
    mockExec.mockImplementation((command, callback) => {
      callback?.(null, { stdout: '', stderr: '' });
      return {} as any;
    });
  });

  test('concatenates audio files successfully', async () => {
    const processor = new AudioProcessor(mockOptions);
    const audioBuffers = [
      Buffer.from('audio1'),
      Buffer.from('audio2')
    ];

    const result = await processor.concatenateAudio(audioBuffers);
    expect(result).toBeDefined();
    expect(mockMkdtemp).toHaveBeenCalled();
    expect(mockWriteFile).toHaveBeenCalledTimes(3); // 2 audio files + 1 file list
    expect(mockRm).toHaveBeenCalled();
  });

  test('normalizes audio correctly', () => {
    const processor = new AudioProcessor(mockOptions);
    const input = Buffer.from([0, 128, 255, 255]); // Sample 16-bit PCM data
    const result = processor.normalizeAudio(input);
    
    expect(result).toBeDefined();
    expect(result.length).toBe(input.length);
  });

  test('adds pause between segments', () => {
    const processor = new AudioProcessor(mockOptions);
    const pauseDuration = 0.5; // seconds
    const result = processor.addPause(pauseDuration);
    
    const expectedSamples = pauseDuration * mockOptions.sampleRate!;
    const expectedBytes = expectedSamples * mockOptions.channels! * 2; // 2 bytes per sample
    expect(result.length).toBe(expectedBytes);
  });
}); 