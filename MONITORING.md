# Form Submission Monitoring Guide

## How to Check for Missed Form Submissions

### 1. **Vercel Function Logs**

#### Via Vercel Dashboard:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (`TAG` or `actinggarage`)
3. Click on **"Deployments"** tab
4. Click on the **latest deployment**
5. Scroll down to **"Functions"** section
6. You should see:
   - `api/submit-form` - Form submission handler
   - `api/get-members` - Dashboard data fetcher
7. Click on **`api/submit-form`** to view:
   - **Function logs**: All console.log outputs
   - **Failed submissions**: Look for `FORM SUBMISSION FAILED` or `FAILED SUBMISSION DETAILS`
   - **Success submissions**: Look for `Mailchimp response SUCCESS`
   - **Errors**: Check for HTTP 500 status codes

**Note**: Functions only appear after they've been called at least once. If you don't see them:
- Submit a test form first
- Or check the **"Logs"** tab in the deployment for real-time logs

#### Via Vercel CLI:
```bash
# View all logs
vercel logs --follow

# Filter for form submissions
vercel logs | grep "FORM SUBMISSION"

# View logs for specific function
vercel logs --follow | grep "submit-form"

# View logs from last hour
vercel logs --since 1h
```

#### Alternative: Check Deployment Logs
1. Go to **Deployments** tab
2. Click on any deployment
3. Click **"View Function Logs"** or scroll to **"Build Logs"**
4. Look for function invocations and errors

### 2. **Mailchimp Verification**

#### Check Recent Submissions:
1. Log into [Mailchimp](https://mailchimp.com)
2. Go to **Audience** → **All contacts**
3. Filter by:
   - **Tag**: `form_submission`
   - **Date**: Last 7 days / 30 days
4. Compare count with expected submissions

#### Check for Missing Data:
- Look for contacts with empty fields (missing course, age, etc.)
- Check `SOURCE` field - should be `website_form` for form submissions
- Verify UTM parameters are populated correctly

### 3. **Browser Console Logs**

#### Check Frontend Errors:
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for:
   - `API error:` - indicates failed API calls
   - `Form submitted successfully` - successful submissions
   - Any red error messages

### 4. **Error Patterns to Look For**

#### Common Issues:
- **400 Bad Request**: Missing required fields, invalid data format
- **401 Unauthorized**: Mailchimp API key issues
- **500 Internal Server Error**: Server-side errors
- **Network errors**: CORS issues, timeout errors

### 5. **Monitoring Checklist**

- [ ] Check Vercel logs daily for `FORM SUBMISSION FAILED`
- [ ] Compare Mailchimp contact count with form submission count
- [ ] Verify all form fields are populated correctly in Mailchimp
- [ ] Check for duplicate submissions (same email multiple times)
- [ ] Monitor for API rate limits (Mailchimp has limits)

### 6. **Automated Monitoring (Future Enhancement)**

Consider adding:
- **Sentry** or **LogRocket** for error tracking
- **Vercel Analytics** for function performance
- **Webhook** to Slack/Discord for failed submissions
- **Database** to log all submission attempts (success + failures)

## Current Logging Format

All submissions are logged with timestamps:
- **Success**: `[TIMESTAMP] Mailchimp response SUCCESS`
- **Failure**: `[TIMESTAMP] FORM SUBMISSION FAILED`
- **Details**: Email, name, error message, HTTP status

## Quick Debug Commands

```bash
# View recent Vercel logs
vercel logs --since 1h | grep "submit-form"

# Check Mailchimp API status
curl -X GET "https://us3.api.mailchimp.com/3.0/ping" \
  -H "Authorization: Basic YOUR_API_KEY"

# Test form submission locally
curl -X POST http://localhost:3000/api/submit-form \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","phone":"123456789","interests":"teatro"}'
```

