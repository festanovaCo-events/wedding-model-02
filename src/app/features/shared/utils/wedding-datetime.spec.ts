import { WEDDING_INFO } from '../constants/wedding-info';
import { MODEL_02_INFO } from '../../model-02/constants/model-02-info';
import {
  formatLongDate,
  formatModelTime,
  toGoogleCalendarStamp,
} from './wedding-datetime';

describe('wedding datetime', () => {
  const ceremonyStart = '2026-09-12T17:00:00-05:00';
  const partyStart = '2026-09-12T19:30:00-05:00';

  it('converts Cartagena local time to a Google Calendar stamp', () => {
    expect(toGoogleCalendarStamp(ceremonyStart)).toBe('20260912T220000Z');
    expect(toGoogleCalendarStamp(partyStart)).toBe('20260913T003000Z');
  });

  it('builds the confirmation deadline label from the deadline instant', () => {
    expect(formatLongDate('2026-11-20T23:59:59-05:00')).toBe('20 de noviembre de 2026');
    expect(WEDDING_INFO.confirmation.deadlineLabel).toBe('20 de noviembre de 2026');
  });

  it('derives the model 02 date and event times from the ceremony and party', () => {
    expect(formatModelTime(ceremonyStart)).toBe('5:00 PM');
    expect(formatModelTime(partyStart)).toBe('7:30 PM');
    expect(MODEL_02_INFO.date).toEqual({
      month: 'SEPTIEMBRE',
      dayOfWeek: 'SÁBADO',
      day: '12',
      year: '2026',
    });
    expect(MODEL_02_INFO.events.ceremony.time).toBe('5:00 PM');
    expect(MODEL_02_INFO.events.reception.time).toBe('7:30 PM');
    expect(MODEL_02_INFO.events.ceremony.place).toBe(WEDDING_INFO.events.ceremony.place);
  });

  it('builds calendar and instagram links from the couple and the event times', () => {
    expect(WEDDING_INFO.events.ceremony.calendarUrl).toContain('20260912T220000Z');
    expect(WEDDING_INFO.events.ceremony.calendarUrl).toContain('Boda+de+Jorge+y+Yina');
    expect(WEDDING_INFO.events.party.calendarUrl).toContain('20260913T003000Z/20260913T040000Z');
    expect(WEDDING_INFO.couple.hashtag).toBe('#Jorge&Yina');
    expect(WEDDING_INFO.sections.instagram.hashtag).toBe(WEDDING_INFO.couple.hashtag);
    expect(WEDDING_INFO.sections.instagram.url).toBe(
      'https://www.instagram.com/explore/tags/Jorge%26Yina/',
    );
  });
});
