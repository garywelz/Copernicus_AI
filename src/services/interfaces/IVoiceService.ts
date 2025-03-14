import { VoiceSynthesisOptions } from '../../types/voice';
import { AudioSegment } from '../../types/audio';

export interface IVoiceService {
  synthesize(text: string, options: VoiceSynthesisOptions): Promise<AudioSegment>;
  combineAudio(segments: AudioSegment[]): Promise<Buffer>;
} 