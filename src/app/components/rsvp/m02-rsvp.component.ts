import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import { WEDDING_INFO } from '../../shared/constants/wedding-info';
import { MODEL_02_INFO } from '../../constants/m02-info';
import { ConfirmationStatusComponent } from '../../shared/components/confirmations/confirmation-status/confirmation-status.component';
import { DeclinedStatusComponent } from '../../shared/components/confirmations/declined-status/declined-status.component';
import { ErrorStatusComponent } from '../../shared/components/confirmations/error-status/error-status.component';
import { RsvpView } from '../../shared/interfaces/rsvp-view';
import { invitationStatusView } from '../../shared/interfaces/invitation.interface';
import { InvitationStateService } from '../../shared/services/invitation-state.service';

@Component({
  selector: 'app-m02-rsvp',
  standalone: true,
  imports: [
    CommonModule,
    HugeiconsIconComponent,
    ConfirmationStatusComponent,
    DeclinedStatusComponent,
    ErrorStatusComponent,
  ],
  templateUrl: './m02-rsvp.component.html',
})
export class M02RsvpComponent {
  @Output() confirmRequested = new EventEmitter<void>();

  readonly weddingInfo = WEDDING_INFO;
  readonly info = MODEL_02_INFO;
  readonly icon = CheckmarkCircle02Icon;
  readonly view$: Observable<RsvpView>;

  constructor(private invitationStateService: InvitationStateService) {
    this.view$ = combineLatest([
      this.invitationStateService.invitationData$,
      this.invitationStateService.error$,
    ]).pipe(
      map(([invitationData, error]): RsvpView => {
        const status = invitationStatusView(invitationData?.data.invitation.status);
        return {
          invitationData,
          error,
          isConfirmed: status.isAccepted,
          isDeclined: status.isDeclined,
        };
      }),
    );
  }
}
