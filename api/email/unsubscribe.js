import { getSupabaseAdmin } from '../_utils/supabaseAdmin.js'

function html(res, status, body) {
  res.status(status)
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.send(body)
}

function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export default async function handler(req, res) {
  // One-click unsubscribe endpoint. Works via GET (link) and POST (List-Unsubscribe-Post).
  const email = (req.query?.email || '').toString().trim().toLowerCase()
  if (!email) {
    return html(res, 400, '<h1>Missing email</h1>')
  }

  try {
    const supabase = getSupabaseAdmin()

    const now = new Date().toISOString()
    const { error } = await supabase.from('email_preferences').upsert(
      {
        email,
        unsubscribed_marketing: true,
        unsubscribed_all: false,
        updated_at: now,
        unsubscribed_at: now,
      },
      { onConflict: 'email' }
    )

    if (error) throw error

    return html(
      res,
      200,
      `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Darse de baja</title>
  </head>
  <body style="font-family:Arial,Helvetica,sans-serif;padding:28px;background:#0b0b0b;color:#ffffff;">
    <div style="max-width:720px;margin:0 auto;border:1px solid #2a2a2a;border-radius:16px;padding:22px;background:#111;">
      <h1 style="margin:0 0 10px 0;font-size:22px;">Listo</h1>
      <p style="margin:0;color:#d6d6d6;line-height:1.6;">
        ${escapeHtml(email)} fue dado de baja de emails de marketing.
      </p>
    </div>
  </body>
</html>`
    )
  } catch (err) {
    console.error('unsubscribe failed:', err)
    return html(res, 500, '<h1>Error</h1><p>No pudimos procesar la baja. Intenta más tarde.</p>')
  }
}

