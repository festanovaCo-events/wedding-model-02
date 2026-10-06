import { TestBed } from '@angular/core/testing';
import { InvitationMockApiService } from '../mocks/invitation-mock-api.service';
import { INVITATION_API } from './invitation-api';
import { InvitationStateService, MissingInvitationTokenError } from './invitation-state.service';

describe('InvitationStateService', () => {
  let service: InvitationStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InvitationStateService,
        { provide: INVITATION_API, useExisting: InvitationMockApiService },
      ],
    });

    service = TestBed.inject(InvitationStateService);
    TestBed.inject(InvitationMockApiService).reset();
  });

  it('loads an invitation and exposes its token', (done) => {
    service.load('TOKEN_TEST').subscribe((response) => {
      expect(response.data.invitation.status).toBe('PENDING');
      expect(service.getToken()).toBe('TOKEN_TEST');
      expect(service.isConfirmed()).toBeFalse();
      done();
    });
  });

  it('reuses the invitation already loaded for the same token', (done) => {
    service.load('TOKEN_TEST').subscribe((first) => {
      service.load('TOKEN_TEST').subscribe((second) => {
        expect(second).toBe(first);
        done();
      });
    });
  });

  it('marks the invitation as accepted after registering guests', (done) => {
    service.load('TOKEN_TEST').subscribe(() => {
      service.accept(['Jorge Mestre', 'Invitado Demo']).subscribe(() => {
        const data = service.getInvitationData();
        expect(data?.data.invitation.status).toBe('ACCEPTED');
        expect(data?.data.invitation.guests).toEqual([
          { id: 'mock-guest-1', name: 'Jorge Mestre' },
          { id: 'mock-guest-2', name: 'Invitado Demo' },
        ]);
        expect(service.isConfirmed()).toBeTrue();
        done();
      });
    });
  });

  it('marks the invitation as declined', (done) => {
    service.load('TOKEN_TEST').subscribe(() => {
      service.decline().subscribe(() => {
        expect(service.getInvitationData()?.data.invitation.status).toBe('DECLINED');
        expect(service.getInvitationData()?.data.invitation.guests).toEqual([]);
        done();
      });
    });
  });

  it('rejects accept when there is no loaded invitation', (done) => {
    service.accept(['Ana']).subscribe({
      next: () => done.fail('accept should fail without a token'),
      error: (error: unknown) => {
        expect(error).toBeInstanceOf(MissingInvitationTokenError);
        done();
      },
    });
  });
});
