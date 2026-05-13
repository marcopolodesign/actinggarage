import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Receives sendBeacon requests from FormFlyout when the user closes the tab
// with a valid email in the form. Proxies to upsert_lead_from_form RPC.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (!payload?.email) {
      return res.status(400).json({ success: false, message: 'email is required' });
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      return res.status(500).json({ success: false, message: 'Supabase not configured' });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { error } = await supabase.rpc('upsert_lead_from_form', { payload });

    if (error) {
      console.error('upsert_lead_from_form error:', error.message);
      return res.status(500).json({ success: false, message: error.message });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('upsert-lead handler error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
}
