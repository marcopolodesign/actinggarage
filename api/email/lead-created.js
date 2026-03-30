import { assertWebhookSecret } from '../_utils/webhookAuth.js'
import { getSupabaseAdmin } from '../_utils/supabaseAdmin.js'
import { getResend } from '../_utils/resendClient.js'
import { renderWelcomeEmail } from '../_utils/emailTemplates.js'

function json(res, status, body) {
  res.status(status).json(body)
}

function getUnsubscribeUrl({ baseUrl, email }) {
  const u = new URL('/api/email/unsubscribe', baseUrl)
  u.searchParams.set('email', email)
  return u.toString()
}

export default async function handler(req, res) {
  // Expecting Supabase DB Webhook payload (or similar)
  if (req.method !== 'POST') return json(res, 405, { success: false, message: 'Method not allowed' })

  try {
    assertWebhookSecret(req)

    const baseUrl = process.env.PUBLIC_BASE_URL || 'https://theactinggarage.com'
    const from = process.env.RESEND_FROM || 'The Acting Garage <no-reply@theactinggarage.com>'

    const record = req.body?.record || req.body?.new || req.body
    const email = record?.email
    const name = record?.name
    const gender = record?.gender

    if (!email) return json(res, 400, { success: false, message: 'Missing email in payload' })

    const supabase = getSupabaseAdmin()
    const { data: prefs, error: prefsErr } = await supabase
      .from('email_preferences')
      .select('unsubscribed_marketing, unsubscribed_all')
      .eq('email', email)
      .maybeSingle()

    if (prefsErr) {
      // Don’t block sending on a prefs read error; just report it.
      console.warn('email_preferences read error:', prefsErr)
    }

    if (prefs?.unsubscribed_all || prefs?.unsubscribed_marketing) {
      return json(res, 200, { success: true, skipped: true, reason: 'unsubscribed' })
    }

    const unsubscribeUrl = getUnsubscribeUrl({ baseUrl, email })
    const html = await renderWelcomeEmail({ name, gender, unsubscribeUrl })

    const resend = getResend()
    const { data, error } = await resend.emails.send({
      from,
      to: email,
      subject: 'Bienvenido a The Acting Garage 🎬',
      html,
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    })

    if (error) return json(res, 500, { success: false, message: error.message || 'Resend error', error })
    return json(res, 200, { success: true, id: data?.id })
  } catch (err) {
    console.error('lead-created email failed:', err)
    return json(res, 500, { success: false, message: err.message || 'Unknown error' })
  }
}

