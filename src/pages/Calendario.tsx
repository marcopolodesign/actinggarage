/**
 * /calendario — la agenda pública de la escuela.
 *
 * Dos lecturas de los mismos datos:
 *
 * · Móvil: timeline vertical agrupado por mes. La escuela no tiene eventos todos
 *   los días, así que una cuadrícula mensual en un teléfono sería sobre todo
 *   celdas vacías; la lista aprovecha el alto y se recorre de un scroll.
 * · Escritorio: la cuadrícula del mes a la izquierda —para ubicarse de un
 *   vistazo— y el mismo timeline a la derecha. Al pulsar un día con evento, la
 *   lista salta hasta él. La cuadrícula sola escondería la información en un
 *   modal, que es justo lo que hay que evitar cuando lo que se quiere es que la
 *   gente lea de qué va cada cosa.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import EventCard from '../components/EventCard';
import { useFormFlyout } from '../context/FormFlyoutContext';
import type { TagEvent, EventType } from '../lib/events';
import {
  fetchUpcomingEvents, groupByMonth, monthGrid, monthLabel,
  ymd, typeLabel, DIAS_SEMANA,
} from '../lib/events';

const anchorOf = (e: TagEvent) => `evento-${e.slug}`;

const Calendario: React.FC = () => {
  const [events, setEvents] = useState<TagEvent[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<EventType | 'todos'>('todos');
  const [mesVisible, setMesVisible] = useState<string | null>(null); // "2026-10"
  const { openFlyout } = useFormFlyout();

  useEffect(() => {
    let vivo = true;
    fetchUpcomingEvents()
      .then((data) => { if (vivo) setEvents(data); })
      // El mensaje real importa: si la consulta falla queremos verlo, no un
      // "algo salió mal" que obligue a abrir la consola para diagnosticar.
      .catch((err) => { if (vivo) setError(err.message); })
      .finally(() => { if (vivo) setCargando(false); });
    return () => { vivo = false; };
  }, []);

  // Tipos realmente presentes: no tiene sentido ofrecer "Casting" si no hay ninguno.
  const tipos = useMemo(() => {
    const vistos: EventType[] = [];
    for (const e of events) if (!vistos.includes(e.type)) vistos.push(e.type);
    return vistos;
  }, [events]);

  const visibles = useMemo(
    () => (filtro === 'todos' ? events : events.filter((e) => e.type === filtro)),
    [events, filtro]
  );

  const grupos = useMemo(() => groupByMonth(visibles), [visibles]);

  // El calendario arranca en el mes del primer evento, no en el mes actual: si
  // la próxima muestra es en noviembre, abrir en un octubre vacío no ayuda.
  useEffect(() => {
    if (!mesVisible && grupos.length) setMesVisible(grupos[0].key);
  }, [grupos, mesVisible]);

  const [anio, mes] = (mesVisible ?? '').split('-').map(Number);
  const semanas = useMemo(
    () => (mesVisible ? monthGrid(anio, mes - 1) : []),
    [mesVisible, anio, mes]
  );

  /** Día del mes visible → primer evento de ese día, para pintar y para saltar. */
  const eventosPorDia = useMemo(() => {
    const mapa = new Map<number, TagEvent[]>();
    if (!mesVisible) return mapa;
    for (const e of visibles) {
      const [y, m, d] = ymd(e.starts_at).split('-').map(Number);
      if (y !== anio || m !== mes) continue;
      const previos = mapa.get(d) ?? [];
      previos.push(e);
      mapa.set(d, previos);
    }
    return mapa;
  }, [visibles, mesVisible, anio, mes]);

  const mesesConEventos = useMemo(() => grupos.map((g) => g.key), [grupos]);
  const indiceMes = mesVisible ? mesesConEventos.indexOf(mesVisible) : -1;

  /**
   * La cuadrícula sigue al scroll de la lista. Sin esto uno baja hasta los
   * eventos de noviembre y el calendario de al lado sigue mostrando septiembre,
   * que es peor que no tener calendario: dice algo falso.
   */
  useEffect(() => {
    if (!mesesConEventos.length) return;
    let pendiente = false;

    const alScrollear = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        pendiente = false;
        // El mes activo es el último cuyo encabezado ya pasó por debajo de la
        // cabecera fija (~180px), o el primero si todavía no pasó ninguno.
        let activo = mesesConEventos[0];
        for (const key of mesesConEventos) {
          const top = document.getElementById(`mes-${key}`)?.getBoundingClientRect().top;
          if (top !== undefined && top <= 180) activo = key;
        }
        setMesVisible((previo) => (previo === activo ? previo : activo));
      });
    };

    window.addEventListener('scroll', alScrollear, { passive: true });
    return () => window.removeEventListener('scroll', alScrollear);
  }, [mesesConEventos]);

  const irAlMes = (key: string | undefined) => {
    if (!key) return;
    document.getElementById(`mes-${key}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const irAlDia = (dia: number) => {
    const delDia = eventosPorDia.get(dia);
    if (!delDia?.length) return;
    document.getElementById(anchorOf(delDia[0]))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const tituloSEO = 'Calendario de The Acting Garage — muestras, workshops y castings en Barcelona';
  const descripcionSEO =
    'Agenda de The Acting Garage: muestras, funciones, workshops, masterclass, castings e inicios de curso de la escuela de interpretación en Barcelona.';

  return (
    <>
      <Helmet>
        <title>Calendario - The Acting Garage</title>
        <meta name="title" content={tituloSEO} />
        <meta name="description" content={descripcionSEO} />
        <meta name="keywords" content="calendario acting garage, muestras teatro barcelona, workshops interpretación, castings barcelona, agenda escuela de teatro" />

        {/* Open Graph */}
        <meta property="og:title" content={tituloSEO} />
        <meta property="og:description" content={descripcionSEO} />
        <meta property="og:url" content="https://www.theactinggarage.com/calendario" />

        {/* Twitter */}
        <meta name="twitter:title" content={tituloSEO} />
        <meta name="twitter:description" content={descripcionSEO} />

        {/* LLM Tags */}
        <meta name="ai:title" content={tituloSEO} />
        <meta name="ai:description" content={descripcionSEO} />

        {/* Canonical */}
        <link rel="canonical" href="https://www.theactinggarage.com/calendario" />
      </Helmet>

      <Header showOnScroll={false} />

      <div className="min-h-screen bg-black pt-28 pb-24">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          {/* Cabecera */}
          <header className="border-b border-white/10 pb-10">
            <p className="font-mdio text-[11px] uppercase tracking-[0.25em] text-tag-yellow">
              The Acting Garage
            </p>
            <h1 className="font-druk mt-3 text-5xl uppercase leading-none text-white md:text-7xl">
              Calendario
            </h1>
            <p className="font-garamond mt-5 max-w-2xl text-lg leading-relaxed text-white/70">
              Todo lo que pasa en la escuela: muestras y funciones abiertas al público, workshops,
              masterclass, castings e inicios de curso.
            </p>
          </header>

          {/* Filtros por tipo */}
          {tipos.length > 1 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {(['todos', ...tipos] as (EventType | 'todos')[]).map((t) => {
                const activo = filtro === t;
                return (
                  <button
                    key={t}
                    onClick={() => { setFiltro(t); setMesVisible(null); }}
                    className={`font-mdio px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-colors duration-200 ${
                      activo
                        ? 'bg-tag-yellow text-black'
                        : 'border border-white/20 text-white/60 hover:border-white hover:text-white'
                    }`}
                  >
                    {t === 'todos' ? 'Todo' : typeLabel(t)}
                  </button>
                );
              })}
            </div>
          )}

          {/* Estados */}
          {cargando && (
            <p className="font-mdio mt-16 text-sm uppercase tracking-[0.2em] text-white/40">
              Cargando agenda…
            </p>
          )}

          {error && (
            <p className="font-mdio mt-16 text-sm text-white/70">
              No hemos podido cargar el calendario: {error}
            </p>
          )}

          {!cargando && !error && visibles.length === 0 && (
            <div className="mt-16 max-w-xl">
              <h2 className="font-druk text-2xl uppercase text-white">
                Ahora mismo no hay fechas publicadas
              </h2>
              <p className="font-garamond mt-4 text-lg leading-relaxed text-white/70">
                Las muestras y los workshops se anuncian con semanas de antelación. Déjanos tus datos
                y te avisamos en cuanto haya una nueva fecha.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                {/* Se abre sin curso a propósito: el select del formulario sólo
                    admite nombres del catálogo, así que pasarle "Calendario"
                    dejaría el campo vacío en silencio. */}
                <button
                  onClick={() => openFlyout()}
                  className="bg-tag-yellow px-8 py-3 font-mdio text-sm font-bold uppercase tracking-[0.1em] text-black transition-colors duration-300 hover:bg-white"
                >
                  Quiero que me aviséis
                </button>
                <Link
                  to="/cursos"
                  className="border border-white/40 px-8 py-3 font-mdio text-sm font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-black"
                >
                  Ver los cursos
                </Link>
              </div>
            </div>
          )}

          {/* Calendario + timeline */}
          {!cargando && !error && visibles.length > 0 && (
            <div className="mt-12 lg:grid lg:grid-cols-[300px_1fr] lg:gap-16">
              {/* Cuadrícula del mes — sólo escritorio */}
              <aside className="hidden lg:block">
                <div className="sticky top-28">
                  <div className="flex items-center justify-between">
                    <h2 className="font-druk text-xl uppercase text-white">
                      {mesVisible ? monthLabel(mesVisible) : ''}
                    </h2>
                    <div className="flex gap-1">
                      <button
                        onClick={() => irAlMes(mesesConEventos[indiceMes - 1])}
                        disabled={indiceMes <= 0}
                        aria-label="Mes anterior con eventos"
                        className="h-8 w-8 border border-white/20 font-mdio text-white/70 transition-colors hover:border-white hover:text-white disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/20"
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => irAlMes(mesesConEventos[indiceMes + 1])}
                        disabled={indiceMes < 0 || indiceMes >= mesesConEventos.length - 1}
                        aria-label="Mes siguiente con eventos"
                        className="h-8 w-8 border border-white/20 font-mdio text-white/70 transition-colors hover:border-white hover:text-white disabled:cursor-not-allowed disabled:border-white/10 disabled:text-white/20"
                      >
                        ›
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-7 gap-1">
                    {DIAS_SEMANA.map((d, i) => (
                      <div
                        key={`${d}-${i}`}
                        className="font-mdio pb-2 text-center text-[10px] uppercase tracking-[0.15em] text-white/30"
                      >
                        {d}
                      </div>
                    ))}

                    {semanas.flat().map((dia, i) => {
                      if (dia === null) return <div key={`v-${i}`} className="h-10" />;
                      const delDia = eventosPorDia.get(dia);
                      const tiene = !!delDia?.length;
                      return (
                        <button
                          key={`${mesVisible}-${dia}`}
                          onClick={() => irAlDia(dia)}
                          disabled={!tiene}
                          aria-label={
                            tiene ? `${delDia!.length} evento(s) el ${dia}` : `${dia}, sin eventos`
                          }
                          className={`font-mdio relative h-10 text-sm transition-colors duration-200 ${
                            tiene
                              ? 'bg-tag-yellow font-bold text-black hover:bg-white'
                              : 'cursor-default text-white/25'
                          }`}
                        >
                          {dia}
                        </button>
                      );
                    })}
                  </div>

                  <p className="font-mdio mt-6 text-[10px] uppercase leading-relaxed tracking-[0.15em] text-white/30">
                    Pulsa un día marcado para ir a su ficha
                  </p>
                </div>
              </aside>

              {/* Timeline */}
              <div>
                {grupos.map((grupo) => (
                  <section key={grupo.key} id={`mes-${grupo.key}`} className="scroll-mt-24">
                    <h2 className="font-druk sticky top-20 z-10 bg-black py-4 text-lg uppercase tracking-[0.1em] text-white/50 lg:static lg:bg-transparent">
                      {grupo.label}
                    </h2>
                    {grupo.events.map((e) => (
                      <EventCard key={e.id} event={e} anchorId={anchorOf(e)} destacar={e.featured} />
                    ))}
                  </section>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Calendario;
