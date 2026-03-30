# Resend email webhooks (website)

This folder contains server-side endpoints that send emails via Resend when Supabase database webhooks fire.

## Endpoints

- `POST /api/email/lead-created`
  - Trigger: new row inserted into `leads`
  - Sends: `email-bienvenida.html` (“Bienvenido…”) to the lead email
- `POST /api/email/enrollment-created`
  - Trigger: new row inserted into `enrollments` with `status='active'`
  - Sends: a simple “Inscripción confirmada” email to the student email
- `GET|POST /api/email/unsubscribe?email=...`
  - One-click unsubscribe. Persists into `email_preferences` in Supabase.

## Webhook auth

All webhook endpoints require a secret header:

- `x-webhook-secret: <EMAIL_WEBHOOK_SECRET>`

## Expected payload shape

We accept Supabase webhook payload formats that include one of these:

- `body.record` (preferred)
- `body.new`
- or the record itself as the root body

Minimal fields used:

- Lead: `email`, `name`, `gender`
- Enrollment: `id`, `student_id`, `instance_id`

## Required environment variables (Vercel)

See `env.example` at repo root of `website/`.

At minimum:

- `RESEND_API_KEY`
- `RESEND_FROM`
- `EMAIL_WEBHOOK_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `PUBLIC_BASE_URL`

