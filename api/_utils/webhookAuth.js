export function assertWebhookSecret(req) {
  const expected = process.env.EMAIL_WEBHOOK_SECRET
  if (!expected) {
    const err = new Error('EMAIL_WEBHOOK_SECRET not set')
    err.code = 'WEBHOOK_SECRET_NOT_CONFIGURED'
    throw err
  }

  const provided = req.headers['x-webhook-secret']
  if (!provided || provided !== expected) {
    const err = new Error('Unauthorized webhook')
    err.code = 'WEBHOOK_UNAUTHORIZED'
    throw err
  }
}

