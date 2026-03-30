import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

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
  age: string;
  hours: string;
  modality: string;
  description: string;
  landingHref: string;
  whatsappMsg: string;
  accentLabel?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  tagline,
  age,
  hours,
  modality,
  description,
  landingHref,
  whatsappMsg,
  accentLabel,
}) => {
  const waUrl = `https://wa.me/34682560187?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="bg-black border border-white/10 flex flex-col group hover:border-tag-yellow/40 transition-colors duration-300">
      {/* Top accent bar */}
      <div className="h-1 bg-tag-yellow w-0 group-hover:w-full transition-all duration-500 ease-out" />

      <div className="p-8 flex flex-col flex-1">
        {accentLabel && (
          <span className="text-tag-yellow/50 text-[10px] uppercase tracking-widest font-druk mb-3 block">
            {accentLabel}
          </span>
        )}

        <h3
          className="font-druk text-white uppercase leading-none mb-1"
          style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)' }}
        >
          {title}
        </h3>
        <p className="text-tag-yellow/70 font-garamond text-sm italic mb-6">{tagline}</p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { label: 'Edad', value: age },
            { label: 'Formato', value: hours },
            { label: 'Modalidad', value: modality },
          ].map(({ label, value }) => (
            <div key={label} className="border border-white/10 px-3 py-1.5 flex flex-col">
              <span className="text-white/30 text-[9px] uppercase tracking-widest font-druk">{label}</span>
              <span className="text-white text-xs font-druk">{value}</span>
            </div>
          ))}
        </div>

        <p className="text-white/50 font-garamond text-base leading-relaxed flex-1 mb-8">{description}</p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-auto">
          <Link
            to={landingHref}
            className="flex-1 flex items-center justify-center gap-2 border border-tag-yellow text-tag-yellow px-4 py-3 font-druk text-sm uppercase tracking-wide hover:bg-tag-yellow hover:text-black transition-colors duration-200"
          >
            VER PROGRAMA
            <ArrowIcon />
          </Link>
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

const AgeGroupLabel: React.FC<{ age: string; label: string }> = ({ age, label }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className="border border-tag-yellow/30 px-5 py-3 flex flex-col items-center flex-shrink-0">
      <span className="text-tag-yellow font-druk leading-none" style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)' }}>
        {age}
      </span>
      <span className="text-white/30 text-[9px] uppercase tracking-widest font-druk">años</span>
    </div>
    <div className="h-px flex-1 bg-white/10" />
    <span className="text-white/20 font-garamond text-base italic flex-shrink-0">{label}</span>
    <div className="h-px w-6 bg-white/10 hidden sm:block" />
  </div>
);

const LandingJovenes: React.FC = () => {
  const globalWaUrl = `https://wa.me/34682560187?text=${encodeURIComponent('Hola TAG! Quiero más información sobre los cursos para jóvenes')}`;

  return (
    <section className="bg-black min-h-screen">
      <Helmet>
        <title>TAG para Jóvenes — Cursos de Teatro y Cine de 6 a 17 años</title>
        <meta
          name="description"
          content="Cursos de teatro y actuación para niños y jóvenes de 6 a 17 años en TAG. Mini Kids (6-8), Kids (9-12), New Generation teatro y cámara (13-17). Grupos pequeños, profesores en activo."
        />
        <meta name="title" content="TAG para Jóvenes — Cursos de Teatro y Cine de 6 a 17 años" />
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
              TAG PARA
            </span>
            <span className="block text-tag-yellow" style={{ fontSize: 'clamp(3rem, 12vw, 9rem)' }}>
              JÓVENES
            </span>
          </h1>

          <p className="text-white/50 font-garamond max-w-2xl mb-10" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)' }}>
            Programas de teatro y actuación diseñados específicamente para cada etapa del desarrollo. Desde los 6 hasta los 17 años, siempre en grupos pequeños y con profesores en activo.
          </p>

          {/* Global stats */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Edades', value: '6 a 17 años' },
              { label: 'Grupos', value: 'Máx. 12 alumnos' },
              { label: 'Profesorado', value: 'En activo' },
              { label: 'Muestras', value: 'Cada cuatrimestre' },
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

          {/* 6–8 años */}
          <div>
            <AgeGroupLabel age="6–8" label="El juego como herramienta" />
            <div className="grid grid-cols-1 gap-px bg-white/5">
              <CourseCard
                title="Garage Mini Kids"
                tagline='"El juego como herramienta"'
                age="6–8 años"
                hours="1h30/semana"
                modality="Teatro"
                description="Un espacio de juego, descubrimiento y expresión libre. No buscamos pequeños actores perfectos: buscamos niños y niñas felices, expresivos y seguros de sí mismos."
                landingHref="/landing-mini-kids"
                whatsappMsg="Hola TAG! Quiero más información sobre Garage Mini Kids (6-8 años)"
              />
            </div>
          </div>

          {/* 9–12 años */}
          <div>
            <AgeGroupLabel age="9–12" label="Del juego a la técnica" />
            <div className="grid grid-cols-1 gap-px bg-white/5">
              <CourseCard
                title="Garage Kids"
                tagline='"Del juego a la técnica"'
                age="9–12 años"
                hours="2h/semana"
                modality="Teatro"
                description="El momento ideal para profundizar en el teatro de forma más técnica sin perder el disfrute. Construcción de personajes, texto dramático y muestra final cada cuatrimestre."
                landingHref="/landing-kids"
                whatsappMsg="Hola TAG! Quiero más información sobre Garage Kids (9-12 años)"
              />
            </div>
          </div>

          {/* 13–17 años */}
          <div>
            <AgeGroupLabel age="13–17" label="Del juego a la identidad artística" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
              <CourseCard
                title="New Generation"
                tagline='"Del juego a la identidad artística"'
                age="13–17 años"
                hours="2h/semana"
                modality="Teatro"
                description="Teatro para adolescentes. Un espacio seguro para explorar la identidad artística, canalizar emociones y comprometerse con proyectos teatrales exigentes."
                landingHref="/landing-new-generation"
                whatsappMsg="Hola TAG! Quiero más información sobre Garage New Generation (13-17 años)"
                accentLabel="Teatro"
              />
              <CourseCard
                title="New Generation Cámara"
                tagline='"Conocerse delante de la cámara"'
                age="13–17 años"
                hours="2h/semana"
                modality="Cine"
                description="Actuación ante cámara para jóvenes. Aprende a habitar el objetivo con verdad y sin miedo. Incluye rodajes reales: monólogo individual y escena en pareja."
                landingHref="/landing-new-generation-camara"
                whatsappMsg="Hola TAG! Quiero más información sobre New Generation Cámara (13-17 años)"
                accentLabel="Cámara"
              />
              <CourseCard
                title="New Generation Hybrid"
                tagline='"Teatro y Cine. Un solo camino."'
                age="13–17 años"
                hours="4h/semana"
                modality="Teatro + Cine"
                description="La formación completa: 2h de teatro + 2h de cámara cada semana. Para jóvenes que quieren dominar el escenario y el objetivo en un solo programa."
                landingHref="/landing-new-generation-hybrid"
                whatsappMsg="Hola TAG! Quiero más información sobre New Generation Hybrid (13-17 años)"
                accentLabel="Teatro + Cine"
              />
            </div>
          </div>

        </div>
      </div>

      {/* ─── INCLUDED IN ALL PROGRAMMES ─── */}
      <div className="w-full px-6 sm:px-12 lg:px-24 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-druk text-white leading-none mb-3" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
            INCLUIDO EN{' '}
            <span className="text-tag-yellow">TODOS LOS PROGRAMAS</span>
          </h2>
          <p className="text-white/30 font-garamond text-xl mb-12 max-w-xl">
            Independientemente del curso, esto es lo que encontrarás en TAG.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {[
              { icon: '📸', title: 'Fotos profesionales', desc: 'Sesión de 30 min para book o artísticas incluida en el programa.' },
              { icon: '🎭', title: 'Muestra cada cuatrimestre', desc: 'Función abierta al público, grabada y enviada a las familias.' },
              { icon: '🎬', title: 'Profesores en activo', desc: 'Todo el profesorado de TAG son profesionales del sector trabajando hoy.' },
              { icon: '🏆', title: 'Bolsa de casting', desc: 'Acceso a oportunidades de casting para alumnos de New Generation.' },
              { icon: '🎓', title: 'Masterclasses', desc: 'Acceso preferente y con descuento a las masterclasses de profesionales.' },
              { icon: '🎟️', title: 'Descuentos culturales', desc: 'Descuentos en teatro, cine y exposiciones en Barcelona.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-black p-8 flex flex-col gap-3 hover:bg-[#0d0d0d] transition-colors duration-300">
                <span className="text-3xl">{icon}</span>
                <h3 className="font-druk text-tag-yellow text-xl uppercase">{title}</h3>
                <p className="text-white/40 font-garamond text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── FINAL CTA ─── */}
      <div className="w-full bg-tag-yellow px-6 sm:px-12 lg:px-24 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="font-druk text-black leading-none mb-4"
            style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}
          >
            ¿NO SABES QUÉ CURSO ES EL TUYO?
          </h2>
          <p className="text-black/60 font-garamond text-lg mb-8">
            Escríbenos por WhatsApp con la edad y te orientamos.
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

export default LandingJovenes;
