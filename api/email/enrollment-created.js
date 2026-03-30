import { assertWebhookSecret } from '../_utils/webhookAuth.js'
import { getSupabaseAdmin } from '../_utils/supabaseAdmin.js'
import { getResend } from '../_utils/resendClient.js'

function json(res, status, body) {
  res.status(status).json(body)
}

function getUnsubscribeUrl({ baseUrl, email }) {
  const u = new URL('/api/email/unsubscribe', baseUrl)
  u.searchParams.set('email', email)
  return u.toString()
}

function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function fmtDate(dateLike) {
  if (!dateLike) return ''
  const d = new Date(dateLike)
  if (Number.isNaN(d.getTime())) return String(dateLike)
  return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { success: false, message: 'Method not allowed' })

  try {
    assertWebhookSecret(req)

    const baseUrl = process.env.PUBLIC_BASE_URL || 'https://theactinggarage.com'
    const from = process.env.RESEND_FROM || 'The Acting Garage <no-reply@theactinggarage.com>'

    const record = req.body?.record || req.body?.new || req.body
    const enrollmentId = record?.id
    const studentId = record?.student_id || record?.studentId
    const instanceId = record?.instance_id || record?.instanceId

    if (!enrollmentId && !studentId) {
      return json(res, 400, { success: false, message: 'Missing enrollment identifiers' })
    }

    const supabase = getSupabaseAdmin()

    // Pull student + instance details for a useful confirmation email
    const [{ data: student, error: studentErr }, { data: instance, error: instanceErr }] = await Promise.all([
      studentId
        ? supabase.from('students').select('email, name').eq('id', studentId).single()
        : Promise.resolve({ data: null, error: null }),
      instanceId
        ? supabase
            .from('course_instances')
            .select('name, start_date, schedule, location, instructor')
            .eq('id', instanceId)
            .single()
        : Promise.resolve({ data: null, error: null }),
    ])

    if (studentErr) throw studentErr
    if (instanceErr) console.warn('course_instances read error:', instanceErr)

    const email = student?.email
    const studentName = student?.name || ''

    if (!email) return json(res, 400, { success: false, message: 'Student email not found' })

    const { data: prefs } = await supabase
      .from('email_preferences')
      .select('unsubscribed_all, unsubscribed_transactional')
      .eq('email', email)
      .maybeSingle()

    if (prefs?.unsubscribed_all || prefs?.unsubscribed_transactional) {
      return json(res, 200, { success: true, skipped: true, reason: 'unsubscribed' })
    }

    const courseName = instance?.name || 'tu curso'
    const startDate = fmtDate(instance?.start_date || record?.start_date || record?.startDate)
    const schedule = instance?.schedule || ''
    const location = instance?.location || ''
    const instructor = instance?.instructor || ''

    const unsubscribeUrl = getUnsubscribeUrl({ baseUrl, email })

    const html = `
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Inscripción confirmada</title>
  </head>
  <body style="margin:0;padding:0;background:#0b0b0b;font-family:Arial,Helvetica,sans-serif;color:#ffffff;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#0b0b0b;">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="680" cellspacing="0" cellpadding="0" border="0" style="max-width:680px;width:100%;background:#111;border:1px solid #2a2a2a;border-radius:20px;overflow:hidden;">
            <tr>
              <td style="padding:28px 28px 8px 28px;">
                <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#f4b03e;">The Acting Garage</div>
                <h1 style="margin:14px 0 6px 0;font-size:28px;line-height:1.2;">Inscripción confirmada</h1>
                <p style="margin:0 0 14px 0;color:#d6d6d6;font-size:14px;line-height:1.6;">
                  Hola ${escapeHtml(studentName.split(' ')[0] || '')}, ya estás inscripto/a en <strong style="color:#fff;">${escapeHtml(courseName)}</strong>.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 24px 28px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#0e0e0e;border:1px solid #262626;border-radius:16px;">
                  <tr>
                    <td style="padding:18px 18px;">
                      <div style="font-size:13px;color:#f4b03e;font-weight:bold;margin-bottom:8px;">Detalles</div>
                      ${startDate ? `<div style="font-size:14px;line-height:1.6;color:#eaeaea;"><strong>Inicio:</strong> ${escapeHtml(startDate)}</div>` : ''}
                      ${schedule ? `<div style="font-size:14px;line-height:1.6;color:#eaeaea;"><strong>Horario:</strong> ${escapeHtml(schedule)}</div>` : ''}
                      ${location ? `<div style="font-size:14px;line-height:1.6;color:#eaeaea;"><strong>Lugar:</strong> ${escapeHtml(location)}</div>` : ''}
                      ${instructor ? `<div style="font-size:14px;line-height:1.6;color:#eaeaea;"><strong>Profesor:</strong> ${escapeHtml(instructor)}</div>` : ''}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 26px 28px;">
                <p style="margin:0;color:#cfcfcf;font-size:13px;line-height:1.7;">
                  Si tenés alguna duda, respondé a este email y te ayudamos.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 26px 28px;border-top:1px solid #232323;">
                <p style="margin:0;font-size:11px;color:#9a9a9a;line-height:1.5;">
                  Si no querés recibir más emails, podés darte de baja acá:
                  <a href="${escapeHtml(unsubscribeUrl)}" style="color:#9a9a9a;text-decoration:underline;">Darse de baja</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim()

    const resend = getResend()
    const { data, error } = await resend.emails.send({
      from,
      to: email,
      subject: 'Inscripción confirmada — The Acting Garage',
      html,
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    })

    if (error) return json(res, 500, { success: false, message: error.message || 'Resend error', error })
    return json(res, 200, { success: true, id: data?.id })
  } catch (err) {
    console.error('enrollment-created email failed:', err)
    return json(res, 500, { success: false, message: err.message || 'Unknown error' })
  }
}

