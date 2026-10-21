import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_MOCK_FLAGS } from '../constants/api-mock-flags';
import {
  AcceptInvitationResponse,
  DeclineInvitationResponse,
  InvitationInfoResponse,
} from '../interfaces/invitation.interface';
import { InvitationMockApiService } from '../mocks/invitation-mock-api.service';
import { HttpInvitationApi } from './http-invitation-api.service';
import { InvitationApi } from './invitation-api';

@Injectable({ providedIn: 'root' })
export class RoutedInvitationApi implements InvitationApi {
  constructor(
    private httpApi: HttpInvitationApi,
    private mockApi: InvitationMockApiService,
  ) {}

  getInvitationInfo(invitationToken: string): Observable<InvitationInfoResponse> {
    const api = this.apiFor(API_MOCK_FLAGS.invitation.getInfo);
    return api.getInvitationInfo(invitationToken);
  }

  acceptInvitation(
    invitationToken: string,
    guestNames: string[],
  ): Observable<AcceptInvitationResponse> {
    const api = this.apiFor(API_MOCK_FLAGS.invitation.accept);
    return api.acceptInvitation(invitationToken, guestNames);
  }

  declineInvitation(invitationToken: string): Observable<DeclineInvitationResponse> {
    const api = this.apiFor(API_MOCK_FLAGS.invitation.decline);
    return api.declineInvitation(invitationToken);
  }

  private apiFor(useMock: boolean): InvitationApi {
    return useMock ? this.mockApi : this.httpApi;
  }
}
