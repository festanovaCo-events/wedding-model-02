import { GuestList } from './guest-list';
import { InvitationInfoResponse } from '../interfaces/invitation.interface';

function invitation(overrides?: Partial<InvitationInfoResponse['data']>): InvitationInfoResponse {
  return {
    success: true,
    data: {
      available_seats: 2,
      used_seats: 1,
      total_seats: 2,
      invitation: {
        id: 'invitation-1',
        name: 'Jorge Mestre',
        status: 'PENDING',
        seats_reserved: 2,
        guests: [{ id: 'guest-1', name: 'Jorge Mestre' }],
      },
      ...overrides,
    },
  };
}

describe('GuestList', () => {
  it('keeps the host and ignores a duplicated host guest', () => {
    const list = GuestList.fromInvitation(invitation());

    expect(list.hostName).toBe('Jorge Mestre');
    expect(list.names).toEqual(['Jorge Mestre']);
    expect(list.canAddMore).toBeTrue();
  });

  it('adds a guest until the seat limit and blocks duplicates', () => {
    const initial = GuestList.fromInvitation(invitation());
    const withGuest = initial.add('  Invitado Demo  ');
    const duplicate = withGuest.add('Invitado Demo');
    const overLimit = withGuest.add('Otro');

    expect(withGuest.names).toEqual(['Jorge Mestre', 'Invitado Demo']);
    expect(duplicate).toBe(withGuest);
    expect(overLimit).toBe(withGuest);
    expect(withGuest.isPartial).toBeFalse();
  });

  it('does not remove the host', () => {
    const list = GuestList.fromInvitation(invitation()).add('Invitado Demo');

    expect(list.removeAt(0).names).toEqual(['Jorge Mestre', 'Invitado Demo']);
    expect(list.removeAt(1).names).toEqual(['Jorge Mestre']);
  });

  it('describes a partial registration', () => {
    const list = GuestList.fromInvitation(invitation());

    expect(list.isPartial).toBeTrue();
    expect(list.partialMessage).toBe('Solo estás registrando 1 de 2 cupos.');
  });
});
