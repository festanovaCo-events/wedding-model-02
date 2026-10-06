import { Component, DestroyRef, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';
import { INVITATION_MESSAGES } from '../../../constants/invitation-messages';
import { GuestList } from '../../../domain/guest-list';
import { InvitationInfoResponse } from '../../../interfaces/invitation.interface';
import { InvitationStateService } from '../../../services/invitation-state.service';
import { ConfirmAlertComponent } from '../../common/confirm-alert/confirm-alert.component';

type ConfirmationStep =
  | 'confirmation'
  | 'loading'
  | 'guests'
  | 'decline-confirmation'
  | 'partial-quotas-confirmation';

const GUEST_STEP_DELAY_MS = 1500;

@Component({
  selector: 'app-content-confirmation-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, ConfirmAlertComponent],
  templateUrl: './content-confirmation-modal.component.html',
  styleUrl: './content-confirmation-modal.component.css',
})
export class ContentConfirmationModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  currentStep: ConfirmationStep = 'confirmation';
  willAttend: boolean | null = null;
  draftName = '';
  guestList = GuestList.empty();

  private readonly destroyRef = inject(DestroyRef);
  private guestListReady = false;
  private guestStepTimer?: number;

  constructor(
    private invitationStateService: InvitationStateService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.invitationStateService.invitationData$
      .pipe(
        filter((data): data is InvitationInfoResponse => data !== null),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        if (this.guestListReady) {
          return;
        }
        this.guestList = GuestList.fromInvitation(data);
        this.guestListReady = true;
      });

    this.destroyRef.onDestroy(() => this.clearGuestStepTimer());
  }

  get hostName(): string {
    return this.guestList.hostName;
  }

  get names(): readonly string[] {
    return this.guestList.names;
  }

  get maximumSeats(): number {
    return this.guestList.maximumSeats;
  }

  get canAddMoreGuests(): boolean {
    return this.guestList.canAddMore;
  }

  get partialQuotasMessage(): string {
    return this.guestList.partialMessage;
  }

  onConfirmChange(): void {
    if (this.willAttend === true) {
      this.currentStep = 'loading';
      this.guestStepTimer = window.setTimeout(() => {
        this.currentStep = 'guests';
      }, GUEST_STEP_DELAY_MS);
      return;
    }

    if (this.willAttend === false) {
      this.currentStep = 'decline-confirmation';
    }
  }

  confirmDecline(): void {
    if (!this.invitationStateService.getToken()) {
      this.toastr.error(INVITATION_MESSAGES.missingToken);
      return;
    }

    this.currentStep = 'loading';
    this.invitationStateService
      .decline()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.reset();
          this.closeModal.emit();
          this.toastr.info(INVITATION_MESSAGES.declined);
        },
        error: () => {
          this.currentStep = 'decline-confirmation';
          this.toastr.error(INVITATION_MESSAGES.declineError);
        },
      });
  }

  cancelDecline(): void {
    this.willAttend = null;
    this.currentStep = 'confirmation';
  }

  saveName(): void {
    const nextList = this.guestList.add(this.draftName);
    if (nextList === this.guestList) {
      return;
    }
    this.guestList = nextList;
    this.draftName = '';
  }

  deleteName(index: number): void {
    this.guestList = this.guestList.removeAt(index);
  }

  confirmSend(): void {
    if (this.guestList.isPartial) {
      this.currentStep = 'partial-quotas-confirmation';
      return;
    }

    this.send();
  }

  confirmPartialSend(): void {
    this.send();
  }

  cancelPartialSend(): void {
    this.currentStep = 'guests';
  }

  send(): void {
    if (!this.invitationStateService.getToken()) {
      this.toastr.error(INVITATION_MESSAGES.missingToken);
      return;
    }

    this.currentStep = 'loading';
    this.invitationStateService
      .accept(this.guestList.toGuestNames())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.reset();
          this.closeModal.emit();
          this.toastr.success(INVITATION_MESSAGES.accepted);
        },
        error: () => {
          this.currentStep = 'guests';
          this.toastr.error(INVITATION_MESSAGES.acceptError);
        },
      });
  }

  reset(): void {
    this.clearGuestStepTimer();
    this.currentStep = 'confirmation';
    this.willAttend = null;
    this.draftName = '';
    this.guestList = this.guestList.withHostOnly();
  }

  private clearGuestStepTimer(): void {
    if (this.guestStepTimer === undefined) {
      return;
    }
    window.clearTimeout(this.guestStepTimer);
    this.guestStepTimer = undefined;
  }

  onClose(): void {
    this.reset();
    this.closeModal.emit();
  }
}
