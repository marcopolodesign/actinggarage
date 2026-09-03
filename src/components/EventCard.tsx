/**
 * Ficha de un evento dentro del timeline.
 *
 * Es la misma pieza en móvil y en escritorio: lo que cambia entre uno y otro es
 * el ancho de la columna, no la ficha. Así el calendario se lee igual en los dos
 * sitios y no hay dos maquetaciones que mantener.
 *
 * Sigue el sistema de TAG: sin bordes de contenedor, sin sombras, sin esquinas
 * redondeadas y con un solo acento —el amarillo—. La jerarquía la marcan el
 * número del día en Druk y la etiqueta del tipo en versalitas.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import type { TagEvent } from '../lib/events';
import {
  dayNumber, weekdayName, timeRange, placeOf, priceLabel, typeLabel, isOpenType,
} from '../lib/events';

interface Props {
  event: TagEvent;
  /** Ancla para que el clic en el calendario de escritorio salte hasta acá. */
  anchorId?: string;
  destacar?: boolean;
}

const EventCard: React.FC<Props> = ({ event, anchorId, destacar }) => {
  const cancelado = event.status === 'cancelado';
  const abierto = isOpenType(event.type);
  const lugar = placeOf(event);
  const precio = priceLabel(event);

  return (
    <article
      id={anchorId}
      className={`group relative scroll-mt-28 py-8 transition-opacity duration-300 ${
        cancelado ? 'opacity-50' : ''
      }`}
    >
      <div className="flex gap-5 md:gap-8">
        {/* Día */}
        <div className="w-14 md:w-20 flex-shrink-0 text-center">
          <div
            className={`font-druk leading-none text-4xl md:text-5xl ${
              abierto ? 'text-tag-yellow' : 'text-white'
            } ${cancelado ? 'line-through' : ''}`}
          >
            {dayNumber(event.starts_at)}
          </div>
          <div className="font-mdio mt-2 text-[10px] uppercase tracking-[0.2em] text-white/40">
            {weekdayName(event.starts_at)}
          </div>
        </div>

        {/* Contenido */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span
              className={`font-mdio text-[10px] uppercase tracking-[0.2em] ${
                abierto ? 'text-tag-yellow' : 'text-white/50'
              }`}
            >
              {typeLabel(event.type)}
            </span>
            {destacar && !cancelado && (
              <span className="bg-tag-yellow px-2 py-0.5 font-mdio text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                Destacado
              </span>
            )}
            {cancelado && (
              <span className="border border-white/40 px-2 py-0.5 font-mdio text-[10px] uppercase tracking-[0.2em] text-white/60">
                Cancelado
              </span>
            )}
          </div>

          <h3 className="font-druk mt-2 text-2xl uppercase leading-tight text-white md:text-3xl">
            <Link to={`/calendario/${event.slug}`} className="transition-colors hover:text-tag-yellow">
              {event.title}
            </Link>
          </h3>

          <p className="font-mdio mt-2 text-sm text-white/60">
            {timeRange(event)}
            {lugar && <span className="text-white/40"> · {lugar}</span>}
            {precio && <span className="text-white/40"> · {precio}</span>}
          </p>

          {event.description && (
            <p className="font-garamond mt-3 max-w-2xl text-base leading-relaxed text-white/70 line-clamp-3">
              {event.description}
            </p>
          )}

          {event.cta_url && !cancelado && (
            <a
              href={event.cta_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block bg-tag-yellow px-6 py-2.5 font-mdio text-sm font-bold uppercase tracking-[0.1em] text-black transition-colors duration-300 hover:bg-white"
            >
              {event.cta_label || 'Más información'}
            </a>
          )}
        </div>
      </div>

      {/* La línea de tiempo: una regla fina entre eventos, nada más. */}
      <div className="mt-8 h-px w-full bg-white/10" />
    </article>
  );
};

export default EventCard;
