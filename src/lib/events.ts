/**
 * Calendario de la escuela — lectura pública.
 *
 * Los eventos se cargan desde TAG-admin o desde el conector MCP de Claude, y se
 * leen desde acá con la anon key. La RLS de `events` sólo deja ver las filas
 * publicadas, así que no hace falta filtrar por estado en el cliente: lo que
 * llega es lo que se puede mostrar. Igual se pide explícitamente para que el
 * comportamiento sea evidente al leer el código.
 *
 * Todo se guarda en UTC y se muestra en hora de Barcelona. Cualquier corte por
 * día o por mes tiene que pasar por los helpers de acá: un `getMonth()` a secas
 * sobre la fecha del navegador manda una muestra de las 00:30 al mes anterior
 * para quien esté mirando desde otro huso.
 */
import { supabase, isSupabaseConfigured } from './supabase';

export const TZ = 'Europe/Madrid';
const LOCALE = 'es-ES';

export type EventType =
  | 'muestra' | 'funcion' | 'workshop' | 'masterclass'
  | 'casting' | 'inicio' | 'charla' | 'otro';

export type EventStatus = 'borrador' | 'publicado' | 'cancelado';

export interface TagEvent {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  type: EventType;
  starts_at: string;
  ends_at: string | null;
  all_day: boolean;
  location_name: string | null;
  address: string | null;
  is_online: boolean;
  online_url: string | null;
  image_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  capacity: number | null;
  price: number | null;
  status: EventStatus;
  featured: boolean;
}

/**
 * Etiqueta y peso visual por tipo. El sistema de TAG tiene un solo acento —el
 * amarillo—, así que los tipos no se distinguen por color sino por la etiqueta.
 * `open` marca los eventos a los que puede venir cualquiera: ésos van en
 * amarillo, el resto en blanco.
 */
export const EVENT_TYPES: Record<EventType, { label: string; open: boolean }> = {
  muestra:    { label: 'Muestra',        open: true  },
  funcion:    { label: 'Función',        open: true  },
  charla:     { label: 'Charla',         open: true  },
  workshop:   { label: 'Workshop',       open: false },
  masterclass:{ label: 'Masterclass',    open: false },
  casting:    { label: 'Casting',        open: false },
  inicio:     { label: 'Inicio de curso',open: false },
  otro:       { label: 'Evento',         open: false },
};

export const typeLabel = (t: EventType) => EVENT_TYPES[t]?.label ?? 'Evento';
export const isOpenType = (t: EventType) => EVENT_TYPES[t]?.open ?? false;

// --- Fechas -----------------------------------------------------------------

const ymdFmt = new Intl.DateTimeFormat('en-CA', {
  timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
});

/** "2026-10-12" en hora de Barcelona, sirva de clave o de comparación. */
export function ymd(iso: string): string {
  return ymdFmt.format(new Date(iso));
}

/** Clave de mes "2026-10", para agrupar el timeline. */
export const monthKey = (iso: string) => ymd(iso).slice(0, 7);

const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(LOCALE, { timeZone: TZ, ...opts });

const dayNumFmt   = fmt({ day: 'numeric' });
const weekdayFmt  = fmt({ weekday: 'short' });
const timeFmt     = fmt({ hour: '2-digit', minute: '2-digit' });
const longDateFmt = fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const monthYearFmt= fmt({ month: 'long', year: 'numeric' });

export const dayNumber   = (iso: string) => dayNumFmt.format(new Date(iso));
export const weekdayName = (iso: string) => weekdayFmt.format(new Date(iso)).replace('.', '');
export const timeOf      = (iso: string) => timeFmt.format(new Date(iso));
export const longDate    = (iso: string) => longDateFmt.format(new Date(iso));

/** "octubre 2026" → "OCTUBRE 2026" lo hace el CSS; acá se devuelve legible. */
export function monthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number);
  return monthYearFmt.format(new Date(Date.UTC(y, m - 1, 15, 12)));
}

/** Rango horario listo para mostrar: "20:00", "20:00 – 22:00" o "Todo el día". */
export function timeRange(e: TagEvent): string {
  if (e.all_day) return 'Todo el día';
  const inicio = timeOf(e.starts_at);
  if (!e.ends_at) return inicio;
  return ymd(e.ends_at) === ymd(e.starts_at)
    ? `${inicio} – ${timeOf(e.ends_at)}`
    : `${inicio} → ${longDate(e.ends_at)}`;
}

/** Dónde ocurre, en una línea. */
export function placeOf(e: TagEvent): string | null {
  if (e.is_online) return 'Online';
  return [e.location_name, e.address].filter(Boolean).join(' · ') || null;
}

export function priceLabel(e: TagEvent): string | null {
  if (e.price == null) return null;
  if (Number(e.price) === 0) return 'Entrada gratuita';
  return `${Number(e.price).toLocaleString(LOCALE)} €`;
}

/** Agrupa por mes conservando el orden de entrada (ya viene ordenado por fecha). */
export function groupByMonth(events: TagEvent[]): { key: string; label: string; events: TagEvent[] }[] {
  const grupos: { key: string; label: string; events: TagEvent[] }[] = [];
  for (const e of events) {
    const key = monthKey(e.starts_at);
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.key === key) ultimo.events.push(e);
    else grupos.push({ key, label: monthLabel(key), events: [e] });
  }
  return grupos;
}

// --- Consultas --------------------------------------------------------------

const CAMPOS =
  'id, slug, title, description, type, starts_at, ends_at, all_day, location_name, address, ' +
  'is_online, online_url, image_url, cta_label, cta_url, capacity, price, status, featured';

/**
 * Eventos de hoy en adelante. Se corta en el inicio del día de hoy (no en
 * `now()`) para que una muestra de esta misma tarde no desaparezca del
 * calendario a mitad de función.
 */
export async function fetchUpcomingEvents(limit = 60): Promise<TagEvent[]> {
  if (!isSupabaseConfigured()) return [];
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('events')
    .select(CAMPOS)
    .eq('status', 'publicado')
    .gte('starts_at', hoy.toISOString())
    .order('starts_at', { ascending: true })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as TagEvent[];
}

export async function fetchEventBySlug(slug: string): Promise<TagEvent | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase
    .from('events').select(CAMPOS).eq('slug', slug).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as TagEvent) ?? null;
}

// --- Calendario -------------------------------------------------------------

/**
 * Las 6 semanas de un mes, empezando en lunes. Devuelve `null` en los huecos de
 * los bordes en lugar de días del mes vecino: en un calendario chico, mostrar
 * "30 de septiembre" dentro de octubre confunde más de lo que ayuda.
 */
export function monthGrid(year: number, month: number): (number | null)[][] {
  const primero = new Date(Date.UTC(year, month, 1));
  const arranque = (primero.getUTCDay() + 6) % 7; // 0 = lunes
  const dias = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const celdas: (number | null)[] = [
    ...Array(arranque).fill(null),
    ...Array.from({ length: dias }, (_, i) => i + 1),
  ];
  while (celdas.length % 7 !== 0) celdas.push(null);

  const semanas: (number | null)[][] = [];
  for (let i = 0; i < celdas.length; i += 7) semanas.push(celdas.slice(i, i + 7));
  return semanas;
}

export const DIAS_SEMANA = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
