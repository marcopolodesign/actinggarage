export type CtaMode = 'whatsappOnly' | 'whatsappPlusInlineForm';

export type CourseStat = {
  label: string;
  value: string;
};

export type CourseSection = {
  id: 'why' | 'program' | 'included' | 'faqs' | 'weeks';
  title: string;
  body: string[];
};

export type CourseSeo = {
  title: string;
  description: string;
  canonicalPath: string;
};

export type CourseConfig = {
  slug: string;
  courseName: string; // human-readable, used for WhatsApp + lead "course"
  eyebrow: string; // small top label
  heroTitleLines: string[]; // big title split in lines
  heroQuote?: string; // e.g. "EL ACTOR HONESTO"
  heroDescription?: string;
  heroBgImage?: string; // public path
  heroBgOverlayClassName?: string; // tailwind overlay e.g. bg-black/60
  youtubeId?: string;
  ctaMode: CtaMode;
  whatsAppLabel?: string; // overrides courseName in WA message
  whatsAppExtra?: string; // e.g. "(13-17 años)"
  inlineFormSource?: string; // supabase `source`
  inlineFormDefaultInterest?: string;
  stats: CourseStat[];
  sections: CourseSection[];
  seo: CourseSeo;
};

const headerBg = '/content/cursos-header.jpg';
const overlay = 'bg-black/60';

export const coursesConfig: Record<string, CourseConfig> = {
  'garage-pro': {
    slug: 'garage-pro',
    courseName: 'Garage Pro',
    eyebrow: 'Formación Anual · Garage',
    heroTitleLines: ['GARAGE', 'PRO'],
    heroQuote: '"EL ACTOR HONESTO"',
    heroDescription:
      'Programa profesional de interpretación. Técnica + gestión emocional: herramientas tangibles para construir una carrera real.',
    heroBgImage: headerBg,
    heroBgOverlayClassName: overlay,
    ctaMode: 'whatsappPlusInlineForm',
    inlineFormSource: 'cursos_garage_pro',
    inlineFormDefaultInterest: 'teatro-cine',
    stats: [
      { label: 'Duración', value: '3 años' },
      { label: 'Inicio', value: '14 sep 2026' },
      { label: 'Horario', value: 'Lun–Jue 10:00–14:00' },
      { label: 'Carga', value: '16h/semana' },
      { label: 'Grupo', value: 'Máx. 14 alumnos' },
    ],
    sections: [
      {
        id: 'why',
        title: '¿Por qué TAG?',
        body: [
          'Creemos que la técnica es el 50% de esta profesión. El otro 50% es aprender a gestionar nervios, ansiedad, miedos y el constante “no”.',
          'No creemos en gurús ni en “venta de humo”. Creemos en herramientas tangibles y prácticas adaptadas al proceso de cada actor.',
        ],
      },
      {
        id: 'program',
        title: 'Estructura del programa',
        body: [
          'Curso 2026/2027: 14 sep 2026 → 18 jun 2027 (dos cuatrimestres).',
          'Viernes: ensayos y materias extra (según calendario).',
          'Incluye: fotos profesionales, bolsa de casting, material grabado, masterclasses, aulas de ensayo, descuentos culturales.',
        ],
      },
    ],
    seo: {
      title: 'Garage Pro — Programa Profesional de Interpretación | TAG',
      description:
        'Programa profesional de interpretación de 3 años en TAG. Técnica, cámara, cuerpo, voz y gestión emocional. Inicio 14 septiembre 2026.',
      canonicalPath: '/cursos/garage-pro',
    },
  },

  'garage-theatre': {
    slug: 'garage-theatre',
    courseName: 'Garage Theatre',
    eyebrow: 'Formación Anual · Teatro',
    heroTitleLines: ['GARAGE', 'THEATRE'],
    heroQuote: '"EL ACTOR HONESTO"',
    heroDescription:
      'Interpretación teatral para construir técnica, presencia y criterio. Recorrido progresivo en 3 años.',
    heroBgImage: headerBg,
    heroBgOverlayClassName: overlay,
    ctaMode: 'whatsappPlusInlineForm',
    inlineFormSource: 'cursos_garage_theatre',
    inlineFormDefaultInterest: 'teatro',
    stats: [
      { label: 'Duración', value: '3 años' },
      { label: 'Inicio', value: '14 sep 2026' },
      { label: 'Formato', value: '2h/semana' },
      { label: 'Grupo', value: 'Máx. 12 alumnos' },
    ],
    sections: [
      {
        id: 'program',
        title: 'Estructura del programa',
        body: [
          'Curso 2026/2027: 14 sep 2026 → 18 jun 2027 (dos cuatrimestres).',
          'Incluye: fotos profesionales, bolsa de casting, masterclasses, aulas de ensayo, descuentos culturales.',
          'Al finalizar los 3 años pasarás a ser miembro de la compañía TAG.',
        ],
      },
    ],
    seo: {
      title: 'Garage Theatre — Interpretación Teatral | TAG',
      description:
        'Curso anual de interpretación teatral en TAG. Formación de 3 años, grupos reducidos y profesorado en activo. Inicio septiembre 2026.',
      canonicalPath: '/cursos/garage-theatre',
    },
  },

  'garage-cinema': {
    slug: 'garage-cinema',
    courseName: 'Garage Cinema',
    eyebrow: 'Formación Anual · Cámara',
    heroTitleLines: ['GARAGE', 'CINEMA'],
    heroQuote: '"EL ACTOR HONESTO"',
    heroDescription:
      'Interpretación para cámara: herramientas específicas para el audiovisual, rodajes durante el curso y material grabado en cada clase.',
    heroBgImage: headerBg,
    heroBgOverlayClassName: overlay,
    ctaMode: 'whatsappPlusInlineForm',
    inlineFormSource: 'cursos_garage_cinema',
    inlineFormDefaultInterest: 'cine',
    stats: [
      { label: 'Duración', value: '3 años' },
      { label: 'Inicio', value: '14 sep 2026' },
      { label: 'Formato', value: '2h/semana' },
      { label: 'Grupo', value: 'Máx. 12 alumnos' },
      { label: 'Rodajes', value: 'Monólogo + escena pareja' },
    ],
    sections: [
      {
        id: 'program',
        title: 'Estructura del programa',
        body: [
          'Curso 2026/2027: 14 sep 2026 → 18 jun 2027 (dos cuatrimestres).',
          'Incluye: fotos profesionales, bolsa de casting, material grabado en cada clase, masterclasses, aulas de ensayo, descuentos culturales.',
          'Rodajes: monólogo (Q1) y escena en pareja (Q2).',
        ],
      },
    ],
    seo: {
      title: 'Garage Cinema — Interpretación para Cámara | TAG',
      description:
        'Curso anual de actuación para cámara en TAG. Formación de 3 años con rodajes, material grabado y grupos reducidos. Inicio septiembre 2026.',
      canonicalPath: '/cursos/garage-cinema',
    },
  },

  'garage-hybrid': {
    slug: 'garage-hybrid',
    courseName: 'Garage Hybrid',
    eyebrow: 'Formación Anual · Teatro + Cámara',
    heroTitleLines: ['GARAGE', 'HYBRID'],
    heroQuote: '"EL ACTOR HONESTO"',
    heroDescription: 'Cámara + Teatro. Un solo camino para desarrollar versatilidad y criterio profesional.',
    heroBgImage: headerBg,
    heroBgOverlayClassName: overlay,
    ctaMode: 'whatsappPlusInlineForm',
    inlineFormSource: 'cursos_garage_hybrid',
    inlineFormDefaultInterest: 'teatro-cine',
    stats: [
      { label: 'Duración', value: '3 años' },
      { label: 'Inicio', value: '14 sep 2026' },
      { label: 'Formato', value: '4h/semana' },
      { label: 'Cámara', value: '2h/semana' },
      { label: 'Teatro', value: '2h/semana' },
      { label: 'Grupo', value: 'Máx. 12 alumnos' },
    ],
    sections: [
      {
        id: 'program',
        title: 'Estructura del programa',
        body: [
          'Curso 2026/2027: 14 sep 2026 → 18 jun 2027 (dos cuatrimestres).',
          'Incluye: fotos profesionales, bolsa de casting, material grabado, masterclasses, aulas de ensayo, descuentos culturales.',
          'Al finalizar los 3 años, pasarás a formar parte de la compañía TAG.',
        ],
      },
    ],
    seo: {
      title: 'Garage Hybrid — Teatro + Cámara | TAG',
      description:
        'Curso anual híbrido de teatro y cámara en TAG. 3 años, 4h semanales, rodajes y muestras. Inicio septiembre 2026.',
      canonicalPath: '/cursos/garage-hybrid',
    },
  },

  'garage-hybrid-plus': {
    slug: 'garage-hybrid-plus',
    courseName: 'Garage Hybrid Plus',
    eyebrow: 'Formación Anual · Cámara + Teatro + Canto + Impro',
    heroTitleLines: ['GARAGE', 'HYBRID PLUS'],
    heroQuote: '"EL ACTOR HONESTO"',
    heroDescription:
      'El programa de tardes más completo: cámara + teatro, con canto e improvisación para máxima versatilidad profesional.',
    heroBgImage: headerBg,
    heroBgOverlayClassName: overlay,
    ctaMode: 'whatsappPlusInlineForm',
    inlineFormSource: 'cursos_garage_hybrid_plus',
    inlineFormDefaultInterest: 'teatro-cine',
    stats: [
      { label: 'Duración', value: '3 años' },
      { label: 'Inicio', value: '14 sep 2026' },
      { label: 'Formato', value: '8h/semana' },
      { label: 'Cámara', value: '2h/semana' },
      { label: 'Teatro', value: '2h/semana' },
      { label: 'Canto', value: '2h/semana' },
      { label: 'Impro', value: '2h/semana' },
      { label: 'Grupo', value: 'Máx. 12 alumnos' },
    ],
    sections: [
      {
        id: 'why',
        title: '¿Qué es Hybrid Plus?',
        body: [
          'Combina interpretación para cámara y teatro, añadiendo formación en canto e improvisación/creación colectiva.',
          'Perfecto para actores que buscan una formación 360º y máxima versatilidad.',
        ],
      },
      {
        id: 'program',
        title: 'Estructura del programa',
        body: [
          'Curso 2026/2027: 14 sep 2026 → 18 jun 2027 (dos cuatrimestres).',
          'Incluye: fotos profesionales, bolsa de casting, material grabado, masterclasses, aulas de ensayo, descuentos culturales.',
          'Al finalizar la formación, pasarás a formar parte de la compañía TAG.',
        ],
      },
    ],
    seo: {
      title: 'Garage Hybrid Plus — Cámara, Teatro, Canto e Impro | TAG',
      description:
        'Hybrid Plus: programa anual de 3 años (8h/semana) con cámara, teatro, canto e improvisación. Inicio septiembre 2026.',
      canonicalPath: '/cursos/garage-hybrid-plus',
    },
  },

  'garage-mini-kids': {
    slug: 'garage-mini-kids',
    courseName: 'Garage Mini Kids',
    eyebrow: 'Curso Anual · 6–8 años',
    heroTitleLines: ['GARAGE', 'MINI KIDS'],
    heroQuote: '"EL JUEGO COMO HERRAMIENTA"',
    heroDescription: 'Teatro como juego, descubrimiento y expresión libre. Un espacio seguro para crecer.',
    heroBgImage: headerBg,
    heroBgOverlayClassName: overlay,
    ctaMode: 'whatsappOnly',
    whatsAppExtra: '(6-8 años)',
    stats: [
      { label: 'Edad', value: '6–8 años' },
      { label: 'Curso', value: '2026/2027' },
      { label: 'Inicio', value: '14 sep 2026' },
      { label: 'Formato', value: '1h30/semana' },
      { label: 'Grupo', value: 'Máx. 12' },
    ],
    sections: [
      {
        id: 'program',
        title: 'Estructura del programa',
        body: [
          'Cuatrimestres: 18 sep 2026 → 5 feb 2027 y 12 feb 2027 → 18 jun 2027.',
          'Muestras finales abiertas al público (grabadas y enviadas a las familias).',
        ],
      },
      {
        id: 'included',
        title: 'Incluido en el programa',
        body: [
          'Sesión de fotos profesionales.',
          'Acceso preferente y con descuento a masterclasses.',
          'Profesorado en activo.',
          'Aulas para ensayar y descuentos culturales.',
        ],
      },
    ],
    seo: {
      title: 'Garage Mini Kids — Teatro 6 a 8 años | TAG',
      description:
        'Teatro infantil para niños y niñas de 6 a 8 años en TAG. Juego, confianza, creatividad y muestras grabadas. Curso 2026/2027.',
      canonicalPath: '/cursos/garage-mini-kids',
    },
  },

  'garage-kids': {
    slug: 'garage-kids',
    courseName: 'Garage Kids',
    eyebrow: 'Curso · 9–11 años',
    heroTitleLines: ['GARAGE', 'KIDS'],
    heroQuote: '"DEL JUEGO A LA TÉCNICA"',
    heroDescription:
      'Entre 9 y 11 años es el momento ideal para profundizar de forma más técnica sin perder disfrute y creatividad.',
    heroBgImage: headerBg,
    heroBgOverlayClassName: overlay,
    ctaMode: 'whatsappOnly',
    whatsAppExtra: '(9-11 años)',
    stats: [
      { label: 'Edad', value: '9–11 años' },
      { label: 'Curso', value: '2026/2027' },
      { label: 'Formato', value: 'Viernes 18:00–20:00' },
      { label: 'Duración', value: '14 sesiones' },
      { label: 'Fin', value: '19 jun' },
      { label: 'Grupo', value: 'Máx. 12' },
    ],
    sections: [
      {
        id: 'program',
        title: 'Estructura del programa',
        body: [
          'Inicio: 6 de marzo · Fin: 19 de junio (14 sesiones).',
          'Bloques: fundamentos técnicos → construcción de personajes → montaje y muestra final (grabada).',
        ],
      },
      {
        id: 'included',
        title: 'Incluido en el programa',
        body: [
          'Sesión de fotos profesionales.',
          'Acceso preferente y con descuento a masterclasses.',
          'Profesorado en activo.',
          'Aulas para ensayar y descuentos culturales.',
        ],
      },
    ],
    seo: {
      title: 'Garage Kids — Teatro 9 a 11 años | TAG',
      description:
        'Teatro para chicos y chicas de 9 a 11 años en TAG. Del juego a la técnica, viernes 18–20h, muestra final grabada.',
      canonicalPath: '/cursos/garage-kids',
    },
  },

  'garage-new-generation': {
    slug: 'garage-new-generation',
    courseName: 'Garage New Generation',
    eyebrow: 'Curso Anual · 13–17 años',
    heroTitleLines: ['GARAGE NEW', 'GENERATION'],
    heroQuote: '"DEL JUEGO A LA IDENTIDAD ARTÍSTICA"',
    heroDescription:
      'Teatro para adolescentes: presencia, personaje, emoción y escena en un entorno seguro y exigente.',
    heroBgImage: headerBg,
    heroBgOverlayClassName: overlay,
    ctaMode: 'whatsappOnly',
    whatsAppExtra: '(13-17 años)',
    stats: [
      { label: 'Edad', value: '13–17 años' },
      { label: 'Curso', value: '2026/2027' },
      { label: 'Inicio', value: '14 sep 2026' },
      { label: 'Formato', value: '2h/semana' },
      { label: 'Grupo', value: 'Máx. 12' },
    ],
    sections: [
      {
        id: 'program',
        title: 'Estructura del programa',
        body: [
          'Cuatrimestres: 18 sep 2026 → 5 feb 2027 y 12 feb 2027 → 18 jun 2027.',
          'Muestras finales abiertas al público (grabadas y enviadas a las familias).',
        ],
      },
      {
        id: 'included',
        title: 'Incluido en el programa',
        body: [
          'Sesión de fotos profesionales.',
          'Bolsa de casting.',
          'Acceso preferente y con descuento a masterclasses.',
          'Profesorado en activo, aulas para ensayar y descuentos culturales.',
        ],
      },
    ],
    seo: {
      title: 'Garage New Generation — Teatro 13 a 17 años | TAG',
      description:
        'Teatro para jóvenes de 13 a 17 años en TAG. Del juego a la identidad artística, grupos reducidos y muestras grabadas. Curso 2026/2027.',
      canonicalPath: '/cursos/garage-new-generation',
    },
  },

  'garage-new-generation-cinema': {
    slug: 'garage-new-generation-cinema',
    courseName: 'Garage New Generation Cinema',
    eyebrow: 'Curso Anual · 13–17 años · Cámara',
    heroTitleLines: ['NEW GENERATION', 'CINEMA'],
    heroQuote: '"CONOCERSE DELANTE DE LA CÁMARA"',
    heroDescription:
      'Actuación audiovisual para adolescentes: presencia ante el objetivo, personaje, emoción y técnica básica de rodaje.',
    heroBgImage: headerBg,
    heroBgOverlayClassName: overlay,
    ctaMode: 'whatsappOnly',
    whatsAppLabel: 'Garage New Generation Cinema',
    whatsAppExtra: '(13-17 años)',
    stats: [
      { label: 'Edad', value: '13–17 años' },
      { label: 'Curso', value: '2026/2027' },
      { label: 'Inicio', value: '14 sep 2026' },
      { label: 'Formato', value: '2h/semana' },
      { label: 'Rodaje', value: 'Monólogo + escena pareja' },
      { label: 'Grupo', value: 'Máx. 12' },
    ],
    sections: [
      {
        id: 'program',
        title: 'Estructura del programa',
        body: [
          'Cuatrimestres: 14 sep 2026 → 5 feb 2027 y 8 feb 2027 → 18 jun 2027.',
          'Rodajes: monólogo (Q1) y escena en pareja (Q2). Material grabado disponible.',
        ],
      },
      {
        id: 'included',
        title: 'Incluido en el programa',
        body: [
          'Sesión de fotos profesionales.',
          'Bolsa de casting.',
          'Material grabado en cada clase.',
          'Profesorado en activo, aulas para ensayar y descuentos culturales.',
        ],
      },
    ],
    seo: {
      title: 'New Generation Cinema — Actuación para cámara 13 a 17 años | TAG',
      description:
        'Actuación para cámara para jóvenes de 13 a 17 años en TAG. Rodajes, material grabado y grupos reducidos. Curso 2026/2027.',
      canonicalPath: '/cursos/garage-new-generation-cinema',
    },
  },

  'garage-new-generation-hybrid': {
    slug: 'garage-new-generation-hybrid',
    courseName: 'Garage New Generation Hybrid',
    eyebrow: 'Curso Anual · 13–17 años · Teatro + Cámara',
    heroTitleLines: ['NEW GENERATION', 'HYBRID'],
    heroQuote: '"DEL JUEGO A LA IDENTIDAD ARTÍSTICA"',
    heroDescription:
      'Teatro y cámara en una sola formación: 4h semanales (2h teatro + 2h cámara) para orientar su camino artístico.',
    heroBgImage: headerBg,
    heroBgOverlayClassName: overlay,
    ctaMode: 'whatsappOnly',
    whatsAppExtra: '(13-17 años)',
    stats: [
      { label: 'Edad', value: '13–17 años' },
      { label: 'Curso', value: '2026/2027' },
      { label: 'Inicio', value: '14 sep 2026' },
      { label: 'Formato', value: '4h/semana' },
      { label: 'Teatro', value: '2h/semana' },
      { label: 'Cámara', value: '2h/semana' },
      { label: 'Grupo', value: 'Máx. 12' },
    ],
    sections: [
      {
        id: 'program',
        title: 'Estructura del programa',
        body: [
          'Cuatrimestres: 18 sep 2026 → 5 feb 2027 y 12 feb 2027 → 18 jun 2027.',
          'Rodajes: monólogo (Q1) y escena en pareja (Q2).',
          'Muestras finales por cuatrimestre abiertas al público (grabadas).',
        ],
      },
      {
        id: 'included',
        title: 'Incluido en el programa',
        body: [
          'Sesión de fotos profesionales.',
          'Bolsa de casting.',
          'Material grabado en cada clase.',
          'Profesorado en activo, aulas para ensayar y descuentos culturales.',
        ],
      },
    ],
    seo: {
      title: 'New Generation Hybrid — Teatro + Cámara 13 a 17 años | TAG',
      description:
        'Teatro y cámara combinados para jóvenes de 13 a 17 años en TAG. 4h semanales, rodajes y muestras grabadas. Curso 2026/2027.',
      canonicalPath: '/cursos/garage-new-generation-hybrid',
    },
  },

  'garage-hybrid-julio': {
    slug: 'garage-hybrid-julio',
    courseName: 'Garage Hybrid Julio',
    eyebrow: 'Verano 2026 · Adultos · Iniciación',
    heroTitleLines: ['GARAGE', 'HYBRID JULIO'],
    heroQuote: '"EL ACTOR HONESTO"',
    heroDescription:
      '4 semanas intensivas para iniciarte en teatro y cámara, perder el miedo escénico y descubrir tu verdad.',
    heroBgImage: headerBg,
    heroBgOverlayClassName: overlay,
    ctaMode: 'whatsappPlusInlineForm',
    inlineFormSource: 'cursos_garage_hybrid_julio',
    inlineFormDefaultInterest: 'teatro-cine',
    stats: [
      { label: 'Duración', value: '4 semanas' },
      { label: 'Fechas', value: '6–30 jul 2026' },
      { label: 'Teatro', value: 'Lun+Mar 19:00–21:00' },
      { label: 'Cámara', value: 'Mié+Jue 19:00–21:00' },
      { label: 'Total', value: '32h (16h+16h)' },
      { label: 'Grupo', value: 'Máx. 12' },
    ],
    sections: [
      {
        id: 'program',
        title: 'Qué aprenderás',
        body: [
          'Teatro: expresión corporal, creación de personajes, trabajo de emociones, improvisación, escenas y muestra final (grabada).',
          'Cámara: relajación, imaginación, análisis de texto (monólogo), herramientas específicas y rodaje del monólogo (material en Drive).',
        ],
      },
    ],
    seo: {
      title: 'Garage Hybrid Julio — Intensivo verano (Teatro + Cámara) | TAG',
      description:
        'Curso intensivo de verano 2026: 4 semanas de teatro y cámara (nivel iniciación). 6–30 julio 2026, tardes 19–21h.',
      canonicalPath: '/cursos/garage-hybrid-julio',
    },
  },

  'garage-new-generation-julio': {
    slug: 'garage-new-generation-julio',
    courseName: 'Garage New Generation Julio',
    eyebrow: 'Verano 2026 · 13–17 años · Teatro + Cámara',
    heroTitleLines: ['NEW GENERATION', 'JULIO'],
    heroQuote: '"DEL JUEGO A LA IDENTIDAD ARTÍSTICA"',
    heroDescription:
      '4 semanas de verano: 4h diarias (2h teatro + 2h cámara). Cada semana es independiente: puedes hacer 1 o varias.',
    heroBgImage: headerBg,
    heroBgOverlayClassName: overlay,
    ctaMode: 'whatsappOnly',
    whatsAppExtra: '(13-17 años)',
    stats: [
      { label: 'Fechas', value: '29 jun–24 jul 2026' },
      { label: 'Horario', value: 'Lun–Vie 10:00–14:00' },
      { label: 'Formato', value: '4h/día' },
      { label: 'Teatro', value: '2h/día' },
      { label: 'Cámara', value: '2h/día' },
      { label: 'Grupo', value: 'Máx. 12' },
    ],
    sections: [
      {
        id: 'weeks',
        title: 'Temario por semanas',
        body: [
          'Semana 1 (29 jun–3 jul): “El cuerpo y la presencia” · rodaje ejercicio de presencia.',
          'Semana 2 (6–10 jul): “Quién soy, qué quiero, cómo reacciono” · rodaje monólogo.',
          'Semana 3 (13–17 jul): “La emoción genuina y la palabra” · rodaje monólogo emocional.',
          'Semana 4 (20–24 jul): “Juntos en escena y en pantalla” · rodaje escena en pareja.',
        ],
      },
    ],
    seo: {
      title: 'New Generation Julio — Verano 2026 (13–17) | TAG',
      description:
        'Programa de verano 2026 para jóvenes 13–17: teatro + cámara, 4h diarias. Semanas independientes con rodajes y material grabado.',
      canonicalPath: '/cursos/garage-new-generation-julio',
    },
  },

  'garage-casal': {
    slug: 'garage-casal',
    courseName: 'Garage Casal',
    eyebrow: 'Verano 2026 · 7–13 años',
    heroTitleLines: ['GARAGE', 'CASAL'],
    heroQuote: '"DEL JUEGO A LA ESCENA"',
    heroDescription:
      'Casal de verano para descubrir el teatro con acompañamiento profesional: creación, ensayo y función semanal para familias.',
    heroBgImage: headerBg,
    heroBgOverlayClassName: overlay,
    ctaMode: 'whatsappOnly',
    whatsAppExtra: '(7-13 años)',
    stats: [
      { label: 'Edades', value: '7–13 años' },
      { label: 'Fechas', value: '22 jun–24 jul 2026' },
      { label: 'Formato', value: 'Lun–Vie 9:00–17:00' },
      { label: 'Carga', value: '40h/semana' },
      { label: 'Grupo', value: 'Máx. 12' },
      { label: 'Cada semana', value: 'Independiente' },
    ],
    sections: [
      {
        id: 'program',
        title: 'Cómo funciona',
        body: [
          'Cada semana se trabaja una historia: creación de personajes, ensayo y función el viernes (10–15 min) para familias (grabada).',
          'Semanas alternas de teatro de texto y teatro musical.',
        ],
      },
      {
        id: 'weeks',
        title: 'Las cinco semanas',
        body: [
          'Semana 1 (22–26 jun): Teatro — “El Gran Juicio”.',
          'Semana 2 (29 jun–3 jul): Teatro Musical — “Los Descendientes”.',
          'Semana 3 (6–10 jul): Teatro — “Inside Out”.',
          'Semana 4 (13–17 jul): Teatro Musical — “Zombies 1”.',
          'Semana 5 (20–24 jul): Teatro — “El Día del Sí”.',
        ],
      },
      {
        id: 'included',
        title: 'Incluido en cada semana',
        body: [
          'Profesorado TAG en activo toda la semana (con apoyo si es necesario).',
          'Texto dramático preparado por TAG y adaptado al grupo.',
          'Función del viernes grabada y enviada a las familias.',
        ],
      },
    ],
    seo: {
      title: 'Garage Casal — Casal de Verano 2026 (7–13) | TAG',
      description:
        'Casal de verano 2026 en TAG para niños y niñas de 7 a 13 años. Teatro y teatro musical por semanas, función semanal grabada.',
      canonicalPath: '/cursos/garage-casal',
    },
  },
};

