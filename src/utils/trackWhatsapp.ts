import { getUtms } from './utm';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export function trackWhatsappClick(page: string): void {
  const utms = getUtms();

  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'whatsapp_click', {
      page,
      utm_source:   utms.utm_source   || 'organic',
      utm_campaign: utms.utm_campaign || undefined,
    });
  }

  try {
    navigator.sendBeacon(
      '/api/whatsapp-click',
      new Blob([JSON.stringify({ page, ...utms })], { type: 'application/json' })
    );
  } catch {
    // non-critical
  }
}
