import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { WEDDING_INFO } from '../../../shared/constants/wedding-info';
import { InvitationInfoResponse, InvitationStatus } from '../../../shared/interfaces/invitation.interface';
import { INVITATION_API, InvitationApi } from '../../../shared/services/invitation-api';
import { ConfirmationGuideStore } from '../../../shared/services/confirmation-guide.store';
import { InvitationStateService } from '../../../shared/services/invitation-state.service';
import { ModalFlowService } from '../../../shared/services/modal-flow.service';
import { Model02PageComponent } from './model-02-page.component';

function invitation(status: InvitationStatus, token: string): InvitationInfoResponse {
  return {
    success: true,
    data: {
      available_seats: 2,
      used_seats: 0,
      total_seats: 2,
      invitation: {
        id: 'invitation-1',
        name: 'Jorge Mestre',
        status,
        seats_reserved: 2,
        token,
        guests: [],
      },
    },
  };
}

function deferredInvitation(): { stream: Observable<InvitationInfoResponse>; emit: (value: InvitationInfoResponse) => void } {
  const values = new BehaviorSubject<InvitationInfoResponse | null>(null);
  return {
    stream: new Observable((subscriber) => {
      const subscription = values.subscribe((value) => {
        if (value) {
          subscriber.next(value);
        }
      });
      return () => subscription.unsubscribe();
    }),
    emit: (value) => values.next(value),
  };
}

class GuideStore {
  dismissed = false;

  hasBeenDismissed(): boolean {
    return this.dismissed;
  }

  markDismissed(): void {
    this.dismissed = true;
  }
}

describe('Model02PageComponent', () => {
  const originalDeadline = WEDDING_INFO.confirmation.deadline;
  let queryParams: BehaviorSubject<Record<string, string>>;
  let apiReads: Observable<InvitationInfoResponse>[];

  function setDeadline(deadline: string): void {
    (WEDDING_INFO.confirmation as { deadline: string }).deadline = deadline;
  }

  async function createPage(token = 'TOKEN'): Promise<ComponentFixture<Model02PageComponent>> {
    queryParams = new BehaviorSubject<Record<string, string>>({ token });
    const api: InvitationApi = {
      getInvitationInfo: () => apiReads.shift() ?? of(invitation('PENDING', token)),
      acceptInvitation: () => of({ success: true, data: null }),
      declineInvitation: () => of({ success: true, data: null }),
    };

    TestBed.configureTestingModule({
      imports: [Model02PageComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { queryParams } },
        InvitationStateService,
        { provide: INVITATION_API, useValue: api },
        ModalFlowService,
        { provide: ConfirmationGuideStore, useValue: new GuideStore() },
      ],
    });
    TestBed.overrideComponent(Model02PageComponent, {
      set: { imports: [], template: '' },
    });
    await TestBed.compileComponents();
    spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);

    const fixture = TestBed.createComponent(Model02PageComponent);
    fixture.detectChanges();
    return fixture;
  }

  afterEach(() => {
    setDeadline(originalDeadline);
  });

  it('navigates to the expired page when the deadline has passed', async () => {
    setDeadline('2000-01-01T00:00:00-05:00');
    apiReads = [of(invitation('PENDING', 'TOKEN'))];

    await createPage();

    expect(TestBed.inject(Router).navigate).toHaveBeenCalledWith(['/expired'], {
      queryParamsHandling: 'preserve',
      replaceUrl: true,
    });
  });

  it('does not show the confirmation guide when the invitation was already answered', async () => {
    apiReads = [of(invitation('ACCEPTED', 'TOKEN'))];
    const fixture = await createPage();

    TestBed.inject(ModalFlowService).emitWelcomeModalAccepted();

    expect(fixture.componentInstance.showConfirmationGuide).toBeFalse();
    expect(TestBed.inject(Router).navigate).not.toHaveBeenCalled();
  });

  it('ignores a slower response when the token changes', async () => {
    const first = deferredInvitation();
    const second = deferredInvitation();
    apiReads = [first.stream, second.stream];
    const fixture = await createPage('TOKEN_A');
    const state = TestBed.inject(InvitationStateService);

    queryParams.next({ token: 'TOKEN_B' });
    first.emit(invitation('PENDING', 'TOKEN_A'));
    expect(state.getInvitationData()).toBeNull();

    second.emit(invitation('ACCEPTED', 'TOKEN_B'));

    expect(state.getToken()).toBe('TOKEN_B');
    expect(fixture.componentInstance.showConfirmationGuide).toBeFalse();
  });
});
