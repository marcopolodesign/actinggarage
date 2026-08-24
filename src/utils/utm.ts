const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_id'] as const;
type UtmKey = typeof UTM_KEYS[number];

const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function isExpired(): boolean {
  const ts = localStorage.getItem('utm_ts');
  return !!ts && Date.now() - parseInt(ts) > TTL_MS;
}

function clearStored(): void {
  UTM_KEYS.forEach(key => localStorage.removeItem(key));
  localStorage.removeItem('utm_ts');
}

// Call on every page load / navigation. Writes UTMs to localStorage so they
// survive browser closes (last-touch, 30-day window). Must run before any
// browser stripping (e.g. Firefox ETP) can modify the URL.
export function captureUtms(): void {
  const params = new URLSearchParams(window.location.search);
  const hasNew = UTM_KEYS.some(key => params.get(key));
  if (hasNew) {
    clearStored(); // clear stale keys from previous campaigns
    UTM_KEYS.forEach(key => {
      const value = params.get(key);
      if (value) localStorage.setItem(key, value);
    });
    localStorage.setItem('utm_ts', Date.now().toString());
  }
}

export function getUtm(key: UtmKey): string | null {
  if (isExpired()) {
    clearStored();
    return new URLSearchParams(window.location.search).get(key);
  }
  return localStorage.getItem(key) ?? new URLSearchParams(window.location.search).get(key);
}

export function getUtms() {
  return {
    utm_source: getUtm('utm_source') ?? '',
    utm_medium: getUtm('utm_medium') ?? 'organic',
    utm_campaign: getUtm('utm_campaign') ?? '',
    utm_id: getUtm('utm_id') ?? '',
  };
}

// True if any of the three main UTM params are present (URL or localStorage, within TTL).
export function hasUtms(): boolean {
  return (['utm_source', 'utm_medium', 'utm_campaign'] as UtmKey[]).some(key =>
    Boolean(getUtm(key))
  );
}

const WA_NUMBER = '34682560187';

export function isMetaSource(): boolean {
  const source = getUtm('utm_source');
  return source === 'instagram' || source === 'facebook' || source === 'meta';
}

// Texto de WhatsApp por campaña de Meta, para los botones GENÉRICOS del sitio
// (header, botón flotante, CTA global de una landing). La clave es el
// `utm_campaign` que trae la URL del anuncio.
//
// 🔴 Por qué existe este mapa: C01 manda a la gente del anuncio DIRECTO a
// WhatsApp con el texto "Hola TAG! Quisiera más info sobre los cursos!". Si la
// web manda ese mismo texto, los dos orígenes llegan idénticos al WhatsApp de
// Florencia y en el CRM no hay forma de separarlos. Cada campaña que apunte a
// la web necesita SU texto, distinto del de C01.
//
// Al añadir una campaña nueva: darla de alta acá Y en el selector "Seleccioná
// el mensaje recibido" de TAG-admin (`Prospects.jsx`), o Florencia recibe un
// texto que no puede clasificar. La tabla de equivalencias vive en
// `TAG/CAMPAIGNS.md` → "Texto pre-cargado en WhatsApp".
//
// Lo usa `buildCampaignWhatsAppUrl`, no `buildWhatsAppUrl`.
const META_CAMPAIGN_TEXTS: Record<string, string> = {
  // C02 — Adultos · Tráfico Web · Barcelona → /iniciacion
  'adultos-bcn-web': 'Hola TAG! Quisiera info sobre los cursos de iniciación',
  // C04 — Dramaturgia (Garage Writing), online. EN VIVO desde el 2026-08-20
  // (campaña 120254699942670285). El ad set de España está ACTIVE; el de LatAm
  // (AR/CO/MX) existe en PAUSED. Los dos comparten este mismo utm_campaign, así
  // que por WhatsApp NO se distinguen entre sí — sólo el formulario, vía
  // `utm_term` (espana_25_55 / latam_25_55), permite separar la geo en el CRM.
  'dramaturgia-online': 'Hola TAG! Quisiera info sobre el curso de escritura',
};

// Builds a wa.me URL. Meta paid uses metaText, other paid uses paidText, organic uses organicText.
export function buildWhatsAppUrl(organicText: string, paidText?: string, metaText?: string): string {
  if (isMetaSource() && metaText) return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(metaText)}`;
  const isPaid = hasUtms();
  const text = isPaid ? (paidText ?? organicText) : organicText;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

// Igual que buildWhatsAppUrl, pero para los botones GENÉRICOS (header, botón
// flotante, CTA global de una landing): si el visitante viene de Meta y su
// campaña tiene texto propio en META_CAMPAIGN_TEXTS, usa ése.
//
// Va aparte y NO se mete dentro de buildWhatsAppUrl a propósito: los botones
// que ya nombran un curso concreto ("...sobre el Garage Theatre I") tienen que
// conservar ese nombre — es información que Florencia usa. Si el mapa se
// aplicara a todos, los pisaría con el texto genérico de la campaña.
export function buildCampaignWhatsAppUrl(organicText: string, paidText?: string, metaText?: string): string {
  if (isMetaSource()) {
    const campaign = getUtm('utm_campaign');
    const campaignText = campaign ? META_CAMPAIGN_TEXTS[campaign] : undefined;
    if (campaignText) return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(campaignText)}`;
  }
  return buildWhatsAppUrl(organicText, paidText, metaText);
}

// Ruta de la página desde la que se envía el formulario, para poder cortar los
// reportes por landing. Sólo el pathname: la query ya viaja en los utm_* y el
// dominio es siempre el mismo.
export function getLandingPage(): string {
  if (typeof window === 'undefined') return '';
  return window.location.pathname || '/';
}
