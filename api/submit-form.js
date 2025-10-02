import axios from 'axios';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, name, phone, age, interests, source } = req.body;

    // Validate required fields
    if (!email || !name || !phone || !interests) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Mailchimp configuration
    const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    const MAILCHIMP_SERVER = process.env.MAILCHIMP_SERVER || 'us3';
    const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID) {
      console.error('Mailchimp configuration missing:', {
        hasApiKey: !!MAILCHIMP_API_KEY,
        hasListId: !!MAILCHIMP_LIST_ID,
        server: MAILCHIMP_SERVER
      });
      return res.status(500).json({
        success: false,
        message: 'Mailchimp configuration not found',
        error: 'Missing MAILCHIMP_API_KEY or MAILCHIMP_LIST_ID'
      });
    }

    // Prepare merge fields
    const mergeFields = {
      FNAME: name.split(' ')[0] || '',
      LNAME: name.split(' ').slice(1).join(' ') || '',
      PHONE: phone,
      AGE: age,
      SOURCE: source || 'email_campaign',
      MMERGE5: interests,
    };

    // Prepare request data
    const requestData = {
      email_address: email,
      status: 'subscribed',
      merge_fields: mergeFields,
      tags: ['form_submission', 'interest_' + interests.replace('-', '_')],
    };

    const MAILCHIMP_URL = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`;

    console.log('Submitting to Mailchimp:', requestData);

    // Make request to Mailchimp API
    const response = await axios.post(MAILCHIMP_URL, requestData, {
      headers: {
        'Authorization': `Basic ${btoa(`anystring:${MAILCHIMP_API_KEY}`)}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Mailchimp response:', response.data);

    res.json({
      success: true,
      message: 'Form submitted successfully',
      contactId: response.data.id
    });

  } catch (error) {
    console.error('Mailchimp API error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });

    // Handle existing member error
    if (error.response?.status === 400 && error.response?.data?.title === 'Member Exists') {
      return res.json({
        success: true,
        message: 'Contact already exists and was updated',
        contactId: 'existing_member'
      });
    }

    res.status(500).json({
      success: false,
      message: error.response?.data?.detail || error.message || 'Failed to submit form',
      error: error.response?.data || error.message
    });
  }
}
