import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { FormSubmission } from './types';

export const upsertLead = (payload: Partial<FormSubmission>): void => {
  if (!isSupabaseConfigured() || !payload.email) return;
  supabase
    .rpc('upsert_lead_from_form', { payload })
    .then(({ error }) => { if (error) console.warn('upsertLead:', error.message); });
};
