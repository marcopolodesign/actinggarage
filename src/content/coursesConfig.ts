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
  videoSrc?: string; // self-hosted video path (public/), used when there's no youtubeId
  videoPoster?: string; // poster image for videoSrc
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

  'garage-mini-kids': {
    slug: 'garage-mini-kids',
    courseName: 'Garage Mini Kids',
    eyebrow: 'Clases de Teatro para Niños 6–8 años · Barcelona',
    heroTitleLines: ['GARAGE', 'MINI KIDS'],
    heroQuote: '"EL JUEGO COMO HERRAMIENTA"',
    heroDescription: 'Clases de teatro para niños de 6 a 8 años en Barcelona: juego, descubrimiento y expresión libre en un espacio seguro para crecer.',
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
        id: 'why',
        title: '¿Por qué TAG?',
        body: [
          'El teatro infantil debe ser un espacio de juego, descubrimiento y expresión libre.',
          'No buscamos “pequeños actores perfectos”: buscamos niños felices, expresivos y seguros.',
        ],
      },
      {
        id: 'program',
        title: 'Estructura del programa',
        body: [
          'Cuatrimestres: 18 sep 2026 → 5 feb 2027 y 12 feb 2027 → 18 jun 2027.',
          'Formato: 1h30 semanal · grupos máximo 12.',
          'Muestras finales abiertas al público (grabadas y enviadas a las familias).',
          'Q1: juego, cuerpo y grupo (desinhibición, confianza, escucha, trabajo en equipo).',
          'Q2: personajes, emociones y escenas (texto sencillo, improvisaciones guiadas y pequeñas historias).',
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
      title: 'Garage Mini Kids — Clases de Teatro para Niños de 6 a 8 años en Barcelona | TAG',
      description:
        'Clases de teatro infantil en Barcelona para niños y niñas de 6 a 8 años. Juego, confianza, creatividad y muestras grabadas. Curso 2026/2027.',
      canonicalPath: '/cursos/garage-mini-kids',
    },
  },

  'garage-kids': {
    slug: 'garage-kids',
    courseName: 'Garage Kids',
    eyebrow: 'Clases de Teatro para Niños 9–11 años · Barcelona',
    heroTitleLines: ['GARAGE', 'KIDS'],
    heroQuote: '"DEL JUEGO A LA TÉCNICA"',
    heroDescription:
      'Clases de teatro para niños de 9 a 11 años en Barcelona. Entre los 9 y 11 años es el momento ideal para profundizar de forma más técnica sin perder disfrute y creatividad.',
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
        id: 'why',
        title: '¿Por qué TAG?',
        body: [
          'Entre los 9 y 11 años es el momento ideal para profundizar en teatro de forma más técnica sin perder creatividad.',
          'Trabajamos con rigor, respeto por su madurez y un enfoque que equilibra técnica y libertad creativa.',
        ],
      },
      {
        id: 'program',
        title: 'Estructura del programa',
        body: [
          'Inicio: 6 de marzo · Fin: 19 de junio (14 sesiones).',
          'Bloques: fundamentos técnicos → construcción de personajes → montaje y muestra final (grabada).',
          'Formato: viernes 18:00–20:00h · grupos máximo 12.',
        ],
      },
      {
        id: 'program',
        title: 'Filosofía “Del juego a la técnica”',
        body: [
          'No creemos en: técnica sin alma, perfección sin proceso, competir en lugar de colaborar, ni teatro infantilizado.',
          'Creemos en: equilibrio técnica/libertad, compromiso y disciplina como crecimiento, y el teatro como escuela de vida.',
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
      title: 'Garage Kids — Clases de Teatro para Niños de 9 a 11 años en Barcelona | TAG',
      description:
        'Clases de teatro en Barcelona para niños y niñas de 9 a 11 años. Del juego a la técnica actoral, viernes 18–20h, muestra final grabada.',
      canonicalPath: '/cursos/garage-kids',
    },
  },

  'garage-new-generation': {
    slug: 'garage-new-generation',
    courseName: 'Garage New Generation',
    eyebrow: 'Clases de Teatro para Adolescentes 13–17 años · Barcelona',
    heroTitleLines: ['GARAGE NEW', 'GENERATION'],
    heroQuote: '"DEL JUEGO A LA IDENTIDAD ARTÍSTICA"',
    heroDescription:
      'Clases de teatro para adolescentes de 13 a 17 años en Barcelona: presencia, personaje, emoción y escena en un entorno seguro y exigente.',
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
      title: 'Garage New Generation — Clases de Teatro para Adolescentes en Barcelona | TAG',
      description:
        'Clases de teatro para adolescentes de 13 a 17 años en Barcelona. Del juego a la identidad artística, grupos reducidos y muestras grabadas.',
      canonicalPath: '/cursos/garage-new-generation',
    },
  },

  'garage-new-generation-cinema': {
    slug: 'garage-new-generation-cinema',
    courseName: 'Garage New Generation Cinema',
    eyebrow: 'Clases de Actuación para Cámara Adolescentes 13–17 años · Barcelona',
    heroTitleLines: ['NEW GENERATION', 'CINEMA'],
    heroQuote: '"CONOCERSE DELANTE DE LA CÁMARA"',
    heroDescription:
      'Clases de actuación para cámara para adolescentes de 13 a 17 años en Barcelona: presencia ante el objetivo, personaje, emoción y técnica básica de rodaje.',
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
        id: 'why',
        title: '¿Por qué TAG?',
        body: [
          'En adolescencia, la cámara ofrece un espacio para explorar identidad, emociones intensas y presencia delante del objetivo.',
          'Buscamos jóvenes con criterio propio, capaces de comprometerse con el trabajo de cámara y encontrar su voz artística.',
        ],
      },
      {
        id: 'program',
        title: 'Estructura del programa',
        body: [
          'Cuatrimestres: 14 sep 2026 → 5 feb 2027 y 8 feb 2027 → 18 jun 2027.',
          'Rodajes: monólogo (Q1) y escena en pareja (Q2). Material grabado disponible.',
          'Formato: 2 horas semanales · grupos máximo 12.',
        ],
      },
      {
        id: 'program',
        title: 'Qué se trabaja',
        body: [
          'Q1 — Fundamentos: conexión con cámara y presencia (relajación, tensión, imaginación, textos contemporáneos).',
          'Rodaje Q1: monólogo (1,5–2 min).',
          'Q2 — Avanzado: personajes, emoción y técnica básica de rodaje (subtexto, escenas en pareja).',
          'Rodaje Q2: escena en pareja (2–3 min).',
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
      title: 'New Generation Cinema — Clases de Actuación para Cámara para Adolescentes en Barcelona | TAG',
      description:
        'Clases de actuación para cámara para adolescentes de 13 a 17 años en Barcelona. Rodajes, material grabado y grupos reducidos.',
      canonicalPath: '/cursos/garage-new-generation-cinema',
    },
  },

  'garage-new-generation-hybrid': {
    slug: 'garage-new-generation-hybrid',
    courseName: 'Garage New Generation Hybrid',
    eyebrow: 'Clases de Teatro y Cámara Adolescentes 13–17 años · Barcelona',
    heroTitleLines: ['NEW GENERATION', 'HYBRID'],
    heroQuote: '"DEL JUEGO A LA IDENTIDAD ARTÍSTICA"',
    heroDescription:
      'Clases de teatro e interpretación para cámara para adolescentes de 13 a 17 años en Barcelona: 4h semanales (2h teatro + 2h cámara) para orientar su camino artístico.',
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
      title: 'New Generation Hybrid — Clases de Teatro y Cámara para Adolescentes en Barcelona | TAG',
      description:
        'Clases de teatro e interpretación para cámara combinadas para adolescentes de 13 a 17 años en Barcelona. 4h semanales, rodajes y muestras grabadas.',
      canonicalPath: '/cursos/garage-new-generation-hybrid',
    },
  },

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
};

