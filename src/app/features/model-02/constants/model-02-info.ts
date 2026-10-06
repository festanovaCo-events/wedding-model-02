import { WEDDING_INFO } from '../../shared/constants/wedding-info';
import { formatModelDate, formatModelTime } from '../../shared/utils/wedding-datetime';

const ceremony = WEDDING_INFO.events.ceremony;
const party = WEDDING_INFO.events.party;

export const MODEL_02_INFO = {
  monogram: {
    letter1: WEDDING_INFO.couple.husbandName.charAt(0).toUpperCase(),
    letter2: WEDDING_INFO.couple.wifeName.charAt(0).toUpperCase(),
    subtitle: 'NUESTRA BODA',
  },

  quote: {
    lines: [
      'POR ENCIMA DE TODO,',
      'VÍSTANSE DE AMOR,',
      'QUE ES EL VÍNCULO PERFECTO.',
    ],
    reference: 'COL. 3:14-15',
  },

  invitation: {
    intro: 'CON NUESTRO AMOR, LA BENDICIÓN DE DIOS Y LA DE NUESTROS PADRES',
    groomParents: 'JORGE MESTRE Y CARMEN CASTRO',
    brideParents: 'LUIS HERRERA Y ANA SOFÍA RUIZ',
    weLabel: 'NOSOTROS',
    cta: 'TENEMOS EL HONOR DE INVITARTE A NUESTRA BODA',
  },

  date: formatModelDate(ceremony.startsAt),

  events: {
    ceremony: {
      title: 'CEREMONIA RELIGIOSA',
      time: formatModelTime(ceremony.startsAt),
      place: ceremony.place,
      address: ceremony.address,
      mapsUrl: ceremony.mapsUrl,
    },
    reception: {
      title: 'RECEPCIÓN',
      time: formatModelTime(party.startsAt),
      place: party.place,
      address: party.address,
      mapsUrl: party.mapsUrl,
    },
  },

  timeline: [
    { time: formatModelTime(ceremony.startsAt), label: 'Iglesia', icon: 'church' },
    { time: '6:30 PM', label: 'Coctel de bienvenida', icon: 'cocktail' },
    { time: '7:45 PM', label: 'Entrada de novios', icon: 'fireworks' },
    { time: '8:00 PM', label: 'Banquete', icon: 'dinner' },
    { time: '9:00 PM', label: 'Fiesta', icon: 'party' },
    { time: '3:30 AM', label: 'Despedida', icon: 'clock' },
  ],

  passes: {
    label: 'PASES',
    reservedLabel: 'TENEMOS RESERVADOS',
    forYou: 'PARA TI',
    suffix: 'LUGARES',
  },

  gifts: {
    title: 'SUGERENCIA DE REGALO',
    description:
      'SI DESEAN HACERNOS UN PRESENTE, PUEDEN AYUDARNOS EN NUESTRO SUEÑO DE COMPRAR UNA CASA. ¡TODO SUMA!',
    note: 'LLUVIA DE SOBRES',
  },

  rsvp: {
    title: 'CONFIRMACIÓN',
    text: 'AGRADECEMOS QUE CONFIRMES TU ASISTENCIA ANTES DEL',
    buttonText: 'CONFIRMAR ASISTENCIA',
  },

  adultsOnly: {
    text: 'ADORAMOS A SUS HIJOS, PERO CREEMOS QUE NECESITAN UNA NOCHE LIBRE.',
    emphasis: 'SÓLO ADULTOS, POR FAVOR',
  },

  closing: {
    line1: 'ESPERAMOS CONTAR CON SU PRESENCIA',
    line2: 'MUCHAS GRACIAS',
  },

  images: {
    hero: 'assets/images/model-02/hero.png',
    footer: 'assets/images/model-02/footer.png',
  },

  assets: {
    eucalyptus: 'assets/images/model-02/eucalyptus.png',
    eucalyptusInvite: 'assets/images/model-02/eucalyptus-invite.png',
  },
};
