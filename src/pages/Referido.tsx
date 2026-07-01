import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { submitForm } from '../api/submitForm';

const Referido: React.FC = () => {
  const [referrerEmail, setReferrerEmail] = useState('');
  const [friendName, setFriendName] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [friendPhone, setFriendPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const result = await submitForm({
        name: friendName.trim(),
        email: friendEmail.trim().toLowerCase(),
        phone: friendPhone.trim(),
        birthday: '',
        interests: '',
        source: 'referido',
        utm_source: referrerEmail.trim().toLowerCase(),
        utm_medium: 'referral',
      });

      if (!result.success) throw new Error(result.message);
      setSubmitted(true);
    } catch (err: any) {
      setError('Hubo un error al enviar. Intentá de nuevo.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Referí un amigo — The Acting Garage</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div style={{
        minHeight: '100dvh',
        background: '#0a0a0a',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '2rem 1.25rem',
        boxSizing: 'border-box',
      }}>
        <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{
                width: '56px', height: '56px',
                background: '#FFBE00', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '1.5rem', fontWeight: 900, color: '#111',
              }}>✓</div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '0.75rem', lineHeight: 1.15 }}>
                ¡Listo!
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                Nos contactamos con <strong style={{ color: '#fff' }}>{friendName.split(' ')[0]}</strong> en las próximas 24–48h.
              </p>
              <p style={{ marginTop: '0.75rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem' }}>
                Tu 20% se acredita cuando se inscriba.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ marginBottom: '2rem' }}>
                <p style={{
                  fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em',
                  color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem',
                }}>
                  THE ACTING GARAGE
                </p>
                <h1 style={{
                  fontSize: 'clamp(1.9rem, 7vw, 2.6rem)',
                  fontWeight: 900, lineHeight: 1.1,
                  letterSpacing: '-0.02em', marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                }}>
                  TRAÉ UN<br />AMIGO A TAG
                </h1>
              </div>

              {/* Benefit pills */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <span style={{
                  background: '#FFBE00', color: '#111',
                  borderRadius: '100px', padding: '0.35rem 0.85rem',
                  fontSize: '0.75rem', fontWeight: 800,
                }}>
                  Tu amigo: sin matrícula
                </span>
                <span style={{
                  border: '1px solid rgba(255,190,0,0.4)', color: '#FFBE00',
                  borderRadius: '100px', padding: '0.35rem 0.85rem',
                  fontSize: '0.75rem', fontWeight: 800,
                }}>
                  Vos: 20% de descuento
                </span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

                {/* Referrer email */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{
                    display: 'block', fontSize: '0.6rem', fontWeight: 700,
                    letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)',
                    marginBottom: '0.35rem',
                  }}>
                    TU EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={referrerEmail}
                    onChange={e => setReferrerEmail(e.target.value)}
                    placeholder="tu@email.com"
                    style={field}
                  />
                  <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.3rem' }}>
                    Para acreditarte el descuento cuando se inscriba.
                  </p>
                </div>

                {/* Divider */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  margin: '0.75rem 0 1rem',
                }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                  <span style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', fontWeight: 700 }}>
                    TU AMIGO/A
                  </span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <input
                    type="text"
                    required
                    value={friendName}
                    onChange={e => setFriendName(e.target.value)}
                    placeholder="Nombre y apellido *"
                    style={field}
                  />
                  <input
                    type="email"
                    required
                    value={friendEmail}
                    onChange={e => setFriendEmail(e.target.value)}
                    placeholder="Email *"
                    style={field}
                  />
                  <input
                    type="tel"
                    required
                    value={friendPhone}
                    onChange={e => setFriendPhone(e.target.value)}
                    placeholder="Teléfono *"
                    style={field}
                  />
                </div>

                {error && (
                  <p style={{ color: '#ff6b6b', fontSize: '0.82rem', marginBottom: '0.75rem' }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    background: '#FFBE00', color: '#111',
                    border: 'none', borderRadius: '8px',
                    padding: '1rem', width: '100%',
                    fontSize: '0.9rem', fontWeight: 900,
                    letterSpacing: '0.1em',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? 'ENVIANDO...' : 'ENVIAR REFERIDO'}
                </button>

                <p style={{
                  fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)',
                  textAlign: 'center', marginTop: '1rem', lineHeight: 1.5,
                }}>
                  El 20% se acredita al momento de la inscripción de tu amigo/a.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

const field: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '8px',
  padding: '0.875rem 1rem',
  color: '#fff',
  fontSize: '1rem',
  outline: 'none',
  boxSizing: 'border-box',
};

export default Referido;
