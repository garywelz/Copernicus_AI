# Voice Services

This directory contains services for text-to-speech (TTS) functionality.

## Files

- `IVoiceService.ts`: Interface defining the voice service contract
- `GoogleTTSService.ts`: Google Cloud Text-to-Speech implementation
- `OpenAITTSService.ts`: OpenAI TTS implementation
- `VoiceServiceFactory.ts`: Factory for creating voice service instances

## Usage

```typescript
import { VoiceServiceFactory } from './VoiceServiceFactory';

// Create a voice service
const voiceService = VoiceServiceFactory.createService(
    'google',  // or 'openai'
    'your-project-id',
    'your-api-key'  // required for OpenAI
);

// Generate audio
const audio = await voiceService.generateAudio(
    'Hello, this is a test.',
    'host'  // speaker type
);

// Combine audio segments
const finalAudio = await voiceService.combineAudioSegments(
    [audio1, audio2],
    'output.mp3',
    500  // pause duration in ms
);
```

## Voice Settings

### Google TTS
- Host: en-US-Neural2-D (Male)
- Expert: en-US-Neural2-A (Male)
- Questioner: en-US-Neural2-E (Female)

### OpenAI TTS
- Host: onyx
- Expert: nova
- Questioner: shimmer

## Dependencies

- @google-cloud/text-to-speech
- @google-cloud/storage
- openai
- Audio processing library (to be implemented) 