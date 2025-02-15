import { ElevenLabsService } from '../voice/ElevenLabsService.js';
import { AudioProcessor } from '../../utils/audio.js';

export class PodcastInteraction {
  private isPlaying: boolean = false;
  private currentPosition: number = 0;
  private podcastContext: string;

  constructor(
    private ttsService: ElevenLabsService,
    private audioProcessor: AudioProcessor
  ) {
    this.podcastContext = `
      Title: "Black Holes: The Universe's Greatest Mystery"
      Format: Interactive educational podcast with expert hosts
      
      Hosts:
      1. Antoni (Primary Host)
      - Warm, engaging speaking style
      - Makes complex concepts accessible
      - Uses analogies and real-world examples
      - Background: Astrophysicist specializing in black holes
      
      2. Charlotte (Technical Expert)
      - Clear, precise explanations
      - Handles mathematical and technical details
      - Adds depth to Antoni's explanations
      - Background: Theoretical physicist
      
      3. Copernicus (Historical Perspective)
      - Provides historical context
      - Connects ancient astronomy to modern discoveries
      - Dramatic, authoritative voice
      - Background: Renaissance astronomer with modern knowledge
      
      Key Topics:
      - Event horizons and their properties
      - Gravitational effects and time dilation
      - Formation and evolution of black holes
      - Speed of light and relativistic effects
      - Hawking radiation and quantum effects
      
      Style Guide:
      - Keep explanations clear but scientifically accurate
      - Use engaging metaphors when helpful
      - Maintain conversational tone
      - Answer questions as if speaking to an interested listener
    `;
  }

  async handleQuestion(question: string): Promise<Buffer> {
    console.log('Handling question:', question);
    
    // Pause current playback
    this.isPlaying = false;
    
    // Generate contextual response using LLM
    const response = await this.generateResponse(question);
    console.log('Generated response:', response.text);
    
    // Resume playback after response
    this.isPlaying = true;
    
    return response.audioData;
  }

  private async generateResponse(question: string) {
    const context = this.getCurrentContext();
    
    // Use ElevenLabs' model for both text generation and voice
    const response = await this.ttsService.generateAndSynthesize({
      prompt: `You are ${context.currentSpeaker}, an expert discussing black holes.
              Context: ${this.podcastContext}
              Question: ${question}
              Please provide a clear, engaging 2-3 sentence response.`,
      model: "eleven_multilingual_v2",  // Use their latest model
      voiceId: context.currentSpeaker === 'Antoni' ? 
        'ErXwobaYiN019PkySvjV' :  // Antoni's voice
        'charlotte_voice_id',     // Charlotte's voice
      style: 0.7,
      stability: 0.5
    });

    return {
      text: response.text,
      audioData: response.audio,
      speaker: this.selectRespondingCharacter(question, context)
    };
  }

  private getCurrentContext() {
    // Return current segment context based on playback position
    return {
      currentTopic: 'black holes',
      currentSpeaker: 'Antoni',
      timestamp: this.currentPosition
    };
  }

  private selectRespondingCharacter(question: string, context: any): string {
    // Logic to select most appropriate character to answer
    if (question.includes('mathematical') || question.includes('equation')) {
      return 'en_US-female-medium'; // Charlotte for technical questions
    }
    return 'en_US-male-medium'; // Antoni (host) for general questions
  }
} 