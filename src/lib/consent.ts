import { useEffect, useState } from 'react';

/**
 * Consentimiento de cookies — una sola fuente de verdad para todo el sitio.
 *
 * Cómo encaja con Google (Consent Mode v2): index.html declara TODO en «denied»
 * antes de que carguen gtag y GTM, y si ya hay una elección guardada la aplica
 * ahí mismo, antes del primer hit. Este módulo sólo manda el «update» cuando la
 * persona elige después.
 *
 * Meta no tiene Consent Mode: su script (fbevents.js) directamente NO se carga
 * hasta que se acepta la publicidad. Ver components/MetaPixel.tsx.
 *
 * ⚠️ La clave y la forma del objeto están duplicadas a propósito en el script
 * inline de index.html (corre antes que React). Si se cambia una, cambiar la otra.
 */

export interface Consent {
  analytics: boolean;
  ads: boolean;
  ts: string;
  v: 1;
}

export const CONSENT_KEY = 'tag-consent';
const EVENT_CHANGE = 'tag-consent-change';
const EVENT_OPEN = 'tag-consent-open';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw);
    return c && c.v === 1 ? (c as Consent) : null;
  } catch {
    return null;
  }
}

function applyToGoogle(c: Consent) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  const ads = c.ads ? 'granted' : 'denied';
  window.gtag('consent', 'update', {
    analytics_storage: c.analytics ? 'granted' : 'denied',
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  });
}

export function saveConsent(analytics: boolean, ads: boolean): Consent {
  const c: Consent = { analytics, ads, ts: new Date().toISOString(), v: 1 };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
  } catch {
    /* modo privado sin storage: la elección vale para esta visita */
  }
  applyToGoogle(c);
  window.dispatchEvent(new CustomEvent<Consent>(EVENT_CHANGE, { detail: c }));
  return c;
}

/** Reabre el aviso en modo configuración (enlace «Configurar cookies» del pie). */
export function openConsentSettings() {
  window.dispatchEvent(new Event(EVENT_OPEN));
}

export function onConsentOpen(cb: () => void) {
  window.addEventListener(EVENT_OPEN, cb);
  return () => window.removeEventListener(EVENT_OPEN, cb);
}

/** Estado reactivo del consentimiento. `null` = todavía no eligió. */
export function useConsent(): Consent | null {
  const [consent, setConsent] = useState<Consent | null>(() =>
    typeof window === 'undefined' ? null : readConsent(),
  );
  useEffect(() => {
    const onChange = (e: Event) => setConsent((e as CustomEvent<Consent>).detail);
    window.addEventListener(EVENT_CHANGE, onChange);
    return () => window.removeEventListener(EVENT_CHANGE, onChange);
  }, []);
  return consent;
}
