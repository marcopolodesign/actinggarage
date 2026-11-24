import React from 'react';
import { useFormFlyout } from '../context/FormFlyoutContext';

/*
 * Próxima edición de Garage Writing (enero 2027, con Sergio Serrano). Se muestra dentro de la
 * ficha "Garage Writing" en /cursos. Textos e imágenes salen de las piezas que pasó la escuela
 * por la sala (2026-11-24). El botón abre el formulario con 'Garage Writing', que ya existe en
 * COURSES de FormFlyout: no cambia la atribución.
 */
const WRITING = {
  titulo: 'Encuentra tu propia voz teatral',
  lema: '“Escribir desde el latido”',
  tipo: 'Taller de escritura teatral',
  profesor: 'Sergio Serrano',
  rolProfesor: 'Dramaturgo, guionista y director',
  bio: 'Autor de La mancha y El artefacto, obras con candidaturas a los Premios Max. Ganador del Premio Internacional de Teatro Ricardo López Aranda y del Premio de la Crítica Valenciana.',
  descripcion:
    'Un laboratorio de escritura para explorar la experiencia personal, construir universos propios y transformar nuestras inquietudes en material dramático.',
  temas: [
    'Escritura desde la experiencia propia.',
    'Creación de escenas y atmósferas.',
    'Lenguaje y estructuras dramáticas.',
    'Desarrollo y revisión de una obra propia.',
  ],
  metodo:
    'A través de ejercicios prácticos, lecturas y trabajo colectivo sobre los textos de cada participante.',
  datos: [
    { label: 'Inicio', value: 'Enero 2027' },
    { label: 'Duración', value: '12 sesiones' },
    { label: 'Horario', value: 'Martes 17–20 h' },
    { label: 'Modalidad', value: 'Online' },
  ],
  imagenes: [
    { src: '/content/writing/voz-teatral-1.jpg', alt: 'Garage Writing: Encuentra tu propia voz teatral, con Sergio Serrano' },
    { src: '/content/writing/voz-teatral-2.jpg', alt: 'Sobre el taller: qué trabajaremos' },
    { src: '/content/writing/voz-teatral-3.jpg', alt: 'Sobre el profesor: Sergio Serrano' },
    { src: '/content/writing/voz-teatral-4.jpg', alt: 'Inscripciones abiertas: enero 2027, 12 sesiones online' },
  ],
};

const ProximoWriting: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { openFlyout } = useFormFlyout();

  return (
    <div className={`text-left ${className}`}>
      <span className="text-tag-yellow text-[11px] uppercase tracking-widest font-druk block mb-4">
        Próxima edición · Inscripciones abiertas
      </span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
        <img src={WRITING.imagenes[0].src} alt={WRITING.imagenes[0].alt} className="w-full h-auto block" loading="lazy" />

        <div className="flex flex-col">
          <span className="text-white/50 text-[11px] uppercase tracking-widest font-druk mb-2">{WRITING.tipo}</span>
          <h3 className="font-druk text-white uppercase leading-none mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            {WRITING.titulo}
          </h3>
          <p className="text-tag-yellow/80 font-garamond text-xl italic mb-6">{WRITING.lema}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {WRITING.datos.map(({ label, value }) => (
              <div key={label} className="border border-white/10 px-4 py-2 flex flex-col">
                <span className="text-white/40 text-[11px] uppercase tracking-widest font-druk">{label}</span>
                <span className="text-white text-base font-druk">{value}</span>
              </div>
            ))}
          </div>

          <p className="text-white/70 font-garamond text-xl leading-relaxed mb-8">{WRITING.descripcion}</p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openFlyout('Garage Writing');
            }}
            className="self-start px-8 py-3 bg-tag-yellow text-black font-bold text-lg uppercase transition-all duration-300 hover:bg-white"
          >
            QUIERO MÁS INFORMACIÓN
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div>
          <h4 className="font-druk text-white uppercase text-2xl mb-4">¿Qué trabajaremos?</h4>
          <ul className="space-y-2 mb-4">
            {WRITING.temas.map((t) => (
              <li key={t} className="text-white/80 font-garamond text-xl leading-snug flex gap-3">
                <span className="text-tag-yellow">*</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <p className="text-white/60 font-garamond text-lg italic leading-relaxed">{WRITING.metodo}</p>
        </div>
        <div>
          <h4 className="font-druk text-white uppercase text-2xl mb-1">{WRITING.profesor}</h4>
          <p className="text-tag-yellow/80 text-[11px] uppercase tracking-widest font-druk mb-4">{WRITING.rolProfesor}</p>
          <p className="text-white/70 font-garamond text-xl leading-relaxed">{WRITING.bio}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-10">
        {WRITING.imagenes.slice(1).map((img) => (
          <img key={img.src} src={img.src} alt={img.alt} className="w-full h-auto block" loading="lazy" />
        ))}
      </div>
    </div>
  );
};

export default ProximoWriting;
