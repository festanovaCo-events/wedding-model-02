/**
 * Interfaces para la respuesta del endpoint de información de invitación
 */

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export interface InvitationStatusView {
  isAccepted: boolean;
  isDeclined: boolean;
  hasResponded: boolean;
}

export function invitationStatusView(
  status: InvitationStatus | null | undefined,
): InvitationStatusView {
  switch (status) {
    case 'ACCEPTED':
      return { isAccepted: true, isDeclined: false, hasResponded: true };
    case 'DECLINED':
      return { isAccepted: false, isDeclined: true, hasResponded: true };
    case 'PENDING':
    case null:
    case undefined:
      return { isAccepted: false, isDeclined: false, hasResponded: false };
    default: {
      const unexpectedStatus: never = status;
      return unexpectedStatus;
    }
  }
}

export function hasResponded(status: InvitationStatus | null | undefined): boolean {
  return invitationStatusView(status).hasResponded;
}

export interface Guest {
  id: string;
  name: string;
}

export interface Invitation {
  id: string;
  name: string;
  status: InvitationStatus;
  seats_reserved: number;
  guests: Guest[];
  event_id?: string;
  token?: string;
  email?: string;
  responded_at?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface InvitationInfoResponse {
  success: boolean;
  data: {
    invitation: Invitation;
    available_seats: number;
    used_seats: number;
    total_seats: number;
  };
}

export interface AcceptInvitationRequest {
  guest_names: string[];
}

export interface AcceptInvitationResponse {
  success: boolean;
  data: null;
}

export interface DeclineInvitationResponse {
  success: boolean;
  data: null;
}