import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-status.component.html',
})
export class ErrorStatusComponent {
  @Input() error: string | null = null;
}
