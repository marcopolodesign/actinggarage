// Frontend API integration - calls Vercel serverless function
import axios from 'axios';
import type { FormSubmission } from './types';

// Vercel API endpoint
const API_URL = '/api/submit-form';

export const submitForm = async (formData: FormSubmission) => {
  try {
    console.log('Submitting form via Vercel API:', formData);

    // Call our Vercel serverless function
    const response = await axios.post(API_URL, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('API response:', response.data);

    return response.data;

  } catch (error: any) {
    console.error('API error:', error);
    
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
