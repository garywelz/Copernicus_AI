import { IVoiceService } from '../interfaces/IVoiceService';
import { VoiceSynthesisOptions } from '../../types/voice';
import { AudioSegment } from '../../types/audio';
export declare class TextToSpeechService implements IVoiceService {
    private readonly apiKey;
    private readonly baseUrl;
    private readonly audioProcessor;
    private readonly audioEnhancer;
    constructor(apiKey: string);
    synthesize(text: string, options: VoiceSynthesisOptions): Promise<AudioSegment>;
    combineAudio(segments: AudioSegment[]): Promise<Buffer>;
}
