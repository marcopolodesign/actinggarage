import React, { useEffect, useState } from 'react';
import { submitForm } from '../api/submitForm';
import { getUtms, getLandingPage } from '../utils/utm';
import { getReferrerSource, getSessionPath } from '../utils/journey';
import { trackFormConversion } from '../utils/trackConversion';

// Formulario de captura embebido en una landing.
//
// 🔴 Por qué existe: hasta el 2026-09-04 este bloque vivía copiado dentro de
// `CourseLanding.tsx` y no había forma de ponerlo en otra landing sin duplicar
// ~200 líneas. `/iniciacion` — el destino de C02 — se quedó por eso SIN
// formulario: su única conversión era WhatsApp, donde el UTM se pierde, así que
// la campaña se leía como si no convirtiera (1.209 vistas → 2 prospectos en
// agosto, todos rescatados por el popup global).
//
// El `source` es lo que después permite cortar el CRM por landing: darle uno
// propio a cada página, y darlo de alta en el selector de TAG-admin.

export type InlineLeadFormProps = {
  /** Nombre del curso que se guarda en `prospects.course`. */
  courseName: string;
  /** Valor de `prospects.source` — la señal que corta el CRM por landing. */
  source: string;
  /** Interés pre-seleccionado ('teatro' | 'cine' | 'teatro-cine'). */
  defaultInterest?: string;
  title?: string;
  subtitle?: string;
  /** `content_name` del evento Lead del pixel. Por defecto, el nombre del curso. */
  pixelContentName?: string;
};

type InlineFormData = {
  email: string;
  name: string;
  phone: string;
  birthday: string;
  interests: string;
  gender: string;
};

// Devuelve string, igual que la versión que vivía en CourseLanding: el payload
// que espera `submitForm` no cambia.
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

const INPUT_CLASS =
  'w-full bg-black border border-white/15 text-white px-4 py-3 focus:outline-none focus:border-tag-yellow transition-colors duration-200 font-garamond';
const LABEL_CLASS = 'block text-tag-yellow text-xs font-druk uppercase tracking-widest mb-1.5';

const InlineLeadForm: React.FC<InlineLeadFormProps> = ({
  courseName,
  source,
  defaultInterest = '',
  title = '¿Te interesa este curso?',
  subtitle = 'Déjanos tus datos y te contactamos con toda la información.',
  pixelContentName,
}) => {
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

  // Al navegar entre landings el componente se reutiliza: resetear.
  useEffect(() => {
    setFormData({ email: '', name: '', phone: '', birthday: '', interests: defaultInterest, gender: '' });
    setSubmitted(false);
  }, [source, defaultInterest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await submitForm({
        name: formData.name,
        phone: formData.phone,
        birthday: formData.birthday,
        interests: formData.interests,
        gender: formData.gender,
        course: courseName,
        age: calculateAge(formData.birthday),
        email: formData.email,
        source,
        landing_page: getLandingPage(),
        ...getUtms(),
        referrer_source: getReferrerSource(),
        session_path: getSessionPath(),
      });

      if (!result.success) throw new Error('Submission failed');

      setSubmitted(true);

      trackFormConversion({ email: formData.email, phone: formData.phone, name: formData.name });
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        try {
          window.fbq('track', 'Lead', {
            content_name: `${pixelContentName || courseName} Landing Form`,
            content_category: 'Lead Generation',
            content_ids: [courseName],
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

  return (
    <div className="bg-[#0d0d0d] border border-white/10 p-6 sm:p-10">
      <h2 className="font-druk text-tag-yellow text-2xl sm:text-3xl uppercase mb-2">{title}</h2>
      <p className="text-white/50 font-garamond text-base mb-8">{subtitle}</p>

      {submitted ? (
        <div className="text-center py-12">
          <p className="font-druk text-tag-yellow text-3xl mb-3">¡GRACIAS!</p>
          <p className="text-white/60 font-garamond text-lg">Hemos recibido tu información. Te contactamos pronto.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={LABEL_CLASS}>Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
              placeholder="tu@email.com"
              className={`${INPUT_CLASS} placeholder:text-white/25`}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Nombre y Apellido</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Teléfono</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
              className={INPUT_CLASS}
            />
          </div>

          <div>
            <label className={LABEL_CLASS}>Fecha de Nacimiento</label>
            <input
              type="date"
              required
              value={formData.birthday}
              onChange={e => setFormData(p => ({ ...p, birthday: e.target.value }))}
              className={INPUT_CLASS}
              style={{ colorScheme: 'dark' }}
            />
          </div>

          <div>
            <label className="block text-tag-yellow text-xs font-druk uppercase tracking-widest mb-2">
              ¿Cuáles son tus intereses?
            </label>
            <div className="flex gap-2 flex-wrap">
              {[
                { id: 'teatro', label: 'TEATRO' },
                { id: 'cine', label: 'CINE' },
                { id: 'teatro-cine', label: 'TEATRO & CINE' },
                { id: 'escritura', label: 'ESCRITURA' },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, interests: id }))}
                  className={`px-4 py-3 text-sm font-druk uppercase tracking-wide border transition-all duration-200 ${
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
            <label className={LABEL_CLASS}>Género</label>
            <select
              value={formData.gender}
              onChange={e => setFormData(p => ({ ...p, gender: e.target.value }))}
              className={`${INPUT_CLASS} appearance-none`}
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
  );
};

export default InlineLeadForm;
