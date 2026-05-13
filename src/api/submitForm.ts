import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { FormSubmission } from './types';

export const submitForm = async (formData: FormSubmission) => {
  try {
    if (!isSupabaseConfigured()) {
      console.error('Supabase not configured');
      return { success: false, message: 'Supabase not configured. Please check environment variables.' };
    }

    const payload = {
      email:        formData.email,
      name:         formData.name,
      phone:        formData.phone,
      birthday:     formData.birthday     || null,
      age:          formData.age          || null,
      interests:    formData.interests,
      gender:       formData.gender       || null,
      course:       formData.course       || null,
      source:       formData.source       || 'website_form',
      utm_source:   formData.utm_source   || null,
      utm_medium:   formData.utm_medium   || 'organic',
      utm_campaign: formData.utm_campaign || null,
      utm_id:       formData.utm_id       || null,
    };

    const { data, error } = await supabase.rpc('create_prospect_from_form', { payload });

    if (error) {
      console.error('Supabase error:', error);
      return { success: false, message: error.message || 'Failed to submit form', error };
    }

    console.log('Prospect created:', data);
    return { success: true, message: 'Form submitted successfully', id: data as string };

  } catch (error: any) {
    console.error('Form submission error:', error);
    return { success: false, message: error.message || 'Failed to submit form', error };
  }
};

export const submitFormDev = async (formData: FormSubmission) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Form submission (dev mode):', formData);
  return { success: true, message: 'Form submitted successfully (dev mode)', contactId: 'dev_' + Date.now() };
};
