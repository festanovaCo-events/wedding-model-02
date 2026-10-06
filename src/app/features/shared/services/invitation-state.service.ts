import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { INVITATION_MESSAGES } from '../constants/invitation-messages';
import {
  AcceptInvitationResponse,
  DeclineInvitationResponse,
  InvitationInfoResponse,
  InvitationStatus,
} from '../interfaces/invitation.interface';
import { INVITATION_API, InvitationApi } from './invitation-api';

export class MissingInvitationTokenError extends Error {
  constructor() {
    super(INVITATION_MESSAGES.missingToken);
    this.name = 'MissingInvitationTokenError';
  }
}

@Injectable({ providedIn: 'root' })
export class InvitationStateService {
  private readonly invitationDataSubject = new BehaviorSubject<InvitationInfoResponse | null>(null);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  readonly invitationData$ = this.invitationDataSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();
  readonly status$: Observable<InvitationStatus | null> = this.invitationData$.pipe(
    map((data) => data?.data.invitation.status ?? null),
  );
  readonly seatsReserved$: Observable<number | null> = this.invitationData$.pipe(
    map((data) => data?.data.invitation.seats_reserved ?? null),
  );
  readonly hostName$: Observable<string | null> = this.invitationData$.pipe(
    map((data) => data?.data.invitation.name ?? null),
  );

  constructor(@Inject(INVITATION_API) private invitationApi: InvitationApi) {}

  getInvitationData(): InvitationInfoResponse | null {
    return this.invitationDataSubject.value;
  }

  getError(): string | null {
    return this.errorSubject.value;
  }

  getToken(): string | null {
    return this.invitationDataSubject.value?.data.invitation.token || null;
  }

  isConfirmed(): boolean {
    return this.invitationDataSubject.value?.data.invitation.status === 'ACCEPTED';
  }

  load(invitationToken: string, options?: { force?: boolean }): Observable<InvitationInfoResponse> {
    const current = this.invitationDataSubject.value;
    if (!options?.force && current?.data.invitation.token === invitationToken) {
      return of(current);
    }

    this.errorSubject.next(null);

    return this.read(invitationToken).pipe(
      catchError((error: unknown) => {
        this.errorSubject.next(INVITATION_MESSAGES.loadError);
        return throwError(() => error);
      }),
    );
  }

  accept(guestNames: string[]): Observable<AcceptInvitationResponse> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new MissingInvitationTokenError());
    }

    return this.invitationApi.acceptInvitation(token, guestNames).pipe(
      switchMap((response) =>
        this.read(token).pipe(
          map(() => response),
          catchError(() => of(response)),
        ),
      ),
    );
  }

  decline(): Observable<DeclineInvitationResponse> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new MissingInvitationTokenError());
    }

    return this.invitationApi.declineInvitation(token).pipe(
      switchMap((response) =>
        this.read(token).pipe(
          map(() => response),
          catchError(() => of(response)),
        ),
      ),
    );
  }

  private read(invitationToken: string): Observable<InvitationInfoResponse> {
    this.loadingSubject.next(true);

    return this.invitationApi.getInvitationInfo(invitationToken).pipe(
      tap((response) => {
        this.invitationDataSubject.next(response);
        this.loadingSubject.next(false);
      }),
      catchError((error: unknown) => {
        this.loadingSubject.next(false);
        return throwError(() => error);
      }),
    );
  }
}
