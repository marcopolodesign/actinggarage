import React, { useEffect, useState } from 'react';
import { submitForm } from '../api/submitForm';
import { getUtms, getLandingPage } from '../utils/utm';
import { getReferrerSource, getSessionPath } from '../utils/journey';
import { CasillaPrivacidad } from './FormLegal';

/**
 * «Recibe el calendario» — el peldaño más bajo de la escalera de la home nueva.
 *
 * Pide SÓLO el email (decidido con la escuela el 25/09): el resto de los
 * formularios exigen teléfono, y un peldaño que pide lo mismo que «Pedir plaza»
 * no es un peldaño. La persona entra al CRM con source «home_calendario» y le llega
 * por Resend un mail con el enlace al PDF (api/enviar-calendario.js).
 *
 * 🔴 NO dispara el evento Lead de Meta ni la conversión de Google Ads: C05 y la C02
 * nueva optimizan sobre Lead, y contar como prospecto a quien sólo pidió un PDF les
 * enseñaría a buscar gente de baja intención. Va como evento propio.
 */

const RecibirCalendario: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [acepta, setAcepta] = useState(false);
  const [estado, setEstado] = useState<'form' | 'enviando' | 'ok' | 'error'>('form');

  useEffect(() => {
    if (open) {
      setEstado('form');
      setAcepta(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstado('enviando');
    try {
      const r = await submitForm({
        email,
        name: '',
        phone: '',
        birthday: '',
        interests: '',
        source: 'home_calendario',
        landing_page: getLandingPage(),
        ...getUtms(),
        referrer_source: getReferrerSource(),
        session_path: getSessionPath(),
      });
      if (!r.success) throw new Error(r.message);

      // El envío del mail no bloquea: si falla, el pedido ya quedó en el CRM y la
      // escuela lo ve. Se avisa igual, para que no espere un correo que no llega.
      const m = await fetch('/api/enviar-calendario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).catch(() => null);

      if (typeof window.fbq === 'function') {
        try { window.fbq('trackCustom', 'CalendarioSolicitado'); } catch { /* sin pixel */ }
      }
      setEstado(m && m.ok ? 'ok' : 'error');
    } catch (err) {
      console.error('Recibir calendario:', err);
      setEstado('error');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Recibir el calendario"
      className="fixed inset-0 z-[70] bg-black/80 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md bg-tag-yellow text-black p-7 md:p-9">
        <button onClick={onClose} aria-label="Cerrar" className="absolute top-3 right-4 text-2xl leading-none">
          ×
        </button>

        {estado === 'ok' ? (
          <div className="py-4">
            <p className="font-druk uppercase text-4xl leading-none">Enviado</p>
            <p className="font-garamond text-xl mt-4 leading-snug">
              Revisa tu correo: te acabamos de mandar el calendario. Si no lo ves en unos
              minutos, mira en la carpeta de spam.
            </p>
          </div>
        ) : estado === 'error' ? (
          <div className="py-4">
            <p className="font-druk uppercase text-3xl leading-none">Lo tenemos</p>
            <p className="font-garamond text-xl mt-4 leading-snug">
              Recibimos tu pedido, pero el correo no salió solo. Te lo mandamos nosotros hoy
              mismo a <strong>{email}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={enviar}>
            <p className="font-druk uppercase text-4xl md:text-5xl leading-[0.9] tracking-tight">
              Recibe el calendario
            </p>
            <p className="font-garamond text-lg mt-3 leading-snug">
              Fechas de inicio, horarios de cada formación y hasta cuándo quedan plazas. Sólo
              te pedimos el email.
            </p>
            <label htmlFor="cal-email" className="block text-[11px] uppercase tracking-[0.18em] font-bold mt-6 mb-1.5">
              Email
            </label>
            <input
              id="cal-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full bg-transparent border-2 border-black px-4 py-3 font-mdio focus:outline-none"
            />
            <CasillaPrivacidad id="cal-privacidad" checked={acepta} onChange={setAcepta} className="mt-4" />
            <button
              type="submit"
              disabled={!acepta || estado === 'enviando'}
              className="mt-5 w-full bg-black text-tag-yellow py-4 font-druk uppercase text-xl tracking-tight disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {estado === 'enviando' ? 'Enviando…' : 'Recibirlo'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RecibirCalendario;
