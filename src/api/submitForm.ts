// Frontend API integration - calls Supabase directly from client
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { FormSubmission } from './types';

export const submitForm = async (formData: FormSubmission) => {
  try {
    console.log('Submitting form to Supabase:', formData);

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.error('Supabase not configured');
      return {
        success: false,
        message: 'Supabase not configured. Please check environment variables.',
      };
    }

    // Insert directly into Supabase leads table
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        birthday: formData.birthday || null,
        age: formData.age || null,
        interests: formData.interests,
        gender: formData.gender || null,
        course: formData.course || null,
        source: formData.source || 'website_form',
        status: 'nuevo',
        utm_source: formData.utm_source || null,
        utm_medium: formData.utm_medium || 'organic',
        utm_campaign: formData.utm_campaign || null,
        utm_id: formData.utm_id || null
      }])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return {
        success: false,
        message: error.message || 'Failed to submit form',
        error: error
      };
    }

    console.log('Supabase SUCCESS:', { id: data.id, email: formData.email });

    return {
      success: true,
      message: 'Form submitted successfully',
      id: data.id
    };

  } catch (error: any) {
    console.error('Form submission error:', error);

    return {
      success: false,
      message: error.message || 'Failed to submit form',
      error: error
    };
  }
};

// For development - simulate API call
export const submitFormDev = async (formData: FormSubmission) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('Form submission (dev mode):', formData);

  return {
    success: true,
    message: 'Form submitted successfully (dev mode)',
    contactId: 'dev_' + Date.now()
  };
};
