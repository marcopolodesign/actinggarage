import { Resend } from 'resend'

export function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    const err = new Error('RESEND_API_KEY not set')
    err.code = 'RESEND_NOT_CONFIGURED'
    throw err
  }
  return new Resend(apiKey)
}

