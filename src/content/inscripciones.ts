/**
 * Inscripciones — la información que hoy no está en ninguna parte de la web.
 *
 * Sale del informe de London Film School (docs/reports/lfs-aprendizajes-2026-08-20.html):
 * LFS pone la convocatoria en el hero, la escalera de contacto en cuatro peldaños,
 * las fechas clave y el precio completo. TAG tiene los datos duros pero enterrados
 * en los chips de la ficha de curso.
 *
 * Los datos de curso son los mismos de `coursesConfig.ts` — si cambia el inicio,
 * cambia en los dos lados.
 *
 * 🔴 PENDIENTE DE TAG (los campos vacíos no se pintan):
 *   - `puertasAbiertas.fecha` / `.hora`  → jornada de puertas abiertas o clase de prueba
 *   - `precio.rango` / `.formaPago`       → decisión de la escuela
 *   - `hablaConUnAlumno.url`              → alumnos voluntarios de Garage Pro
 */

export const CURSO = '2026/27';

export type FechaClave = {
  cuando: string;
  que: string;
  detalle?: string;
};

export const fechasClave: FechaClave[] = [
  {
    cuando: 'Abierta',
    que: 'Convocatoria curso 2026/27',
    detalle: 'Las plazas se asignan por orden de entrevista y los grupos son de 14 alumnos como máximo.',
  },
  {
    cuando: '14 sep 2026',
    que: 'Primer día de clase',
    detalle: 'Arrancan todas las formaciones anuales.',
  },
  {
    cuando: '18 jun 2027',
    que: 'Cierre del curso',
    detalle: 'Dos cuatrimestres, con muestra abierta al público en cada asignatura.',
  },
];

export type Peldano = {
  n: string;
  titulo: string;
  que: string;
  /** Qué pasa después de hacerlo — el informe marcaba que los CTA de TAG no lo dicen. */
  despues: string;
  accion: 'email' | 'prueba' | 'alumno' | 'entrevista';
};

/**
 * La escalera de compromiso. LFS tiene cuatro peldaños y TAG dos, los dos altos
 * (WhatsApp con un comercial o dejar el teléfono). Cada peldaño pide menos que el
 * siguiente, así que el que está mirando en enero para septiembre tiene dónde entrar.
 */
export const escalera: Peldano[] = [
  {
    // 🔴 Este peldaño todavía NO es de baja fricción: los dos formularios del sitio
    // (`FormFlyout` e `InlineLeadForm`) piden el teléfono como obligatorio. Decía
    // «Te llega un email. No te llama nadie.» y eso era falso — justo el problema
    // que el informe marca en el punto 7 de copy. Hasta que exista una captura de
    // sólo email, el texto dice lo que de verdad pasa.
    n: '01',
    titulo: 'Recibe el calendario',
    que: 'Las fechas del curso 2026/27, los horarios de cada formación y cuándo son las clases de prueba.',
    despues: 'Te lo mandamos por email el mismo día.',
    accion: 'email',
  },
  {
    n: '02',
    titulo: 'Ven a una clase de prueba',
    que: 'Una clase real, con el grupo y el profesor con los que estudiarías.',
    despues: 'Reservas día y hora. Vienes, y decides después.',
    accion: 'prueba',
  },
  {
    n: '03',
    titulo: 'Habla con un alumno',
    que: 'Alguien que está cursando ahora te cuenta cómo es el día a día, sin nadie de la escuela en el medio.',
    despues: 'Te ponemos en contacto directo.',
    accion: 'alumno',
  },
  {
    n: '04',
    titulo: 'Pide tu plaza',
    que: 'Entrevista con la dirección de la escuela para ver qué formación te corresponde.',
    despues: 'Media hora de charla y, si encaja, reservas la plaza.',
    accion: 'entrevista',
  },
];

export type Faq = {
  pregunta: string;
  respuesta: string;
};

/** Cada pregunta respondida acá es un WhatsApp menos y un alumno que avanza solo. */
export const faqs: Faq[] = [
  {
    pregunta: '¿Hace falta experiencia previa?',
    respuesta:
      'No. Garage Theatre, Garage Cinema y Garage Hybrid arrancan de cero. Garage Pro es la formación profesional de 16 horas semanales y ahí sí hacemos una entrevista para ver en qué punto estás.',
  },
  {
    pregunta: '¿Cuántos alumnos hay por clase?',
    respuesta:
      'Catorce como máximo en Garage Pro y doce en las formaciones de dos horas semanales. Es un tope, no un promedio: cuando se llena el grupo, se cierra.',
  },
  {
    pregunta: '¿Se puede entrar con el curso empezado?',
    respuesta:
      'Depende del grupo y de cuánto haya avanzado. Escríbenos y lo miramos con la fecha concreta.',
  },
  {
    pregunta: '¿Qué incluye la formación?',
    respuesta:
      'Sesión de fotos profesionales, bolsa de casting, el material grabado de tus clases, acceso con descuento a las masterclasses, aulas para ensayar y descuentos culturales.',
  },
  {
    pregunta: '¿Qué es una muestra abierta?',
    respuesta:
      'Todas las asignaturas terminan con una función abierta al público, y queda grabada para analizarla en clase. No es un examen: es trabajar delante de gente, que es de lo que se trata.',
  },
  {
    pregunta: '¿Dónde está la escuela?',
    respuesta:
      'En el Carrer de Londres, en el Eixample de Barcelona. Todas las formaciones son presenciales, salvo Garage Writing, que es online.',
  },
];

/** Lo que entra en la matrícula. Datos que ya están en las fichas de curso. */
export const incluido: string[] = [
  'Sesión de fotos profesionales',
  'Bolsa de casting',
  'El material grabado de tus clases',
  'Masterclasses con descuento',
  'Aulas para ensayar',
  'Descuentos culturales',
];

/** Números en vez de adjetivos — el bloque más persuasivo y el más barato de escribir. */
export const enNumeros: { dato: string; que: string }[] = [
  { dato: '14', que: 'alumnos por clase, como máximo' },
  { dato: '3', que: 'años de formación' },
  { dato: '16h', que: 'por semana en Garage Pro' },
  { dato: '1', que: 'muestra abierta al público por asignatura' },
];

/** 🔴 Lo pide TAG. Mientras esté vacío, el bloque no se pinta. */
export const puertasAbiertas: { fecha: string; hora: string; que: string } = {
  fecha: '',
  hora: '',
  que: 'Conoce las aulas, el plató y a los profesores. Sin compromiso y sin que nadie te venda nada.',
};

/** 🔴 Lo decide TAG. Mientras `rango` esté vacío, se muestra la política, no el número. */
export const precio: { rango: string; formaPago: string } = {
  rango: '',
  formaPago: '',
};

/** 🔴 Lo arma TAG con dos o tres alumnos voluntarios de Garage Pro. */
export const hablaConUnAlumno: { url: string } = { url: '' };

export type Alumni = {
  nombre: string;
  curso: string;
  anio: string;
  /** Qué está haciendo hoy. El dato es la pieza — no hace falta decorarlo. */
  hoy: string;
  foto?: string;
};

/**
 * 🔴 Lo arma TAG. Seis alumnos reales con foto, curso, año y qué hicieron después
 * valen más que ocho testimonios sin nombre. Mientras esté vacío, el bloque no se pinta.
 */
export const alumni: Alumni[] = [];

export type Muestra = {
  titulo: string;
  curso: string;
  anio: string;
  /** URL del vídeo (YouTube/Vimeo) o del archivo alojado. */
  url: string;
  poster?: string;
};

/**
 * 🔴 Lo elige TAG. Todas las muestras se graban, pero nada de ese material está en
 * la web — es la prueba más fuerte que tiene la escuela y hoy está guardada.
 */
export const muestras: Muestra[] = [];

export type FotoEscuela = {
  src: string;
  alt: string;
  /** 'ancha' ocupa las dos columnas. */
  ancho?: 'ancha';
};

/**
 * La escuela por dentro. Hoy sólo hay fotos de ambiente en blanco y negro; lo que
 * hace falta es el aula, el plató y las caras, en color y grandes.
 */
export const fotosEscuela: FotoEscuela[] = [
  { src: '/content/tag-bg.jpg', alt: 'Clase en The Acting Garage, Barcelona', ancho: 'ancha' },
  { src: '/content/tecnica.jpg', alt: 'Trabajo de técnica en el aula' },
  { src: '/content/transformacion.jpg', alt: 'Ensayo de escena' },
  { src: '/content/comunidad.jpg', alt: 'Grupo de alumnos de The Acting Garage' },
  { src: '/content/proyeccion.jpg', alt: 'Rodaje a cámara en la escuela' },
];
