/**
 * Prerender del <head> de las rutas públicas.
 *
 * Por qué existe: el sitio es una SPA sin SSR y `vercel.json` reescribe todo a
 * `/index.html`, así que sin esto el HTML servido de CUALQUIER URL es idéntico —
 * mismo title, misma description, sin canonical propio. Los tags por página los
 * pone react-helmet-async recién al hidratar, o sea que un crawler que no ejecuta
 * JS (o que no espera a que termine) no los ve nunca.
 *
 * Qué hace: levanta el `dist/` ya buildeado, lo visita con Chromium headless ruta
 * por ruta, y guarda en `dist/<ruta>/index.html` el shell original de Vite con el
 * <head> ya resuelto para esa ruta.
 *
 * Por qué funciona con el rewrite puesto: en Vercel el chequeo de filesystem corre
 * ANTES que los `rewrites`. Si existe `dist/jovenes/index.html`, `/jovenes` sirve
 * ese archivo y el rewrite ni se evalúa. Las rutas que no prerenderizamos (landings
 * de captación pago, /referido, /dashboard) siguen cayendo en el rewrite como antes.
 *
 * ⚠️ POR QUÉ NO SE COPIA EL DOM COMPLETO. La primera versión guardaba
 * `document.documentElement.outerHTML` tal cual, y eso horneaba en el HTML los
 * <script> que Meta Pixel, GTM y gtag se inyectan solos en runtime — incluido un
 * `connect.facebook.net/signals/config/...?domain=localhost` con su hash `hme`.
 * Servir eso en producción duplicaría los tags de tracking (doble pageview, doble
 * evento de pixel) y mandaría el pixel con el dominio equivocado, justo lo que
 * sostiene la atribución de las campañas. Por eso se reconstruye a partir del shell
 * limpio de Vite y sólo se le agregan los tags que Helmet marca con `data-rh`.
 *
 * Es prerender de <head>, no de contenido: resuelve el problema medido (title,
 * description y canonical por URL en el HTML servido). El <body> lo sigue pintando
 * React, que es lo que Google ya renderiza sin problema.
 *
 * La lista de abajo es la misma que el sitemap: sólo rutas indexables. /privacidad
 * y /terminos quedan fuera a propósito — están marcadas noindex, así que no tiene
 * sentido ni prerenderizarlas ni listarlas en el sitemap.
 */
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

/**
 * En local se usa el Chromium que ya tiene Playwright en su caché. En Vercel eso
 * no sirve: el binario se instala pero la imagen de build no trae las librerías
 * del sistema que necesita (`libnspr4.so` y compañía), y `playwright install
 * --with-deps` haría falta root. @sparticuz/chromium trae un Chromium empaquetado
 * con sus dependencias adentro, que es justo el caso de uso.
 */
async function launch() {
  if (!process.env.VERCEL) return chromium.launch();
  const { default: sparticuz } = await import('@sparticuz/chromium');
  return chromium.launch({
    executablePath: await sparticuz.executablePath(),
    args: sparticuz.args,
    headless: true,
  });
}

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const PORT = 4183;

const ROUTES = [
  '/',
  '/cursos',
  '/calendario',
  '/iniciacion',
  '/pro',
  '/jovenes',
  '/cursos/garage-pro',
  '/cursos/garage-theatre',
  '/cursos/garage-cinema',
  '/cursos/garage-hybrid',
  '/cursos/garage-hybrid-plus',
  '/cursos/garage-videobook',
  '/cursos/garage-writing',
  '/cursos/garage-classic',
  '/cursos/garage-mini-kids',
  '/cursos/garage-kids',
  '/cursos/garage-new-generation',
];

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.mp4': 'video/mp4', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.ttf': 'font/ttf', '.otf': 'font/otf', '.ico': 'image/x-icon', '.xml': 'application/xml',
};

// El shell limpio que dejó Vite. Se lee ANTES de empezar porque la ruta `/` lo
// sobrescribe, y todas las demás rutas se construyen a partir de él.
const SHELL = await readFile(join(DIST, 'index.html'), 'utf-8');

// Sirve dist/ y cae a index.html, igual que hace el rewrite de Vercel.
function serve() {
  return new Promise((resolve) => {
    const server = createServer(async (req, res) => {
      const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      let file = join(DIST, urlPath);
      if (!extname(file) || !existsSync(file)) file = join(DIST, 'index.html');
      try {
        const body = await readFile(file);
        res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
        res.end(body);
      } catch {
        res.writeHead(404).end('not found');
      }
    });
    server.listen(PORT, () => resolve(server));
  });
}

const server = await serve();
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

// Cortar todo lo externo. El prerender sólo necesita que la app monte y que Helmet
// resuelva el head: GTM, gtag, el pixel y las fuentes no aportan nada y encima
// mantienen conexiones abiertas que hacían que `networkidle` no llegara nunca —
// en Vercel el build se quedaba colgado hasta el timeout en cada ruta.
await page.route('**/*', (route) => {
  const url = route.request().url();
  return url.startsWith(`http://localhost:${PORT}`) ? route.continue() : route.abort();
});

const problems = [];
let ok = 0;

for (const route of ROUTES) {
  await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });

  // Esperar a que Helmet haya puesto el canonical de ESTA ruta. Sin esto se
  // capturan snapshots pre-hidratación, que es exactamente el bug que veníamos
  // a arreglar.
  const hydrated = await page
    .waitForFunction(
      (r) => {
        const c = document.querySelector('link[rel=canonical][data-rh]');
        return !!c && new URL(c.href).pathname === r;
      },
      route,
      { timeout: 15000 },
    )
    .then(() => true)
    .catch(() => false);

  if (!hydrated) {
    problems.push(`${route}: Helmet nunca puso un canonical para esta ruta`);
    continue;
  }

  const { title, tags } = await page.evaluate(() => ({
    title: document.title,
    // Sólo lo que puso Helmet. Nada de lo que inyectaron el pixel, GTM o gtag.
    tags: [...document.querySelectorAll('head [data-rh]')]
      .filter((el) => el.tagName !== 'TITLE')
      .map((el) => el.outerHTML),
  }));

  const injected = tags.map((t) => '    ' + t).join('\n');
  const html = SHELL
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace('</head>', `\n    <!-- prerender: tags de esta ruta, generados por scripts/prerender.mjs -->\n${injected}\n  </head>`);

  // Red de seguridad: si algo del shell vuelve a traer un canonical propio, esto
  // lo caza antes de desplegar en vez de que aparezca meses después en Search Console.
  const nCanon = (html.match(/rel="canonical"/g) ?? []).length;
  if (nCanon !== 1) problems.push(`${route}: ${nCanon} canonicals en el HTML final (debe ser 1)`);
  if (/connect\.facebook\.net|googletagmanager\.com\/gtm\.js/.test(injected)) {
    problems.push(`${route}: se coló un script de tracking inyectado en runtime`);
  }

  const out = route === '/' ? join(DIST, 'index.html') : join(DIST, route, 'index.html');
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html);
  ok++;
  console.log(`  ✓ ${route.padEnd(30)} ${tags.length} tags → ${out.replace(DIST, 'dist')}`);
}

await browser.close();
server.close();

console.log(`\nPrerender: ${ok}/${ROUTES.length} rutas`);
if (problems.length) {
  console.error('\nProblemas:');
  problems.forEach((p) => console.error('  ✗ ' + p));
  process.exit(1);
}
