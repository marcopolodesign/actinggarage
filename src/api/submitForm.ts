// Direct Mailchimp integration
import axios from 'axios';
import type { FormSubmission } from './types';

// Mailchimp configuration - these will be used directly from environment
const MAILCHIMP_SERVER = 'us3'; // You can make this configurable if needed
const MAILCHIMP_LIST_ID = '0318e55dfd'; // From your Vercel environment

// Mailchimp API endpoint
const MAILCHIMP_URL = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`;

console.log('MAILCHIMP_URL', MAILCHIMP_URL);
console.log('MAILCHIMP_LIST_ID', MAILCHIMP_LIST_ID);
console.log('MAILCHIMP_SERVER', MAILCHIMP_SERVER);
// console.log('MAILCHIMP_API_KEY', MAILCHIMP_API_KEY); // API key hidden for security



export const submitForm = async (formData: FormSubmission) => {
  try {
    console.log('Submitting form directly to Mailchimp:', formData);

    // Prepare merge fields
    const mergeFields = {
      FNAME: formData.name.split(' ')[0] || '',
      LNAME: formData.name.split(' ').slice(1).join(' ') || '',
      PHONE: formData.phone,
      AGE: formData.age,
      SOURCE: formData.source || 'email_campaign',
      MMERGE5: formData.interests,
    };

    // Prepare request data
    const requestData = {
      email_address: formData.email,
      status: 'subscribed',
      merge_fields: mergeFields,
      tags: ['form_submission', 'interest_' + formData.interests.replace('-', '_')],
    };

    console.log('Mailchimp request data:', requestData);

    // Make request directly to Mailchimp API
    const response = await axios.post(MAILCHIMP_URL, requestData, {
      headers: {
        'Authorization': `Basic ${btoa(`anystring:${import.meta.env.VITE_MAILCHIMP_API_KEY}`)}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Mailchimp response:', response.data);

    return {
      success: true,
      message: 'Form submitted successfully',
      contactId: response.data.id
    };

  } catch (error: any) {
    console.error('Mailchimp API error:', error);
    
    // Handle existing member error
    if (error.response?.status === 400 && error.response?.data?.title === 'Member Exists') {
      return {
        success: true,
        message: 'Contact already exists and was updated',
        contactId: 'existing_member'
      };
    }
    
    return {
      success: false,
      message: error.response?.data?.detail || error.message || 'Failed to submit form',
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
