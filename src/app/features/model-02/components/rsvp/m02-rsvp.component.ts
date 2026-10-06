import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { HugeiconsIconComponent } from '@hugeicons/angular';
import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import { WEDDING_INFO } from '../../../shared/constants/wedding-info';
import { MODEL_02_INFO } from '../../constants/model-02-info';
import { ConfirmationModalHostComponent } from '../../../shared/components/confirmations/confirmation-modal-host.component';
import { ConfirmationStatusComponent } from '../../../shared/components/confirmations/confirmation-status/confirmation-status.component';
import { DeclinedStatusComponent } from '../../../shared/components/confirmations/declined-status/declined-status.component';
import { ErrorStatusComponent } from '../../../shared/components/confirmations/error-status/error-status.component';
import { InvitationStateService } from '../../../shared/services/invitation-state.service';
import { ModalFlowService } from '../../../shared/services/modal-flow.service';
import { InvitationInfoResponse } from '../../../shared/interfaces/invitation.interface';

interface RsvpView {
  invitationData: InvitationInfoResponse | null;
  error: string | null;
  isConfirmed: boolean;
  isDeclined: boolean;
}

@Component({
  selector: 'app-m02-rsvp',
  standalone: true,
  imports: [
    CommonModule,
    HugeiconsIconComponent,
    ConfirmationModalHostComponent,
    ConfirmationStatusComponent,
    DeclinedStatusComponent,
    ErrorStatusComponent,
  ],
  templateUrl: './m02-rsvp.component.html',
})
export class M02RsvpComponent implements OnInit {
  readonly weddingInfo = WEDDING_INFO;
  readonly info = MODEL_02_INFO;
  readonly icon = CheckmarkCircle02Icon;
  readonly view$ = combineLatest([
    inject(InvitationStateService).invitationData$,
    inject(InvitationStateService).error$,
  ]).pipe(
    map(([invitationData, error]): RsvpView => ({
      invitationData,
      error,
      isConfirmed: invitationData?.data.invitation.status === 'ACCEPTED',
      isDeclined: invitationData?.data.invitation.status === 'DECLINED',
    })),
  );

  isConfirmationModalVisible = false;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private invitationStateService: InvitationStateService,
    private modalFlowService: ModalFlowService,
  ) {}

  ngOnInit(): void {
    this.invitationStateService.error$
      .pipe(
        filter((error): error is string => !!error),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.isConfirmationModalVisible = false;
      });

    this.modalFlowService.openConfirmationModal$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.openConfirmation());
  }

  openConfirmation(): void {
    const status = this.invitationStateService.getInvitationData()?.data.invitation.status;
    if (status === 'ACCEPTED' || status === 'DECLINED' || this.invitationStateService.getError()) {
      return;
    }
    this.isConfirmationModalVisible = true;
  }

  closeConfirmationModal(): void {
    this.isConfirmationModalVisible = false;
  }
}
