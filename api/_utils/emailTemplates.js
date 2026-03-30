import fs from 'node:fs/promises'
import path from 'node:path'

function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function normalizeFirstName(name) {
  const s = String(name ?? '').trim()
  if (!s) return ''
  return s.split(/\s+/)[0] || ''
}

function actorWordFromGender(gender) {
  const g = String(gender ?? '').trim().toLowerCase()
  if (g === 'female' || g === 'mujer' || g === 'f' || g === 'woman') return 'actriz'
  if (g === 'male' || g === 'hombre' || g === 'm' || g === 'man') return 'actor'
  return 'actor/actriz'
}

function renderBasicTemplate(html, vars) {
  // Minimal templating: {{varName}} replacements only.
  // We keep it dependency-free (no handlebars) to reduce footprint.
  let out = String(html)
  for (const [key, value] of Object.entries(vars)) {
    const token = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g')
    out = out.replace(token, String(value ?? ''))
  }
  return out
}

async function loadTemplate(relativePathFromWebsiteRoot) {
  const templatePath = path.join(process.cwd(), relativePathFromWebsiteRoot)
  return await fs.readFile(templatePath, 'utf8')
}

export async function renderWelcomeEmail({ name, gender, unsubscribeUrl }) {
  const html = await loadTemplate('email-bienvenida.html')
  const firstName = normalizeFirstName(name) || 'amig@'
  const actorWord = actorWordFromGender(gender)
  return renderBasicTemplate(html, {
    firstName: escapeHtml(firstName),
    actorWord: escapeHtml(actorWord),
    unsubscribeUrl: escapeHtml(unsubscribeUrl),
  })
}

export async function renderHotLeadsTrimestralesEmail({ name, gender, unsubscribeUrl }) {
  const html = await loadTemplate('email-hot-leads-trimestrales.html')
  const firstName = normalizeFirstName(name) || 'amig@'
  const actorWord = actorWordFromGender(gender)
  return renderBasicTemplate(html, {
    firstName: escapeHtml(firstName),
    actorWord: escapeHtml(actorWord),
    unsubscribeUrl: escapeHtml(unsubscribeUrl),
  })
}

export async function renderReinicioClasesEmail({ unsubscribeUrl }) {
  const html = await loadTemplate('email-reinicio-clases.html')
  return renderBasicTemplate(html, {
    unsubscribeUrl: escapeHtml(unsubscribeUrl),
  })
}

