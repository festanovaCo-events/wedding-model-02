const TIME_ZONE = 'America/Bogota';

interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: string;
  monthName: string;
}

export function readZonedParts(iso: string): ZonedParts {
  const date = new Date(iso);
  const values = new Map(
    new Intl.DateTimeFormat('es-CO', {
      timeZone: TIME_ZONE,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      weekday: 'long',
    })
      .formatToParts(date)
      .map((part) => [part.type, part.value]),
  );

  return {
    year: Number(values.get('year')),
    month: Number(
      new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, month: 'numeric' }).format(date),
    ),
    day: Number(values.get('day')),
    hour: Number(values.get('hour')),
    minute: Number(values.get('minute')),
    weekday: values.get('weekday') ?? '',
    monthName: values.get('month') ?? '',
  };
}

export function toGoogleCalendarStamp(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

export function formatLongDate(iso: string): string {
  const parts = readZonedParts(iso);
  return `${parts.day} de ${parts.monthName} de ${parts.year}`;
}

export function formatEventDateLabel(iso: string): string {
  const parts = readZonedParts(iso);
  const hour = String(parts.hour).padStart(2, '0');
  const minute = String(parts.minute).padStart(2, '0');
  return `${capitalize(parts.weekday)} ${parts.day} de ${capitalize(parts.monthName)} - ${hour}:${minute}`;
}

export function formatBannerDate(iso: string): string {
  const parts = readZonedParts(iso);
  const day = String(parts.day).padStart(2, '0');
  const month = String(parts.month).padStart(2, '0');
  return `${day}.${month}.${parts.year}`;
}

export function formatModelDate(iso: string): {
  month: string;
  dayOfWeek: string;
  day: string;
  year: string;
} {
  const parts = readZonedParts(iso);
  return {
    month: parts.monthName.toLocaleUpperCase('es-CO'),
    dayOfWeek: parts.weekday.toLocaleUpperCase('es-CO'),
    day: String(parts.day),
    year: String(parts.year),
  };
}

export function formatModelTime(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso));
}

export function buildGoogleCalendarUrl(input: {
  title: string;
  startsAt: string;
  endsAt: string;
  location: string;
  details: string;
}): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: input.title,
    dates: `${toGoogleCalendarStamp(input.startsAt)}/${toGoogleCalendarStamp(input.endsAt)}`,
    details: input.details,
    location: input.location,
    sf: 'true',
    output: 'xml',
  });

  return `https://calendar.google.com/calendar/render?${params.toString().replace('%2F', '/')}`;
}

export function instagramExploreUrl(hashtag: string): string {
  const tag = hashtag.startsWith('#') ? hashtag.slice(1) : hashtag;
  return `https://www.instagram.com/explore/tags/${encodeURIComponent(tag)}/`;
}

function capitalize(value: string): string {
  if (!value) {
    return value;
  }
  return value.charAt(0).toLocaleUpperCase('es-CO') + value.slice(1);
}
