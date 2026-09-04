export type CtaMode = 'whatsappOnly' | 'whatsappPlusInlineForm';

export type CourseStat = {
  label: string;
  value: string;
};

export type CourseSection = {
  id: string;
  title: string;
  body: string[];
  image?: string; // public path, opcional — ej. foto del profesor
  imageAlt?: string;
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
  videoSrc?: string; // self-hosted video path (public/), used when there's no youtubeId
  videoPoster?: string; // poster image for videoSrc
  ctaMode: CtaMode;
  whatsAppLabel?: string; // overrides courseName in WA message
  whatsAppExtra?: string; // e.g. "(13-17 años)"
  inlineFormSource?: string; // supabase `source`
  inlineFormDefaultInterest?: string;
  statsEmphasis?: boolean; // renders the stats chip row larger — opt-in per course
  stats: CourseStat[];
  sections: CourseSection[];
  seo: CourseSeo;
};

const headerBg = '/content/cursos-header.jpg';
const overlay = 'bg-black/60';
// Video genérico de clase real usado en campañas de Meta Ads, reutilizado en los cursos anuales.
const genericAnnualVideo = '/videos/tag-cursos-anuales.mp4';
const genericAnnualVideoPoster = '/videos/tag-cursos-anuales-poster.jpg';

export const coursesConfig: Record<string, CourseConfig> = {
  'garage-pro': {
    slug: 'garage-pro',
    courseName: 'Garage Pro',
    eyebrow: 'Formación Anual de Interpretación · Barcelona',
    heroTitleLines: ['GARAGE', 'PRO'],
    heroQuote: '"EL ACTOR HONESTO"',
    heroDescription:
      'Curso profesional de interpretación teatral y a cámara en Barcelona. 3 años de formación actoral: técnica, cuerpo, voz y gestión emocional para construir una carrera real.',
    heroBgImage: headerBg,
    heroBgOverlayClassName: overlay,
    videoSrc: genericAnnualVideo,
    videoPoster: genericAnnualVideoPoster,
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
          'Horario: lunes a jueves 10:00–14:00 (16h semanales).',
          'Grupos reducidos: máximo 14 alumnos por clase.',
          'Incluye: fotos profesionales, bolsa de casting, material grabado, masterclasses, aulas de ensayo y descuentos culturales.',
          'Muestras: todas las asignaturas (salvo Cámara y Análisis de texto) terminan con muestra abierta al público y grabada para análisis.',
        ],
      },
      {
        id: 'program',
        title: 'Plan de estudios (resumen por años)',
        body: [
          'Año 1 — Fundamentos: interpretación teatral y a cámara, cuerpo, voz, análisis de texto e improvisación. Rodajes: monólogo y escena en pareja.',
          'Año 2 — Profundización: escenas complejas, giro emocional, clown/teatro físico, técnica vocal avanzada, lucha escénica y Técnica Alexander. Montajes y rodajes de alto nivel.',
          'Año 3 — Profesionalización: cámara avanzada, técnica de audición, gestión emocional/profesionalización, marketing y videobook. Ensayos y rodaje de cortometraje profesional.',
        ],
      },
      {
        id: 'included',
        title: 'Incluido en el programa',
        body: [
          'Sesión de fotos profesionales para todo el alumnado.',
          'Bolsa de casting.',
          'Material grabado en las clases.',
          'Acceso preferente y con descuento a masterclasses.',
          'Profesorado en activo, aulas para ensayar y descuentos culturales.',
        ],
      },
    ],
    seo: {
      title: 'Garage Pro — Curso de Interpretación Teatral y a Cámara en Barcelona | TAG',
      description:
        'Curso profesional de interpretación teatral y a cámara en Barcelona. 3 años de formación actoral: técnica, cuerpo, voz y gestión emocional. Inicio 14 sep 2026.',
      canonicalPath: '/cursos/garage-pro',
    },
  },

  'garage-theatre': {
    slug: 'garage-theatre',
    courseName: 'Garage Theatre',
    eyebrow: 'Curso de Interpretación Teatral · Barcelona',
    heroTitleLines: ['GARAGE', 'THEATRE'],
    heroQuote: '"EL ACTOR HONESTO"',
    heroDescription:
      'Curso de interpretación teatral en Barcelona para construir técnica, presencia escénica y criterio actoral. Recorrido progresivo en 3 años.',
    heroBgImage: headerBg,
    heroBgOverlayClassName: overlay,
    videoSrc: genericAnnualVideo,
    videoPoster: genericAnnualVideoPoster,
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
        id: 'why',
        title: '¿Por qué TAG?',
        body: [
          'Creemos que la técnica es el 50% de esta profesión. El otro 50% es aprender a gestionar nervios, ansiedad, miedos y el constante “no”.',
          'No buscamos perfección: buscamos honestidad. Herramientas tangibles que cada actor adapta a su proceso.',
        ],
      },
      {
        id: 'program',
        title: 'Estructura del programa',
        body: [
          'Curso 2026/2027: 14 sep 2026 → 18 jun 2027 (dos cuatrimestres).',
          'Formato: 2 horas semanales.',
          'Grupos: máximo 12 alumnos por clase.',
          'Incluye: fotos profesionales, bolsa de casting, masterclasses, aulas de ensayo, descuentos culturales.',
          'Al finalizar los 3 años pasarás a ser miembro de la compañía TAG.',
        ],
      },
      {
        id: 'program',
        title: 'Qué trabajamos (por años)',
        body: [
          'Año 1 — Fundamentos: juego, desinhibición, presencia escénica e impulso. Muestras: improvisación grupal + escena en pareja y monólogo teatral.',
          'Año 2 — Recorrido histórico: del teatro griego al Siglo de Oro (lectura contemporánea) y métodos de construcción de personaje (Stanislavski, Lecoq, Meisner, Donnellan…).',
          'Año 3 — Siglo XX y post-dramático: vanguardias, experimentación, creación colectiva y montaje final en teatro profesional de Barcelona.',
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
          'Al finalizar los 3 años: compañía TAG.',
        ],
      },
    ],
    seo: {
      title: 'Garage Theatre — Curso de Interpretación Teatral en Barcelona | TAG',
      description:
        'Curso de interpretación teatral en Barcelona. Formación actoral de 3 años, grupos reducidos y profesorado en activo. Inicio septiembre 2026.',
      canonicalPath: '/cursos/garage-theatre',
    },
  },

  'garage-cinema': {
    slug: 'garage-cinema',
    courseName: 'Garage Cinema',
    eyebrow: 'Curso de Interpretación para Cámara · Barcelona',
    heroTitleLines: ['GARAGE', 'CINEMA'],
    heroQuote: '"EL ACTOR HONESTO"',
    heroDescription:
      'Curso de interpretación para cámara en Barcelona: actuación audiovisual, técnica de cine y televisión, rodajes durante el curso y material grabado en cada clase.',
    heroBgImage: headerBg,
    heroBgOverlayClassName: overlay,
    videoSrc: genericAnnualVideo,
    videoPoster: genericAnnualVideoPoster,
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
        id: 'why',
        title: '¿Por qué TAG?',
        body: [
          'La técnica es el 50%. El otro 50% es aprender a gestionar nervios, ansiedad, miedos y el constante “no”.',
          'Herramientas prácticas y tangibles; cada actor adapta el método a su proceso.',
        ],
      },
      {
        id: 'program',
        title: 'Estructura del programa',
        body: [
          'Curso 2026/2027: 14 sep 2026 → 18 jun 2027 (dos cuatrimestres).',
          'Formato: 2 horas semanales.',
          'Grupos: máximo 12 alumnos por clase.',
          'Incluye: fotos profesionales, bolsa de casting, material grabado en cada clase, masterclasses, aulas de ensayo, descuentos culturales.',
          'Rodajes: monólogo (Q1) y escena en pareja (Q2).',
        ],
      },
      {
        id: 'program',
        title: 'Qué aprenderás (por años)',
        body: [
          'Año 1 — Fundamentos: conexión con cámara, relajación activa, escucha, personaje y escenas. Rodajes: monólogo + escena en pareja.',
          'Año 2 — Profundización: acciones físicas con intención, subtexto, escucha avanzada, preparación emocional y escenas complejas. Rodajes: escena con giro emocional + escena grupal/alto nivel.',
          'Año 3 — Profesionalización: negocio del acting, preproducción, ensayos intensivos y rodaje profesional de cortometraje (3–5 días), postproducción y presentación final.',
        ],
      },
      {
        id: 'included',
        title: 'Incluido en el programa',
        body: [
          'Sesión de fotos profesionales.',
          'Bolsa de casting.',
          'Material grabado en cada clase.',
          'Acceso a masterclasses, profesorado en activo, aulas para ensayar y descuentos culturales.',
        ],
      },
    ],
    seo: {
      title: 'Garage Cinema — Curso de Interpretación para Cámara en Barcelona | TAG',
      description:
        'Curso de interpretación para cámara y actuación audiovisual en Barcelona. Formación de 3 años con rodajes, material grabado y grupos reducidos.',
      canonicalPath: '/cursos/garage-cinema',
    },
  },

  'garage-hybrid': {
    slug: 'garage-hybrid',
    courseName: 'Garage Hybrid',
    eyebrow: 'Curso de Interpretación Teatral y a Cámara · Barcelona',
    heroTitleLines: ['GARAGE', 'HYBRID'],
    heroQuote: '"EL ACTOR HONESTO"',
    heroDescription: 'Curso de interpretación teatral y a cámara en Barcelona. Cámara + Teatro en un solo camino para desarrollar versatilidad y criterio profesional.',
    heroBgImage: headerBg,
    heroBgOverlayClassName: overlay,
    videoSrc: genericAnnualVideo,
    videoPoster: genericAnnualVideoPoster,
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
        id: 'why',
        title: '¿Por qué TAG?',
        body: [
          'La técnica es el 50%. El otro 50% es aprender a gestionar nervios, ansiedad, miedos y el constante “no”.',
          'No creemos en dogmas: herramientas tangibles para que encuentres tu camino con honestidad.',
        ],
      },
      {
        id: 'program',
        title: 'Estructura del programa',
        body: [
          'Curso 2026/2027: 14 sep 2026 → 18 jun 2027 (dos cuatrimestres).',
          'Formato: 2h cámara + 2h teatro por semana.',
          'Grupos: máximo 12 alumnos por clase.',
          'Incluye: fotos profesionales, bolsa de casting, material grabado, masterclasses, aulas de ensayo, descuentos culturales.',
          'Al finalizar los 3 años, pasarás a formar parte de la compañía TAG.',
        ],
      },
      {
        id: 'program',
        title: 'Qué trabajamos (resumen por cuatrimestres)',
        body: [
          'Q1: cámara (rodaje monólogo + fotos) + teatro (muestra grupal). Bases: presencia, escucha, emoción y juego.',
          'Q2: cámara (rodaje escena en pareja) + teatro (escena en pareja + monólogo). Texto, conflicto y subtexto.',
          'Años 2–3: escenas complejas, clásicos y métodos de personaje, rodajes de alto nivel y profesionalización (cine/teatro).',
        ],
      },
      {
        id: 'included',
        title: 'Incluido en el programa',
        body: [
          'Sesión de fotos profesionales.',
          'Bolsa de casting.',
          'Material grabado en las clases.',
          'Masterclasses, profesorado en activo, aulas para ensayar y descuentos culturales.',
          'Compañía TAG al finalizar.',
        ],
      },
    ],
    seo: {
      title: 'Garage Hybrid — Curso de Interpretación Teatral y a Cámara en Barcelona | TAG',
      description:
        'Curso de interpretación teatral y a cámara en Barcelona. Formación híbrida de 3 años, 4h semanales, rodajes y muestras. Inicio septiembre 2026.',
      canonicalPath: '/cursos/garage-hybrid',
    },
  },

  'garage-hybrid-plus': {
    slug: 'garage-hybrid-plus',
    courseName: 'Garage Hybrid Plus',
    eyebrow: 'Curso de Interpretación con Canto e Improvisación · Barcelona',
    heroTitleLines: ['GARAGE', 'HYBRID PLUS'],
    heroQuote: '"EL ACTOR HONESTO"',
    heroDescription:
      'Curso de interpretación teatral y a cámara con canto e improvisación en Barcelona. El programa de tardes más completo para máxima versatilidad profesional.',
    heroBgImage: headerBg,
    heroBgOverlayClassName: overlay,
    videoSrc: genericAnnualVideo,
    videoPoster: genericAnnualVideoPoster,
    ctaMode: 'whatsappPlusInlineForm',
    inlineFormSource: 'cursos_garage_hybrid_plus',
    inlineFormDefaultInterest: 'teatro-cine',
    statsEmphasis: true,
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
        title: '¿Por qué TAG?',
        body: [
          'La técnica es el 50%. El otro 50% es aprender a gestionar nervios, ansiedad, miedos y el constante “no”.',
          'Herramientas prácticas para construir criterio y honestidad interpretativa.',
        ],
      },
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
          'Horario: 8h semanales (2h cámara + 2h teatro + 2h canto + 2h impro/creación colectiva).',
          'Grupos: máximo 12 alumnos por clase.',
          'Incluye: fotos profesionales, bolsa de casting, material grabado, masterclasses, aulas de ensayo, descuentos culturales.',
          'Al finalizar la formación, pasarás a formar parte de la compañía TAG.',
        ],
      },
      {
        id: 'program',
        title: 'Plan de estudios (resumen por años)',
        body: [
          'Año 1: rodaje monólogo + fotos, muestra grupal de teatro, muestra vocal y jam de impro. Bases de personaje, voz y juego.',
          'Año 2: rodajes complejos, montaje de clásico, recital avanzado y formatos de impro larga (Harold/Montage).',
          'Año 3: preproducción + rodaje de cortometraje, montaje profesional, preparación de audiciones musicales y shows con industria invitada.',
        ],
      },
      {
        id: 'included',
        title: 'Incluido en el programa',
        body: [
          'Sesión de fotos profesionales.',
          'Bolsa de casting.',
          'Material grabado en las clases.',
          'Acceso preferente y con descuento a masterclasses.',
          'Profesorado en activo, aulas para ensayar y descuentos culturales.',
          'Compañía TAG al finalizar.',
        ],
      },
    ],
    seo: {
      title: 'Garage Hybrid Plus — Interpretación con Canto e Improvisación en Barcelona | TAG',
      description:
        'Curso de interpretación teatral y a cámara con canto e improvisación en Barcelona. Programa anual de 3 años (8h/semana). Inicio septiembre 2026.',
      canonicalPath: '/cursos/garage-hybrid-plus',
    },
  },

  // The 5 youth course configs previously here (garage-mini-kids, garage-kids,
  // garage-new-generation, garage-new-generation-cinema, garage-new-generation-hybrid)
  // were consolidated into the single /jovenes page (LandingJovenes.tsx) — their old
  // URLs redirect there, see App.tsx. Removed 2026-07-23.

  'garage-hybrid-julio': {
    slug: 'garage-hybrid-julio',
    courseName: 'Garage Hybrid Julio',
    eyebrow: 'Curso de Iniciación a la Interpretación · Verano Barcelona',
    heroTitleLines: ['GARAGE', 'HYBRID JULIO'],
    heroQuote: '"EL ACTOR HONESTO"',
    heroDescription:
      'Curso intensivo de iniciación a la interpretación teatral y a cámara en Barcelona. 4 semanas de verano para perder el miedo escénico y descubrir tu verdad.',
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
        id: 'why',
        title: '¿Por qué TAG?',
        body: [
          'La técnica es el 50%. El otro 50% es aprender a gestionar nervios, ansiedad, miedos y el constante “no”.',
          'Herramientas prácticas para que cada actor encuentre su camino: compromiso y verdad.',
        ],
      },
      {
        id: 'program',
        title: '¿A quién va dirigido?',
        body: [
          'Personas sin experiencia previa que quieren iniciarse, perder el miedo escénico y descubrir capacidades expresivas en teatro y cámara.',
          'Requisitos: ninguno (solo ganas de aprender, jugar y descubrir).',
        ],
      },
      {
        id: 'program',
        title: 'Qué aprenderás',
        body: [
          'Teatro: expresión corporal, creación de personajes, trabajo de emociones, improvisación, escenas y muestra final (grabada).',
          'Cámara: relajación, imaginación, análisis de texto (monólogo), herramientas específicas y rodaje del monólogo (material en Drive).',
        ],
      },
      {
        id: 'program',
        title: 'Estructura del intensivo',
        body: [
          'Duración: 4 semanas intensivas · 6–30 julio 2026.',
          'Teatro: lunes y martes 19:00–21:00h.',
          'Cámara: miércoles y jueves 19:00–21:00h.',
          'Total: 16h teatro + 16h cámara · grupo máximo 12.',
        ],
      },
      {
        id: 'why',
        title: 'Filosofía “El actor honesto”',
        body: [
          'No creemos en: gurús con “verdad absoluta”, buscar validación constante, “menos es más” como única verdad o una sola técnica para todos.',
          'Creemos en: herramientas tangibles, compromiso y verdad, y que hacer mejores personas crea mejores actores.',
        ],
      },
    ],
    seo: {
      title: 'Garage Hybrid Julio — Curso de Iniciación a la Interpretación en Barcelona | TAG',
      description:
        'Curso intensivo de iniciación a la interpretación teatral y a cámara en Barcelona, verano 2026. 4 semanas, 6–30 julio, tardes 19–21h.',
      canonicalPath: '/cursos/garage-hybrid-julio',
    },
  },

  'garage-new-generation-julio': {
    slug: 'garage-new-generation-julio',
    courseName: 'Garage New Generation Julio',
    eyebrow: 'Campamento Urbano de Teatro Adolescentes · Verano Barcelona',
    heroTitleLines: ['NEW GENERATION', 'JULIO'],
    heroQuote: '"DEL JUEGO A LA IDENTIDAD ARTÍSTICA"',
    heroDescription:
      'Campamento urbano de teatro y cámara para adolescentes de 13 a 17 años en Barcelona. 4 semanas de verano, 4h diarias (2h teatro + 2h cámara), semanas independientes.',
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
        id: 'why',
        title: '¿Por qué New Generation Julio?',
        body: [
          'La adolescencia es un momento rico y complejo: identidad, emociones intensas y presencia.',
          'Este intensivo combina teatro y cámara (4h diarias) para trabajar presencia, personaje, emoción, escena y objetivo.',
        ],
      },
      {
        id: 'program',
        title: 'Cómo funciona',
        body: [
          'Cada semana es independiente: puedes inscribirte a 1, varias o las 4 semanas.',
          'Quien llega por primera vez encuentra fundamentos; quien repite profundiza los mismos pilares desde un eje distinto.',
          'Formato: lunes a viernes 10:00–14:00h (2h teatro + 2h cámara). Grupo máximo 12.',
        ],
      },
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
      {
        id: 'included',
        title: 'Nuestro compromiso',
        body: [
          'Entorno profesional, seguro y estimulante.',
          'Profesorado en activo, con rigor, respeto y entusiasmo.',
          'Material grabado disponible para el alumnado.',
        ],
      },
    ],
    seo: {
      title: 'New Generation Julio — Campamento Urbano de Teatro para Adolescentes en Barcelona | TAG',
      description:
        'Campamento urbano de verano en Barcelona para adolescentes de 13 a 17 años: teatro y cámara, 4h diarias, semanas independientes con rodajes.',
      canonicalPath: '/cursos/garage-new-generation-julio',
    },
  },

  'garage-casal': {
    slug: 'garage-casal',
    courseName: 'Garage Casal',
    eyebrow: 'Casal de Verano de Teatro Niños 7–13 años · Barcelona',
    heroTitleLines: ['GARAGE', 'CASAL'],
    heroQuote: '"DEL JUEGO A LA ESCENA"',
    heroDescription:
      'Casal de verano de teatro en Barcelona para niños y niñas de 7 a 13 años, con acompañamiento profesional: creación, ensayo y función semanal para familias.',
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
        id: 'why',
        title: '¿Por qué el Casal de Verano de TAG?',
        body: [
          'En verano aparece un espacio más libre donde la creatividad toma protagonismo.',
          'A través de texto, personaje y acompañamiento respetuoso, los peques exploran su mundo interior y lo llevan a escena con compromiso y verdad.',
          'Cada semana se trabaja una historia y se estrena el viernes (10–15 min) ante familias. Semanas alternas de teatro de texto y teatro musical.',
        ],
      },
      {
        id: 'program',
        title: 'Cómo funciona',
        body: [
          'Cada semana se trabaja una historia: creación de personajes, ensayo y función el viernes (10–15 min) para familias (grabada).',
          'Semanas alternas de teatro de texto y teatro musical.',
          'Formato: lunes a viernes 9:00–17:00h (40h semanales). Grupo máximo 12.',
          'Profesorado: lunes+miércoles un/a profe, martes+jueves otro/a, viernes ambos para la función (con apoyo extra si hace falta).',
        ],
      },
      {
        id: 'program',
        title: 'Estructura semanal',
        body: [
          'Teatro: lunes cohesión + impro; martes objetivos del personaje; miércoles creación (cuerpo/emoción); jueves ensayos con vestuario/atrezo; viernes calentamiento + ensayo general + estreno.',
          'Teatro musical: lunes intro + talent show; martes voz + primeras coreos; miércoles escena musical + ensayo coreográfico; jueves ritmo/movimiento + ensayos; viernes control vocal/corporal + estreno.',
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
          'Contacto: info@theactinggarage.com · 682 560 187.',
        ],
      },
    ],
    seo: {
      title: 'Garage Casal — Casal de Verano de Teatro para Niños en Barcelona | TAG',
      description:
        'Casal de verano de teatro en Barcelona para niños y niñas de 7 a 13 años. Teatro y teatro musical por semanas, función semanal grabada.',
      canonicalPath: '/cursos/garage-casal',
    },
  },

  'garage-classic': {
    slug: 'garage-classic',
    courseName: 'Garage Classic',
    eyebrow: 'Clases de Teatro para Mayores de 60 años · Barcelona',
    heroTitleLines: ['GARAGE', 'CLASSIC'],
    heroQuote: '"NUNCA ES TARDE PARA SUBIRSE AL ESCENARIO"',
    heroDescription:
      'Clases de teatro para mayores de 60 años en Barcelona. Interpretación teatral para estimular la memoria, la expresión y la motricidad, en un grupo activo y con acompañamiento profesional.',
    heroBgImage: headerBg,
    heroBgOverlayClassName: overlay,
    ctaMode: 'whatsappPlusInlineForm',
    inlineFormSource: 'cursos_garage_classic',
    inlineFormDefaultInterest: 'teatro',
    stats: [
      { label: 'Edad', value: '60+' },
      { label: 'Curso', value: 'Anual' },
      { label: 'Formato', value: '1h30/semana' },
      { label: 'Días', value: '1 día/semana' },
      { label: 'Grupo', value: 'Reducido' },
    ],
    sections: [
      {
        id: 'why',
        title: '¿Por qué Garage Classic?',
        body: [
          'El teatro es una herramienta de bienestar a cualquier edad: estimula la memoria, la expresión corporal y la motricidad en un espacio de disfrute y conexión con otras personas.',
          'No buscamos "actores profesionales": buscamos personas que se animen a jugar, a expresarse y a subirse a un escenario, muchas veces por primera vez en su vida.',
        ],
      },
      {
        id: 'program',
        title: 'Estructura del programa',
        body: [
          'Curso anual, 1h30 semanal, en grupo reducido.',
          'Trabajo de memoria, voz, cuerpo y expresión a través de juegos teatrales y ejercicios adaptados.',
          'Muestra final abierta a familiares y amigos.',
        ],
      },
      {
        id: 'included',
        title: 'Incluido en el programa',
        body: [
          'Profesorado especializado en trabajo con adultos mayores.',
          'Grupo reducido y ambiente cercano.',
          'Muestra final con público.',
          'Aulas accesibles y descuentos culturales.',
        ],
      },
    ],
    seo: {
      title: 'Garage Classic — Clases de Teatro para Mayores de 60 años en Barcelona | TAG',
      description:
        'Clases de teatro para mayores de 60 años en Barcelona. Interpretación teatral para la memoria, la expresión y el bienestar en la tercera edad.',
      canonicalPath: '/cursos/garage-classic',
    },
  },

  'garage-expert-cinema': {
    slug: 'garage-expert-cinema',
    courseName: 'Garage Expert Cinema',
    eyebrow: 'Curso Anual para Actores Avanzados · Barcelona',
    heroTitleLines: ['GARAGE', 'EXPERT', 'CINEMA'],
    heroQuote: '"EL ACTOR HONESTO"',
    heroDescription:
      'Curso anual para actores avanzados en Barcelona: terminas con 3 a 5 escenas profesionales rodadas, editadas y montadas, listas para agentes, castings y plataformas de la industria.',
    heroBgImage: headerBg,
    heroBgOverlayClassName: overlay,
    ctaMode: 'whatsappPlusInlineForm',
    inlineFormSource: 'cursos_garage_expert_cinema',
    inlineFormDefaultInterest: 'teatro-cine',
    statsEmphasis: true,
    stats: [
      { label: 'Duración', value: 'Sep → Jun' },
      { label: 'Carga', value: '4h/semana' },
      { label: 'Formato', value: '2h escena + 2h cámara' },
      { label: 'Grupo', value: 'Máx. 10 alumnos' },
      { label: 'Entregable', value: 'Escenas rodadas y montadas' },
    ],
    sections: [
      {
        id: 'why',
        title: '¿Qué es Garage Expert Cinema?',
        body: [
          'No es un curso de escenas sueltas: es la culminación de tu proceso como actor. Está pensado para actores avanzados que ya dominan las herramientas técnicas y necesitan un espacio donde afilarlas, aplicarlas a material exigente y convertirlas en el material que de verdad les abre puertas: sus escenas profesionales rodadas.',
          'Aquí no repetimos teoría desde cero. Repasamos y llevamos a maestría todo lo trabajado en tu formación, y lo cruzamos con lo que la industria realmente pide: cómo te vendes, cómo gestionas una audición, cómo sostienes una carrera cuando el "no" es la respuesta más frecuente.',
          'Técnica y negocio, cuerpo y estrategia, arte y oficio: el 50% técnica + 50% gestión emocional de la filosofía TAG, aplicado a la etapa donde más importa — la salida al mercado.',
          'El objetivo es tangible: terminar el curso con 3 a 5 escenas profesionales rodadas en condiciones profesionales, editadas y montadas — listas para agentes, castings y plataformas de la industria.',
          'Trabajo a medida: las escenas se escriben específicamente para cada alumno, según lo que quiere mostrar en ellas, y cada actor se enseña y se trata de forma personal a lo largo de todo el curso.',
        ],
      },
      {
        id: 'program',
        title: 'Estructura del programa',
        body: [
          'Duración: un curso completo, de septiembre a junio.',
          'Formato: 4 horas semanales — 2h de Escena/Herramientas + 2h de Cámara/Industria.',
          'Para quién: actores avanzados con formación técnica sólida.',
          'Grupos: máximo 10 alumnos por clase.',
          'Estructura: núcleo de entrenamiento fijo + foco rotativo por trimestre.',
          'Entregable final: escenas profesionales rodadas, editadas y montadas.',
        ],
      },
      {
        id: 'why',
        title: 'Filosofía "El actor honesto"',
        body: [
          'Mentalidad de profesional que se lanza al mercado, no de estudiante que termina un curso. No vienes a aprender el oficio: vienes a demostrarlo, grabarlo y venderlo.',
          'El "no" va a ser la respuesta más común en tu carrera. Este curso te entrena para recibirlo, gestionarlo y seguir presentándote a la siguiente audición con la misma verdad.',
        ],
      },
      {
        id: 'program',
        title: 'Bloque 1 · Maestría y escena (2h/semana)',
        body: [
          'Repaso y maestría — llevar el instrumento al límite. No se aprenden herramientas nuevas desde cero: se revisan, se pulen y se llevan a maestría todas las que ya tienes, aplicadas sobre material de nivel profesional. Cada sesión es entrenamiento de atleta, no clase de estudiante.',
          'Repaso integral de herramientas: cuerpo, voz, escucha, impulso y construcción de personaje, auditadas y afinadas sobre escenas exigentes.',
          'Análisis y ataque de material: cómo leer un guion de casting real y tomar decisiones de actuación en poco tiempo, como en la industria.',
          'Trabajo de escena avanzado: escenas de alta exigencia dramática elegidas específicamente por su potencial en cámara.',
          'Escenas escritas a medida: cada escena que grabarás se escribe específicamente para ti, en función de lo que quieres mostrar. Nunca material genérico de grupo.',
          'Feedback individualizado: cada actor recibe notas dirigidas a su propio material, alumno a alumno.',
          'Primer semestre (septiembre a enero): selección de material y registros que mejor representan tu rango, construcción de personaje a nivel profesional (biografía, psicología y fisicalidad aplicadas a papeles de casting real) y preparación de los dos primeros bloques de rodaje.',
          'Segundo semestre (febrero a junio): registro y versatilidad (comedia, drama, thriller), escenas de giro emocional y alta complejidad, y ensayo y ajuste fino de cada escena antes de su rodaje definitivo.',
        ],
      },
      {
        id: 'program',
        title: 'Bloque 2 · Cámara y rodaje (incluido)',
        body: [
          'De la escena ensayada al material que te representa. Cada escena de trabajo se lleva a rodaje en condiciones profesionales: equipo de cámara, iluminación y dirección, con el mismo compromiso que un rodaje real.',
          'Primer semestre: 1-2 escenas rodadas.',
          'Segundo semestre: 2-3 escenas rodadas de mayor exigencia y registro.',
          'Cierre de curso: sesión de fotos profesionales (headshots) para completar tu material de presentación.',
        ],
      },
      {
        id: 'program',
        title: 'Bloque 3 · El negocio del acting (2h/semana)',
        body: [
          'De actor en formación a actor profesional. La técnica te lleva a la sala; el negocio te lleva a la carrera. Este bloque trabaja todo lo que rodea a la actuación y que ninguna escuela suele enseñar con la misma seriedad.',
          'Audiciones y material: el self-tape profesional (setup, luz, encuadre y entrega — el estándar que espera un director de casting hoy), callbacks, y el reel y las escenas (qué escenas incluir, cómo ordenarlas, duración y primeras impresiones).',
          'Agentes y self-marketing: cómo funciona la relación con un agente, presencia profesional y comunicación de marca sin perder honestidad, y networking de industria para construir relaciones de trabajo que duran.',
          'Gestión del "no": vivir en el rechazo, ansiedad y bloqueo frente al casting (regulación antes, durante y después de la sala), identidad más allá del resultado y resiliencia a largo plazo.',
          'El bloque de negocio se trabaja con la misma disciplina que la escena: no son "charlas motivacionales", son sesiones de entrenamiento con herramientas prácticas que se repiten y se interiorizan.',
        ],
      },
      {
        id: 'included',
        title: 'Masterclasses e industria',
        body: [
          'Directores de casting, agentes y actores en activo comparten sala con el grupo a lo largo del curso.',
          'Traemos la industria al aula: mínimo una masterclass por trimestre.',
          'Sesión de mock-castings con directores de casting y/o representantes sobre tu propio material.',
        ],
      },
      {
        id: 'included',
        title: 'Las escenas finales — qué te llevas al terminar el curso',
        body: [
          'El curso entero converge en un entregable claro: tus escenas profesionales rodadas, la carta de presentación que te acompañará en cada audición, con cada agente y en cada plataforma de la industria a partir de ahora.',
          '3 a 5 escenas rodadas en condiciones profesionales.',
          'Registro variado: drama, comedia, thriller u otros géneros.',
          'Edición y montaje profesional del material.',
          'Sesión de fotos (headshots) actualizada.',
          'Self-tape de audición grabado bajo condiciones reales.',
          'CV de actor actualizado y revisado.',
          'Feedback individual de industria sobre el material final.',
          'Presentación final ante industria invitada.',
        ],
      },
      {
        id: 'why',
        title: '¿Qué conseguirás en el curso?',
        body: [
          'Como actor: herramientas llevadas a maestría (no solo aprendidas), escenas profesionales rodadas y terminadas, versatilidad demostrada en registro y género, y criterio propio ante el material de casting.',
          'Como profesional: conocimiento real del negocio del acting, material listo para agentes y plataformas, experiencia en rodaje y self-tape profesional, y una red de contactos e industria conocida en persona.',
          'Como persona: herramientas concretas para gestionar el rechazo a largo plazo, resiliencia emocional entrenada (no improvisada) y una relación más honesta y sostenible con tu carrera.',
          '"Siempre hacemos lo mejor que podemos con las luces que tenemos." Al terminar este curso, sales con muchas más luces — y con el material que lo demuestra.',
        ],
      },
    ],
    seo: {
      title: 'Garage Expert Cinema — Curso Anual para Actores Avanzados en Barcelona | TAG',
      description:
        'Curso anual para actores avanzados en Barcelona. Terminas con 3 a 5 escenas profesionales rodadas, editadas y montadas —tu videobook—, headshots y self-tape. Grupos de máximo 10. Septiembre a junio.',
      canonicalPath: '/cursos/garage-expert-cinema',
    },
  },

  'garage-writing': {
    slug: 'garage-writing',
    courseName: 'Garage Writing',
    eyebrow: 'Curso de Escritura de Comedia Teatral · Online',
    heroTitleLines: ['GARAGE', 'WRITING'],
    heroQuote: '"¿CÓMO SE TRANSFORMA UNA IDEA CÓMICA EN UNA HISTORIA?"',
    heroDescription:
      'Curso online de escritura de comedia teatral con Yago Alonso: de la premisa al escenario. 12 sesiones para llevar una idea cómica hasta una pieza que se convierta en obra.',
    heroBgImage: headerBg,
    heroBgOverlayClassName: overlay,
    ctaMode: 'whatsappPlusInlineForm',
    whatsAppExtra: '(online, miércoles 17-20h)',
    inlineFormSource: 'cursos_garage_writing',
    inlineFormDefaultInterest: 'escritura',
    stats: [
      { label: 'Duración', value: '12 sesiones' },
      { label: 'Inicio', value: '16 sep 2026' },
      { label: 'Horario', value: 'Miércoles 17:00–20:00' },
      { label: 'Carga', value: '3h/semana' },
      { label: 'Modalidad', value: 'Online vía Zoom' },
    ],
    sections: [
      {
        id: 'modalidad',
        title: 'Garage Writing — cursos online',
        body: [
          'Garage Writing es la nueva formación online de TAG dedicada a la escritura dramática y el guion cinematográfico.',
          'Cada curso: doce sesiones de tres horas, en directo vía Zoom —da igual dónde estés— con los mejores profesionales de la dramaturgia y el guion. Y sales con material propio: no con apuntes, sino con una pieza escrita.',
          'Empezamos con Escribir Comedia, con Yago Alonso.',
        ],
      },
      {
        id: 'curso',
        title: 'Escribir comedia — de la premisa al escenario',
        body: [
          '¿Cómo se transforma una idea cómica en una historia capaz de sostenerse durante más de una hora sobre un escenario?',
          'Este curso propone un recorrido completo por el proceso de escritura de una comedia teatral: desde la búsqueda de la premisa hasta la lectura y reescritura del texto con actores.',
          'A lo largo de doce sesiones, trabajaremos la premisa, el conflicto, la estructura, los personajes, los diálogos, los mecanismos cómicos, el tono y la tesis de la obra. Todo para poder desarrollar una pieza que se convierta en una obra teatral.',
          'El curso combinará conceptos de dramaturgia con ejercicios de escritura y lecturas en voz alta. El objetivo no será únicamente escribir chistes, sino construir situaciones, personajes y conflictos que produzcan comedia de manera orgánica.',
        ],
      },
      {
        id: 'estructura',
        title: 'Estructura del programa',
        body: [
          'Duración: 12 sesiones.',
          'Fechas: inicio miércoles 16 de septiembre de 2026 // fin miércoles 2 de diciembre de 2026.',
          'Horario: miércoles de 17:00 a 20:00 h (3 horas semanales).',
          'Modalidad: teórico-práctica, online vía Zoom.',
          'Nivel: abierto a personas con interés en la escritura dramática.',
        ],
      },
      {
        id: 'objetivos',
        title: 'Objetivos del curso',
        body: [
          'Encontrar y formular una premisa cómica clara.',
          'Comprobar si una idea tiene suficiente recorrido dramático.',
          'Construir una escaleta organizada en tres actos.',
          'Crear personajes reconocibles, contradictorios y diferenciados.',
          'Utilizar mecanismos como la negación, la ironía dramática, los secretos y los cambios de estatus.',
          'Escribir diálogos ágiles y adecuados a cada personaje.',
          'Integrar un tema o una mirada propia sin convertir la obra en un discurso.',
          'Detectar problemas de ritmo, tono y estructura.',
          'Utilizar a los actores como herramienta para comprobar y mejorar un texto.',
          'Reescribir una escena a partir de lo descubierto en una lectura o ensayo.',
        ],
      },
      {
        id: 'metodologia',
        title: 'Metodología',
        body: [
          'El curso combina conceptos de dramaturgia con ejercicios de escritura y lecturas en voz alta.',
          'Se trabaja sesión a sesión sobre el material propio de cada participante, con puesta en común y revisión del texto en grupo.',
        ],
      },
      {
        id: 'profesor',
        title: 'El profesor · Yago Alonso',
        image: '/content/yago.jpg',
        imageAlt: 'Yago Alonso',
        body: [
          'Guionista de ficción y entretenimiento, dramaturgo y director teatral.',
          'Guion audiovisual: forma parte del equipo responsable del guion de la película "Wolfgang. Extraordinario" (2025), dirigida por Javier Ruiz Caldera.',
          'Autoría teatral: coautor, junto a Carmen Marfà, de "La presència (Sixto Paz)", que hizo temporada en la Sala Villarroel de Barcelona en 2024 y en el Teatre Borràs en 2026. Coautor de "La promesa" (2026), junto a Silvia Navarro. Coautor, junto a Eva Mor, y director de "Els plans" (2025). Director de "Kalumba" (2020).',
          'Coautoría y codirección con Carmen Marfà: "Ovelles" (2018) — candidata a los Premios Max a Mejor Espectáculo de Pequeño Formato, Premio Teatre Barcelona 2022 a la Mejor Reposición, nominada a dos Premios Butaca (Mejor Texto y Mejor Espectáculo de Pequeño Formato) y a un Premio de la Crítica (Mejor Espectáculo de Pequeño Formato).',
          '"Instruccions per enterrar un pare" (2020) y "La pell fina" (2022) — esta última candidata a los Premios Max a Mejor Autoría Revelación 2022, nominada a dos Premios Butaca (Mejor Texto y Mejor Espectáculo de Pequeño Formato) y a cuatro Premios Teatre Barcelona.',
        ],
      },
    ],
    seo: {
      title: 'Garage Writing — Curso de Escritura de Comedia Teatral Online | TAG',
      description:
        'Curso online de escritura de comedia teatral con Yago Alonso. 12 sesiones, miércoles de 17 a 20h vía Zoom, del 16 de septiembre al 2 de diciembre de 2026. De la premisa al escenario.',
      canonicalPath: '/cursos/garage-writing',
    },
  },

  'garage-mini-kids': {
    slug: 'garage-mini-kids',
    courseName: 'Garage Mini Kids',
    eyebrow: 'Clases de Teatro para Niños de 6 a 8 años · Barcelona',
    heroTitleLines: ['GARAGE', 'MINI KIDS'],
    heroDescription:
      'Clases de teatro para niños y niñas de 6 a 8 años en Barcelona. Juego, expresión y primeras herramientas escénicas en grupos de doce.',
    heroBgImage: headerBg,
    heroBgOverlayClassName: overlay,
    ctaMode: 'whatsappPlusInlineForm',
    whatsAppExtra: '(6-8 años)',
    inlineFormSource: 'cursos_garage_mini_kids',
    inlineFormDefaultInterest: 'teatro',
    stats: [
      { label: 'Edad', value: '6–8 años' },
      { label: 'Inicio', value: '14 sep 2026' },
      { label: 'Formato', value: '1h30/semana' },
      { label: 'Grupo', value: 'Máx. 12 alumnos' },
    ],
    sections: [
      {
        id: 'why',
        title: '¿Por qué teatro a esta edad?',
        body: [
          'A los 6 años no se viene a aprender a actuar: se viene a jugar en serio, y de ahí sale todo lo demás.',
          'Desarrollar confianza en sí mismos y sí mismas.',
          'Expresar emociones de forma sana.',
          'Conectar con otros niños y niñas y aprender a trabajar en equipo.',
          'Potenciar su creatividad e imaginación.',
          'Divertirse mientras aprenden.',
        ],
      },
      {
        id: 'program',
        title: 'Estructura del programa',
        body: [
          'Curso 2026/2027, dos cuatrimestres, con muestra al final de cada uno.',
          'Formato: 1 hora y media semanal.',
          'Grupos: máximo 12 niños y niñas por clase.',
          'No hace falta experiencia previa ni ningún tipo de prueba de acceso.',
        ],
      },
      {
        id: 'program',
        title: 'Qué trabajamos',
        body: [
          'Primer cuatrimestre — Desinhibición y confianza en el espacio. Conciencia corporal y movimiento expresivo. Mirada, escucha y trabajo en equipo. Consolidación y juegos de cierre de bloque.',
          'Segundo cuatrimestre — Creación de personajes simples: animales, objetos mágicos, diferentes tipos de personas. Emociones básicas y expresividad: alegría, tristeza, miedo, sorpresa, enfado. Introducción al texto dramático: primeras palabras en escena con textos muy sencillos. Pequeñas escenas guiadas. Ensayos con puesta en escena: construimos pequeñas historias entre todos y todas.',
        ],
      },
      {
        id: 'included',
        title: 'Incluido en el programa',
        body: [
          'Sesión de media hora de fotos profesionales (book o artísticas).',
          'Acceso preferente y con descuento a masterclasses de profesionales en activo.',
          'Todo el profesorado de TAG son profesionales en ACTIVO.',
          'Aulas para ensayar.',
          'Descuentos en actividades culturales de Barcelona (teatro, cine, exposiciones…).',
        ],
      },
    ],
    seo: {
      title: 'Garage Mini Kids — Clases de Teatro para Niños de 6 a 8 años en Barcelona | TAG',
      description:
        'Clases de teatro para niños y niñas de 6 a 8 años en Barcelona. Grupos de máximo 12, profesorado en activo y muestra cada cuatrimestre. Inicio septiembre 2026.',
      canonicalPath: '/cursos/garage-mini-kids',
    },
  },

  'garage-kids': {
    slug: 'garage-kids',
    courseName: 'Garage Kids',
    eyebrow: 'Clases de Teatro para Niños de 9 a 12 años · Barcelona',
    heroTitleLines: ['GARAGE', 'KIDS'],
    heroDescription:
      'Clases de teatro para niños y niñas de 9 a 12 años en Barcelona. Técnica actoral real adaptada a su edad, en grupos de doce.',
    heroBgImage: headerBg,
    heroBgOverlayClassName: overlay,
    ctaMode: 'whatsappPlusInlineForm',
    whatsAppExtra: '(9-12 años)',
    inlineFormSource: 'cursos_garage_kids',
    inlineFormDefaultInterest: 'teatro',
    stats: [
      { label: 'Edad', value: '9–12 años' },
      { label: 'Inicio', value: '14 sep 2026' },
      { label: 'Formato', value: '2h/semana' },
      { label: 'Grupo', value: 'Máx. 12 alumnos' },
    ],
    sections: [
      {
        id: 'why',
        title: '¿Por qué teatro a esta edad?',
        body: [
          'Es la edad en la que empiezan a preguntarse quiénes son. El teatro les da un sitio donde probarlo sin consecuencias.',
          'Construir su identidad y autoconocimiento.',
          'Expresarse con mayor profundidad y matices.',
          'Desarrollar pensamiento crítico y análisis.',
          'Trabajar en equipo con mayor responsabilidad.',
          'Aprender herramientas técnicas que les acompañarán toda la vida.',
        ],
      },
      {
        id: 'program',
        title: 'Estructura del programa',
        body: [
          'Curso 2026/2027, dos cuatrimestres, con muestra al final de cada uno.',
          'Formato: 2 horas semanales.',
          'Grupos: máximo 12 alumnos por clase.',
          'No hace falta experiencia previa ni ningún tipo de prueba de acceso.',
        ],
      },
      {
        id: 'program',
        title: 'Qué trabajamos',
        body: [
          'Primer cuatrimestre — Presencia escénica y uso del espacio: ocupar el escenario con confianza y propósito. Expresión corporal avanzada: control corporal, movimiento expresivo y lenguaje no verbal. Proyección vocal y dicción: técnicas para que su voz llegue clara y potente al público. Concentración y escucha activa: estar presente en escena y reaccionar con verdad.',
          'Segundo cuatrimestre — Análisis de personajes: ¿quién es?, ¿qué quiere?, ¿por qué actúa así? Trabajo emocional profundo: emociones complejas y matices (frustración, celos, esperanza, decepción). Creación física del personaje. Trabajo con texto dramático: análisis, memorización y entrega de diálogos con intención. Escenas complejas: conflicto, subtexto y desarrollo dramático. Improvisación estructurada. Ensayos intensivos y montaje final.',
        ],
      },
      {
        id: 'included',
        title: 'Incluido en el programa',
        body: [
          'Sesión de media hora de fotos profesionales (book o artísticas).',
          'Acceso preferente y con descuento a masterclasses de profesionales en activo.',
          'Todo el profesorado de TAG son profesionales en ACTIVO.',
          'Aulas para ensayar.',
          'Descuentos en actividades culturales de Barcelona (teatro, cine, exposiciones…).',
        ],
      },
    ],
    seo: {
      title: 'Garage Kids — Clases de Teatro para Niños de 9 a 12 años en Barcelona | TAG',
      description:
        'Clases de teatro para niños y niñas de 9 a 12 años en Barcelona. Grupos de máximo 12, profesorado en activo y muestra cada cuatrimestre. Inicio septiembre 2026.',
      canonicalPath: '/cursos/garage-kids',
    },
  },

  'garage-new-generation': {
    slug: 'garage-new-generation',
    courseName: 'Garage New Generation',
    eyebrow: 'Teatro para Adolescentes de 13 a 17 años · Barcelona',
    heroTitleLines: ['GARAGE', 'NEW GENERATION'],
    heroQuote: '"JUGAR, PERO JUGAR MUY EN SERIO"',
    heroDescription:
      'Teatro para jóvenes de 13 a 17 años en Barcelona. Del juego a la identidad artística, en grupos de doce y con profesorado en activo.',
    heroBgImage: headerBg,
    heroBgOverlayClassName: overlay,
    videoSrc: genericAnnualVideo,
    videoPoster: genericAnnualVideoPoster,
    ctaMode: 'whatsappPlusInlineForm',
    whatsAppExtra: '(13-17 años)',
    inlineFormSource: 'cursos_garage_new_generation',
    inlineFormDefaultInterest: 'teatro',
    stats: [
      { label: 'Edad', value: '13–17 años' },
      { label: 'Inicio', value: '14 sep 2026' },
      { label: 'Formato', value: '2h/semana' },
      { label: 'Grupo', value: 'Máx. 12 alumnos' },
    ],
    sections: [
      {
        id: 'why',
        title: '¿Por qué New Generation?',
        body: [
          'A esta edad nadie pide permiso para hacer algo que da vergüenza querer. Este es el sitio donde deja de darla.',
          'Explorar su identidad artística y personal.',
          'Mayor autoconocimiento y comprensión de sus emociones.',
          'Canalizar emociones de forma creativa y segura.',
          'Desarrollar presencia escénica y confianza en público.',
          'Aprender herramientas actorales adecuadas a su madurez.',
          'Capacidad de trabajo en equipo con responsabilidad, empatía y comprensión de perspectivas diferentes.',
          'Jugar, pero jugar MUY EN SERIO.',
        ],
      },
      {
        id: 'program',
        title: 'Estructura del programa',
        body: [
          'Curso 2026/2027, dos cuatrimestres, con muestra al final de cada uno.',
          'Formato: 2 horas semanales.',
          'Grupos: máximo 12 alumnos por clase.',
          'Tres recorridos a elegir: Teatro, Cámara o Hybrid, que combina los dos.',
          'No hace falta experiencia previa ni ningún tipo de prueba de acceso.',
        ],
      },
      {
        id: 'program',
        title: 'Qué trabajamos',
        body: [
          'Primer cuatrimestre — Confianza y cohesión grupal: crear un espacio seguro para la expresión. Técnica corporal y presencia escénica: control, energía y uso del espacio. Voz proyectada, articulación y ritmo. Atención, escucha y verdad escénica: estar presente y reaccionar con autenticidad. Creación de personajes a partir de improvisaciones. Consolidación y muestra interna de bloque.',
          'Segundo cuatrimestre — Construcción de personajes: objetivo, conflicto y actitud. Trabajo emocional adaptado a la edad: canalizar emociones de forma creativa y segura. Improvisación: escucha activa, creatividad y resolución espontánea de escenas. Escenas breves contemporáneas: introducción a la escena dialogada y pequeños monólogos. Ensayos de escenas o montaje grupal.',
        ],
      },
      {
        id: 'included',
        title: 'Incluido en el programa',
        body: [
          'Sesión de media hora de fotos profesionales (book o artísticas).',
          'Acceso preferente y con descuento a masterclasses de profesionales en activo.',
          'Todo el profesorado de TAG son profesionales en ACTIVO.',
          'Aulas para ensayar.',
          'Descuentos en actividades culturales de Barcelona (teatro, cine, exposiciones…).',
        ],
      },
    ],
    seo: {
      title: 'Garage New Generation — Teatro para Adolescentes de 13 a 17 años en Barcelona | TAG',
      description:
        'Teatro para jóvenes de 13 a 17 años en Barcelona. Recorridos de teatro y cámara, grupos de máximo 12 y bolsa de casting. Inicio septiembre 2026.',
      canonicalPath: '/cursos/garage-new-generation',
    },
  },
};
