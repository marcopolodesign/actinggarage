import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import HeaderNueva from '../components/HeaderNueva';
import ProximosEventos from '../components/ProximosEventos';
import { useFormFlyout } from '../context/FormFlyoutContext';
import { useAboutFlyout } from '../context/AboutFlyoutContext';
import {
  CURSO,
  alumni,
  enNumeros,
  escalera,
  faqs,
  fechasClave,
  fotosEscuela,
  incluido,
  muestras,
  precio,
  puertasAbiertas,
} from '../content/inscripciones';

/**
 * Home nueva — la estructura de London Film School aplicada a TAG.
 *
 * Qué cambia respecto de la home actual (informe
 * docs/reports/lfs-aprendizajes-2026-08-20.html):
 *
 *  · ORDEN — LFS va promesa → cursos → obra del alumno → evento → alumni →
 *    quiénes somos → captura. TAG cerraba con un manifiesto sobre sí misma
 *    justo donde el visitante necesita una prueba.
 *  · MENÚ — por etapa de decisión («Estudiar en TAG»), no por tipo de página.
 *  · INSCRIPCIONES — cómo se entra, fechas clave, qué incluye y FAQ. No existía.
 *  · ESCALERA — cuatro peldaños de contacto en vez de dos, los dos altos.
 *  · FOTOS — la escuela en grande y a sangre, no en cards chicas.
 *  · COPY — datos en vez de adjetivos: los números ya estaban en las fichas.
 *
 * Design system (design-system.md): negro de fondo, un solo acento #FFBE00,
 * Druk uppercase para display, botones cuadrados, sin sombras, sin cards con
 * fondo intermedio, y el acento usado como SUPERFICIE —franjas a sangre—, no
 * sólo en botones.
 */

const YELLOW = '#FFBE00';

/** Rótulo de sección: cajita que sobresale como una pestaña, al estilo LFS. */
const Rotulo: React.FC<{ children: React.ReactNode; oscuro?: boolean }> = ({ children, oscuro }) => (
  <span
    className={`inline-block text-[10px] uppercase tracking-[0.22em] font-bold px-3 py-1.5 mb-6 ${
      oscuro ? 'bg-black text-tag-yellow' : 'bg-tag-yellow text-black'
    }`}
  >
    {children}
  </span>
);

/** Un solo signo de acción, repetido: la flecha. */
const Flecha: React.FC<{ className?: string }> = ({ className }) => (
  <span aria-hidden="true" className={className}>
    &#8594;
  </span>
);

const HomeNueva: React.FC = () => {
  const { openFlyout } = useFormFlyout();
  const { openFlyout: openAboutFlyout } = useAboutFlyout();

  const hayPuertasAbiertas = Boolean(puertasAbiertas.fecha);

  return (
    <div className="bg-black text-white" data-tag-nueva>
      <Helmet>
        <title>The Acting Garage — Escuela de interpretación en Barcelona | Curso {CURSO}</title>
        <meta
          name="description"
          content={`Escuela de interpretación para cine y teatro en Barcelona. Convocatoria ${CURSO} abierta: empieza el 14 de septiembre. Grupos de 14 alumnos, tres años de formación y muestra abierta al público en cada asignatura.`}
        />
        <meta name="robots" content="noindex" />
      </Helmet>

      <HeaderNueva />

      {/* ───────────── 1 · HERO — la promesa es del alumno, no de la marca ───────────── */}
      {/* En mobile el hero no va a pantalla completa ni pegado abajo: el banner de
          cookies vive fijo al pie y le tapaba los dos CTA a cualquier visita nueva.
          Centrado y a 82svh, además asoma la franja de números y se entiende que hay
          más para abajo. En escritorio sí va a sangre y alineado al pie. */}
      <section className="relative min-h-[82svh] md:min-h-[100svh] flex items-center md:items-end overflow-hidden pt-28 md:pt-32">
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
          poster="/content/tag-bg.jpg"
        >
          <source src="/content/tag-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/70 to-black/30" />

        {/* En mobile el eyebrow y la entradilla van cortos a propósito: los dos CTA
            tienen que entrar sin scrollear, que es donde se pierde el tráfico de Meta. */}
        <div className="relative z-20 w-full px-5 md:px-8 pb-8 md:pb-16">
          <p className="text-tag-yellow text-[11px] md:text-xs uppercase tracking-[0.18em] md:tracking-[0.22em] font-bold mb-4 md:mb-5">
            <span className="md:hidden">Interpretación · Barcelona</span>
            <span className="hidden md:inline">
              Escuela de interpretación · Carrer de Londres, Barcelona
            </span>
          </p>

          <h1 className="font-druk uppercase leading-[0.86] tracking-tight text-white text-[13.5vw] md:text-[9.5vw] max-w-[16ch]">
            El actor
            <br />
            <span className="text-tag-yellow">honesto</span>
          </h1>

          <p className="font-garamond text-white/85 text-lg md:text-2xl mt-4 md:mt-6 max-w-[46ch] leading-snug">
            <span className="md:hidden">
              Tres años de técnica, y de aprender a sostener el miedo y el «no» constante.
            </span>
            <span className="hidden md:inline">
              Tres años para construir técnica de verdad y aprender a sostener los nervios, el
              miedo y el «no» constante, que es la mitad de esta profesión.
            </span>
          </p>

          {/* La escalera, ya en el hero: cada CTA dice qué pasa después */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 md:mt-9">
            <button
              onClick={() => openFlyout()}
              className="bg-tag-yellow text-black px-6 md:px-8 py-4 md:py-5 font-druk text-base md:text-lg uppercase tracking-tight hover:bg-white transition-colors duration-300 flex items-center justify-between gap-6"
            >
              Reservar una clase de prueba
              <Flecha />
            </button>
            <a
              href="#inscripciones"
              className="border-2 border-tag-yellow text-tag-yellow px-6 md:px-8 py-4 md:py-5 font-druk text-base md:text-lg uppercase tracking-tight hover:bg-tag-yellow hover:text-black transition-colors duration-300 flex items-center justify-between gap-6"
            >
              Ver fechas y cómo se entra
              <Flecha />
            </a>
          </div>
        </div>
      </section>

      {/* ───────────── 2 · EN NÚMEROS — datos, no adjetivos ───────────── */}
      <section className="bg-tag-yellow text-black">
        <div className="px-5 md:px-8 py-14 md:py-20 grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
          {enNumeros.map((n) => (
            <div key={n.que}>
              <div className="font-druk text-6xl md:text-8xl leading-none tracking-tight">{n.dato}</div>
              <p className="text-[11px] md:text-xs uppercase tracking-[0.14em] font-bold mt-3 max-w-[22ch]">
                {n.que}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── 3 · CURSOS — el nombre con su descriptor pegado ───────────── */}
      <section id="cursos" className="px-5 md:px-8 py-20 md:py-28 border-b border-white/10">
        <Rotulo>Formaciones</Rotulo>
        <h2 className="font-druk uppercase text-5xl md:text-7xl leading-[0.9] tracking-tight max-w-[18ch]">
          Elige con cuántas horas por semana puedes
        </h2>

        <div className="mt-12 border-t border-white/15">
          {[
            { slug: 'garage-pro', nombre: 'Garage Pro', desc: 'Formación profesional de interpretación · 3 años · 16 h/semana', grupo: 'Máx. 14' },
            { slug: 'garage-hybrid-plus', nombre: 'Garage Hybrid Plus', desc: 'Teatro y cine para profesionalizarse · 3 años · 8 h/semana', grupo: 'Máx. 14' },
            { slug: 'garage-hybrid', nombre: 'Garage Hybrid', desc: 'Teatro y cine combinados · 3 años · 4 h/semana', grupo: 'Máx. 12' },
            { slug: 'garage-theatre', nombre: 'Garage Theatre', desc: 'Interpretación teatral desde cero · 3 años · 2 h/semana', grupo: 'Máx. 12' },
            { slug: 'garage-cinema', nombre: 'Garage Cinema', desc: 'Interpretación a cámara desde cero · 3 años · 2 h/semana', grupo: 'Máx. 12' },
            { slug: 'garage-new-generation', nombre: 'Garage New Generation', desc: 'Teatro y cine para adolescentes · 13 a 17 años', grupo: 'Máx. 12' },
            { slug: 'garage-kids', nombre: 'Garage Kids', desc: 'Teatro para chicos · 9 a 12 años', grupo: 'Máx. 12' },
            { slug: 'garage-mini-kids', nombre: 'Garage Mini Kids', desc: 'Juego teatral · 5 a 8 años', grupo: 'Máx. 12' },
            { slug: 'garage-writing', nombre: 'Garage Writing', desc: 'Escritura para cine y teatro · online', grupo: '' },
          ].map((c) => (
            <Link
              key={c.slug}
              to={`/cursos/${c.slug}`}
              className="group flex items-center justify-between gap-6 py-6 border-b border-white/15 hover:bg-tag-yellow hover:text-black transition-colors duration-200 px-1 md:px-3"
            >
              <div className="min-w-0">
                <span className="font-druk uppercase text-2xl md:text-4xl tracking-tight block leading-none">
                  {c.nombre}
                </span>
                <span className="font-mdio text-sm md:text-base text-white/60 group-hover:text-black/70 block mt-2">
                  {c.desc}
                </span>
              </div>
              <div className="flex items-center gap-5 shrink-0">
                {c.grupo && (
                  <span className="hidden md:inline text-[10px] uppercase tracking-[0.18em] font-bold text-white/50 group-hover:text-black/60">
                    {c.grupo}
                  </span>
                )}
                <Flecha className="text-2xl md:text-3xl" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ───────────── 4 · LA ESCUELA POR DENTRO — fotos grandes, a sangre ───────────── */}
      <section id="escuela" className="py-20 md:py-28 border-b border-white/10">
        <div className="px-5 md:px-8">
          <Rotulo>La escuela</Rotulo>
          <h2 className="font-druk uppercase text-5xl md:text-7xl leading-[0.9] tracking-tight max-w-[20ch]">
            Esto es lo que vas a ver el primer día
          </h2>
          <p className="font-garamond text-white/70 text-xl mt-5 max-w-[52ch] leading-snug">
            Estamos en el Carrer de Londres, en el Eixample. Aulas para ensayar, plató de
            cámara y profesores que siguen trabajando en activo.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-1">
          {fotosEscuela.map((f) => (
            <figure key={f.src} className={f.ancho === 'ancha' ? 'md:col-span-2' : ''}>
              <img
                src={f.src}
                alt={f.alt}
                loading="lazy"
                className={`w-full object-cover ${f.ancho === 'ancha' ? 'h-[52vh] md:h-[78vh]' : 'h-[38vh] md:h-[56vh]'}`}
              />
            </figure>
          ))}
        </div>

        <div className="px-5 md:px-8 mt-10">
          <button
            onClick={() => openAboutFlyout()}
            className="text-tag-yellow font-druk uppercase text-xl md:text-2xl tracking-tight flex items-center gap-4 hover:text-white transition-colors duration-300"
          >
            Quiénes somos
            <Flecha />
          </button>
        </div>
      </section>

      {/* ───────────── 5 · EL TRABAJO DEL ALUMNO ───────────── */}
      {muestras.length > 0 && (
        <section id="muestras" className="px-5 md:px-8 py-20 md:py-28 border-b border-white/10">
          <Rotulo>Muestras</Rotulo>
          <h2 className="font-druk uppercase text-5xl md:text-7xl leading-[0.9] tracking-tight max-w-[18ch]">
            Lo que hacen los alumnos
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-1">
            {muestras.map((m) => (
              <a key={m.url} href={m.url} target="_blank" rel="noopener noreferrer" className="group block">
                {m.poster && (
                  <img src={m.poster} alt={m.titulo} loading="lazy" className="w-full h-[34vh] object-cover" />
                )}
                <div className="py-4">
                  <span className="font-druk uppercase text-xl tracking-tight block group-hover:text-tag-yellow transition-colors">
                    {m.titulo}
                  </span>
                  <span className="font-mdio text-sm text-white/55">
                    {m.curso} · {m.anio}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ───────────── 5b · AGENDA — novedades fechadas como señal de vida ─────────────
          Era el punto 10 del embudo del informe y se me habia pasado: el componente ya
          existe, se alimenta solo de la tabla `events` y **no pinta nada si no hay
          fechas publicadas**, asi que no puede quedar una seccion de agenda vacia. */}
      <div className="border-b border-white/10">
        <ProximosEventos />
      </div>

      {/* ───────────── 6 · INSCRIPCIONES — cómo se entra, en cuatro peldaños ───────────── */}
      <section id="inscripciones" className="px-5 md:px-8 py-20 md:py-28 border-b border-white/10">
        <Rotulo>Inscripciones {CURSO}</Rotulo>
        <h2 className="font-druk uppercase text-5xl md:text-7xl leading-[0.9] tracking-tight max-w-[16ch]">
          Cómo se entra a TAG
        </h2>
        <p className="font-garamond text-white/70 text-xl mt-5 max-w-[54ch] leading-snug">
          No hace falta decidirse hoy. Cada paso pide menos que el siguiente, y puedes
          quedarte en el que quieras.
        </p>

        <ol className="mt-12 border-t border-white/15">
          {escalera.map((p) => (
            <li key={p.n} className="border-b border-white/15 py-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
              <div className="md:col-span-1 font-druk text-tag-yellow text-3xl md:text-4xl leading-none">
                {p.n}
              </div>
              <div className="md:col-span-5">
                <h3 className="font-druk uppercase text-2xl md:text-3xl tracking-tight leading-none">
                  {p.titulo}
                </h3>
                <p className="font-mdio text-sm text-white/55 mt-3">{p.despues}</p>
              </div>
              <div className="md:col-span-4">
                <p className="font-garamond text-lg text-white/80 leading-snug">{p.que}</p>
              </div>
              <div className="md:col-span-2 flex md:justify-end items-start">
                <button
                  onClick={() => openFlyout()}
                  className="bg-tag-yellow text-black px-5 py-3 text-xs uppercase tracking-[0.12em] font-bold hover:bg-white transition-colors duration-300 flex items-center gap-3"
                >
                  {p.accion === 'email' ? 'Recibirlo' : p.accion === 'prueba' ? 'Reservar' : p.accion === 'alumno' ? 'Que me escriban' : 'Pedir entrevista'}
                  <Flecha />
                </button>
              </div>
            </li>
          ))}
        </ol>

        {/* Precio — mientras TAG no publique número, se publica la política */}
        <div className="mt-12 max-w-[62ch]">
          <h3 className="font-druk uppercase text-2xl tracking-tight">Precio y forma de pago</h3>
          {precio.rango ? (
            <p className="font-garamond text-xl text-white/80 mt-3 leading-snug">
              {precio.rango}. {precio.formaPago}
            </p>
          ) : (
            <p className="font-garamond text-xl text-white/80 mt-3 leading-snug">
              Te lo pasamos por escrito en la primera respuesta, con la matrícula, las cuotas
              y qué entra en cada formación. Sin tener que llamar a nadie para saberlo.
            </p>
          )}
        </div>
      </section>

      {/* ───────────── 7 · FECHAS CLAVE ───────────── */}
      <section id="fechas" className="px-5 md:px-8 py-20 md:py-28 border-b border-white/10">
        {/* «Convocatoria», no «Calendario»: el calendario de eventos es el bloque de
            Próximas fechas de más arriba. Esto es el inicio y el fin del curso. */}
        <Rotulo>Convocatoria</Rotulo>
        <h2 className="font-druk uppercase text-5xl md:text-7xl leading-[0.9] tracking-tight max-w-[16ch]">
          Fechas clave
        </h2>
        <div className="mt-12 border-t border-white/15">
          {fechasClave.map((f) => (
            <div key={f.que} className="border-b border-white/15 py-7 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8">
              <div className="md:col-span-3 font-druk uppercase text-tag-yellow text-2xl md:text-3xl tracking-tight leading-none">
                {f.cuando}
              </div>
              <div className="md:col-span-4">
                <h3 className="font-druk uppercase text-xl md:text-2xl tracking-tight leading-none">{f.que}</h3>
              </div>
              <div className="md:col-span-5">
                {f.detalle && <p className="font-garamond text-lg text-white/75 leading-snug">{f.detalle}</p>}
              </div>
            </div>
          ))}
        </div>
        <Link
          to="/calendario"
          className="inline-flex items-center gap-4 mt-8 text-tag-yellow font-druk uppercase text-xl tracking-tight hover:text-white transition-colors duration-300"
        >
          Ver el calendario completo
          <Flecha />
        </Link>
      </section>

      {/* ───────────── 8 · QUÉ INCLUYE ───────────── */}
      <section id="incluye" className="px-5 md:px-8 py-20 md:py-28 border-b border-white/10">
        <Rotulo>Qué incluye</Rotulo>
        <h2 className="font-druk uppercase text-5xl md:text-7xl leading-[0.9] tracking-tight max-w-[20ch]">
          Entra en la matrícula, no se paga aparte
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/15 border border-white/15">
          {incluido.map((i) => (
            <div key={i} className="bg-black px-6 py-8 flex items-start gap-4">
              <span className="text-tag-yellow font-druk text-2xl leading-none">+</span>
              <span className="font-druk uppercase text-xl tracking-tight leading-tight">{i}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── 9 · PUERTAS ABIERTAS — franja a sangre, el CTA de menor fricción ───────────── */}
      {hayPuertasAbiertas && (
        <section className="bg-tag-yellow text-black px-5 md:px-8 py-16 md:py-24">
          <Rotulo oscuro>Puertas abiertas</Rotulo>
          <h2 className="font-druk uppercase text-5xl md:text-8xl leading-[0.86] tracking-tight max-w-[16ch]">
            {puertasAbiertas.fecha}
          </h2>
          <p className="font-druk uppercase text-2xl md:text-3xl mt-4">{puertasAbiertas.hora}</p>
          <p className="font-garamond text-xl md:text-2xl mt-5 max-w-[48ch] leading-snug">
            {puertasAbiertas.que}
          </p>
          <button
            onClick={() => openFlyout()}
            className="mt-9 bg-black text-tag-yellow px-8 py-5 font-druk text-lg uppercase tracking-tight hover:bg-white hover:text-black transition-colors duration-300 flex items-center gap-6"
          >
            Apuntarme
            <Flecha />
          </button>
        </section>
      )}

      {/* ───────────── 10 · ALUMNI — el contenido es el diseño ───────────── */}
      {alumni.length > 0 && (
        <section id="alumni" className="px-5 md:px-8 py-20 md:py-28 border-b border-white/10">
          <Rotulo>Alumni</Rotulo>
          <div className="mt-6">
            {alumni.map((a) => (
              <div key={a.nombre} className="border-b border-white/15 py-7">
                <h3 className="font-druk uppercase text-tag-yellow text-4xl md:text-7xl leading-none tracking-tight">
                  {a.nombre}
                </h3>
                <p className="font-mdio text-sm text-white/60 mt-3">
                  {a.curso} · {a.anio} — {a.hoy}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ───────────── 11 · FAQ — cada respuesta es un WhatsApp menos ───────────── */}
      <section id="faq" className="px-5 md:px-8 py-20 md:py-28 border-b border-white/10">
        <Rotulo>Preguntas frecuentes</Rotulo>
        <h2 className="font-druk uppercase text-5xl md:text-7xl leading-[0.9] tracking-tight max-w-[16ch]">
          Lo que nos preguntan siempre
        </h2>
        <div className="mt-12 border-t border-white/15">
          {faqs.map((f) => (
            <details key={f.pregunta} className="group border-b border-white/15 py-6">
              <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
                <span className="font-druk uppercase text-xl md:text-3xl tracking-tight leading-tight">
                  {f.pregunta}
                </span>
                <span
                  aria-hidden="true"
                  className="text-tag-yellow text-3xl leading-none shrink-0 transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="font-garamond text-lg md:text-xl text-white/80 mt-4 max-w-[62ch] leading-snug">
                {f.respuesta}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ───────────── 12 · EL ESCALÓN DE EMAIL — lo que captura al que hoy se va ───────────── */}
      <section className="bg-tag-yellow text-black px-5 md:px-8 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div>
            <Rotulo oscuro>Calendario {CURSO}</Rotulo>
            <h2 className="font-druk uppercase text-5xl md:text-8xl leading-[0.86] tracking-tight max-w-[14ch]">
              Llévate las fechas
            </h2>
            <p className="font-garamond text-xl md:text-2xl mt-5 max-w-[46ch] leading-snug">
              Horarios de cada formación, cuándo son las clases de prueba y hasta cuándo hay
              plazas. Te llega por email y no te llama nadie.
            </p>
          </div>
          <button
            onClick={() => openFlyout()}
            className="shrink-0 bg-black text-tag-yellow px-10 py-7 font-druk text-2xl md:text-4xl uppercase tracking-tight hover:bg-white hover:text-black transition-colors duration-300 flex items-center gap-8"
          >
            Recibirlo
            <Flecha className="text-4xl md:text-6xl" />
          </button>
        </div>
      </section>

      <footer className="px-5 md:px-8 py-12 text-white/45 text-xs font-mdio flex flex-wrap gap-x-8 gap-y-3 justify-between">
        <span>The Acting Garage · Carrer de Londres, Barcelona</span>
        <span style={{ color: YELLOW }}>Convocatoria {CURSO} abierta</span>
      </footer>
    </div>
  );
};

export default HomeNueva;
