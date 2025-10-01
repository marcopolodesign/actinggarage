// API endpoint for form submission
import axios from 'axios';
import type { FormSubmission } from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const submitForm = async (formData: FormSubmission) => {
  try {
    console.log('Submitting form to backend API:', formData);

    // Call our backend API instead of Mailchimp directly
    const response = await axios.post(`${API_BASE_URL}/submit-form`, formData);
    
    return response.data;
  } catch (error: any) {
    console.error('Form submission error:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to submit form',
      error: error.response?.data || error
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
