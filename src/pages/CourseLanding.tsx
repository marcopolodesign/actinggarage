import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Testimonios from '../components/Testimonios';
import { coursesConfig, type CourseConfig } from '../content/coursesConfig';
import InlineLeadForm from '../components/InlineLeadForm';
import { buildWhatsAppUrl } from '../utils/utm';
import { trackWhatsappClick } from '../utils/trackWhatsapp';

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    gtag: (...args: any[]) => void;
  }
}

const WhatsAppIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      fill="currentColor"
    />
  </svg>
);

function getWhatsAppUrl(course: CourseConfig, _search: string) {
  const label = course.whatsAppLabel || course.courseName;
  const extra = course.whatsAppExtra ? ` ${course.whatsAppExtra}` : '';
  // 🔴 Los TRES textos, siempre (CLAUDE.md → Atribución, Regla 1). Faltaba el
  // tercero hasta el 2026-09-04: el tráfico de Meta que llegaba a una ficha de
  // curso caía al texto de "otro pago" — el mismo que manda Google — así que en
  // el WhatsApp esos prospectos se leían como Google. Afectaba a las 16 fichas
  // de /cursos/:slug, incluida la de C04 (garage-writing) y la de C05.
  return buildWhatsAppUrl(
    `Hola TAG! Quiero más información sobre el ${label}${extra}`,
    `Hola TAG! Quisiera obtener más información sobre el ${label}${extra}`,
    `Hola TAG! Quisiera más info sobre el ${label}${extra}`
  );
}

const NotFound: React.FC = () => (
  <section className="bg-black min-h-screen">
    <Header showOnScroll={false} />
    <div className="pt-28 sm:pt-36 px-6 sm:px-12 lg:px-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-druk text-white leading-none mb-4" style={{ fontSize: 'clamp(2.2rem, 7vw, 4rem)' }}>
          Curso no encontrado
        </h1>
        <p className="text-white/60 font-garamond text-lg mb-10">
          Puede que el enlace esté desactualizado. Vuelve a la lista de cursos para elegir el programa correcto.
        </p>
        <Link
          to="/cursos"
          className="inline-flex items-center gap-3 bg-tag-yellow text-black px-8 py-4 font-druk text-lg uppercase hover:bg-white transition-colors duration-300"
        >
          VER CURSOS
        </Link>
      </div>
    </div>
  </section>
);

const CourseLanding: React.FC = () => {
  const { slug } = useParams();
  const location = useLocation();

  const course = slug ? coursesConfig[slug] : undefined;

  const whatsappUrl = useMemo(() => (course ? getWhatsAppUrl(course, location.search) : ''), [course, location.search]);

  // El formulario y su estado viven en <InlineLeadForm/> desde el 2026-09-04:
  // se extrajo para poder reutilizarlo en /iniciacion (destino de C02), que
  // captaba sólo por WhatsApp y por eso no se podía medir.
  const whatsappButtonRef = useRef<HTMLAnchorElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showFixedButton, setShowFixedButton] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const current = whatsappButtonRef.current;
    if (!isMobile || !current) return;
    const observer = new IntersectionObserver(([entry]) => setShowFixedButton(!entry.isIntersecting), {
      threshold: 0,
      rootMargin: '-100px',
    });
    observer.observe(current);
    return () => {
      observer.unobserve(current);
    };
  }, [isMobile]);

  if (!course) return <NotFound />;

  const heroBg = course.heroBgImage ? `url(${course.heroBgImage})` : undefined;
  const overlayClass = course.heroBgOverlayClassName || 'bg-black/60';

  return (
    <section className="bg-black min-h-screen">
      <Helmet>
        <title>{course.seo.title}</title>
        <meta name="title" content={course.seo.title} />
        <meta name="description" content={course.seo.description} />
        <link rel="canonical" href={`https://www.theactinggarage.com${course.seo.canonicalPath}`} />

        <meta property="og:title" content={course.seo.title} />
        <meta property="og:description" content={course.seo.description} />
        <meta property="og:url" content={`https://www.theactinggarage.com${course.seo.canonicalPath}`} />

        <meta name="twitter:title" content={course.seo.title} />
        <meta name="twitter:description" content={course.seo.description} />
      </Helmet>

      <Header showOnScroll={false} />

      {/* HERO */}
      <div className="relative w-full px-6 sm:px-12 lg:px-24 pt-28 sm:pt-36 pb-16 bg-black overflow-hidden">
        {heroBg && (
          <div className="absolute inset-0 -z-0" style={{ backgroundImage: heroBg, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className={`absolute inset-0 ${overlayClass}`} />
          </div>
        )}

        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-tag-yellow text-xs uppercase tracking-[0.3em] font-druk mb-4 opacity-70">{course.eyebrow}</p>

          <h1 className="font-druk leading-none mb-6">
            {course.heroTitleLines.map((line, idx) => (
              <span
                key={`${line}-${idx}`}
                className={`block ${idx === 0 ? 'text-tag-yellow' : 'text-white'}`}
                style={{ fontSize: 'clamp(2.2rem, 9vw, 7.5rem)' }}
              >
                {line}
              </span>
            ))}
          </h1>

          {course.heroQuote && (
            <p className="text-white/80 font-garamond mb-2 max-w-xl" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)' }}>
              {course.heroQuote}
            </p>
          )}

          {course.heroDescription && (
            <p className="text-white/45 font-garamond mb-10 max-w-2xl" style={{ fontSize: 'clamp(0.95rem, 2.2vw, 1.2rem)' }}>
              {course.heroDescription}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {course.stats.map(({ label, value }) => (
              <div
                key={label}
                className={`border border-tag-yellow/40 flex flex-col ${course.statsEmphasis ? 'px-5 py-3' : 'px-4 py-2.5'}`}
              >
                <span className={`text-tag-yellow/60 uppercase tracking-widest font-druk ${course.statsEmphasis ? 'text-xs' : 'text-[11px]'}`}>
                  {label}
                </span>
                <span className={`text-white font-druk ${course.statsEmphasis ? 'text-xl' : 'text-base'}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VIDEO + CTA + FORM */}
      <div className="w-full px-6 sm:px-12 lg:px-24 pb-20 bg-black">
        <div className="max-w-3xl mx-auto">
          {course.youtubeId && (
            <div className="w-full mb-8" style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${course.youtubeId}`}
                  title={`${course.courseName} — TAG`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                />
              </div>
            </div>
          )}

          {!course.youtubeId && course.videoSrc && (
            <video
              className="w-full mb-8"
              src={course.videoSrc}
              poster={course.videoPoster}
              controls
              preload="none"
              playsInline
              style={{ width: '100%', height: 'auto', display: 'block' }}
            >
              Tu navegador no soporta video HTML5.
            </video>
          )}

          <a
            ref={whatsappButtonRef}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsappClick('course_landing')}
            className="w-full bg-tag-yellow text-black px-6 py-4 sm:px-8 sm:py-5 font-druk text-lg sm:text-xl uppercase hover:bg-white transition-colors duration-300 shadow-lg flex items-center justify-center gap-3 mb-10"
          >
            <WhatsAppIcon />
            CONTACTAR POR WHATSAPP
          </a>

          {course.ctaMode === 'whatsappPlusInlineForm' && (
            <InlineLeadForm
              courseName={course.courseName}
              source={course.inlineFormSource || `cursos_${course.slug}`}
              defaultInterest={course.inlineFormDefaultInterest || ''}
            />
          )}
        </div>
      </div>

      {/* SECTIONS */}
      <div className="w-full px-6 sm:px-12 lg:px-24 pb-20 bg-black">
        <div className="max-w-4xl mx-auto space-y-16">
          {course.sections.map(section => (
            <div key={section.id} className="border-t border-white/5 pt-12">
              <h2 className="font-druk text-white leading-none mb-4" style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)' }}>
                {section.title.split(' ').slice(0, 1).join(' ')}{' '}
                <span className="text-tag-yellow">{section.title.split(' ').slice(1).join(' ')}</span>
              </h2>
              <div className={section.image ? 'flex flex-col sm:flex-row gap-8 sm:gap-10' : undefined}>
                {section.image && (
                  <img
                    src={section.image}
                    alt={section.imageAlt || ''}
                    className="w-40 sm:w-56 rounded-2xl object-cover shrink-0 border border-white/10"
                  />
                )}
                <div className="space-y-4">
                  {section.body.map((p, idx) => (
                    <p key={idx} className="text-white/55 font-garamond text-lg sm:text-xl leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Testimonios />

      {/* FINAL CTA */}
      <div className="w-full bg-tag-yellow px-6 sm:px-12 lg:px-24 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-druk text-black leading-none mb-4" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
            ¿TE QUEDAN DUDAS?
          </h2>
          <p className="text-black/60 font-garamond text-lg mb-8">Escríbenos y te ayudamos a encontrar el curso ideal.</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsappClick('course_landing')}
            className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 font-druk text-lg uppercase hover:bg-white hover:text-black transition-colors duration-300"
          >
            <WhatsAppIcon />
            CONTACTAR POR WHATSAPP
          </a>
        </div>
      </div>

      {/* MOBILE STICKY BUTTON */}
      {isMobile && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`fixed bottom-6 left-6 right-6 bg-tag-yellow text-black px-6 py-4 font-druk text-lg uppercase shadow-lg z-50 flex items-center justify-center gap-2 transition-all duration-500 ease-out ${
            showFixedButton ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-12 pointer-events-none'
          }`}
        >
          <WhatsAppIcon />
          CONTACTAR POR WHATSAPP
        </a>
      )}
    </section>
  );
};

export default CourseLanding;

