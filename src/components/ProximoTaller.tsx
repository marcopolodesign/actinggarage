import React from 'react';
import { useFormFlyout } from '../context/FormFlyoutContext';

/*
 * Próximo taller de Garage Workshops. Se muestra dentro de la ficha de Garage Workshops
 * en /cursos y en /pro. Para cambiar de taller, editar TALLER; pasada la fecha `hasta`
 * el bloque se oculta solo, así no queda publicado un taller que ya pasó.
 */
export const TALLER = {
  etiqueta: 'Master Class',
  titulo: 'Entrenamiento mental para actores',
  imparte: 'Clara Núñez',
  rol: 'Mental trainer',
  fecha: 'Sábado 28 de noviembre',
  horario: 'De 10:00 a 14:30 h',
  descripcion:
    'Un taller práctico para gestionar el estrés, transformar los estados emocionales que te limitan y ganar seguridad en escena.',
  imagen: '/content/workshops/entrenamiento-mental-actores.jpg',
  youtubeId: 'U_GHojWg4XM',
  // Último momento en que se muestra (hora de Barcelona).
  hasta: '2026-11-28T14:30:00+01:00',
};

export const tallerVigente = () => Date.now() < new Date(TALLER.hasta).getTime();

const ProximoTaller: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { openFlyout } = useFormFlyout();
  if (!tallerVigente()) return null;

  return (
    <div className={`text-left ${className}`}>
      <span className="text-tag-yellow text-[11px] uppercase tracking-widest font-druk block mb-4">
        Próximo taller · {TALLER.etiqueta}
      </span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
        <img
          src={TALLER.imagen}
          alt={`${TALLER.titulo}, con ${TALLER.imparte}`}
          className="w-full h-auto block"
          loading="lazy"
        />

        <div className="flex flex-col">
          <h3
            className="font-druk text-white uppercase leading-none mb-3"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
          >
            {TALLER.titulo}
          </h3>
          <p className="text-tag-yellow/80 font-garamond text-xl italic mb-6">
            Con {TALLER.imparte}, {TALLER.rol.toLowerCase()}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { label: 'Fecha', value: TALLER.fecha },
              { label: 'Horario', value: TALLER.horario },
            ].map(({ label, value }) => (
              <div key={label} className="border border-white/10 px-4 py-2 flex flex-col">
                <span className="text-white/40 text-[11px] uppercase tracking-widest font-druk">{label}</span>
                <span className="text-white text-base font-druk">{value}</span>
              </div>
            ))}
          </div>

          <p className="text-white/70 font-garamond text-xl leading-relaxed mb-8">{TALLER.descripcion}</p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openFlyout('Garage Workshops');
            }}
            className="self-start px-8 py-3 bg-tag-yellow text-black font-bold text-lg uppercase transition-all duration-300 hover:bg-white"
          >
            QUIERO APUNTARME
          </button>
        </div>
      </div>

      <div className="relative w-full mt-8" style={{ paddingTop: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${TALLER.youtubeId}?rel=0`}
          title={TALLER.titulo}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default ProximoTaller;
