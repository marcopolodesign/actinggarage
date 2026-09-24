import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { onConsentOpen, readConsent, saveConsent, useConsent } from '../lib/consent';

/**
 * Aviso de cookies con Aceptar / Rechazar / Configurar.
 *
 * Reemplaza al viejo EulaDisclaimer, que daba el consentimiento por aceptado «al
 * continuar navegando» y cuyo «Declinar» sacaba a la persona a google.com.
 *
 * Criterios (AEPD): rechazar cuesta lo mismo que aceptar —mismo tamaño, mismo
 * nivel—, nada viene premarcado, y se puede cambiar después desde el pie
 * («Configurar cookies»).
 *
 * En móvil es una franja baja y compacta: el aviso anterior ocupaba media pantalla
 * y el botón de WhatsApp le tapaba el «Aceptar». Mientras no hay elección, el
 * botón de WhatsApp y el popup de captura esperan (ver WhatsAppButton y LeadPopup).
 */

const btn =
  'flex-1 md:flex-none px-4 py-3 text-[13px] md:text-sm font-bold uppercase tracking-[0.06em] border-2 border-tag-yellow transition-colors duration-200';

const Interruptor: React.FC<{
  id: string;
  titulo: string;
  detalle: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}> = ({ id, titulo, detalle, checked, disabled, onChange }) => (
  <label htmlFor={id} className={`flex items-start gap-4 py-3 border-t border-white/10 ${disabled ? 'opacity-70' : 'cursor-pointer'}`}>
    <input
      id={id}
      type="checkbox"
      className="mt-1 h-5 w-5 accent-[#FFBE00] shrink-0"
      checked={checked}
      disabled={disabled}
      onChange={e => onChange?.(e.target.checked)}
    />
    <span>
      <span className="block text-white text-sm font-bold">{titulo}</span>
      <span className="block text-white/60 text-[13px] leading-snug mt-0.5">{detalle}</span>
    </span>
  </label>
);

const CookieConsent: React.FC = () => {
  const consent = useConsent();
  const [open, setOpen] = useState<boolean>(() => typeof window !== 'undefined' && readConsent() === null);
  const [config, setConfig] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);

  // «Configurar cookies» desde el pie: reabre con la elección actual cargada.
  useEffect(
    () =>
      onConsentOpen(() => {
        const c = readConsent();
        setAnalytics(Boolean(c?.analytics));
        setAds(Boolean(c?.ads));
        setConfig(true);
        setOpen(true);
      }),
    [],
  );

  useEffect(() => {
    if (consent) setOpen(false);
  }, [consent]);

  if (!open) return null;

  const decidir = (a: boolean, p: boolean) => {
    saveConsent(a, p);
    setConfig(false);
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-[60] bg-black border-t-2 border-tag-yellow text-white font-mdio"
    >
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 md:py-5">
        <p className="text-[13px] md:text-sm leading-snug text-white/85">
          Usamos cookies propias y de terceros para medir el uso de la web y mostrarte
          publicidad de nuestros cursos. Puedes aceptarlas, rechazarlas o elegir cuáles.{' '}
          <Link to="/cookies" className="underline text-tag-yellow whitespace-nowrap">
            Política de cookies
          </Link>
        </p>

        {config && (
          <div className="mt-3">
            <Interruptor
              id="ck-necesarias"
              titulo="Necesarias"
              detalle="Hacen funcionar la web y los formularios. Siempre activas."
              checked
              disabled
            />
            <Interruptor
              id="ck-analitica"
              titulo="Analítica"
              detalle="Google Analytics: cuántas personas visitan cada página, de forma agregada."
              checked={analytics}
              onChange={setAnalytics}
            />
            <Interruptor
              id="ck-publicidad"
              titulo="Publicidad"
              detalle="Google Ads y Meta (Facebook e Instagram): medir nuestros anuncios y mostrarte los cursos."
              checked={ads}
              onChange={setAds}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 md:gap-3 mt-3 md:justify-end">
          <button className={`${btn} bg-black text-tag-yellow hover:bg-tag-yellow hover:text-black`} onClick={() => decidir(false, false)}>
            Rechazar
          </button>
          {config ? (
            <button className={`${btn} bg-black text-tag-yellow hover:bg-tag-yellow hover:text-black`} onClick={() => decidir(analytics, ads)}>
              Guardar selección
            </button>
          ) : (
            <button className={`${btn} bg-black text-tag-yellow hover:bg-tag-yellow hover:text-black`} onClick={() => setConfig(true)}>
              Configurar
            </button>
          )}
          <button className={`${btn} bg-tag-yellow text-black hover:bg-white hover:border-white`} onClick={() => decidir(true, true)}>
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
