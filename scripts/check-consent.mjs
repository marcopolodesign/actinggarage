/**
 * Control del aviso de cookies contra un sitio desplegado.
 *
 *   node scripts/check-consent.mjs https://www.theactinggarage.com/nueva
 *
 * Falla (exit 1) si vuelve cualquiera de los problemas de la lista de Andrés del
 * 24/09/2026:
 *   1. el pixel de Meta se carga antes de que la persona elija;
 *   2. Google no arranca con el consentimiento en «denied»;
 *   3. no aparece el aviso, o no trae Rechazar / Configurar / Aceptar;
 *   4. «Rechazar» saca a la persona de la web (el viejo «Declinar» → google.com);
 *   5. después de rechazar, el pixel de Meta se carga igual;
 *   6. el botón de WhatsApp se ve mientras el aviso está abierto.
 *
 * Se corre después de cada deploy que toque index.html, CookieConsent.tsx,
 * MetaPixel.tsx o lib/consent.ts.
 */
import { chromium } from 'playwright-core';

const url = process.argv[2] ?? 'https://www.theactinggarage.com/nueva';
const fails = [];
const check = (ok, msg) => { if (!ok) fails.push(msg); console.log(`${ok ? '✓' : '✗'} ${msg}`); };

const browser = await chromium.launch();
const page = await (await browser.newContext()).newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

const antes = await page.evaluate(() => ({
  fbq: typeof window.fbq,
  fbScript: !!document.querySelector('script[src*="fbevents"]'),
  defaultDenied: (window.dataLayer || []).some(
    (e) => e && e[0] === 'consent' && e[1] === 'default' && e[2]?.ad_storage === 'denied' && e[2]?.analytics_storage === 'denied',
  ),
  botones: [...document.querySelectorAll('[aria-label="Aviso de cookies"] button')].map((b) => b.innerText.trim().toLowerCase()),
  waOculto: document.querySelector('a[aria-label="Contact via WhatsApp"]')?.className.includes('opacity-0') ?? true,
}));

check(antes.fbq === 'undefined' && !antes.fbScript, 'el pixel de Meta no se carga antes de elegir');
check(antes.defaultDenied, 'Google arranca con Consent Mode en «denied»');
check(['rechazar', 'configurar', 'aceptar'].every((b) => antes.botones.includes(b)), 'el aviso trae Rechazar / Configurar / Aceptar');
check(antes.waOculto, 'el botón de WhatsApp espera a que se resuelva el aviso');

const host = new URL(page.url()).host;
const rechazar = page.getByRole('button', { name: /rechazar/i });
if (!(await rechazar.count())) {
  check(false, 'hay un botón «Rechazar» para probar');
  await browser.close();
  console.error(`\n${fails.length} control(es) fallaron`);
  process.exit(1);
}
await rechazar.first().click();
await page.waitForTimeout(1500);
const despues = await page.evaluate(() => ({
  fbq: typeof window.fbq,
  aviso: !!document.querySelector('[aria-label="Aviso de cookies"]'),
  guardado: localStorage.getItem('tag-consent'),
}));
check(new URL(page.url()).host === host, '«Rechazar» deja a la persona en la web');
check(!despues.aviso && /"ads":false/.test(despues.guardado ?? ''), '«Rechazar» cierra el aviso y guarda la elección');
check(despues.fbq === 'undefined', 'después de rechazar, el pixel de Meta sigue sin cargarse');

await browser.close();
if (fails.length) {
  console.error(`\n${fails.length} control(es) fallaron`);
  process.exit(1);
}
console.log('\nConsentimiento OK');
