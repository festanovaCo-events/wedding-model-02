import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AcceptInvitationResponse,
  DeclineInvitationResponse,
  InvitationInfoResponse,
} from '../interfaces/invitation.interface';

export interface InvitationApi {
  getInvitationInfo(invitationToken: string): Observable<InvitationInfoResponse>;
  acceptInvitation(
    invitationToken: string,
    guestNames: string[],
  ): Observable<AcceptInvitationResponse>;
  declineInvitation(invitationToken: string): Observable<DeclineInvitationResponse>;
}

export const INVITATION_API = new InjectionToken<InvitationApi>('INVITATION_API');
