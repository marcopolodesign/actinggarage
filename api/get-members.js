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

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Mailchimp configuration
    const MAILCHIMP_API_KEY = process.env.VITE_MAILCHIMP_API_KEY;
    const MAILCHIMP_SERVER = 'us3';
    const MAILCHIMP_LIST_ID = '0318e55dfd';

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID) {
      return res.status(500).json({
        success: false,
        message: 'Mailchimp configuration not found',
        error: 'Missing VITE_MAILCHIMP_API_KEY'
      });
    }

    const { count = 1000, offset = 0, status = 'subscribed' } = req.query;

    // Fetch members from Mailchimp
    const MAILCHIMP_URL = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`;
    
    const response = await axios.get(MAILCHIMP_URL, {
      params: {
        count: parseInt(count),
        offset: parseInt(offset),
        status: status
      },
      headers: {
        'Authorization': `Basic ${btoa(`anystring:${MAILCHIMP_API_KEY}`)}`,
        'Content-Type': 'application/json',
      },
    });

    // Transform Mailchimp data to match CSV structure
    const members = response.data.members.map(member => {
      const mergeFields = member.merge_fields || {};
      const tags = member.tags || [];
      const tagNames = tags.map(tag => tag.name).join(',');
      
      // Extract interests from tags (interest_teatro, interest_cine, etc.)
      const interestTags = tags
        .filter(tag => tag.name.startsWith('interest_'))
        .map(tag => tag.name.replace('interest_', '').replace('_', '-'));
      const interests = interestTags.length > 0 ? interestTags.join(',') : (mergeFields.MMERGE5 || '');

      // Format dates
      const optinTime = member.timestamp_opt ? new Date(member.timestamp_opt).toISOString().replace('T', ' ').substring(0, 19) : '';
      const confirmTime = member.timestamp_signup ? new Date(member.timestamp_signup).toISOString().replace('T', ' ').substring(0, 19) : '';
      const lastChanged = member.last_changed ? new Date(member.last_changed).toISOString().replace('T', ' ').substring(0, 19) : '';

      return {
        'Email Address': member.email_address || '',
        'First Name': mergeFields.FNAME || '',
        'Last Name': mergeFields.LNAME || '',
        'Address': '',
        'Phone Number': mergeFields.PHONE || '',
        'Birthday': '',
        'Company': '',
        'Gender': '',
        'Interests': interests,
        'Age': mergeFields.AGE || '',
        'Source': mergeFields.SOURCE || 'organic',
        'UTM Source': mergeFields.MMERGE11 || '',
        'UTM Medium': mergeFields.MMERGE12 || '',
        'UTM Campaign': mergeFields.MMERGE13 || '',
        'MEMBER_RATING': member.member_rating || 0,
        'OPTIN_TIME': optinTime,
        'OPTIN_IP': member.ip_opt || '',
        'CONFIRM_TIME': confirmTime,
        'CONFIRM_IP': member.ip_signup || '',
        'GMTOFF': '',
        'DSTOFF': '',
        'TIMEZONE': '',
        'CC': '',
        'REGION': '',
        'LAST_CHANGED': lastChanged,
        'LEID': member.list_id || '',
        'EUID': member.unique_email_id || '',
        'NOTES': '',
        'TAGS': tagNames
      };
    });

    res.json({
      success: true,
      total_items: response.data.total_items,
      members: members
    });

  } catch (error) {
    console.error('Mailchimp API error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });

    res.status(500).json({
      success: false,
      message: error.response?.data?.detail || error.message || 'Failed to fetch members',
      error: error.response?.data || error.message
    });
  }
}

