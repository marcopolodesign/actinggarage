import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useConsent } from '../lib/consent';

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

const PIXEL_ID = '834745809170874';

/**
 * Pixel de Meta — se carga SÓLO si la persona aceptó la publicidad.
 *
 * Antes se cargaba siempre al entrar. Meta no tiene Consent Mode como Google, así
 * que la única forma de no mandarle nada sin consentimiento es no cargar
 * fbevents.js. Mientras no hay consentimiento `window.fbq` no existe, y los
 * `fbq('track', …)` de los formularios (InlineLeadForm, trackWhatsapp) ya están
 * protegidos con `typeof window.fbq === 'function'`: no rompen, no mandan nada.
 *
 * Sin noscript: una persona sin JavaScript no puede dar el consentimiento.
 *
 * Efecto para las campañas: Meta sólo ve los prospectos de quien aceptó. La
 * atribución del CRM (UTMs en `prospects`) no depende del pixel y sigue igual.
 */
function loadPixel() {
  if (typeof window.fbq === 'function') return;
  (function (f: any, b: any, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = '2.0';
    n.queue = [];
    const t = b.createElement(e);
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  // `as any`: tras el guard de arriba TS da fbq por `never`, pero el snippet ya lo definió.
  (window as any).fbq('init', PIXEL_ID);
}

const MetaPixel: React.FC = () => {
  const location = useLocation();
  const consent = useConsent();
  const allowed = Boolean(consent?.ads);
  const lastPath = useRef<string | null>(null);

  // Si después de aceptar la retira desde «Configurar cookies», se corta en esta
  // misma visita (fbevents.js ya está cargado y no se puede descargar).
  useEffect(() => {
    if (typeof window.fbq !== 'function') return;
    window.fbq('consent', allowed ? 'grant' : 'revoke');
  }, [allowed]);

  // PageView al aceptar (la página en la que está) y en cada cambio de ruta después.
  useEffect(() => {
    if (!allowed) return;
    loadPixel();
    const path = location.pathname + location.search;
    if (lastPath.current === path) return;
    lastPath.current = path;
    window.fbq('track', 'PageView');
  }, [allowed, location.pathname, location.search]);

  return null;
};

export default MetaPixel;
