import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { Alert02Icon } from '@hugeicons/core-free-icons';
import { CONFIRMATION_COPY } from '../../../constants/confirmation-copy';

@Component({
  selector: 'app-error-status',
  standalone: true,
  imports: [CommonModule, HugeiconsIconComponent],
  templateUrl: './error-status.component.html',
})
export class ErrorStatusComponent {
  @Input() error: string | null = null;

  readonly copy = CONFIRMATION_COPY;
  readonly errorIcon = Alert02Icon;
}
