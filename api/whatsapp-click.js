import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { page, utm_source, utm_medium, utm_campaign, utm_id } = req.body || {};

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    await supabase.from('whatsapp_clicks').insert([{
      page:         page         || null,
      utm_source:   utm_source   || null,
      utm_medium:   utm_medium   || null,
      utm_campaign: utm_campaign || null,
      utm_id:       utm_id       || null,
    }]);

    res.status(200).json({ ok: true });
  } catch (err) {
    // Non-critical — don't fail the user's WhatsApp click
    console.error('whatsapp-click error:', err);
    res.status(200).json({ ok: true });
  }
}
