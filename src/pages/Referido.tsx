import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { submitForm } from '../api/submitForm';

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '8px',
  padding: '0.85rem 1rem',
  color: '#fff',
  fontSize: '0.95rem',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.65rem',
  fontWeight: 700,
  letterSpacing: '0.15em',
  color: 'rgba(255,255,255,0.45)',
  marginBottom: '0.4rem',
};

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
        // Referrer stored in utm_source so CRM can identify who gets the 20% credit
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
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '3rem 1.25rem 4rem',
      }}>

        {/* Wordmark */}
        <p style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.25em',
          color: 'rgba(255,255,255,0.35)',
          marginBottom: '3rem',
        }}>
          THE ACTING GARAGE
        </p>

        {/* Hero */}
        <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 8vw, 3.5rem)',
            fontWeight: 900,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            marginBottom: '1rem',
            textTransform: 'uppercase',
          }}>
            TRAÉ UN<br />AMIGO A TAG
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
            Compartí la experiencia y los dos ganan.
          </p>
        </div>

        {/* Benefit cards */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          maxWidth: '480px',
          width: '100%',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
        }}>
          <div style={{
            flex: 1,
            minWidth: '180px',
            background: '#FFBE00',
            borderRadius: '12px',
            padding: '1.25rem',
            color: '#111',
          }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '0.4rem' }}>
              TU AMIGO/A
            </p>
            <p style={{ fontSize: '1.1rem', fontWeight: 900, lineHeight: 1.2 }}>
              Sin matrícula
            </p>
            <p style={{ fontSize: '0.78rem', marginTop: '0.3rem', opacity: 0.7 }}>
              Se inscribe sin pagar el costo de ingreso
            </p>
          </div>
          <div style={{
            flex: 1,
            minWidth: '180px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '12px',
            padding: '1.25rem',
          }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', marginBottom: '0.4rem', color: '#FFBE00' }}>
              VOS
            </p>
            <p style={{ fontSize: '1.1rem', fontWeight: 900, lineHeight: 1.2 }}>
              20% de descuento
            </p>
            <p style={{ fontSize: '0.78rem', marginTop: '0.3rem', color: 'rgba(255,255,255,0.5)' }}>
              En tu próxima cuota mensual
            </p>
          </div>
        </div>

        {/* Form */}
        <div style={{ maxWidth: '480px', width: '100%' }}>
          {submitted ? (
            <div style={{
              background: 'rgba(255,190,0,0.08)',
              border: '1px solid rgba(255,190,0,0.3)',
              borderRadius: '14px',
              padding: '2.5rem 2rem',
              textAlign: 'center',
            }}>
              <div style={{
                width: '52px', height: '52px',
                background: '#FFBE00', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '1.4rem', color: '#111', fontWeight: 900,
              }}>✓</div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.6rem' }}>
                ¡Listo, {friendName.split(' ')[0]}!
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, fontSize: '0.9rem' }}>
                Nos contactamos con <strong style={{ color: '#fff' }}>{friendName.split(' ')[0]}</strong> en las próximas 24–48h con su oferta.
              </p>
              <p style={{ marginTop: '1rem', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem' }}>
                Tu 20% de descuento se acredita cuando se inscriba.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              padding: '2rem',
            }}>
              {/* Referrer */}
              <p style={{
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em',
                color: '#FFBE00', marginBottom: '1.25rem',
              }}>
                TUS DATOS
              </p>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}>TU EMAIL</label>
                <input
                  type="email"
                  required
                  value={referrerEmail}
                  onChange={e => setReferrerEmail(e.target.value)}
                  placeholder="tu@email.com"
                  style={inputStyle}
                />
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.4rem' }}>
                  Lo usamos para acreditarte el descuento cuando tu amigo/a se inscriba.
                </p>
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', margin: '1.5rem 0' }} />

              {/* Friend */}
              <p style={{
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em',
                color: '#FFBE00', marginBottom: '1.25rem',
              }}>
                DATOS DE TU AMIGO/A
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>NOMBRE Y APELLIDO</label>
                  <input
                    type="text"
                    required
                    value={friendName}
                    onChange={e => setFriendName(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>EMAIL</label>
                  <input
                    type="email"
                    required
                    value={friendEmail}
                    onChange={e => setFriendEmail(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>TELÉFONO</label>
                  <input
                    type="tel"
                    required
                    value={friendPhone}
                    onChange={e => setFriendPhone(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>

              {error && (
                <p style={{ color: '#ff6b6b', fontSize: '0.82rem', marginTop: '1rem' }}>{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%',
                  background: '#FFBE00',
                  color: '#111',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '1rem',
                  fontSize: '0.9rem',
                  fontWeight: 900,
                  letterSpacing: '0.12em',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  marginTop: '1.75rem',
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? 'ENVIANDO...' : 'ENVIAR REFERIDO'}
              </button>

              <p style={{
                fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)',
                textAlign: 'center', marginTop: '1rem', lineHeight: 1.5,
              }}>
                El descuento del 20% se acredita al momento de la inscripción de tu amigo/a.
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Referido;
