import { PodcastInteraction } from './PodcastInteraction.js';
import { AudioPlayer } from '../audio/AudioPlayer.js';

export class PodcastController {
  constructor(
    private player: AudioPlayer,
    private interaction: PodcastInteraction
  ) {}

  async handleCommand(command: string) {
    // Normalize the command
    const normalizedCommand = command.toLowerCase().trim();
    
    // Handle common typos
    if (normalizedCommand.startsWith('aks ')) {
      command = 'ask ' + command.slice(4);
    }

    if (normalizedCommand.startsWith('ask ') || normalizedCommand.startsWith('aks ')) {
      // Handle question
      const question = command.replace(/^(ask|aks)\s+/i, '').trim();
      const response = await this.interaction.handleQuestion(question);
      await this.player.playInterruption(response);
    } else {
      // Handle other commands (pause, resume, etc.)
      switch (normalizedCommand) {
        case 'pause':
          this.player.pause();
          break;
        case 'resume':
        case 'play':
          this.player.resume();
          break;
        // Add other commands as needed
      }
    }
  }
} 