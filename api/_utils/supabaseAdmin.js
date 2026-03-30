import { createClient } from '@supabase/supabase-js'

export function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    const err = new Error('Supabase admin not configured (need SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)')
    err.code = 'SUPABASE_ADMIN_NOT_CONFIGURED'
    throw err
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  })
}

