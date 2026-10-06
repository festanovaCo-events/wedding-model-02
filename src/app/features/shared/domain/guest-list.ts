import { InvitationInfoResponse } from '../interfaces/invitation.interface';

const DEFAULT_SEAT_LIMIT = 7;

export class GuestList {
  private constructor(
    readonly hostName: string,
    readonly maximumSeats: number,
    readonly names: readonly string[],
  ) {}

  static empty(): GuestList {
    return new GuestList('', DEFAULT_SEAT_LIMIT, []);
  }

  static fromInvitation(data: InvitationInfoResponse): GuestList {
    const hostName = data.data.invitation.name || '';
    const maximumSeats = data.data.available_seats ?? DEFAULT_SEAT_LIMIT;
    const names = hostName ? [hostName] : [];

    for (const guest of data.data.invitation.guests ?? []) {
      if (guest.name !== hostName && !names.includes(guest.name)) {
        names.push(guest.name);
      }
    }

    return new GuestList(hostName, maximumSeats, names);
  }

  get additionalGuests(): readonly string[] {
    return this.names.filter((name) => name !== this.hostName);
  }

  get canAddMore(): boolean {
    return this.additionalGuests.length < Math.max(this.maximumSeats - 1, 0);
  }

  get isPartial(): boolean {
    return this.names.length < this.maximumSeats;
  }

  get partialMessage(): string {
    return `Solo estás registrando ${this.names.length} de ${this.maximumSeats} cupos.`;
  }

  add(rawName: string): GuestList {
    const name = rawName.trim();
    if (!name || !this.canAddMore || this.names.includes(name) || name === this.hostName) {
      return this;
    }

    return new GuestList(this.hostName, this.maximumSeats, [...this.names, name]);
  }

  removeAt(index: number): GuestList {
    const name = this.names[index];
    if (!name || name === this.hostName) {
      return this;
    }

    return new GuestList(
      this.hostName,
      this.maximumSeats,
      this.names.filter((_, currentIndex) => currentIndex !== index),
    );
  }

  withHostOnly(): GuestList {
    return new GuestList(this.hostName, this.maximumSeats, this.hostName ? [this.hostName] : []);
  }

  toGuestNames(): string[] {
    return [...this.names];
  }
}
