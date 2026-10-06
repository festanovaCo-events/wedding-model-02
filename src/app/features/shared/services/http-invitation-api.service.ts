import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { API_ROUTES } from '../constants/api-routes';
import {
  AcceptInvitationRequest,
  AcceptInvitationResponse,
  DeclineInvitationResponse,
  InvitationInfoResponse,
} from '../interfaces/invitation.interface';
import { InvitationApi } from './invitation-api';

@Injectable({ providedIn: 'root' })
export class HttpInvitationApi implements InvitationApi {
  constructor(private http: HttpClient) {}

  getInvitationInfo(invitationToken: string): Observable<InvitationInfoResponse> {
    const url = `${environment.apiBaseUrl}${API_ROUTES.invitation.getInfo(invitationToken)}`;
    return this.http.get<InvitationInfoResponse>(url);
  }

  acceptInvitation(
    invitationToken: string,
    guestNames: string[],
  ): Observable<AcceptInvitationResponse> {
    const url = `${environment.apiBaseUrl}${API_ROUTES.invitation.accept(invitationToken)}`;
    const body: AcceptInvitationRequest = { guest_names: guestNames };
    return this.http.post<AcceptInvitationResponse>(url, body);
  }

  declineInvitation(invitationToken: string): Observable<DeclineInvitationResponse> {
    const url = `${environment.apiBaseUrl}${API_ROUTES.invitation.decline(invitationToken)}`;
    return this.http.get<DeclineInvitationResponse>(url);
  }
}
