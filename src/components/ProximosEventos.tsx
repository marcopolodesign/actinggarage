/**
 * Bloque de "Próximas fechas" para la home.
 *
 * Muestra los tres eventos más cercanos y lleva al calendario. Es el único
 * contenido de la home que cambia solo, sin que nadie toque el sitio: mientras
 * haya fechas cargadas, quien entra por búsqueda orgánica ve que la escuela
 * está viva y tiene un motivo para volver.
 *
 * Si no hay eventos publicados, el componente no pinta nada. Una sección
 * "Próximas fechas" vacía comunica lo contrario de lo que se busca.
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { TagEvent } from '../lib/events';
import {
  fetchUpcomingEvents, dayNumber, monthLabel, monthKey, timeRange, placeOf,
  typeLabel, isOpenType,
} from '../lib/events';

const ProximosEventos: React.FC = () => {
  const [events, setEvents] = useState<TagEvent[]>([]);

  useEffect(() => {
    let vivo = true;
    fetchUpcomingEvents(3)
      .then((data) => { if (vivo) setEvents(data); })
      // En la home un fallo de red no puede romper el resto de la página:
      // el bloque simplemente no aparece.
      .catch((err) => console.error('No se pudieron cargar los próximos eventos:', err));
    return () => { vivo = false; };
  }, []);

  if (!events.length) return null;

  return (
    <section className="bg-black px-6 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <p className="font-mdio text-[11px] uppercase tracking-[0.25em] text-tag-yellow">
              Agenda
            </p>
            <h2 className="font-druk mt-3 text-4xl uppercase leading-none text-white md:text-6xl">
              Próximas fechas
            </h2>
          </div>
          <Link
            to="/calendario"
            className="font-mdio text-[11px] uppercase tracking-[0.2em] text-white/50 transition-colors hover:text-tag-yellow"
          >
            Ver el calendario →
          </Link>
        </div>

        <div className="grid gap-px bg-white/10 md:grid-cols-3">
          {events.map((e) => (
            <Link
              key={e.id}
              to={`/calendario/${e.slug}`}
              className="group bg-black p-6 transition-colors duration-300 hover:bg-white/[0.03] md:p-8"
            >
              <div className="flex items-baseline gap-3">
                <span
                  className={`font-druk text-5xl leading-none ${
                    isOpenType(e.type) ? 'text-tag-yellow' : 'text-white'
                  }`}
                >
                  {dayNumber(e.starts_at)}
                </span>
                <span className="font-mdio text-[11px] uppercase tracking-[0.2em] text-white/40">
                  {monthLabel(monthKey(e.starts_at)).split(' ')[0]}
                </span>
              </div>

              <p className="font-mdio mt-5 text-[10px] uppercase tracking-[0.2em] text-white/40">
                {typeLabel(e.type)}
              </p>
              <h3 className="font-druk mt-2 text-xl uppercase leading-tight text-white transition-colors group-hover:text-tag-yellow">
                {e.title}
              </h3>
              <p className="font-mdio mt-3 text-sm text-white/50">
                {timeRange(e)}
                {placeOf(e) && <span className="text-white/30"> · {placeOf(e)}</span>}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProximosEventos;
