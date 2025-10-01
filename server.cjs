const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mailchimp configuration
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_SERVER = process.env.MAILCHIMP_SERVER || 'us3';
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;

// Mailchimp API endpoint
const MAILCHIMP_URL = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`;

// API endpoint to submit form data
app.post('/api/submit-form', async (req, res) => {
  try {
    const { email, name, phone, age, interests, source } = req.body;

    // Validate required fields
    if (!email || !name || !phone || !interests) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
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

    console.log('Submitting to Mailchimp:', requestData);

    // Make request to Mailchimp API
    const response = await axios.post(MAILCHIMP_URL, requestData, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });

    // Add tags to the contact
    if (response.data.id) {
      const tagUrl = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${response.data.id}/tags`;
      
      await axios.post(tagUrl, {
        tags: [
          { name: 'form_submission', status: 'active' },
          { name: 'interest_' + interests.replace('-', '_'), status: 'active' },
          { name: 'source_' + (source || 'email_campaign'), status: 'active' }
        ]
      }, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      });
    }

    res.json({
      success: true,
      message: 'Form submitted successfully',
      contactId: response.data.id
    });

  } catch (error) {
    console.error('Mailchimp API error:', error.response?.data || error.message);

    // Handle existing member error
    if (error.response?.status === 400 && error.response?.data?.title === 'Member Exists') {
      try {
        // Update existing member
        const subscriberHash = crypto.createHash('md5').update(req.body.email.toLowerCase()).digest('hex');
        const updateUrl = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${subscriberHash}`;
        
        const updateData = {
          merge_fields: {
            FNAME: req.body.name.split(' ')[0] || '',
            LNAME: req.body.name.split(' ').slice(1).join(' ') || '',
            PHONE: req.body.phone,
            AGE: req.body.age,
            SOURCE: req.body.source || 'email_campaign',
          },
        };

        await axios.patch(updateUrl, updateData, {
          headers: {
            'Authorization': `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
            'Content-Type': 'application/json',
          },
        });

        // Update tags
        const tagUrl = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members/${subscriberHash}/tags`;
        
        await axios.post(tagUrl, {
          tags: [
            { name: 'form_submission', status: 'active' },
            { name: 'interest_' + req.body.interests.replace('-', '_'), status: 'active' },
            { name: 'source_' + (req.body.source || 'email_campaign'), status: 'active' }
          ]
        }, {
          headers: {
            'Authorization': `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
            'Content-Type': 'application/json',
          },
        });

        res.json({
          success: true,
          message: 'Contact updated successfully',
          contactId: subscriberHash
        });

      } catch (updateError) {
        console.error('Update error:', updateError.response?.data || updateError.message);
        res.status(500).json({
          success: false,
          message: 'Failed to update existing contact',
          error: updateError.response?.data || updateError.message
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to submit form',
        error: error.response?.data || error.message
      });
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📧 Mailchimp integration ready!`);
});
