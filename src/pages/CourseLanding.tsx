import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Testimonios from '../components/Testimonios';
import { coursesConfig, type CourseConfig } from '../content/coursesConfig';
import { submitForm } from '../api/submitForm';

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    gtag: (...args: any[]) => void;
  }
}

type InlineFormData = {
  email: string;
  name: string;
  phone: string;
  birthday: string;
  interests: string;
  gender: string;
};

const calculateAge = (birthday: string): string => {
  if (!birthday) return '';
  const date = new Date(birthday);
  if (Number.isNaN(date.getTime())) return '';
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const m = today.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
  return String(age);
};

const WhatsAppIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      fill="currentColor"
    />
  </svg>
);

function getWhatsAppUrl(course: CourseConfig, search: string) {
  const urlParams = new URLSearchParams(search);
  const hasUtm = urlParams.has('utm_source') || urlParams.has('utm_medium') || urlParams.has('utm_campaign');
  const label = course.whatsAppLabel || course.courseName;
  const extra = course.whatsAppExtra ? ` ${course.whatsAppExtra}` : '';
  const message = hasUtm
    ? encodeURIComponent(`Hola TAG! Quisiera obtener más información sobre el ${label}${extra}`)
    : encodeURIComponent(`Hola TAG! Quiero más información sobre el ${label}${extra}`);
  return `https://wa.me/34682560187?text=${message}`;
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

  // Inline form state (only used when enabled)
  const defaultInterest = course?.inlineFormDefaultInterest || '';
  const [formData, setFormData] = useState<InlineFormData>({
    email: '',
    name: '',
    phone: '',
    birthday: '',
    interests: defaultInterest,
    gender: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const whatsappButtonRef = useRef<HTMLAnchorElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showFixedButton, setShowFixedButton] = useState(false);

  // Keep defaults in sync when navigating between slugs
  useEffect(() => {
    setFormData({
      email: '',
      name: '',
      phone: '',
      birthday: '',
      interests: defaultInterest,
      gender: '',
    });
    setSubmitted(false);
  }, [slug, defaultInterest]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;
    setIsSubmitting(true);
    const urlParams = new URLSearchParams(location.search);
    try {
      const result = await submitForm({
        name: formData.name,
        phone: formData.phone,
        birthday: formData.birthday,
        interests: formData.interests,
        gender: formData.gender,
        course: course.courseName,
        age: calculateAge(formData.birthday),
        email: formData.email,
        source: course.inlineFormSource || `cursos_${course.slug}`,
        utm_source: urlParams.get('utm_source') || '',
        utm_medium: urlParams.get('utm_medium') || 'organic',
        utm_campaign: urlParams.get('utm_campaign') || '',
        utm_id: urlParams.get('utm_id') || '',
      });

      if (!result.success) throw new Error('Submission failed');

      setSubmitted(true);

      // Light-weight conversion tracking (same pattern as existing landings)
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', { send_to: 'AW-17688095812/dXncCM7MhLsbEMTYq_JB' });
      }
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        try {
          window.fbq('track', 'Lead', {
            content_name: `${course.courseName} Landing Form`,
            content_category: 'Lead Generation',
            content_ids: [course.courseName],
            content_type: 'form',
            status: true,
          });
        } catch (err) {
          console.error('Meta Pixel error:', err);
        }
      }
    } catch (err) {
      console.error('Form error:', err);
      alert('Error al enviar el formulario. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!course) return <NotFound />;

  const heroBg = course.heroBgImage ? `url(${course.heroBgImage})` : undefined;
  const overlayClass = course.heroBgOverlayClassName || 'bg-black/60';

  return (
    <section className="bg-black min-h-screen">
      <Helmet>
        <title>{course.seo.title}</title>
        <meta name="title" content={course.seo.title} />
        <meta name="description" content={course.seo.description} />
        <link rel="canonical" href={`https://actinggarage.com${course.seo.canonicalPath}`} />

        <meta property="og:title" content={course.seo.title} />
        <meta property="og:description" content={course.seo.description} />
        <meta property="og:url" content={`https://actinggarage.com${course.seo.canonicalPath}`} />

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
              <div key={label} className="border border-tag-yellow/40 px-4 py-2 flex flex-col">
                <span className="text-tag-yellow/50 text-[10px] uppercase tracking-widest font-druk">{label}</span>
                <span className="text-white text-sm font-druk">{value}</span>
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

          <a
            ref={whatsappButtonRef}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-tag-yellow text-black px-6 py-4 sm:px-8 sm:py-5 font-druk text-lg sm:text-xl uppercase hover:bg-white transition-colors duration-300 shadow-lg flex items-center justify-center gap-3 mb-10"
          >
            <WhatsAppIcon />
            CONTACTAR POR WHATSAPP
          </a>

          {course.ctaMode === 'whatsappPlusInlineForm' && (
            <div className="bg-[#0d0d0d] border border-white/10 p-6 sm:p-10">
              <h2 className="font-druk text-tag-yellow text-2xl sm:text-3xl uppercase mb-2">¿Te interesa este curso?</h2>
              <p className="text-white/50 font-garamond text-base mb-8">Déjanos tus datos y te contactamos con toda la información.</p>

              {submitted ? (
                <div className="text-center py-12">
                  <p className="font-druk text-tag-yellow text-3xl mb-3">¡GRACIAS!</p>
                  <p className="text-white/60 font-garamond text-lg">Hemos recibido tu información. Te contactamos pronto.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-tag-yellow text-[11px] font-druk uppercase tracking-widest mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      placeholder="tu@email.com"
                      className="w-full bg-black border border-white/15 text-white px-4 py-3 focus:outline-none focus:border-tag-yellow transition-colors duration-200 font-garamond placeholder:text-white/25"
                    />
                  </div>

                  <div>
                    <label className="block text-tag-yellow text-[11px] font-druk uppercase tracking-widest mb-1.5">Nombre y Apellido</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-black border border-white/15 text-white px-4 py-3 focus:outline-none focus:border-tag-yellow transition-colors duration-200 font-garamond"
                    />
                  </div>

                  <div>
                    <label className="block text-tag-yellow text-[11px] font-druk uppercase tracking-widest mb-1.5">Teléfono</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                      className="w-full bg-black border border-white/15 text-white px-4 py-3 focus:outline-none focus:border-tag-yellow transition-colors duration-200 font-garamond"
                    />
                  </div>

                  <div>
                    <label className="block text-tag-yellow text-[11px] font-druk uppercase tracking-widest mb-1.5">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      required
                      value={formData.birthday}
                      onChange={e => setFormData(p => ({ ...p, birthday: e.target.value }))}
                      className="w-full bg-black border border-white/15 text-white px-4 py-3 focus:outline-none focus:border-tag-yellow transition-colors duration-200 font-garamond"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>

                  <div>
                    <label className="block text-tag-yellow text-[11px] font-druk uppercase tracking-widest mb-2">¿Cuáles son tus intereses?</label>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { id: 'teatro', label: 'TEATRO' },
                        { id: 'cine', label: 'CINE' },
                        { id: 'teatro-cine', label: 'TEATRO & CINE' },
                      ].map(({ id, label }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, interests: id }))}
                          className={`px-4 py-2 text-xs font-druk uppercase tracking-wide border transition-all duration-200 ${
                            formData.interests === id
                              ? 'bg-tag-yellow text-black border-tag-yellow'
                              : 'bg-transparent text-white/50 border-white/15 hover:border-tag-yellow/40 hover:text-white/80'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-tag-yellow text-[11px] font-druk uppercase tracking-widest mb-1.5">Género</label>
                    <select
                      value={formData.gender}
                      onChange={e => setFormData(p => ({ ...p, gender: e.target.value }))}
                      className="w-full bg-black border border-white/15 text-white px-4 py-3 focus:outline-none focus:border-tag-yellow transition-colors duration-200 font-garamond appearance-none"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                      <option value="no_especificado">No especificado</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.interests}
                    className="w-full bg-tag-yellow text-black font-druk text-lg uppercase py-4 hover:bg-white transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
                  >
                    {isSubmitting ? 'ENVIANDO...' : 'QUIERO MÁS INFORMACIÓN'}
                  </button>
                </form>
              )}
            </div>
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
              <div className="space-y-4">
                {section.body.map((p, idx) => (
                  <p key={idx} className="text-white/55 font-garamond text-lg sm:text-xl leading-relaxed">
                    {p}
                  </p>
                ))}
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

