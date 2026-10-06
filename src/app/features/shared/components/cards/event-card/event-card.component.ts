import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { WEDDING_INFO } from '../../../constants/wedding-info';

const EVENT_CARD_ANIMATIONS = {
  rings: WEDDING_INFO.animations.rings,
  party: WEDDING_INFO.animations.party,
} as const;

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, LottieComponent],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.css',
})
export class EventCardComponent implements OnInit {
  @Input({ required: true }) titulo!: string;
  @Input({ required: true }) animationKey!: keyof typeof EVENT_CARD_ANIMATIONS;
  @Input() date = '';
  @Input() place = '';
  @Input() address = '';
  @Input() calendarRef = '';
  @Input() location = '';
  @Input() mapsUrl = '';
  options!: AnimationOptions;
  animationItem?: AnimationItem;

  ngOnInit(): void {
    this.options = {
      animationData: EVENT_CARD_ANIMATIONS[this.animationKey],
      loop: true,
      autoplay: true,
    };
  }

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
  }
}
