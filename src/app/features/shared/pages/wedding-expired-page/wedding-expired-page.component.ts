import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';
import { ExpiredBannerComponent } from '../../components/expired-banner/expired-banner.component';
import { InvitationCardComponent } from '../../components/invitation-card/invitation-card.component';
import { WEDDING_INFO } from '../../constants/wedding-info';
import { InvitationStateService } from '../../services/invitation-state.service';
import { InvitationInfoResponse } from '../../interfaces/invitation.interface';
import { shouldShowExpiredInvitationPage } from '../../utils/confirmation-deadline';

@Component({
  selector: 'app-wedding-expired-page',
  standalone: true,
  imports: [CommonModule, ExpiredBannerComponent, InvitationCardComponent],
  templateUrl: './wedding-expired-page.component.html',
  styleUrl: './wedding-expired-page.component.css',
})
export class WeddingExpiredPageComponent implements OnInit {
  readonly coupleName = WEDDING_INFO.couple.fullName;
  readonly deadline = WEDDING_INFO.confirmation.deadlineLabel;
  readonly inviteeName$ = inject(InvitationStateService).hostName$.pipe(
    map((name) => name?.split(' ')[0] || 'Invitado'),
  );

  invitationUrl = '';

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invitationStateService: InvitationStateService,
  ) {}

  ngOnInit(): void {
    this.invitationStateService.invitationData$
      .pipe(
        filter((data): data is InvitationInfoResponse => data !== null),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data) => {
        if (!shouldShowExpiredInvitationPage(data.data.invitation.status)) {
          void this.router.navigate(['/'], {
            queryParamsHandling: 'preserve',
            replaceUrl: true,
          });
        }
      });

    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const token =
        (params['token'] as string | undefined) ??
        this.invitationStateService.getToken() ??
        undefined;

      if (!token) {
        return;
      }

      this.invitationUrl = `${window.location.origin}/invitations-wedding-model-02?token=${encodeURIComponent(token)}`;
      this.invitationStateService.load(token).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    });
  }
}
