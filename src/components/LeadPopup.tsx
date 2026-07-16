import React, { useState, useEffect, useMemo } from 'react';
import { submitForm } from '../api/submitForm';
import { getUtms, buildWhatsAppUrl } from '../utils/utm';
import { getMetaAttribution } from '../utils/metaAttribution';
import { trackFormConversion } from '../utils/trackConversion';

declare global {
  interface Window { fbq: (...args: any[]) => void; }
}

const STORAGE_KEY = 'tag_popup_seen';
const COOLDOWN_DAYS = 7;
const DELAY_MS = 10000;

const COUNTRIES = [
  { flag: '🇪🇸', code: '+34', name: 'España' },
  { flag: '🇦🇷', code: '+54', name: 'Argentina' },
  { flag: '🇲🇽', code: '+52', name: 'México' },
  { flag: '🇨🇴', code: '+57', name: 'Colombia' },
  { flag: '🇵🇪', code: '+51', name: 'Perú' },
  { flag: '🇨🇱', code: '+56', name: 'Chile' },
  { flag: '🇻🇪', code: '+58', name: 'Venezuela' },
  { flag: '🇺🇾', code: '+598', name: 'Uruguay' },
  { flag: '🇧🇴', code: '+591', name: 'Bolivia' },
  { flag: '🇵🇹', code: '+351', name: 'Portugal' },
  { flag: '🇫🇷', code: '+33', name: 'Francia' },
  { flag: '🇮🇹', code: '+39', name: 'Italia' },
  { flag: '🇬🇧', code: '+44', name: 'Reino Unido' },
  { flag: '🇩🇪', code: '+49', name: 'Alemania' },
  { flag: '🇺🇸', code: '+1',  name: 'EEUU' },
];

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '6px',
  padding: '0.75rem 1rem',
  color: '#fff',
  fontSize: '0.9rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

const LeadPopup: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+34');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const waUrl = useMemo(() => buildWhatsAppUrl(
    'Hola TAG! Acabo de registrarme en vuestra web y me gustaría recibir más información sobre los cursos.',
    'Hola TAG! Acabo de registrarme en vuestro formulario y me gustaría saber más sobre los cursos.',
    'Hola TAG! Os vi en Instagram y acabo de dejar mis datos. Me gustaría recibir más info sobre los cursos.'
  ), []);

  useEffect(() => {
    if (window.location.pathname.startsWith('/referido')) return;

    const seen = localStorage.getItem(STORAGE_KEY);
    if (seen) {
      const daysSince = (Date.now() - Number(seen)) / (1000 * 60 * 60 * 24);
      if (daysSince < COOLDOWN_DAYS) return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
      if (typeof window !== 'undefined' && typeof window.fbq !== 'undefined') {
        try {
          window.fbq('trackCustom', 'FormStart', {
            content_name: 'Lead Popup',
            content_category: 'Lead Generation',
          });
        } catch {}
      }
    }, DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const fullPhone = countryCode + phone.replace(/^0+/, '');
    const { utm_source, utm_medium, utm_campaign, utm_id } = getUtms();
    const { fbc, fbp } = getMetaAttribution();
    const event_id = crypto.randomUUID();

    try {
      const result = await submitForm({
        email,
        name,
        phone: fullPhone,
        birthday: '',
        interests: '',
        source: 'website_popup',
        utm_source,
        utm_medium: utm_medium || 'organic',
        utm_campaign,
        utm_id,
      });

      if (result.success) {
        setSubmitted(true);
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
        trackFormConversion({ email, phone: fullPhone, name });

        if (typeof window !== 'undefined' && typeof window.fbq !== 'undefined') {
          try {
            window.fbq('track', 'Lead', {
              content_name: 'Lead Popup Submission',
              content_category: 'Lead Generation',
            }, { eventID: event_id });
          } catch {}
        }

        fetch('https://eqyprtyrsbbpiwapnclb.supabase.co/functions/v1/capi-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_id,
            email,
            phone: fullPhone,
            fbc,
            fbp,
            client_user_agent: navigator.userAgent,
            event_source_url: window.location.href,
          }),
        }).catch(() => {});

        setTimeout(() => setVisible(false), 3000);
      } else {
        throw new Error('Submit failed');
      }
    } catch {
      alert('Error al enviar. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible) return null;

  const selectedCountry = COUNTRIES.find(c => c.code === countryCode) ?? COUNTRIES[0];

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) handleClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.75)',
        padding: '1rem',
      }}
    >
      <div style={{
        background: '#111',
        color: '#fff',
        borderRadius: '14px',
        padding: '2rem 2rem 2.25rem',
        maxWidth: '400px',
        width: '100%',
        position: 'relative',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
      }}>
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '1.4rem',
            cursor: 'pointer',
            lineHeight: 1,
            padding: '0.25rem 0.5rem',
          }}
        >
          ×
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: '#FFBE00',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.5rem',
            }}>✓</div>
            <p style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.4rem' }}>¡Gracias!</p>
            <p style={{ fontSize: '0.85rem', opacity: 0.6, marginBottom: '1.25rem' }}>Nos ponemos en contacto en las próximas 24h.</p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#25D366',
                color: '#fff',
                textDecoration: 'none',
                padding: '0.7rem 1.25rem',
                borderRadius: '7px',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Escríbenos por WhatsApp
            </a>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.18em', opacity: 0.4, marginBottom: '0.75rem' }}>
              THE ACTING GARAGE
            </p>
            <h2 style={{
              fontSize: '1.35rem',
              fontWeight: 900,
              lineHeight: 1.2,
              marginBottom: '0.5rem',
              letterSpacing: '-0.01em',
            }}>
              ¿Quieres saber más<br />sobre nuestros cursos?
            </h2>
            <p style={{ fontSize: '0.82rem', opacity: 0.55, marginBottom: '1.75rem', lineHeight: 1.5 }}>
              Déjanos tus datos y te contactamos con toda la info.
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <input
                type="email"
                placeholder="Email *"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Nombre y apellido *"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                style={inputStyle}
              />

              {/* Phone with country selector */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <select
                    value={countryCode}
                    onChange={e => setCountryCode(e.target.value)}
                    style={{
                      ...inputStyle,
                      width: 'auto',
                      paddingRight: '2rem',
                      paddingLeft: '0.65rem',
                      appearance: 'none',
                      cursor: 'pointer',
                      minWidth: '80px',
                    }}
                  >
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  {/* Dropdown chevron */}
                  <span style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    fontSize: '0.65rem',
                    opacity: 0.5,
                  }}>▾</span>
                </div>
                <input
                  type="tel"
                  placeholder="Teléfono *"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: '#FFBE00',
                  color: '#111',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '0.9rem',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  marginTop: '0.5rem',
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? 'ENVIANDO...' : 'QUIERO INFO'}
              </button>
            </form>
            <p style={{ fontSize: '0.7rem', opacity: 0.3, textAlign: 'center', marginTop: '1rem' }}>
              Sin spam. Te contactamos una sola vez.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default LeadPopup;
