import { getSupabaseAdmin } from './_utils/supabaseAdmin.js'
import { getResend } from './_utils/resendClient.js'

/**
 * POST /api/enviar-calendario  { email }
 *
 * El peldaño «Recibe el calendario» de la home nueva: la persona deja sólo el
 * email, el formulario la da de alta en el CRM (create_prospect_from_form, con
 * source «home_calendario») y después llama acá para que le llegue el mail con el
 * enlace al PDF del calendario.
 *
 * Por qué se chequea el CRM antes de mandar: el endpoint es público. Sin ese
 * chequeo cualquiera podría usarlo para mandarle nuestro mail a direcciones
 * ajenas. Sólo se envía si ese email entró o se actualizó en los últimos 15
 * minutos, o sea, si acaba de pasar por el formulario.
 *
 * Nombre estático a propósito (no api/x/[param].js): las rutas dinámicas de
 * funciones pierden contra el rewrite del SPA en vercel.json. Ver api/mcp.js.
 *
 * Variables: RESEND_API_KEY, SUPABASE_SERVICE_ROLE_KEY, CALENDARIO_PDF_URL
 * (el enlace de Drive al PDF). Sin CALENDARIO_PDF_URL responde 503 y no manda nada.
 */

const FROM = process.env.RESEND_FROM || 'The Acting Garage <hola@theactinggarage.com>'
const BASE = process.env.PUBLIC_BASE_URL || 'https://www.theactinggarage.com'
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

function html({ pdfUrl, unsubscribeUrl }) {
  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <span style="display:none;max-height:0;overflow:hidden;">Fechas de inicio, horarios de cada formación y hasta cuándo quedan plazas.</span>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:#000;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:600px;width:100%;">
        <tr><td style="padding:40px 40px 0;">
          <p style="margin:0;font-size:10px;font-weight:700;letter-spacing:0.25em;color:rgba(255,255,255,0.35);text-transform:uppercase;">The Acting Garage · Curso 2026/27</p>
        </td></tr>
        <tr><td style="padding:16px 40px 0;">
          <h1 style="margin:0;font-family:'Arial Black','Impact',sans-serif;font-size:44px;font-weight:900;line-height:1;color:#fff;text-transform:uppercase;letter-spacing:-0.02em;">Tu calendario</h1>
        </td></tr>
        <tr><td style="padding:24px 40px 0;">
          <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.7);">Hola. Aquí tienes el calendario del curso 2026/27: cuándo empieza cada formación, en qué horarios y hasta cuándo quedan plazas.</p>
          <p style="margin:0;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.7);">Si tienes cualquier duda, responde a este correo o escríbenos por WhatsApp y te contestamos nosotros, no un bot.</p>
        </td></tr>
        <tr><td style="padding:32px 40px 0;">
          <a href="${pdfUrl}" style="display:block;background:#FFBE00;color:#000;text-decoration:none;text-align:center;padding:18px 0;font-family:'Arial Black','Impact',sans-serif;font-size:14px;font-weight:900;text-transform:uppercase;letter-spacing:0.12em;">Descargar el calendario (PDF) &rarr;</a>
        </td></tr>
        <tr><td style="padding:20px 40px 0;">
          <a href="https://wa.me/34682560187?text=${encodeURIComponent('Hola TAG! Acabo de recibir el calendario y tengo una duda.')}" style="display:block;border:2px solid #FFBE00;color:#FFBE00;text-decoration:none;text-align:center;padding:14px 0;font-family:'Arial Black','Impact',sans-serif;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:0.12em;">Escribirnos por WhatsApp</a>
        </td></tr>
        <tr><td style="padding:40px 40px 0;"><div style="height:1px;background:rgba(255,255,255,0.08);"></div></td></tr>
        <tr><td style="padding:24px 40px 40px;">
          <p style="margin:0;font-size:11px;line-height:1.6;color:rgba(255,255,255,0.3);">
            The Acting Garage · Carrer de Londres, 9 · 08029 Barcelona<br>
            Recibes este correo porque pediste el calendario en nuestra web.<br>
            <a href="${unsubscribeUrl}" style="color:rgba(255,255,255,0.4);text-decoration:underline;">No quiero recibir más correos</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' })

  const pdfUrl = process.env.CALENDARIO_PDF_URL
  if (!pdfUrl) return res.status(503).json({ ok: false, error: 'calendario no configurado' })

  const email = String(req.body?.email || '').trim().toLowerCase()
  if (!EMAIL_RE.test(email)) return res.status(400).json({ ok: false, error: 'email inválido' })

  try {
    const supabase = getSupabaseAdmin()

    // Sólo a quien acaba de pasar por el formulario (ver comentario de cabecera).
    const desde = new Date(Date.now() - 15 * 60 * 1000).toISOString()
    const { data: reciente, error: qErr } = await supabase
      .from('prospects')
      .select('id')
      .ilike('email', email)
      .or(`created_at.gte.${desde},updated_at.gte.${desde}`)
      .limit(1)
    if (qErr) throw qErr
    if (!reciente?.length) return res.status(403).json({ ok: false, error: 'sin solicitud reciente' })

    const { data: prefs } = await supabase
      .from('email_preferences')
      .select('unsubscribed_all')
      .eq('email', email)
      .maybeSingle()
    if (prefs?.unsubscribed_all) return res.status(200).json({ ok: true, skipped: 'baja' })

    const unsubscribeUrl = `${BASE}/api/email/unsubscribe?email=${encodeURIComponent(email)}`
    const { data, error } = await getResend().emails.send({
      from: FROM,
      to: email,
      replyTo: 'hola@theactinggarage.com',
      subject: 'El calendario del curso 2026/27 de The Acting Garage',
      html: html({ pdfUrl, unsubscribeUrl }),
      headers: { 'List-Unsubscribe': `<${unsubscribeUrl}>` },
      tags: [{ name: 'category', value: 'calendario' }],
    })
    if (error) throw new Error(error.message || 'Resend error')
    return res.status(200).json({ ok: true, id: data?.id })
  } catch (err) {
    console.error('enviar-calendario:', err)
    return res.status(500).json({ ok: false, error: err.message || 'error' })
  }
}
