import { CommonModule } from '@angular/common';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { WEDDING_INFO } from '../../../../constants/wedding-info';

@Component({
  selector: 'app-splash-music',
  standalone: true,
  imports: [CommonModule, LottieComponent],
  templateUrl: './splash-music.component.html',
})
export class SplashMusicComponent implements OnInit {
  @Output() iconClicked = new EventEmitter<void>();
  private animationItem: AnimationItem | undefined;
  shouldLoadAnimation = false;

  options: AnimationOptions = {
    animationData: WEDDING_INFO.animations.music,
    loop: true,
    autoplay: true,
  };

  ngOnInit(): void {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(() => {
        this.shouldLoadAnimation = true;
      }, { timeout: 2000 });
      return;
    }

    window.setTimeout(() => {
      this.shouldLoadAnimation = true;
    }, 2000);
  }

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
  }

  onClick(): void {
    this.iconClicked.emit();
  }

  pauseAnimation(): void {
    this.animationItem?.pause();
  }

  playAnimation(): void {
    this.animationItem?.play();
  }
}
