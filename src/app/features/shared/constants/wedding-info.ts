import { ACTIVE_THEME } from '../themes/active-theme';
import {
  buildGoogleCalendarUrl,
  formatBannerDate,
  formatEventDateLabel,
  formatLongDate,
  instagramExploreUrl,
  toGoogleCalendarStamp,
} from '../utils/wedding-datetime';

const HUSBAND_NAME = 'Jorge';
const WIFE_NAME = 'Yina';
const HASHTAG = `#${HUSBAND_NAME}&${WIFE_NAME}`;
const CALENDAR_DETAILS = '¡Acompáñanos a celebrar este momento especial!';

const CEREMONY_START = '2026-09-12T17:00:00-05:00';
const CEREMONY_END = '2026-09-12T18:00:00-05:00';
const PARTY_START = '2026-09-12T19:30:00-05:00';
const PARTY_END = '2026-09-12T23:00:00-05:00';
const CONFIRMATION_DEADLINE = '2026-11-20T23:59:59-05:00';

const CEREMONY_PLACE = 'Parroquia Cristo Sacerdote - Los Alpes';
const CEREMONY_ADDRESS = 'Tv. 73, Los Alpes, Cartagena de Indias, Bolívar';
const PARTY_PLACE = 'Los Alpes Social Hall';
const PARTY_ADDRESS = 'Tv. 74 #31C-59, Los Alpes, Cartagena de Indias, Bolívar';

function calendarUrl(title: string, startsAt: string, endsAt: string, location: string): string {
  return buildGoogleCalendarUrl({
    title: `Boda de ${HUSBAND_NAME} y ${WIFE_NAME} (${title})`,
    startsAt,
    endsAt,
    location,
    details: CALENDAR_DETAILS,
  });
}

export const WEDDING_INFO = {
  couple: {
    husbandName: HUSBAND_NAME,
    wifeName: WIFE_NAME,
    fullName: `${HUSBAND_NAME} & ${WIFE_NAME}`,
    hashtag: HASHTAG,
  },

  confirmation: {
    deadline: CONFIRMATION_DEADLINE,
    deadlineLabel: formatLongDate(CONFIRMATION_DEADLINE),
  },

  dates: {
    bannerDate: formatBannerDate(CEREMONY_START),
    weddingDate: CEREMONY_START,
    ceremonyDate: formatEventDateLabel(CEREMONY_START),
    partyDate: formatEventDateLabel(PARTY_START),
    ceremonyDateTimeISO: toGoogleCalendarStamp(CEREMONY_START),
    ceremonyEndDateTimeISO: toGoogleCalendarStamp(CEREMONY_END),
    partyDateTimeISO: toGoogleCalendarStamp(PARTY_START),
    partyEndDateTimeISO: toGoogleCalendarStamp(PARTY_END),
  },

  quote: {
    text: 'Por encima de todo,\nvistanse de amor, que es el vinculo perfecto.',
    openingQuoteImage: 'assets/images/banner-home/comilla-apertura.svg',
    closingQuoteImage: 'assets/images/banner-home/comilla-cierre.svg',
  },

  events: {
    ceremony: {
      title: 'Ceremonia',
      place: CEREMONY_PLACE,
      address: CEREMONY_ADDRESS,
      location: 'Tv.+73,+Los+Alpes,+Cartagena+de+Indias,+Bolívar',
      date: formatEventDateLabel(CEREMONY_START),
      startsAt: CEREMONY_START,
      endsAt: CEREMONY_END,
      animationKey: 'rings' as const,
      mapsUrl:
        'https://www.google.com/maps/place/Parroquia+Cristo+Sacerdote+-+Los+Alpes/@10.3966981,-75.4813256,17z/data=!3m1!4b1!4m6!3m5!1s0x8ef625caadc0d713:0x5c81f0948bd2590e!8m2!3d10.3966981!4d-75.4813256!16s%2Fg%2F1ydddld33?entry=ttu&g_ep=EgoyMDI2MDIxNy4wIKXMDSoASAFQAw%3D%3D',
      calendarUrl: calendarUrl('Ceremonia', CEREMONY_START, CEREMONY_END, `${CEREMONY_PLACE}, ${CEREMONY_ADDRESS}`),
    },
    party: {
      title: 'Fiesta',
      place: PARTY_PLACE,
      address: PARTY_ADDRESS,
      location: 'Tv.+74+%2331C-59,+Los+Alpes,+Cartagena+de+Indias,+Bolívar',
      date: formatEventDateLabel(PARTY_START),
      startsAt: PARTY_START,
      endsAt: PARTY_END,
      animationKey: 'party' as const,
      mapsUrl:
        'https://www.google.com/maps/place/LOS+ALPES+Social+Hall/data=!4m2!3m1!1s0x0:0x63d05aebcd7f42ff?sa=X&ved=1t:2428&ictx=111',
      calendarUrl: calendarUrl('Fiesta', PARTY_START, PARTY_END, `${PARTY_PLACE}, ${PARTY_ADDRESS}`),
    },
  },

  music: {
    url: ACTIVE_THEME.assets.music,
    volume: 0.3,
    loop: true,
  },

  assets: {
    bannerVideo: ACTIVE_THEME.assets.bannerVideo,
    bannerImage: ACTIVE_THEME.assets.bannerImage,
    backgroundImage: ACTIVE_THEME.assets.decorations.eventScheduleLines,
    instagramBackground: ACTIVE_THEME.assets.instagramBackground,
    portraits: [
      {
        publicId: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
        full: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
      },
      {
        publicId: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
        full: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80',
      },
      {
        publicId: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
        full: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=80',
      },
      {
        publicId: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80',
        full: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80',
      },
      {
        publicId: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80',
        full: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&q=80',
      },
      {
        publicId: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
        full: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
      },
      {
        publicId: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=800&q=80',
        full: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&q=80',
      },
    ],
  },

  animations: ACTIVE_THEME.animations,

  sections: {
    gifts: {
      title: 'Lluvia de sobres',
      description:
        'Sus buenos deseos son suficientes para nosotros y en caso de querer hacernos un regalito, este puede ser en efectivo',
    },
    instagram: {
      title: 'Compartimos este día junto a vos',
      description: 'Compartí tus fotos y videos de ese hermoso día',
      buttonText: 'Ver en Instagram',
      hashtag: HASHTAG,
      url: instagramExploreUrl(HASHTAG),
    },
    modals: {
      dressCode: {
        title: 'Elegante formal',
        description:
          'Queremos que cada uno de ustedes se sienta especial y luzca espectacular en nuestro dia tan especial.',
      },
      tipsAndNotes: {
        title: 'Tips y Notas',
        description:
          'Se reserva el color blanco (en todas sus tonalidades) para el vestido de novia. No olvides confirmar tu asistencia.',
      },
    },
    instructions: {
      cards: [
        {
          title: 'Música',
          descriptionLines: ['Una orientación para', 'tu vestuario'],
          path: 'assets/animations/sounds.json',
          label: 'Sugerir canción',
        },
        {
          title: 'Vestuario',
          descriptionLines: ['Una orientación para', 'tu vestuario'],
          path: 'assets/animations/dress.json',
          label: 'Ver más',
        },
        {
          title: 'Tips y Notas',
          descriptionLines: ['Una orientación para', 'tu vestuario'],
          path: 'assets/animations/tips.json',
          label: 'Información',
        },
      ],
    },
  },
};
