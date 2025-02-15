import { logger } from '../../utils/logger.js';
import { spawn } from 'child_process';
import fs from 'fs/promises';

export class AudioPlayer {
  private isPlaying: boolean = false;
  private currentProcess?: ReturnType<typeof spawn>;
  private currentPosition: number = 0;
  private isPaused: boolean = false;

  async playPodcast(buffer: Buffer, startPosition: number = 0) {
    try {
      // Clean up any existing process
      if (this.currentProcess) {
        this.currentProcess.removeAllListeners();
        this.currentProcess.kill();
        this.currentProcess = undefined;
      }

      // Use mpg123 with seek position (-k is frame offset)
      const frameOffset = Math.floor(startPosition * 38.28);  // Convert seconds to frames
      this.currentProcess = spawn('mpg123', [
        '-k', frameOffset.toString(),  // Start position
        '-'  // Read from stdin
      ], { 
        stdio: ['pipe', 'inherit', 'inherit'],
      });

      this.isPlaying = true;
      this.isPaused = false;

      // Write the buffer to mpg123's stdin
      this.currentProcess.stdin.write(buffer);
      this.currentProcess.stdin.end();

      // Track position while playing
      let lastTime = Date.now();
      const interval = setInterval(() => {
        if (this.isPlaying && !this.isPaused) {
          const now = Date.now();
          this.currentPosition += (now - lastTime) / 1000;
          lastTime = now;
        }
      }, 100);

      // Wait for playback to finish
      await new Promise((resolve, reject) => {
        this.currentProcess?.on('close', (code) => {
          clearInterval(interval);
          if (code === 0 || code === null) {
            resolve(null);
          } else {
            reject(new Error(`Process exited with code ${code}`));
          }
        });
        this.currentProcess?.on('error', reject);
      });

      this.isPlaying = false;
    } catch (error) {
      logger.error('Error playing podcast:', error);
      this.isPlaying = false;
      throw error;
    }
  }

  async playInterruption(buffer: Buffer) {
    try {
      // Remember state
      const wasPlaying = this.isPlaying;
      const wasPaused = this.isPaused;
      const position = this.currentPosition;  // Save current position

      // Stop current playback
      await this.stop();

      // Wait a moment for cleanup
      await new Promise(resolve => setTimeout(resolve, 100));

      // Play interruption
      console.log('Playing voice response...');
      return new Promise<void>((resolve, reject) => {
        const interruptionProcess = spawn('mpg123', ['-'], { 
          stdio: ['pipe', 'inherit', 'inherit']
        });

        interruptionProcess.stdin.write(buffer);
        interruptionProcess.stdin.end();

        interruptionProcess.on('close', async (code) => {
          console.log('Voice response finished.');
          if (code === 0 || code === null) {
            try {
              // Wait a moment before resuming
              await new Promise(resolve => setTimeout(resolve, 500));

              // If we were playing and not paused before, restart playback from saved position
              if (wasPlaying && !wasPaused) {
                const podcastBuffer = await fs.readFile('output/black-holes-podcast.mp3');
                await this.playPodcast(podcastBuffer, position);
              } else if (wasPaused) {
                this.isPaused = true;
                this.isPlaying = false;
                this.currentPosition = position;  // Restore position
              }
              resolve();
            } catch (error) {
              reject(error);
            }
          } else {
            reject(new Error(`Interruption process exited with code ${code}`));
          }
        });

        interruptionProcess.on('error', reject);
      });

    } catch (error) {
      logger.error('Error playing interruption:', error);
      throw error;
    }
  }

  pause() {
    if (this.isPlaying && this.currentProcess) {
      this.currentProcess.kill('SIGSTOP');
      this.isPlaying = false;
      this.isPaused = true;
    }
  }

  async resume() {
    if (this.isPaused) {
      this.isPaused = false;
      const podcastBuffer = await fs.readFile('output/black-holes-podcast.mp3');
      await this.playPodcast(podcastBuffer, this.currentPosition);
    }
  }

  async stop() {
    if (this.currentProcess) {
      return new Promise<void>((resolve) => {
        this.currentProcess?.on('close', () => {
          this.isPlaying = false;
          this.isPaused = false;
          this.currentProcess = undefined;
          resolve();
        });
        this.currentProcess?.kill();
      });
    }
  }
} 