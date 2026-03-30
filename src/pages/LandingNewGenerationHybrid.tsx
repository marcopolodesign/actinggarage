import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';

const WhatsAppIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      fill="currentColor"
    />
  </svg>
);

const COURSE_NAME = 'New Generation Hybrid';

const LandingNewGenerationHybrid: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showFixedButton, setShowFixedButton] = useState(false);
  const whatsappButtonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || !whatsappButtonRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowFixedButton(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-100px' }
    );
    observer.observe(whatsappButtonRef.current);
    return () => {
      if (whatsappButtonRef.current) observer.unobserve(whatsappButtonRef.current);
    };
  }, [isMobile]);

  const getWhatsAppUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasUtm =
      urlParams.has('utm_source') ||
      urlParams.has('utm_medium') ||
      urlParams.has('utm_campaign');
    const message = hasUtm
      ? encodeURIComponent(`Hola TAG! Quisiera obtener más información sobre el ${COURSE_NAME} (13-17 años)`)
      : encodeURIComponent(`Hola TAG! Quiero más información sobre el ${COURSE_NAME} (13-17 años)`);
    return `https://wa.me/34682560187?text=${message}`;
  };

  const stats = [
    { label: 'Edad', value: '13–17 años' },
    { label: 'Formato', value: '4h/semana' },
    { label: 'Teatro', value: '2h/semana' },
    { label: 'Cámara', value: '2h/semana' },
    { label: 'Grupo', value: 'Máx. 12 alumnos' },
  ];

  const reasons = [
    'Explorar su identidad artística y personal.',
    'Mayor autoconocimiento y comprensión de sus emociones.',
    'Canalizar emociones de forma creativa y segura.',
    'Desarrollar presencia escénica y confianza tanto en el escenario como delante de la cámara.',
    'Aprender herramientas actorales para teatro y audiovisual.',
    'Capacidad de trabajo en equipo con responsabilidad.',
    'Jugar, pero jugar MUY EN SERIO.',
  ];

  const q1Theatre = [
    'Confianza y cohesión grupal: crear un espacio seguro para la expresión',
    'Técnica corporal y presencia escénica: control, energía y uso del espacio',
    'Voz proyectada, articulación y ritmo: la voz como herramienta expresiva',
    'Atención, escucha y verdad escénica: estar presente y reaccionar con autenticidad',
    'Trabajo de creación de personajes a partir de improvisaciones',
  ];

  const q1Camera = [
    'Romper el hielo con la cámara: aprender a relajarnos y habitar el objetivo',
    'Jugar con emociones y conectar: la imaginación como herramienta',
    'Primer contacto con textos contemporáneos para cámara',
    'Trabajo de creación de personaje para cámara',
  ];

  const q2Theatre = [
    'Construcción de personajes: objetivo, conflicto y actitud',
    'Trabajo emocional adaptado a la edad: canalizar emociones de forma creativa y segura',
    'Improvisación: escucha activa, creatividad y resolución espontánea de escenas',
    'Escenas breves contemporáneas: introducción a la escena dialogada y pequeños monólogos',
    'Ensayos de escenas o montaje grupal: construir el espectáculo entre todos y todas',
  ];

  const q2Camera = [
    'Crea tu versión de tus personajes favoritos',
    'Conectar emocionalmente a través de la música',
    'Análisis de texto: profundizar en los textos para cámara',
    'Trabajo de escenas en pareja y técnica básica de cámara',
  ];

  const included = [
    'Sesión de media hora de fotos profesionales (book o artísticas)',
    'Bolsa de casting',
    'Material grabado en cada clase al que el alumnado tendrá acceso',
    'Acceso preferente y con descuento a masterclasses de profesionales en activo',
    'Todo el profesorado de TAG son profesionales en ACTIVO',
    'Aulas para ensayar',
    'Descuentos en actividades culturales de Barcelona (teatro, cine, exposiciones…)',
  ];

  return (
    <section className="bg-black min-h-screen">
      <Helmet>
        <title>New Generation Hybrid — Teatro y Cine para jóvenes de 13 a 17 años | TAG</title>
        <meta
          name="description"
          content="Del juego a la identidad artística. Teatro y cine combinados para jóvenes de 13 a 17 años. 4h semanales, grupos pequeños, rodajes reales. Curso 2026/2027."
        />
        <meta name="title" content="New Generation Hybrid — Teatro y Cine para jóvenes de 13 a 17 años | TAG" />
      </Helmet>

      <Header showOnScroll={false} />

      {/* ─── HERO ─── */}
      <div className="w-full px-6 sm:px-12 lg:px-24 pt-28 sm:pt-36 pb-16 bg-black">
        <div className="max-w-4xl mx-auto">
          <p className="text-tag-yellow text-xs uppercase tracking-[0.3em] font-druk mb-4 opacity-70">
            Curso Anual · New Generation
          </p>

          <h1 className="font-druk leading-none mb-6">
            <span className="block text-tag-yellow" style={{ fontSize: 'clamp(2.5rem, 10vw, 7rem)' }}>
              NEW GENERATION
            </span>
            <span className="block text-white" style={{ fontSize: 'clamp(2.5rem, 10vw, 7rem)' }}>
              HYBRID
            </span>
          </h1>

          <p className="text-white/70 font-garamond mb-2 max-w-xl" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)' }}>
            "DEL JUEGO A LA IDENTIDAD ARTÍSTICA"
          </p>
          <p className="text-white/40 font-garamond mb-10 max-w-xl" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>
            Teatro y Cine combinados. El programa Hybrid ofrece 4 horas semanales para jóvenes que quieren dominar el escenario y la cámara.
          </p>

          <div className="flex flex-wrap gap-3">
            {stats.map(({ label, value }) => (
              <div key={label} className="border border-tag-yellow/40 px-4 py-2 flex flex-col">
                <span className="text-tag-yellow/50 text-[10px] uppercase tracking-widest font-druk">{label}</span>
                <span className="text-white text-sm font-druk">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── VIDEO + CTA ─── */}
      <div className="w-full px-6 sm:px-12 lg:px-24 pb-20 bg-black">
        <div className="max-w-3xl mx-auto">
          {/* TODO: Replace video ID 'ioPES8OreeY' with the New Generation Hybrid video */}
          <div className="w-full mb-8" style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
              <iframe
                src="https://www.youtube.com/embed/ioPES8OreeY"
                title="New Generation Hybrid — TAG"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
              />
            </div>
          </div>

          <a
            ref={whatsappButtonRef}
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-tag-yellow text-black px-6 py-4 sm:px-8 sm:py-5 font-druk text-lg sm:text-xl uppercase hover:bg-white transition-colors duration-300 shadow-lg flex items-center justify-center gap-3 mb-10"
          >
            <WhatsAppIcon />
            CONTACTAR POR WHATSAPP
          </a>
        </div>
      </div>

      {/* ─── WHY TAG ─── */}
      <div className="w-full px-6 sm:px-12 lg:px-24 py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-druk text-white leading-none mb-3" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
            ¿POR QUÉ TAG{' '}
            <span className="text-tag-yellow">NEW GENERATION HYBRID?</span>
          </h2>
          <p className="text-white/30 font-garamond text-xl sm:text-2xl mb-12 max-w-2xl">
            El programa Hybrid combina teatro y cámara en una sola formación de 4 horas semanales, ofreciendo un espacio para:
          </p>
          <ul className="space-y-4">
            {reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="text-tag-yellow font-druk text-xl flex-shrink-0 mt-0.5">—</span>
                <p className="text-white/60 font-garamond text-lg sm:text-xl leading-relaxed">{reason}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ─── PROGRAM ─── */}
      <div className="w-full px-6 sm:px-12 lg:px-24 py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-druk text-white leading-none mb-12" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
            ESTRUCTURA DEL{' '}
            <span className="text-tag-yellow">PROGRAMA</span>
          </h2>

          {/* Q1 */}
          <div className="mb-px">
            <div className="bg-[#0a0a0a] p-6 mb-px">
              <p className="text-tag-yellow/50 text-[10px] uppercase tracking-widest font-druk mb-2">Primer Cuatrimestre</p>
              <h3 className="font-druk text-white text-2xl sm:text-3xl uppercase mb-1">BASES ACTORALES Y FUNDAMENTOS DE CÁMARA</h3>
              <p className="text-white/40 font-garamond text-base italic">"Construyendo las herramientas del actor joven — sobre el escenario y delante del objetivo"</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5">
              <div className="bg-black p-8">
                <p className="text-tag-yellow/60 text-[10px] uppercase tracking-widest font-druk mb-3">Teatro — Bases Físicas, Vocales y Relacionales</p>
                <ul className="space-y-2">
                  {q1Theatre.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-tag-yellow font-druk text-sm flex-shrink-0">→</span>
                      <p className="text-white/50 font-garamond text-base leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
                <p className="text-white/30 font-garamond text-sm mt-6 italic">→ Muestra final abierta al público — grabada y enviada a las familias.</p>
              </div>
              <div className="bg-black p-8">
                <p className="text-tag-yellow/60 text-[10px] uppercase tracking-widest font-druk mb-3">Cámara — Conexión y Presencia</p>
                <ul className="space-y-2">
                  {q1Camera.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-tag-yellow font-druk text-sm flex-shrink-0">→</span>
                      <p className="text-white/50 font-garamond text-base leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-4 border border-tag-yellow/20 bg-tag-yellow/5">
                  <p className="text-tag-yellow font-druk text-sm uppercase tracking-wide mb-1">Rodaje: MONÓLOGO</p>
                  <p className="text-white/40 font-garamond text-sm">Monólogo de 1,5–2 minutos. Material grabado disponible para el alumnado.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Q2 */}
          <div className="mt-px">
            <div className="bg-[#0a0a0a] p-6 mb-px mt-px">
              <p className="text-tag-yellow/50 text-[10px] uppercase tracking-widest font-druk mb-2">Segundo Cuatrimestre</p>
              <h3 className="font-druk text-white text-2xl sm:text-3xl uppercase mb-1">HERRAMIENTAS AVANZADAS PARA JÓVENES</h3>
              <p className="text-white/40 font-garamond text-base italic">"Personajes, emociones y escenas — en escena y en pantalla"</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5">
              <div className="bg-black p-8">
                <p className="text-tag-yellow/60 text-[10px] uppercase tracking-widest font-druk mb-3">Teatro — Personajes, Emoción e Improvisación</p>
                <ul className="space-y-2">
                  {q2Theatre.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-tag-yellow font-druk text-sm flex-shrink-0">→</span>
                      <p className="text-white/50 font-garamond text-base leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
                <p className="text-white/30 font-garamond text-sm mt-6 italic">→ Muestra final abierta al público — grabada y enviada a las familias.</p>
              </div>
              <div className="bg-black p-8">
                <p className="text-tag-yellow/60 text-[10px] uppercase tracking-widest font-druk mb-3">Cámara — Personajes, Emoción y Técnica de Rodaje</p>
                <ul className="space-y-2">
                  {q2Camera.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-tag-yellow font-druk text-sm flex-shrink-0">→</span>
                      <p className="text-white/50 font-garamond text-base leading-relaxed">{item}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-4 border border-tag-yellow/20 bg-tag-yellow/5">
                  <p className="text-tag-yellow font-druk text-sm uppercase tracking-wide mb-1">Rodaje: ESCENA EN PAREJA</p>
                  <p className="text-white/40 font-garamond text-sm">Escena de 2–3 minutos con un compañero. Material grabado disponible para el alumnado.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── INCLUDED ─── */}
      <div className="w-full px-6 sm:px-12 lg:px-24 py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-druk text-white leading-none mb-10" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
            INCLUIDO EN EL{' '}
            <span className="text-tag-yellow">PROGRAMA</span>
          </h2>
          <ul className="space-y-4">
            {included.map((item, i) => (
              <li key={i} className="flex items-start gap-4 border-b border-white/5 pb-4">
                <span className="text-tag-yellow font-druk text-lg flex-shrink-0">→</span>
                <p className="text-white/60 font-garamond text-lg sm:text-xl leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ─── FINAL CTA ─── */}
      <div className="w-full bg-tag-yellow px-6 sm:px-12 lg:px-24 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-druk text-black leading-none mb-4" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
            EMPIEZA TU FORMACIÓN
          </h2>
          <p className="text-black/60 font-garamond text-lg mb-8">
            Plazas limitadas. El próximo paso es tuyo.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 font-druk text-lg uppercase hover:bg-white hover:text-black transition-colors duration-300"
          >
            <WhatsAppIcon />
            CONTACTAR POR WHATSAPP
          </a>
        </div>
      </div>

      {/* ─── MOBILE STICKY BUTTON ─── */}
      {isMobile && (
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={`fixed bottom-6 left-6 right-6 bg-tag-yellow text-black px-6 py-4 font-druk text-lg uppercase shadow-lg z-50 flex items-center justify-center gap-2 transition-all duration-500 ease-out ${
            showFixedButton
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-12 pointer-events-none'
          }`}
        >
          <WhatsAppIcon />
          CONTACTAR POR WHATSAPP
        </a>
      )}
    </section>
  );
};

export default LandingNewGenerationHybrid;
