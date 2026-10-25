import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { Tick02Icon } from '@hugeicons/core-free-icons';
import { CONFIRMATION_COPY } from '../../../constants/confirmation-copy';
import { InvitationInfoResponse } from '../../../interfaces/invitation.interface';

@Component({
  selector: 'app-confirmation-status',
  standalone: true,
  imports: [CommonModule, HugeiconsIconComponent],
  templateUrl: './confirmation-status.component.html',
})
export class ConfirmationStatusComponent {
  @Input() invitationData: InvitationInfoResponse | null = null;

  readonly copy = CONFIRMATION_COPY;
  readonly acceptedIcon = Tick02Icon;

  get confirmedGuestNames(): string[] {
    if (!this.invitationData) {
      return [];
    }

    const { invitation } = this.invitationData.data;

    if (invitation.guests?.length > 0) {
      return invitation.guests.map((guest) => guest.name);
    }

    return invitation.name ? [invitation.name] : [];
  }
}
