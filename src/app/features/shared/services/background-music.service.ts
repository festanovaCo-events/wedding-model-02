import { Injectable } from '@angular/core';
import { WEDDING_INFO } from '../constants/wedding-info';

@Injectable({ providedIn: 'root' })
export class BackgroundMusicService {
  private audio: HTMLAudioElement | null = null;
  private playing = false;

  get isPlaying(): boolean {
    return this.playing;
  }

  play(): void {
    this.ensureAudio();
    const audio = this.audio;
    if (!audio) {
      return;
    }

    this.playing = true;
    void audio.play().catch(() => {
      this.playing = false;
    });
  }

  pause(): void {
    this.audio?.pause();
    this.playing = false;
  }

  toggle(): boolean {
    if (this.playing) {
      this.pause();
      return false;
    }

    this.play();
    return true;
  }

  private ensureAudio(): void {
    if (this.audio) {
      return;
    }

    this.audio = new Audio(WEDDING_INFO.music.url);
    this.audio.loop = WEDDING_INFO.music.loop;
    this.audio.volume = WEDDING_INFO.music.volume;
  }
}
