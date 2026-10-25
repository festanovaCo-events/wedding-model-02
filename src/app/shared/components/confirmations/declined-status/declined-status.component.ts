import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { CONFIRMATION_COPY } from '../../../constants/confirmation-copy';

@Component({
  selector: 'app-declined-status',
  standalone: true,
  imports: [CommonModule, HugeiconsIconComponent],
  templateUrl: './declined-status.component.html',
})
export class DeclinedStatusComponent {
  readonly copy = CONFIRMATION_COPY;
  readonly declinedIcon = Cancel01Icon;
}
