import { shouldShowExpiredInvitationPage } from './confirmation-deadline';

const beforeDeadline = new Date('2026-10-11T12:00:00-05:00');
const afterDeadline = new Date('2026-11-21T00:00:00-05:00');

describe('shouldShowExpiredInvitationPage', () => {
  it('hides a pending invitation after the deadline', () => {
    expect(shouldShowExpiredInvitationPage('PENDING', afterDeadline)).toBeTrue();
  });

  it('hides a declined invitation after the deadline', () => {
    expect(shouldShowExpiredInvitationPage('DECLINED', afterDeadline)).toBeTrue();
  });

  it('keeps an accepted invitation visible after the deadline', () => {
    expect(shouldShowExpiredInvitationPage('ACCEPTED', afterDeadline)).toBeFalse();
  });

  it('keeps a pending invitation visible before the deadline', () => {
    expect(shouldShowExpiredInvitationPage('PENDING', beforeDeadline)).toBeFalse();
  });
});
