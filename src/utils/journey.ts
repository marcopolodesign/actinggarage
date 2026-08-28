// Señales de recorrido, separadas de utm.ts porque responden preguntas
// distintas: utm.ts sabe QUÉ CAMPAÑA trajo al visitante (si vino de una);
// esto sabe DE QUÉ CANAL vino y QUÉ RECORRIÓ, incluso sin ninguna campaña
// detrás — el caso de alguien que entra desde el perfil de Instagram sin
// clickear un anuncio.

const REFERRER_KEY = 'referrer_source';
const REFERRER_TS_KEY = 'referrer_source_ts';
const REFERRER_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 días, mismo TTL que utm.ts

const SESSION_PATH_KEY = 'session_path';
const SESSION_PATH_CAP = 20;

function classifyReferrer(referrer: string): string {
  if (!referrer) return 'direct';
  let hostname: string;
  try {
    hostname = new URL(referrer).hostname;
  } catch {
    return 'direct';
  }
  if (hostname.includes('instagram.com')) return 'instagram_organic';
  if (hostname.includes('facebook.com')) return 'facebook_organic';
  if (hostname.includes('google.')) return 'google_organic';
  return `other:${hostname}`;
}

// Captura first-touch: sólo escribe si no hay uno guardado o si expiró (30
// días), igual que utm.ts. Se guarda AUNQUE la URL traiga UTMs — son señales
// distintas y las dos importan (la campaña, y el canal real detrás).
// Llamar una sola vez por carga de la app (no por cambio de ruta interno).
export function captureReferrerSource(): void {
  if (typeof window === 'undefined') return;
  const ts = localStorage.getItem(REFERRER_TS_KEY);
  const expired = !!ts && Date.now() - parseInt(ts) > REFERRER_TTL_MS;
  const existing = localStorage.getItem(REFERRER_KEY);
  if (existing && !expired) return;

  const source = classifyReferrer(document.referrer || '');
  localStorage.setItem(REFERRER_KEY, source);
  localStorage.setItem(REFERRER_TS_KEY, Date.now().toString());
}

export function getReferrerSource(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(REFERRER_KEY) ?? '';
}

// Recorrido de ESTA visita (sessionStorage, no localStorage — se reinicia al
// cerrar la pestaña). Llamar en cada cambio de ruta. No duplica visitas
// consecutivas al mismo path (ej. re-render con el mismo pathname) y capa en
// 20 entradas para no acumular sin límite en sesiones largas.
export function pushSessionPath(pathname: string): void {
  if (typeof window === 'undefined' || !pathname) return;
  let path: string[] = [];
  try {
    path = JSON.parse(sessionStorage.getItem(SESSION_PATH_KEY) || '[]');
  } catch {
    path = [];
  }
  if (path[path.length - 1] === pathname) return;
  path.push(pathname);
  if (path.length > SESSION_PATH_CAP) path = path.slice(path.length - SESSION_PATH_CAP);
  sessionStorage.setItem(SESSION_PATH_KEY, JSON.stringify(path));
}

// Recorrido como string legible para que se lea directo en una tabla del
// admin sin parsear JSON: "/cursos/garage-cinema → /cursos".
export function getSessionPath(): string {
  if (typeof window === 'undefined') return '';
  try {
    const path: string[] = JSON.parse(sessionStorage.getItem(SESSION_PATH_KEY) || '[]');
    return path.join(' → ');
  } catch {
    return '';
  }
}
