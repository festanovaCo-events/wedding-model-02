import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { Alert02Icon, CalendarRemove01Icon } from '@hugeicons/core-free-icons';
import { EXPIRED_INVITATION_COPY } from '../../constants/expired-invitation-copy';

@Component({
  selector: 'app-expired-banner',
  standalone: true,
  imports: [CommonModule, HugeiconsIconComponent],
  templateUrl: './expired-banner.component.html',
  styleUrl: './expired-banner.component.css',
})
export class ExpiredBannerComponent {
  @Input({ required: true }) deadline!: string;

  readonly copy = EXPIRED_INVITATION_COPY;
  readonly calendarIcon = CalendarRemove01Icon;
  readonly alertIcon = Alert02Icon;
}
