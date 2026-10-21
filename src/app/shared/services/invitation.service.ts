import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AcceptInvitationResponse,
  DeclineInvitationResponse,
  InvitationInfoResponse,
} from '../interfaces/invitation.interface';
import { INVITATION_API, InvitationApi } from './invitation-api';

@Injectable({ providedIn: 'root' })
export class InvitationService {
  constructor(@Inject(INVITATION_API) private invitationApi: InvitationApi) {}

  getInvitationInfo(invitationToken: string): Observable<InvitationInfoResponse> {
    return this.invitationApi.getInvitationInfo(invitationToken);
  }

  acceptInvitation(
    invitationToken: string,
    guestNames: string[],
  ): Observable<AcceptInvitationResponse> {
    return this.invitationApi.acceptInvitation(invitationToken, guestNames);
  }

  declineInvitation(invitationToken: string): Observable<DeclineInvitationResponse> {
    return this.invitationApi.declineInvitation(invitationToken);
  }
}
