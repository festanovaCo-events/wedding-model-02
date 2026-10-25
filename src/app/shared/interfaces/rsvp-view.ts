import { InvitationInfoResponse } from './invitation.interface';

export interface RsvpView {
  invitationData: InvitationInfoResponse | null;
  error: string | null;
  isConfirmed: boolean;
  isDeclined: boolean;
}
