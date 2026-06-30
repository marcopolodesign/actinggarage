import React, { useState, useEffect } from 'react';
import { submitForm } from '../api/submitForm';
import { getUtms } from '../utils/utm';
import { getMetaAttribution } from '../utils/metaAttribution';
import { trackFormConversion } from '../utils/trackConversion';

declare global {
  interface Window { fbq: (...args: any[]) => void; }
}

const STORAGE_KEY = 'tag_popup_seen';
const COOLDOWN_DAYS = 7;
const DELAY_MS = 10000;

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
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Cooldown: don't show if dismissed/submitted in the last COOLDOWN_DAYS
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

    const { utm_source, utm_medium, utm_campaign, utm_id } = getUtms();
    const { fbc, fbp } = getMetaAttribution();
    const event_id = crypto.randomUUID();

    try {
      const result = await submitForm({
        email,
        name,
        phone,
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
        trackFormConversion({ email, phone, name });

        if (typeof window !== 'undefined' && typeof window.fbq !== 'undefined') {
          try {
            window.fbq('track', 'Lead', {
              content_name: 'Lead Popup Submission',
              content_category: 'Lead Generation',
            }, { eventID: event_id });
          } catch {}
        }

        fetch('https://pyiypxvvruwvwfcsprrb.supabase.co/functions/v1/capi-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_id,
            email,
            phone,
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
      alert('Error al enviar. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!visible) return null;

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
            <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Nos ponemos en contacto en las próximas 24h.</p>
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
              ¿Querés saber más<br />sobre nuestros cursos?
            </h2>
            <p style={{ fontSize: '0.82rem', opacity: 0.55, marginBottom: '1.75rem', lineHeight: 1.5 }}>
              Dejanos tus datos y te contactamos con toda la info.
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
              <input
                type="tel"
                placeholder="Teléfono *"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={inputStyle}
              />
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
