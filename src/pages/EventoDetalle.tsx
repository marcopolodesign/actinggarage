/**
 * /calendario/:slug — la ficha de un evento suelto.
 *
 * Existe sobre todo para compartir: cuando Andrés o Tony mandan una muestra por
 * WhatsApp o la ponen en la bio de Instagram, el enlace tiene que abrir en ese
 * evento y no en la agenda entera. Por eso también arma el JSON-LD de `Event`,
 * que es lo que hace que Google muestre la fecha en el resultado de búsqueda.
 *
 * A diferencia del resto del sitio, el <head> de esta ruta no se puede
 * prerenderizar: el contenido depende de la fila de la base de datos. Los
 * buscadores lo indexan igual porque ejecutan JS, y la agenda —que sí es
 * estable— sí está prerenderizada.
 */
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import type { TagEvent } from '../lib/events';
import {
  fetchEventBySlug, longDate, timeRange, placeOf, priceLabel, typeLabel, isOpenType,
} from '../lib/events';

const EventoDetalle: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<TagEvent | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let vivo = true;
    setCargando(true);
    fetchEventBySlug(slug)
      .then((data) => { if (vivo) setEvent(data); })
      .catch((err) => { if (vivo) setError(err.message); })
      .finally(() => { if (vivo) setCargando(false); });
    return () => { vivo = false; };
  }, [slug]);

  const cancelado = event?.status === 'cancelado';
  const lugar = event ? placeOf(event) : null;
  const precio = event ? priceLabel(event) : null;

  // Datos estructurados para Google. Sólo con evento cargado y no cancelado.
  const jsonLd = event && !cancelado ? {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.starts_at,
    ...(event.ends_at ? { endDate: event.ends_at } : {}),
    eventAttendanceMode: event.is_online
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    ...(event.description ? { description: event.description } : {}),
    ...(event.image_url ? { image: [event.image_url] } : {}),
    location: event.is_online
      ? { '@type': 'VirtualLocation', url: event.online_url || 'https://www.theactinggarage.com' }
      : {
          '@type': 'Place',
          name: event.location_name || 'The Acting Garage',
          address: event.address || 'C/ Còrsega 340, Barcelona',
        },
    organizer: {
      '@type': 'Organization',
      name: 'The Acting Garage',
      url: 'https://www.theactinggarage.com',
    },
  } : null;

  return (
    <>
      <Helmet>
        <title>{event ? `${event.title} - The Acting Garage` : 'Calendario - The Acting Garage'}</title>
        {event && (
          <meta
            name="description"
            content={event.description || `${typeLabel(event.type)} en The Acting Garage — ${longDate(event.starts_at)}.`}
          />
        )}
        {event && <meta property="og:title" content={`${event.title} - The Acting Garage`} />}
        {event?.description && <meta property="og:description" content={event.description} />}
        {event?.image_url && <meta property="og:image" content={event.image_url} />}
        {event && (
          <link rel="canonical" href={`https://www.theactinggarage.com/calendario/${event.slug}`} />
        )}
        {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
      </Helmet>

      <Header showOnScroll={false} />

      <div className="min-h-screen bg-black pt-28 pb-24">
        <div className="mx-auto max-w-3xl px-6 md:px-8">
          <Link
            to="/calendario"
            className="font-mdio text-[11px] uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-tag-yellow"
          >
            ← Calendario
          </Link>

          {cargando && (
            <p className="font-mdio mt-16 text-sm uppercase tracking-[0.2em] text-white/40">
              Cargando…
            </p>
          )}

          {error && (
            <p className="font-mdio mt-16 text-sm text-white/70">
              No hemos podido cargar el evento: {error}
            </p>
          )}

          {!cargando && !error && !event && (
            <div className="mt-16">
              <h1 className="font-druk text-3xl uppercase text-white md:text-5xl">
                Esta fecha ya no está
              </h1>
              <p className="font-garamond mt-4 text-lg text-white/70">
                Puede que el evento se haya retirado o que el enlace esté mal.
                En el calendario están todas las fechas vigentes.
              </p>
              <Link
                to="/calendario"
                className="mt-8 inline-block bg-tag-yellow px-8 py-3 font-mdio text-sm font-bold uppercase tracking-[0.1em] text-black transition-colors duration-300 hover:bg-white"
              >
                Ver el calendario
              </Link>
            </div>
          )}

          {event && (
            <article className="mt-10">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`font-mdio text-[11px] uppercase tracking-[0.25em] ${
                    isOpenType(event.type) ? 'text-tag-yellow' : 'text-white/50'
                  }`}
                >
                  {typeLabel(event.type)}
                </span>
                {cancelado && (
                  <span className="border border-white/40 px-2 py-0.5 font-mdio text-[10px] uppercase tracking-[0.2em] text-white/60">
                    Cancelado
                  </span>
                )}
              </div>

              <h1
                className={`font-druk mt-4 text-4xl uppercase leading-none text-white md:text-6xl ${
                  cancelado ? 'line-through opacity-60' : ''
                }`}
              >
                {event.title}
              </h1>

              {event.image_url && (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="mt-8 w-full object-cover"
                  loading="lazy"
                />
              )}

              <dl className="mt-10 border-t border-white/10">
                {[
                  ['Cuándo', `${longDate(event.starts_at)} · ${timeRange(event)}`],
                  ['Dónde', lugar],
                  ['Plazas', event.capacity ? `${event.capacity}` : null],
                  ['Precio', precio],
                ]
                  .filter(([, valor]) => !!valor)
                  .map(([etiqueta, valor]) => (
                    <div key={etiqueta as string} className="flex flex-wrap gap-2 border-b border-white/10 py-4">
                      <dt className="font-mdio w-28 flex-shrink-0 text-[11px] uppercase tracking-[0.2em] text-white/40">
                        {etiqueta}
                      </dt>
                      <dd className="font-mdio text-base text-white">{valor}</dd>
                    </div>
                  ))}
              </dl>

              {event.description && (
                <div className="font-garamond mt-10 whitespace-pre-line text-lg leading-relaxed text-white/80">
                  {event.description}
                </div>
              )}

              {!cancelado && (event.cta_url || (event.is_online && event.online_url)) && (
                <a
                  href={event.cta_url || event.online_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-12 inline-block bg-tag-yellow px-10 py-4 font-mdio text-base font-bold uppercase tracking-[0.1em] text-black transition-colors duration-300 hover:bg-white"
                >
                  {event.cta_label || (event.is_online ? 'Entrar a la sesión' : 'Más información')}
                </a>
              )}
            </article>
          )}
        </div>
      </div>
    </>
  );
};

export default EventoDetalle;
