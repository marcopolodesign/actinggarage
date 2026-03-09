import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Testimonios from '../components/Testimonios';
import { submitForm } from '../api/submitForm';

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    gtag: (...args: any[]) => void;
  }
}

interface InlineFormData {
  email: string;
  name: string;
  phone: string;
  birthday: string;
  interests: string;
  gender: string;
}

const calculateAge = (birthday: string): string => {
  if (!birthday) return '';
  const date = new Date(birthday);
  if (isNaN(date.getTime())) return '';
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const m = today.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
  return String(age);
};

const WhatsAppIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      fill="currentColor"
    />
  </svg>
);

const COURSE_NAME = 'Garage Hybrid Plus';
const LANDING_SOURCE = 'landing_hybrid_plus';

const LandingHybridPlus: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showFixedButton, setShowFixedButton] = useState(false);
  const whatsappButtonRef = useRef<HTMLAnchorElement>(null);

  const [formData, setFormData] = useState<InlineFormData>({
    email: '',
    name: '',
    phone: '',
    birthday: '',
    interests: '',
    gender: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
      ? encodeURIComponent(`Hola TAG! Quisiera obtener más información sobre el ${COURSE_NAME}`)
      : encodeURIComponent(`Hola TAG! Quiero más información sobre el ${COURSE_NAME}`);
    return `https://wa.me/34682560187?text=${message}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const urlParams = new URLSearchParams(window.location.search);
    try {
      const result = await submitForm({
        name: formData.name,
        phone: formData.phone,
        birthday: formData.birthday,
        interests: formData.interests,
        gender: formData.gender,
        course: COURSE_NAME,
        age: calculateAge(formData.birthday),
        email: formData.email,
        source: LANDING_SOURCE,
        utm_source: urlParams.get('utm_source') || '',
        utm_medium: urlParams.get('utm_medium') || 'organic',
        utm_campaign: urlParams.get('utm_campaign') || '',
        utm_id: urlParams.get('utm_id') || '',
      });

      if (result.success) {
        setSubmitted(true);
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
          window.gtag('event', 'conversion', {
            send_to: 'AW-17688095812/dXncCM7MhLsbEMTYq_JB',
          });
        }
        if (typeof window !== 'undefined' && typeof window.fbq !== 'undefined') {
          try {
            window.fbq('track', 'Lead', {
              content_name: `${COURSE_NAME} Landing Form`,
              content_category: 'Lead Generation',
              content_ids: [COURSE_NAME],
              content_type: 'form',
              status: true,
            });
          } catch (err) {
            console.error('Meta Pixel error:', err);
          }
        }
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Form error:', error);
      alert('Error al enviar el formulario. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    { label: 'Duración', value: '3 años' },
    { label: 'Clases', value: '2 días/semana' },
    { label: 'Dedicación', value: '8h/semana' },
    { label: 'Edad', value: '17–45 años' },
    { label: 'Modalidad', value: 'Teatro + Cine' },
  ];

  const learningPillars = [
    {
      icon: '🎭',
      title: 'Teatro Escénico',
      desc: 'Técnica actoral profunda: texto, cuerpo, emoción y construcción de personaje de alto nivel.',
    },
    {
      icon: '🎬',
      title: 'Actuación ante Cámara',
      desc: 'Cine y televisión: framing, continuidad, dirección y actuación con diferentes formatos audiovisuales.',
    },
    {
      icon: '🎵',
      title: 'Canto Aplicado',
      desc: 'Voz, expresión musical y canto como herramienta actoral. Amplía tu rango y versatilidad.',
    },
    {
      icon: '✍️',
      title: 'Creación Artística',
      desc: 'Proyectos personales y colectivos donde desarrollas tu voz propia como creador e intérprete.',
    },
    {
      icon: '⚡',
      title: 'Doble Intensidad',
      desc: '8 horas semanales de formación para quienes necesitan avanzar más rápido sin comprometer profundidad.',
    },
  ];

  const faqs = [
    {
      q: '¿En qué se diferencia el Hybrid Plus del Hybrid estándar?',
      a: 'El Hybrid Plus duplica la carga horaria (8h vs 4h semanales), incorpora formación en canto y expresión vocal, y añade módulos de creación artística personal. Es para quienes buscan una profesionalización más intensa y completa.',
    },
    {
      q: '¿Necesito experiencia previa en canto o teatro?',
      a: 'No es obligatorio, pero sí recomendamos que tengas cierta base o motivación real de comprometerte con las 8 horas semanales. Nuestro equipo te valorará en el proceso de admisión.',
    },
    {
      q: '¿Cuándo comienza el próximo grupo?',
      a: 'Los grupos abren inscripción una vez al año. Contáctanos por WhatsApp o rellena el formulario para recibir información sobre las próximas fechas de inicio y plazas disponibles.',
    },
    {
      q: '¿Puedo cambiar al Hybrid estándar si el Plus es demasiado intenso?',
      a: 'Sí, existe flexibilidad para cambiar de modalidad dentro del primer mes, sujeto a disponibilidad de plazas. Hablamos contigo para encontrar el formato que mejor se adapte.',
    },
    {
      q: '¿Cómo me inscribo?',
      a: 'Rellena el formulario en esta página o escríbenos directamente por WhatsApp. Nuestro equipo te acompañará en el proceso de admisión y responderá todas tus preguntas.',
    },
  ];

  return (
    <section className="bg-black min-h-screen">
      <Helmet>
        <title>Garage Hybrid Plus — Teatro, Cine & Canto | TAG Escuela de Actuación</title>
        <meta
          name="description"
          content="La formación actoral más completa: Teatro, Cine y Canto en un programa de 3 años con 8 horas semanales. Garage Hybrid Plus en TAG."
        />
        <meta
          name="title"
          content="Garage Hybrid Plus — Teatro, Cine & Canto | TAG Escuela de Actuación"
        />
      </Helmet>

      <Header showOnScroll={false} />

      {/* ─── HERO ─── */}
      <div className="w-full px-6 sm:px-12 lg:px-24 pt-28 sm:pt-36 pb-16 bg-black">
        <div className="max-w-4xl mx-auto">
          <p className="text-tag-yellow text-xs uppercase tracking-[0.3em] font-druk mb-4 opacity-70">
            Formación Anual · Garage
          </p>

          <h1 className="font-druk leading-none mb-6">
            <span
              className="block text-tag-yellow"
              style={{ fontSize: 'clamp(3rem, 12vw, 8rem)' }}
            >
              GARAGE
            </span>
            <span
              className="block text-white"
              style={{ fontSize: 'clamp(2.2rem, 9vw, 6.5rem)' }}
            >
              HYBRID PLUS
            </span>
          </h1>

          <p
            className="text-white/70 font-garamond mb-10 max-w-xl"
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)' }}
          >
            Teatro, Cine y Canto. La formación actoral más completa para profesionalizarte a fondo.
          </p>

          {/* Stat badges */}
          <div className="flex flex-wrap gap-3">
            {stats.map(({ label, value }) => (
              <div key={label} className="border border-tag-yellow/40 px-4 py-2 flex flex-col">
                <span className="text-tag-yellow/50 text-[10px] uppercase tracking-widest font-druk">
                  {label}
                </span>
                <span className="text-white text-sm font-druk">{value}</span>
              </div>
            ))}
          </div>

          {/* Plus badge */}
          <div className="mt-6 inline-flex items-center gap-2 bg-tag-yellow px-4 py-2">
            <span className="font-druk text-black text-xs uppercase tracking-widest">
              ⚡ Doble intensidad — 8h semanales
            </span>
          </div>
        </div>
      </div>

      {/* ─── VIDEO + CTA + FORM ─── */}
      <div className="w-full px-6 sm:px-12 lg:px-24 pb-20 bg-black">
        <div className="max-w-3xl mx-auto">
          {/* Video */}
          <div className="w-full mb-8" style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
              <iframe
                src="https://www.youtube.com/embed/ioPES8OreeY"
                title="Garage Hybrid Plus — TAG"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
              />
            </div>
          </div>

          {/* WhatsApp CTA */}
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

          {/* ── Inline Contact Form ── */}
          <div className="bg-[#0d0d0d] border border-white/10 p-6 sm:p-10">
            <h2 className="font-druk text-tag-yellow text-2xl sm:text-3xl uppercase mb-2">
              ¿Te interesa el Garage Hybrid Plus?
            </h2>
            <p className="text-white/50 font-garamond text-base mb-8">
              Déjanos tus datos y te contactamos con toda la información.
            </p>

            {submitted ? (
              <div className="text-center py-12">
                <p className="font-druk text-tag-yellow text-3xl mb-3">¡GRACIAS!</p>
                <p className="text-white/60 font-garamond text-lg">
                  Hemos recibido tu información. Te contactamos pronto.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-tag-yellow text-[11px] font-druk uppercase tracking-widest mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    placeholder="tu@email.com"
                    className="w-full bg-black border border-white/15 text-white px-4 py-3 focus:outline-none focus:border-tag-yellow transition-colors duration-200 font-garamond placeholder:text-white/25"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-tag-yellow text-[11px] font-druk uppercase tracking-widest mb-1.5">
                    Nombre y Apellido
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-black border border-white/15 text-white px-4 py-3 focus:outline-none focus:border-tag-yellow transition-colors duration-200 font-garamond"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-tag-yellow text-[11px] font-druk uppercase tracking-widest mb-1.5">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                    className="w-full bg-black border border-white/15 text-white px-4 py-3 focus:outline-none focus:border-tag-yellow transition-colors duration-200 font-garamond"
                  />
                </div>

                {/* Birthday */}
                <div>
                  <label className="block text-tag-yellow text-[11px] font-druk uppercase tracking-widest mb-1.5">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.birthday}
                    onChange={e => setFormData(p => ({ ...p, birthday: e.target.value }))}
                    className="w-full bg-black border border-white/15 text-white px-4 py-3 focus:outline-none focus:border-tag-yellow transition-colors duration-200 font-garamond"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-tag-yellow text-[11px] font-druk uppercase tracking-widest mb-2">
                    ¿Cuáles son tus intereses?
                  </label>
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

                {/* Gender */}
                <div>
                  <label className="block text-tag-yellow text-[11px] font-druk uppercase tracking-widest mb-1.5">
                    Género
                  </label>
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
        </div>
      </div>

      {/* ─── LEARNING PILLARS ─── */}
      <div className="w-full px-6 sm:px-12 lg:px-24 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2
            className="font-druk text-white leading-none mb-3"
            style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}
          >
            ¿QUÉ VAS A{' '}
            <span className="text-tag-yellow">APRENDER?</span>
          </h2>
          <p className="text-white/30 font-garamond text-xl sm:text-2xl mb-12 max-w-xl">
            Cinco disciplinas, una formación. La versión más completa del método Garage.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {learningPillars.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-black p-8 flex flex-col gap-4 hover:bg-[#0d0d0d] transition-colors duration-300 group"
              >
                <span className="text-3xl">{icon}</span>
                <h3 className="font-druk text-tag-yellow text-2xl sm:text-3xl uppercase tracking-wide group-hover:text-white transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-white/50 font-garamond text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── TESTIMONIALS ─── */}
      <Testimonios />

      {/* ─── FAQ ─── */}
      <div className="w-full px-6 sm:px-12 lg:px-24 py-20 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2
            className="font-druk text-white leading-none mb-12"
            style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}
          >
            PREGUNTAS{' '}
            <span className="text-tag-yellow">FRECUENTES</span>
          </h2>

          <div className="divide-y divide-white/10">
            {faqs.map(({ q, a }, i) => (
              <div key={i}>
                <button
                  className="w-full flex items-start justify-between gap-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-druk text-white text-xl sm:text-2xl uppercase leading-snug flex-1">
                    {q}
                  </span>
                  <span
                    className={`text-tag-yellow font-druk text-2xl flex-shrink-0 leading-none transition-transform duration-300 ${
                      openFaq === i ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFaq === i ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-white/35 font-garamond text-xl sm:text-2xl leading-relaxed">{a}</p>
                </div>
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

export default LandingHybridPlus;
