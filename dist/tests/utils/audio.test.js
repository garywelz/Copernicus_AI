"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const audio_1 = require("../../utils/audio");
const child_process_1 = require("child_process");
const promises_1 = __importDefault(require("fs/promises"));
const os_1 = __importDefault(require("os"));
globals_1.jest.mock('child_process');
globals_1.jest.mock('fs/promises');
globals_1.jest.mock('os');
(0, globals_1.describe)('AudioProcessor', () => {
    const mockOptions = {
        sampleRate: 44100,
        bitDepth: 16,
        channels: 2
    };
    const mockExec = child_process_1.exec;
    const mockTmpdir = os_1.default.tmpdir;
    const mockMkdtemp = promises_1.default.mkdtemp;
    const mockWriteFile = promises_1.default.writeFile;
    const mockReadFile = promises_1.default.readFile;
    const mockRm = promises_1.default.rm;
    beforeEach(() => {
        globals_1.jest.clearAllMocks();
        mockTmpdir.mockReturnValue('/tmp');
        mockMkdtemp.mockResolvedValue('/tmp/test-dir');
        mockWriteFile.mockResolvedValue();
        mockReadFile.mockResolvedValue(Buffer.from('test audio'));
        mockRm.mockResolvedValue();
        mockExec.mockImplementation((command, callback) => {
            callback?.(null, { stdout: '', stderr: '' });
            return {};
        });
    });
    (0, globals_1.test)('concatenates audio files successfully', async () => {
        const processor = new audio_1.AudioProcessor(mockOptions);
        const audioBuffers = [
            Buffer.from('audio1'),
            Buffer.from('audio2')
        ];
        const result = await processor.concatenateAudio(audioBuffers);
        (0, globals_1.expect)(result).toBeDefined();
        (0, globals_1.expect)(mockMkdtemp).toHaveBeenCalled();
        (0, globals_1.expect)(mockWriteFile).toHaveBeenCalledTimes(3); // 2 audio files + 1 file list
        (0, globals_1.expect)(mockRm).toHaveBeenCalled();
    });
    (0, globals_1.test)('normalizes audio correctly', () => {
        const processor = new audio_1.AudioProcessor(mockOptions);
        const input = Buffer.from([0, 128, 255, 255]); // Sample 16-bit PCM data
        const result = processor.normalizeAudio(input);
        (0, globals_1.expect)(result).toBeDefined();
        (0, globals_1.expect)(result.length).toBe(input.length);
    });
    (0, globals_1.test)('adds pause between segments', () => {
        const processor = new audio_1.AudioProcessor(mockOptions);
        const pauseDuration = 0.5; // seconds
        const result = processor.addPause(pauseDuration);
        const expectedSamples = pauseDuration * mockOptions.sampleRate;
        const expectedBytes = expectedSamples * mockOptions.channels * 2; // 2 bytes per sample
        (0, globals_1.expect)(result.length).toBe(expectedBytes);
    });
});
//# sourceMappingURL=audio.test.js.map