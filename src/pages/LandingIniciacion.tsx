import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { buildWhatsAppUrl } from '../utils/utm';

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      fill="currentColor"
    />
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface CourseCardProps {
  title: string;
  tagline: string;
  modality: string;
  hours: string;
  startDate: string;
  age: string;
  description: string;
  fullProgramHref?: string;
  whatsappMsg: string;
  accentLabel?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  tagline,
  modality,
  hours,
  startDate,
  age,
  description,
  fullProgramHref,
  whatsappMsg,
  accentLabel,
}) => {
  const waUrl = buildWhatsAppUrl(whatsappMsg);

  return (
    <div className="bg-black border border-white/10 flex flex-col group hover:border-tag-yellow/40 transition-colors duration-300">
      <div className="h-1 bg-tag-yellow w-0 group-hover:w-full transition-all duration-500 ease-out" />
      <div className="p-8 flex flex-col flex-1">
        {accentLabel && (
          <span className="text-tag-yellow/50 text-[10px] uppercase tracking-widest font-druk mb-3 block">
            {accentLabel}
          </span>
        )}
        <h3 className="font-druk text-white uppercase leading-none mb-1" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)' }}>
          {title}
        </h3>
        <p className="text-tag-yellow/70 font-garamond text-sm italic mb-6">{tagline}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { label: 'Edad', value: age },
            { label: 'Formato', value: hours },
            { label: 'Modalidad', value: modality },
            { label: 'Inicio', value: startDate },
          ].map(({ label, value }) => (
            <div key={label} className="border border-white/10 px-3 py-1.5 flex flex-col">
              <span className="text-white/30 text-[9px] uppercase tracking-widest font-druk">{label}</span>
              <span className="text-white text-xs font-druk">{value}</span>
            </div>
          ))}
        </div>

        <p className="text-white/50 font-garamond text-base leading-relaxed flex-1 mb-8">{description}</p>

        <div className="flex flex-col sm:flex-row gap-3 mt-auto">
          {fullProgramHref && (
            <Link
              to={fullProgramHref}
              className="flex-1 flex items-center justify-center gap-2 border border-tag-yellow text-tag-yellow px-4 py-3 font-druk text-sm uppercase tracking-wide hover:bg-tag-yellow hover:text-black transition-colors duration-200"
            >
              VER PROGRAMA COMPLETO
              <ArrowIcon />
            </Link>
          )}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-tag-yellow text-black px-4 py-3 font-druk text-sm uppercase tracking-wide hover:bg-white transition-colors duration-200"
          >
            <WhatsAppIcon />
            CONTACTAR
          </a>
        </div>
      </div>
    </div>
  );
};

const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-4 mb-8">
    <span className="text-tag-yellow font-druk uppercase leading-none flex-shrink-0" style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)' }}>
      {label}
    </span>
    <div className="h-px flex-1 bg-white/10" />
  </div>
);

const LandingIniciacion: React.FC = () => {
  const globalWaUrl = buildWhatsAppUrl('Hola TAG! Quiero más información sobre los cursos de iniciación');

  return (
    <section className="bg-black min-h-screen">
      <Helmet>
        <title>Garage Iniciación — Primeros Pasos en Teatro y Cámara en Barcelona | TAG</title>
        <meta
          name="description"
          content="Cursos de iniciación a la interpretación en Barcelona: teatro, cámara, teatro+cámara y teatro para mayores de 60. Grupos reducidos, profesores en activo."
        />
        <meta name="title" content="Garage Iniciación — Primeros Pasos en Teatro y Cámara en Barcelona | TAG" />
      </Helmet>

      <Header showOnScroll={false} />

      {/* ─── HERO ─── */}
      <div className="w-full px-6 sm:px-12 lg:px-24 pt-28 sm:pt-36 pb-20 bg-black">
        <div className="max-w-5xl mx-auto">
          <p className="text-tag-yellow text-xs uppercase tracking-[0.3em] font-druk mb-4 opacity-70">
            The Acting Garage · Cursos 2026/2027
          </p>

          <h1 className="font-druk leading-none mb-6">
            <span className="block text-white" style={{ fontSize: 'clamp(3rem, 12vw, 9rem)' }}>
              GARAGE
            </span>
            <span className="block text-tag-yellow" style={{ fontSize: 'clamp(3rem, 12vw, 9rem)' }}>
              INICIACIÓN
            </span>
          </h1>

          <p className="text-white/50 font-garamond max-w-2xl mb-10" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)' }}>
            El primer paso para descubrir tu potencial expresivo, sin experiencia previa. Teatro, cámara o ambos — a tu ritmo, en grupos reducidos.
          </p>

          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Nivel', value: 'Sin experiencia' },
              { label: 'Grupos', value: 'Reducidos' },
              { label: 'Profesorado', value: 'En activo' },
              { label: 'Progresión', value: 'Hacia Garage Pro' },
            ].map(({ label, value }) => (
              <div key={label} className="border border-white/10 px-4 py-2 flex flex-col">
                <span className="text-white/30 text-[10px] uppercase tracking-widest font-druk">{label}</span>
                <span className="text-white text-sm font-druk">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── COURSES ─── */}
      <div className="w-full px-6 sm:px-12 lg:px-24 pb-24 bg-black">
        <div className="max-w-5xl mx-auto space-y-20">
          <div>
            <SectionLabel label="Adultos — Nivel I" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
              <CourseCard
                title="Garage Theatre I"
                tagline='"El actor honesto"'
                modality="Teatro"
                hours="2h/semana"
                startDate="14 sep 2026"
                age="17 a 60 años"
                description="Primer año del recorrido teatral: juego, desinhibición, presencia escénica e impulso. La base sobre la que se construye todo lo demás."
                fullProgramHref="/cursos/garage-theatre"
                whatsappMsg="Hola TAG! Quiero más información sobre Garage Theatre I (Iniciación)"
                accentLabel="Teatro"
              />
              <CourseCard
                title="Garage Cinema I"
                tagline='"Conocerse delante de la cámara"'
                modality="Cine"
                hours="2h/semana"
                startDate="14 sep 2026"
                age="17 a 60 años"
                description="Primer año ante cámara: conexión, relajación activa, escucha, personaje y escenas. Incluye rodaje de monólogo y escena en pareja."
                fullProgramHref="/cursos/garage-cinema"
                whatsappMsg="Hola TAG! Quiero más información sobre Garage Cinema I (Iniciación)"
                accentLabel="Cámara"
              />
              <CourseCard
                title="Garage Hybrid Level I"
                tagline='"Teatro y Cine. Un solo camino."'
                modality="Teatro + Cine"
                hours="4h/semana"
                startDate="14 sep 2026"
                age="17 a 60 años"
                description="Primer año combinado: 2h de teatro + 2h de cámara semanales. Presencia, escucha, emoción y juego desde ambas disciplinas a la vez."
                fullProgramHref="/cursos/garage-hybrid"
                whatsappMsg="Hola TAG! Quiero más información sobre Garage Hybrid Level I (Iniciación)"
                accentLabel="Teatro + Cine"
              />
            </div>
          </div>

          <div>
            <SectionLabel label="Mayores de 60" />
            <div className="grid grid-cols-1 gap-px bg-white/5">
              <CourseCard
                title="Garage Classic"
                tagline='"Nunca es tarde para subirse al escenario"'
                modality="Teatro"
                hours="1h30/semana"
                startDate="Curso anual"
                age="60+"
                description="Interpretación teatral para estimular la memoria, la expresión y la motricidad, en un grupo activo y con acompañamiento profesional."
                fullProgramHref="/cursos/garage-classic"
                whatsappMsg="Hola TAG! Quiero más información sobre Garage Classic"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── FINAL CTA ─── */}
      <div className="w-full bg-tag-yellow px-6 sm:px-12 lg:px-24 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-druk text-black leading-none mb-4" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
            ¿NO SABES POR DÓNDE EMPEZAR?
          </h2>
          <p className="text-black/60 font-garamond text-lg mb-8">
            Escríbenos por WhatsApp y te orientamos sin compromiso.
          </p>
          <a
            href={globalWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 font-druk text-lg uppercase hover:bg-white hover:text-black transition-colors duration-300"
          >
            <WhatsAppIcon />
            CONTACTAR POR WHATSAPP
          </a>
        </div>
      </div>
    </section>
  );
};

export default LandingIniciacion;
