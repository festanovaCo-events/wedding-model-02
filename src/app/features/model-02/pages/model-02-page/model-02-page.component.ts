import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { MODEL_02_INFO } from '../../constants/model-02-info';
import { M02HeroComponent } from '../../components/hero/m02-hero.component';
import { M02InvitationComponent } from '../../components/invitation/m02-invitation.component';
import { M02EventsComponent } from '../../components/events/m02-events.component';
import { M02TimelineComponent } from '../../components/timeline/m02-timeline.component';
import { M02PassesComponent } from '../../components/passes/m02-passes.component';
import { M02GiftsComponent } from '../../components/gifts/m02-gifts.component';
import { M02RsvpComponent } from '../../components/rsvp/m02-rsvp.component';
import { M02AdultsOnlyComponent } from '../../components/adults-only/m02-adults-only.component';
import { M02FooterComponent } from '../../components/footer/m02-footer.component';
import { ModalComponent } from '../../../shared/components/common/modal/modal.component';
import { ConfirmationGuideStore } from '../../../shared/services/confirmation-guide.store';
import { ModalFlowService } from '../../../shared/services/modal-flow.service';
import { InvitationStateService } from '../../../shared/services/invitation-state.service';
import { InvitationInfoResponse } from '../../../shared/interfaces/invitation.interface';
import { shouldShowExpiredInvitationPage } from '../../../shared/utils/confirmation-deadline';

@Component({
  selector: 'app-model-02-page',
  standalone: true,
  imports: [
    CommonModule,
    M02HeroComponent,
    M02InvitationComponent,
    M02EventsComponent,
    M02TimelineComponent,
    M02PassesComponent,
    M02GiftsComponent,
    M02RsvpComponent,
    M02AdultsOnlyComponent,
    M02FooterComponent,
    ModalComponent,
  ],
  templateUrl: './model-02-page.component.html',
})
export class Model02PageComponent implements OnInit {
  readonly assets = MODEL_02_INFO.assets;

  showConfirmationGuide = false;

  private readonly destroyRef = inject(DestroyRef);
  private welcomeAccepted = false;
  private invitationLoadPending = false;
  private isPreviewMode = false;

  constructor(
    private modalFlowService: ModalFlowService,
    private invitationStateService: InvitationStateService,
    private confirmationGuideStore: ConfirmationGuideStore,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.isPreviewMode = params['preview'] === '1';
      const invitationToken = params['token'] as string | undefined;

      if (!invitationToken) {
        this.invitationLoadPending = false;
        if (this.welcomeAccepted) {
          this.tryShowConfirmationGuide();
        }
        return;
      }

      this.invitationLoadPending = true;
      this.invitationStateService
        .load(invitationToken)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
        error: () => {
          this.invitationLoadPending = false;
          if (this.welcomeAccepted) {
            this.tryShowConfirmationGuide();
          }
        },
      });
    });

    this.modalFlowService.welcomeModalAccepted$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.welcomeAccepted = true;
        this.tryShowConfirmationGuide();
      });

    this.invitationStateService.invitationData$
      .pipe(
        filter((data): data is InvitationInfoResponse => data !== null),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => this.handleInvitation(data));
  }

  openConfirmation(): void {
    this.closeGuide();
    this.modalFlowService.requestOpenConfirmationModal();
  }

  closeGuide(): void {
    this.dismissConfirmationGuide();
  }

  private handleInvitation(data: InvitationInfoResponse): void {
    this.invitationLoadPending = false;

    const status = data.data.invitation.status;
    if (!this.isPreviewMode && shouldShowExpiredInvitationPage(status)) {
      void this.router.navigate(['/expired'], {
        queryParamsHandling: 'preserve',
        replaceUrl: true,
      });
      return;
    }

    if (status === 'ACCEPTED' || status === 'DECLINED') {
      this.dismissConfirmationGuide();
      return;
    }

    if (this.welcomeAccepted) {
      this.tryShowConfirmationGuide();
    }
  }

  private shouldShowConfirmationGuide(): boolean {
    if (this.confirmationGuideStore.hasBeenDismissed()) {
      return false;
    }

    const status = this.invitationStateService.getInvitationData()?.data.invitation.status;
    if (status === 'ACCEPTED' || status === 'DECLINED') {
      return false;
    }

    return !this.invitationLoadPending;
  }

  private tryShowConfirmationGuide(): void {
    if (this.shouldShowConfirmationGuide()) {
      this.showConfirmationGuide = true;
    }
  }

  private dismissConfirmationGuide(): void {
    this.showConfirmationGuide = false;
    this.confirmationGuideStore.markDismissed();
  }
}
