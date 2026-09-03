/**
 * Servidor MCP del calendario de la escuela.
 *
 * Para qué: que Andrés y Tony carguen las fechas de TAG hablándole a Claude
 * ("el 12 de octubre a las 20 hay muestra de Pro en la sala 1") y que eso quede
 * publicado en www.theactinggarage.com/calendario sin pasar por nadie más.
 *
 * Cómo se conecta: en Claude → Configuración → Conectores → Agregar conector
 * personalizado, con la URL
 *
 *     https://www.theactinggarage.com/api/mcp/<token>
 *
 * El token es personal (uno por persona, tabla `mcp_tokens`) y va en la URL
 * porque el alta de conectores personalizados de Claude no pide credenciales
 * aparte. Acá se guarda sólo su SHA-256: la tabla no sirve para entrar. Se
 * revoca poniéndole `revoked_at` a la fila, sin tocar código ni redeployar.
 *
 * ⚠️ El archivo NO puede ser `api/mcp/[token].js`. Las rutas dinámicas se
 * resuelven en la misma fase que los `rewrites` de `vercel.json`, y el
 * catch-all a `/index.html` gana: el endpoint devolvía el HTML del sitio y un
 * 405 a cualquier POST. Por eso la función tiene nombre estático y el token
 * llega por un rewrite explícito, declarado ANTES del catch-all.
 *
 * Protocolo: MCP sobre Streamable HTTP, sin estado. Cada POST trae un mensaje
 * JSON-RPC 2.0 completo y se contesta con JSON plano — no se abre SSE ni se
 * emiten session ids, que la spec permite para servidores sin estado.
 *
 * Escribe con la service role key (salta RLS), así que el chequeo del token es
 * lo único que separa a un desconocido de la tabla `events`. Por eso el handler
 * valida el token ANTES de mirar el cuerpo del request, y las herramientas sólo
 * tocan `events` — nunca prospectos, alumnos ni pagos.
 */
import crypto from 'node:crypto';
import { getSupabaseAdmin } from './_utils/supabaseAdmin.js';

const PROTOCOL_VERSION = '2025-06-18';
const SERVER_INFO = { name: 'the-acting-garage', title: 'The Acting Garage', version: '1.0.0' };
const SITE = 'https://www.theactinggarage.com';

/**
 * La escuela está en Barcelona. NO se puede usar un offset fijo: España cambia
 * de hora dos veces al año (+02:00 en verano, +01:00 en invierno), así que
 * hornear "+02:00" publicaría con una hora de más todos los eventos de invierno
 * — y las muestras son justo en noviembre y diciembre.
 */
const TZ = 'Europe/Madrid';
const LOCALE = 'es-ES';

const TIPOS = ['muestra', 'funcion', 'workshop', 'masterclass', 'casting', 'inicio', 'charla', 'otro'];
const ESTADOS = ['borrador', 'publicado', 'cancelado'];

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

function slugify(text) {
  return String(text)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'evento';
}

/**
 * Cuántos milisegundos le lleva `tz` a UTC en ese instante concreto. Se calcula
 * formateando el instante en la zona y volviéndolo a leer como si fuera UTC: la
 * diferencia entre ambos es el offset vigente, con el cambio de hora incluido.
 */
function offsetDeZona(ts, tz) {
  const partes = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hour12: false,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).formatToParts(ts).map((p) => [p.type, p.value])
  );
  const comoUTC = Date.UTC(
    Number(partes.year), Number(partes.month) - 1, Number(partes.day),
    Number(partes.hour) % 24, Number(partes.minute), Number(partes.second)
  );
  return comoUTC - ts;
}

/**
 * "2026-10-12" + "20:00" (hora de Barcelona) → instante UTC en ISO.
 *
 * Se resuelve en dos pasos porque el offset depende del instante y el instante
 * depende del offset: se estima con la hora leída como UTC, y si el offset del
 * resultado no coincide (los dos domingos del año en que cambia la hora) se
 * recalcula una vez más.
 */
function toTimestamp(fecha, hora) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(fecha || ''))) {
    throw new Error(`La fecha "${fecha}" no tiene el formato AAAA-MM-DD (ejemplo: 2026-10-12).`);
  }
  const h = hora ? String(hora).trim() : '00:00';
  const m = h.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) throw new Error(`La hora "${hora}" no tiene el formato HH:MM en 24 horas (ejemplo: 20:30).`);
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (hh > 23 || mm > 59) throw new Error(`La hora "${hora}" no existe.`);

  const [y, mo, d] = fecha.split('-').map(Number);
  const naive = Date.UTC(y, mo - 1, d, hh, mm, 0);
  if (Number.isNaN(naive)) throw new Error(`La fecha "${fecha}" no existe en el calendario.`);
  // Fecha imposible tipo 2026-02-30: Date.UTC la corre al mes siguiente.
  const verif = new Date(naive);
  if (verif.getUTCMonth() !== mo - 1 || verif.getUTCDate() !== d) {
    throw new Error(`La fecha "${fecha}" no existe en el calendario.`);
  }

  let ts = naive - offsetDeZona(naive, TZ);
  const off = offsetDeZona(ts, TZ);
  if (naive - off !== ts) ts = naive - off;
  return new Date(ts).toISOString();
}

const FMT_FECHA = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
});
const FMT_HORA = new Intl.DateTimeFormat(LOCALE, { timeZone: TZ, hour: '2-digit', minute: '2-digit' });

/** Cómo ve Claude un evento cuando lo lista o lo acaba de guardar. */
function describir(e) {
  const partes = [
    `${e.title} — ${FMT_FECHA.format(new Date(e.starts_at))}${e.all_day ? ' (todo el día)' : ` a las ${FMT_HORA.format(new Date(e.starts_at))}`}`,
    `  tipo: ${e.type}${e.status !== 'publicado' ? ` · ESTADO: ${e.status.toUpperCase()}` : ''}${e.featured ? ' · destacado' : ''}`,
  ];
  if (e.ends_at && !e.all_day) partes.push(`  termina: ${FMT_HORA.format(new Date(e.ends_at))}`);
  if (e.is_online) partes.push(`  online${e.online_url ? `: ${e.online_url}` : ''}`);
  else if (e.location_name || e.address) partes.push(`  lugar: ${[e.location_name, e.address].filter(Boolean).join(' — ')}`);
  if (e.capacity) partes.push(`  plazas: ${e.capacity}`);
  if (e.price != null) {
    partes.push(`  precio: ${Number(e.price) === 0 ? 'entrada gratuita' : `${Number(e.price).toLocaleString('es-ES')} €`}`);
  }
  if (e.cta_url) partes.push(`  botón: "${e.cta_label || 'Más info'}" → ${e.cta_url}`);
  if (e.description) partes.push(`  descripción: ${e.description}`);
  partes.push(`  link público: ${SITE}/calendario/${e.slug}`);
  partes.push(`  id: ${e.id}`);
  return partes.join('\n');
}

/** Slug único: si "muestra-de-pro" ya existe, prueba "muestra-de-pro-2", etc. */
async function slugLibre(db, base, ignorarId) {
  for (let i = 1; i < 50; i++) {
    const intento = i === 1 ? base : `${base}-${i}`;
    let q = db.from('events').select('id').eq('slug', intento);
    if (ignorarId) q = q.neq('id', ignorarId);
    const { data, error } = await q.maybeSingle();
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    if (!data) return intento;
  }
  return `${base}-${Date.now()}`;
}

/** Busca un grupo por nombre para poder colgar el evento de un curso. */
async function resolverComision(db, nombre) {
  const { data, error } = await db
    .from('course_instances')
    .select('id, name, start_date')
    .ilike('name', `%${nombre}%`)
    .order('start_date', { ascending: false })
    .limit(5);
  if (error) throw new Error(error.message);
  if (!data?.length) throw new Error(`No he encontrado ningún grupo que se parezca a "${nombre}".`);
  if (data.length > 1) {
    throw new Error(
      `"${nombre}" coincide con varios grupos. Vuelve a pedirlo con el nombre exacto de uno de estos:\n` +
      data.map((c) => `  · ${c.name} (empieza el ${c.start_date})`).join('\n')
    );
  }
  return data[0].id;
}

/** Campos comunes a crear y editar. Devuelve sólo las claves presentes en args. */
async function camposDesdeArgs(db, args, { paraCrear }) {
  const row = {};
  const set = (k, v) => { if (v !== undefined) row[k] = v; };

  if (args.titulo !== undefined) row.title = String(args.titulo).trim();
  if (args.descripcion !== undefined) row.description = args.descripcion || null;

  if (args.tipo !== undefined) {
    const tipo = String(args.tipo).toLowerCase();
    if (!TIPOS.includes(tipo)) throw new Error(`Tipo "${args.tipo}" inválido. Los válidos son: ${TIPOS.join(', ')}.`);
    row.type = tipo;
  }

  if (args.estado !== undefined) {
    const estado = String(args.estado).toLowerCase();
    if (!ESTADOS.includes(estado)) throw new Error(`Estado "${args.estado}" inválido. Los válidos son: ${ESTADOS.join(', ')}.`);
    row.status = estado;
  }

  const todoElDia = args.todo_el_dia === true || (paraCrear && args.hora === undefined && args.todo_el_dia === undefined);
  if (args.fecha !== undefined || args.hora !== undefined || args.todo_el_dia !== undefined) {
    if (args.fecha === undefined) throw new Error('Para cambiar la hora hay que mandar también la fecha.');
    row.all_day = !!todoElDia;
    row.starts_at = toTimestamp(args.fecha, todoElDia ? '00:00' : args.hora);
    if (args.hora_fin) {
      row.ends_at = toTimestamp(args.fecha_fin || args.fecha, args.hora_fin);
      if (Date.parse(row.ends_at) < Date.parse(row.starts_at)) {
        throw new Error('La hora de fin cae antes que la de inicio.');
      }
    } else if (args.fecha_fin) {
      row.ends_at = toTimestamp(args.fecha_fin, '23:59');
    }
  }

  set('location_name', args.lugar);
  set('address', args.direccion);
  if (args.online !== undefined) row.is_online = !!args.online;
  set('online_url', args.link_online);
  set('image_url', args.imagen);
  set('cta_label', args.cta_texto);
  set('cta_url', args.cta_link);
  if (args.plazas !== undefined) row.capacity = args.plazas === null ? null : Number(args.plazas);
  if (args.precio !== undefined) row.price = args.precio === null ? null : Number(args.precio);
  if (args.destacado !== undefined) row.featured = !!args.destacado;

  if (args.curso !== undefined) {
    row.course_instance_id = args.curso ? await resolverComision(db, args.curso) : null;
  }

  return row;
}

// ---------------------------------------------------------------------------
// Herramientas
// ---------------------------------------------------------------------------

const CAMPOS_EVENTO = {
  titulo:      { type: 'string', description: 'Título del evento, como se va a ver en la web. Ej: "Muestra de Garage Pro".' },
  fecha:       { type: 'string', description: 'Fecha en formato AAAA-MM-DD. Ej: "2026-10-12".' },
  hora:        { type: 'string', description: 'Hora de inicio en formato HH:MM, 24 horas. Ej: "20:00". Si no se indica, el evento queda como de día completo.' },
  hora_fin:    { type: 'string', description: 'Hora de finalización en formato HH:MM. Opcional.' },
  fecha_fin:   { type: 'string', description: 'Fecha de finalización AAAA-MM-DD, sólo si el evento dura más de un día. Opcional.' },
  todo_el_dia: { type: 'boolean', description: 'true si el evento no tiene un horario concreto (ej: una convocatoria abierta).' },
  tipo:        { type: 'string', enum: TIPOS, description: 'Qué clase de evento es. Define el color y el ícono en la web.' },
  descripcion: { type: 'string', description: 'Texto que se lee debajo del título en la web. Dos o tres frases.' },
  lugar:       { type: 'string', description: 'Nombre del lugar. Ej: "Sala 1 — The Acting Garage".' },
  direccion:   { type: 'string', description: 'Dirección completa, si es en otro lado.' },
  online:      { type: 'boolean', description: 'true si el evento es por videollamada.' },
  link_online: { type: 'string', description: 'Enlace de Zoom/Meet, si es online.' },
  imagen:      { type: 'string', description: 'URL del flyer o foto del evento.' },
  cta_texto:   { type: 'string', description: 'Texto del botón. Ej: "Reservar entrada", "Apuntarme".' },
  cta_link:    { type: 'string', description: 'Adónde lleva el botón: enlace de entradas, formulario o WhatsApp.' },
  plazas:      { type: 'number', description: 'Número máximo de plazas (aforo).' },
  precio:      { type: 'number', description: 'Precio en euros. Dejar vacío si la entrada es gratuita.' },
  curso:       { type: 'string', description: 'Nombre del grupo con el que se relaciona el evento, si aplica. Ej: "Garage Pro 2026".' },
  destacado:   { type: 'boolean', description: 'true para que aparezca resaltado arriba de todo en la web.' },
  estado:      { type: 'string', enum: ESTADOS, description: 'publicado (se ve en la web), borrador (no se ve) o cancelado (se ve tachado). Por defecto: publicado.' },
};

const TOOLS = [
  {
    name: 'listar_eventos',
    title: 'Ver los eventos del calendario',
    description:
      'Devuelve los eventos de la escuela ordenados por fecha. Por defecto muestra los que vienen de hoy en adelante. ' +
      'Úsalo siempre antes de editar o cancelar algo, para tener el id correcto.',
    inputSchema: {
      type: 'object',
      properties: {
        desde:  { type: 'string', description: 'Mostrar desde esta fecha (AAAA-MM-DD). Por defecto, hoy.' },
        hasta:  { type: 'string', description: 'Mostrar hasta esta fecha (AAAA-MM-DD).' },
        incluir_borradores: { type: 'boolean', description: 'true para ver también los que no están publicados.' },
      },
    },
  },
  {
    name: 'crear_evento',
    title: 'Publicar un evento nuevo',
    description:
      'Crea un evento y lo publica en www.theactinggarage.com/calendario. Sólo hacen falta el título y la fecha; ' +
      'el resto ayuda a que la ficha se vea completa. Antes de crear algo que suene repetido, revisa con listar_eventos.',
    inputSchema: {
      type: 'object',
      properties: CAMPOS_EVENTO,
      required: ['titulo', 'fecha'],
    },
  },
  {
    name: 'editar_evento',
    title: 'Cambiar un evento',
    description:
      'Modifica un evento existente. Se cambian sólo los campos que indiques; el resto queda como estaba. ' +
      'El id sale de listar_eventos.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string', description: 'id del evento (lo devuelve listar_eventos).' }, ...CAMPOS_EVENTO },
      required: ['id'],
    },
  },
  {
    name: 'cancelar_evento',
    title: 'Cancelar un evento',
    description:
      'Marca el evento como cancelado. Sigue apareciendo en la web, tachado, que es lo que corresponde cuando ya se comunicó ' +
      'y hay gente anotada. Para que desaparezca del todo, usa borrar_evento.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'id del evento.' },
        motivo: { type: 'string', description: 'Se agrega al final de la descripción, para que la gente entienda por qué.' },
      },
      required: ['id'],
    },
  },
  {
    name: 'borrar_evento',
    title: 'Borrar un evento',
    description:
      'Elimina el evento definitivamente. Usar sólo si se cargó por error. Si el evento ya se ha comunicado, cancélalo en vez de borrarlo.',
    inputSchema: {
      type: 'object',
      properties: { id: { type: 'string', description: 'id del evento.' } },
      required: ['id'],
    },
  },
];

async function ejecutarTool(db, quien, name, args = {}) {
  switch (name) {
    case 'listar_eventos': {
      const desde = args.desde ? toTimestamp(args.desde, '00:00') : new Date().toISOString();
      let q = db.from('events').select('*').gte('starts_at', desde).order('starts_at', { ascending: true }).limit(100);
      if (args.hasta) q = q.lte('starts_at', toTimestamp(args.hasta, '23:59'));
      if (!args.incluir_borradores) q = q.neq('status', 'borrador');
      const { data, error } = await q;
      if (error) throw new Error(error.message);
      if (!data.length) return 'No hay eventos cargados en ese rango.';
      return `${data.length} evento(s):\n\n${data.map(describir).join('\n\n')}`;
    }

    case 'crear_evento': {
      const row = await camposDesdeArgs(db, args, { paraCrear: true });
      if (!row.title) throw new Error('Falta el título.');
      if (!row.starts_at) throw new Error('Falta la fecha.');
      row.slug = await slugLibre(db, slugify(`${row.title}-${String(args.fecha).slice(0, 7)}`));
      row.status = row.status || 'publicado';
      row.source = 'claude';
      row.created_by = quien;
      const { data, error } = await db.from('events').insert(row).select().single();
      if (error) throw new Error(error.message);
      return `Listo, evento creado${data.status === 'publicado' ? ' y publicado' : ` como ${data.status}`}:\n\n${describir(data)}`;
    }

    case 'editar_evento': {
      const row = await camposDesdeArgs(db, args, { paraCrear: false });
      if (!Object.keys(row).length) throw new Error('No has indicado ningún campo para cambiar.');
      if (row.title) row.slug = await slugLibre(db, slugify(row.title), args.id);
      const { data, error } = await db.from('events').update(row).eq('id', args.id).select().single();
      if (error) throw new Error(error.message);
      if (!data) throw new Error(`No existe ningún evento con id ${args.id}.`);
      return `Evento actualizado:\n\n${describir(data)}`;
    }

    case 'cancelar_evento': {
      const { data: actual, error: e1 } = await db.from('events').select('*').eq('id', args.id).maybeSingle();
      if (e1) throw new Error(e1.message);
      if (!actual) throw new Error(`No existe ningún evento con id ${args.id}.`);
      const descripcion = args.motivo
        ? `${actual.description ? `${actual.description}\n\n` : ''}Cancelado: ${args.motivo}`
        : actual.description;
      const { data, error } = await db
        .from('events').update({ status: 'cancelado', description: descripcion })
        .eq('id', args.id).select().single();
      if (error) throw new Error(error.message);
      return `Evento cancelado. Sigue visible en la web marcado como cancelado:\n\n${describir(data)}`;
    }

    case 'borrar_evento': {
      const { data, error } = await db.from('events').delete().eq('id', args.id).select().maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) throw new Error(`No existe ningún evento con id ${args.id}.`);
      return `Borrado "${data.title}". Ya no aparece en el calendario.`;
    }

    default:
      throw new Error(`No existe la herramienta "${name}".`);
  }
}

// ---------------------------------------------------------------------------
// Transporte JSON-RPC
// ---------------------------------------------------------------------------

const ok = (id, result) => ({ jsonrpc: '2.0', id, result });
const fail = (id, code, message) => ({ jsonrpc: '2.0', id, error: { code, message } });

async function manejarMensaje(msg, ctx) {
  const { id, method, params } = msg || {};

  switch (method) {
    case 'initialize':
      return ok(id, {
        protocolVersion: params?.protocolVersion || PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions:
          'Calendario de The Acting Garage. Sirve para publicar y corregir las fechas de la escuela ' +
          '(muestras, workshops, castings, inicios de curso) en www.theactinggarage.com/calendario. ' +
          'Las fechas se interpretan en hora de Barcelona. Antes de editar o cancelar algo, lista los eventos ' +
          'para tener el id. Confirma siempre con la persona antes de borrar.',
      });

    case 'ping':
      return ok(id, {});

    case 'tools/list':
      return ok(id, { tools: TOOLS });

    case 'resources/list':
      return ok(id, { resources: [] });

    case 'prompts/list':
      return ok(id, { prompts: [] });

    case 'tools/call': {
      const nombre = params?.name;
      try {
        const texto = await ejecutarTool(ctx.db, ctx.quien, nombre, params?.arguments || {});
        return ok(id, { content: [{ type: 'text', text: texto }] });
      } catch (err) {
        // Error de la herramienta, no del protocolo: va como isError para que
        // Claude pueda leerlo, explicarlo y reintentar con los datos corregidos.
        console.error(`[mcp] ${nombre} falló:`, err);
        return ok(id, { content: [{ type: 'text', text: `No pude hacerlo: ${err.message}` }], isError: true });
      }
    }

    default:
      return fail(id, -32601, `Método no soportado: ${method}`);
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Mcp-Session-Id, MCP-Protocol-Version, Last-Event-ID');

  if (req.method === 'OPTIONS') return res.status(200).end();
  // Sin estado: no hay sesión que cerrar ni stream que abrir.
  if (req.method === 'DELETE') return res.status(200).end();
  if (req.method === 'GET') {
    return res.status(405).json(fail(null, -32000, 'Este servidor no abre streams SSE; envía los mensajes por POST.'));
  }
  if (req.method !== 'POST') return res.status(405).end();

  // 1) Autenticación, antes de mirar nada del cuerpo.
  const enUrl = req.query?.token;
  const enHeader = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  const token = enUrl || enHeader;
  if (!token) {
    res.setHeader('WWW-Authenticate', 'Bearer');
    return res.status(401).json(fail(null, -32001, 'Falta el token del conector.'));
  }

  let db;
  try {
    db = getSupabaseAdmin();
  } catch (err) {
    console.error('[mcp] Supabase mal configurado:', err);
    return res.status(500).json(fail(null, -32603, 'El servidor no está configurado.'));
  }

  const { data: tokenRow, error: tokenError } = await db
    .from('mcp_tokens')
    .select('id, label, revoked_at')
    .eq('token_hash', sha256(token))
    .maybeSingle();

  if (tokenError) {
    console.error('[mcp] error leyendo mcp_tokens:', tokenError);
    return res.status(500).json(fail(null, -32603, 'No pude validar el token.'));
  }
  if (!tokenRow || tokenRow.revoked_at) {
    res.setHeader('WWW-Authenticate', 'Bearer');
    return res.status(401).json(fail(null, -32001, 'Token inválido o revocado.'));
  }

  // No bloquea la respuesta: si falla, no importa.
  db.from('mcp_tokens').update({ last_used_at: new Date().toISOString() }).eq('id', tokenRow.id).then(() => {}, () => {});

  const ctx = { db, quien: tokenRow.label };

  // 2) El cuerpo puede ser un mensaje o un batch.
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json(fail(null, -32700, 'JSON inválido.')); }
  }

  const mensajes = Array.isArray(body) ? body : [body];
  // Las notificaciones (sin id) no llevan respuesta. Si el request es sólo
  // notificaciones —"notifications/initialized"— se contesta 202 sin cuerpo.
  const respuestas = [];
  for (const msg of mensajes) {
    if (!msg || msg.id === undefined || msg.id === null) continue;
    respuestas.push(await manejarMensaje(msg, ctx));
  }

  if (!respuestas.length) return res.status(202).end();
  return res.status(200).json(Array.isArray(body) ? respuestas : respuestas[0]);
}
