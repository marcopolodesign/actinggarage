import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

// =====================================================
// CONFIGURATION TOGGLES
// Set to true/false to enable/disable each integration
// =====================================================
const SEND_TO_SUPABASE = true;   // Save form data to Supabase database
const SEND_TO_MAILCHIMP = false;  // Also send to Mailchimp (for email marketing)

// Initialize Supabase client (if enabled)
// Try both VITE_ prefixed (for consistency) and non-prefixed env vars
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

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
    const { email, name, phone, birthday, age, interests, gender, course, source, utm_source, utm_medium, utm_campaign, utm_id } = req.body;

    // Validate required fields
    if (!email || !name || !phone || !interests) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const submissionTimestamp = new Date().toISOString();
    let supabaseResult = null;
    let mailchimpResult = null;

    // =====================================================
    // SUPABASE SUBMISSION
    // =====================================================
    if (SEND_TO_SUPABASE) {
      if (!supabase) {
        console.error(`[${submissionTimestamp}] Supabase NOT CONFIGURED`, {
          hasUrl: !!supabaseUrl,
          hasKey: !!supabaseAnonKey,
          urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 30) : 'not set'
        });
        return res.status(500).json({
          success: false,
          message: 'Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.',
          debug: {
            hasUrl: !!supabaseUrl,
            hasKey: !!supabaseAnonKey
          },
          timestamp: submissionTimestamp
        });
      }
      try {
        console.log(`[${submissionTimestamp}] Submitting to Supabase...`);

        const { data, error } = await supabase
          .from('leads')
          .insert([{
            email,
            name,
            phone,
            birthday: birthday || null,
            age: age || null,
            interests,
            gender: gender || null,
            course: course || null,
            source: source || 'website_form',
            status: 'nuevo',
            utm_source: utm_source || null,
            utm_medium: utm_medium || 'organic',
            utm_campaign: utm_campaign || null,
            utm_id: utm_id || null
          }])
          .select()
          .single();

        if (error) {
          console.error(`[${submissionTimestamp}] Supabase error:`, error);
          // Don't fail the request, just log the error
          supabaseResult = { success: false, error: error.message };
        } else {
          console.log(`[${submissionTimestamp}] Supabase SUCCESS:`, { id: data.id, email });
          supabaseResult = { success: true, id: data.id };
        }
      } catch (supabaseError) {
        console.error(`[${submissionTimestamp}] Supabase exception:`, supabaseError.message);
        supabaseResult = { success: false, error: supabaseError.message };
      }
    } else {
      console.log(`[${submissionTimestamp}] Supabase submission DISABLED`);
    }

    // =====================================================
    // MAILCHIMP SUBMISSION
    // =====================================================
    if (SEND_TO_MAILCHIMP) {
      const MAILCHIMP_API_KEY = process.env.VITE_MAILCHIMP_API_KEY;
      const MAILCHIMP_SERVER = 'us3';
      const MAILCHIMP_LIST_ID = '0318e55dfd';

      if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID) {
        console.warn(`[${submissionTimestamp}] Mailchimp configuration missing`);
        mailchimpResult = { success: false, error: 'Mailchimp not configured' };
      } else {
        try {
          // Prepare merge fields
          const mergeFields = {
            FNAME: name.split(' ')[0] || '',
            LNAME: name.split(' ').slice(1).join(' ') || '',
            PHONE: phone,
            BIRTHDAY: birthday || '',
            AGE: age || '',
            SOURCE: source || 'website_form',
            MMERGE5: interests,
            GENDER: gender || '',
            MMERGE14: course || '',
            MMERGE11: utm_source || '',
            MMERGE12: utm_medium || 'organic',
            MMERGE13: utm_campaign || '',
          };

          const requestData = {
            email_address: email,
            status: 'subscribed',
            merge_fields: mergeFields,
            tags: ['form_submission', 'interest_' + interests.replace('-', '_')],
          };

          const MAILCHIMP_URL = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`;

          console.log(`[${submissionTimestamp}] Submitting to Mailchimp...`);

          const response = await axios.post(MAILCHIMP_URL, requestData, {
            headers: {
              'Authorization': `Basic ${btoa(`anystring:${MAILCHIMP_API_KEY}`)}`,
              'Content-Type': 'application/json',
            },
          });

          console.log(`[${submissionTimestamp}] Mailchimp SUCCESS:`, {
            contactId: response.data.id,
            email: response.data.email_address
          });

          mailchimpResult = { success: true, contactId: response.data.id };

        } catch (mailchimpError) {
          // Handle existing member (this is actually a success case)
          if (mailchimpError.response?.status === 400 && mailchimpError.response?.data?.title === 'Member Exists') {
            console.log(`[${submissionTimestamp}] Mailchimp: Member already exists`);
            mailchimpResult = { success: true, contactId: 'existing_member' };
          } else {
            console.error(`[${submissionTimestamp}] Mailchimp error:`, mailchimpError.message);
            mailchimpResult = { success: false, error: mailchimpError.message };
          }
        }
      }
    } else {
      console.log(`[${submissionTimestamp}] Mailchimp submission DISABLED`);
    }

    // =====================================================
    // RESPONSE
    // =====================================================
    // Consider success if at least one integration succeeded
    const overallSuccess =
      (SEND_TO_SUPABASE && supabaseResult?.success) ||
      (SEND_TO_MAILCHIMP && mailchimpResult?.success) ||
      (!SEND_TO_SUPABASE && !SEND_TO_MAILCHIMP); // No integrations enabled

    if (overallSuccess) {
      res.json({
        success: true,
        message: 'Form submitted successfully',
        supabase: supabaseResult,
        mailchimp: mailchimpResult
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Form submission failed',
        supabase: supabaseResult,
        mailchimp: mailchimpResult
      });
    }

  } catch (error) {
    const errorTimestamp = new Date().toISOString();
    console.error(`[${errorTimestamp}] FORM SUBMISSION FAILED:`, error.message);

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit form',
      timestamp: errorTimestamp
    });
  }
}
