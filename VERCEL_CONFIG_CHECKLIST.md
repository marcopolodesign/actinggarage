# Vercel Configuration Checklist for tagadmin.vercel.app

## 🔐 Environment Variables Required on Vercel

Go to your Vercel project → Settings → Environment Variables and add:

### Supabase Configuration (for form submissions)
```
VITE_SUPABASE_URL=https://pyiypxvvruwvwfcsprrb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5aXlweHZ2cnV3dndmY3NwcnJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3MjI5NzMsImV4cCI6MjA4MzI5ODk3M30.pnk3nltwayliSWH5fq5qwCbWLohwJcjfPCj-n_0t9FQ
```

### Mailchimp Configuration (for Dashboard and form submissions)
```
VITE_MAILCHIMP_API_KEY=your_mailchimp_api_key_here
```
OR (both work):
```
MAILCHIMP_API_KEY=your_mailchimp_api_key_here
```

**Note**: The Mailchimp List ID is hardcoded to `0318e55dfd` in the code.

---

## 📊 Current Status

### ✅ Courses Data
- **Status**: Hardcoded in code (same locally and production)
- **Location**: `src/pages/Cursos.tsx` and `src/components/CursosHome.tsx`
- **Action**: No changes needed - data is in the codebase

### ⚠️ Authentication
- **Status**: **NO AUTHENTICATION EXISTS**
- **Current**: Dashboard is publicly accessible at `/dashboard`
- **Issue**: If "auth fails" means the Dashboard isn't loading, it's likely a Mailchimp API key issue, not auth

### ✅ Supabase Integration
- **Status**: Configured in code
- **Used for**: Saving form submissions to `leads` table
- **Action**: Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in Vercel

### ⚠️ Dashboard Data Loading
- **Status**: Uses Mailchimp API (not Supabase)
- **Endpoint**: `/api/get-members`
- **Requires**: `VITE_MAILCHIMP_API_KEY` or `MAILCHIMP_API_KEY` in Vercel

---

## 🔧 Steps to Fix

1. **Add Environment Variables to Vercel**:
   - Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables
   - Add all variables listed above
   - **Important**: After adding, redeploy the project

2. **Redeploy**:
   - Go to Deployments tab
   - Click "..." on latest deployment → "Redeploy"

3. **Test**:
   - Visit: `https://tagadmin.vercel.app/dashboard`
   - Check browser console for errors
   - Verify form submissions work

---

## 🐛 Troubleshooting

### If Dashboard shows "Error Loading Dashboard":
- Check browser console for specific error
- Verify `VITE_MAILCHIMP_API_KEY` is set in Vercel
- Check Vercel function logs: Project → Functions → View Logs

### If form submissions fail:
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Check Supabase dashboard for table `leads` exists
- Check Vercel function logs for errors

### If "auth fails":
- **There is no authentication system** - this might mean:
  - Dashboard API is failing (check Mailchimp API key)
  - Or you want to add authentication (would need to implement)

---

## 📝 Notes

- **Mailchimp List ID**: Hardcoded to `0318e55dfd` in:
  - `api/get-members.js` (line 28)
  - `api/submit-form.js` (line 103)

- **Environment Variable Prefix**: 
  - Client-side code uses `VITE_` prefix
  - Serverless functions can use either `VITE_` or without prefix
  - Vercel automatically makes `VITE_` vars available to both

