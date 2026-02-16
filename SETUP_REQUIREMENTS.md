# TAG Application Setup Requirements

> **📌 Review CATCH_UP first.** Always read [CATCH_UP.md](../CATCH_UP.md) (workspace root) for the latest changes and handoff context.

## ✅ **COMPLETED SETUP ITEMS**

### 1. **Node.js Version**
- ✅ **Current**: Node.js v20.19.5 (upgraded from v18.20.7)
- ✅ **Required**: Node.js 20.19+ or 22.12+
- ✅ **Status**: Compatible with Vite v7.1.7

### 2. **Dependencies**
- ✅ **Core**: React 19.1.1, React-DOM 19.1.1
- ✅ **Build Tool**: Vite 7.1.7
- ✅ **TypeScript**: 5.8.3
- ✅ **API**: Axios 1.12.2, Mailchimp Marketing 3.0.80
- ✅ **Type Definitions**: @types/node (for process.env support)

### 3. **Code Structure**
- ✅ **FormSubmission Interface**: Moved to separate types.ts file
- ✅ **Import Issues**: Fixed ES module imports (crypto, FormSubmission)
- ✅ **Mailchimp Integration**: Updated merge tags to match your configuration
- ✅ **Environment File**: Created .env from env.example

## 🔧 **CONFIGURATION REQUIRED**

### 4. **Environment Variables (.env file)**
You need to update the `.env` file with your actual Mailchimp credentials:

```bash
# Replace these placeholder values with your actual Mailchimp credentials:

REACT_APP_MAILCHIMP_API_KEY=your_actual_mailchimp_api_key
REACT_APP_MAILCHIMP_SERVER_PREFIX=us3  # or your server prefix
REACT_APP_MAILCHIMP_LIST_ID=your_actual_list_id
```

### 5. **Mailchimp Setup Requirements**
To get the values above, you need:

#### A. **Mailchimp API Key**
1. Log into your Mailchimp account
2. Go to Account → Extras → API keys
3. Create a new API key or use an existing one
4. Copy the API key (starts with letters/numbers)

#### B. **Server Prefix**
- Usually `us3`, `us6`, `us8`, etc.
- Found in your Mailchimp dashboard URL or API key details

#### C. **List ID**
1. Go to Audience → All contacts
2. Click on Settings → Audience name and defaults
3. Find your Audience ID (usually 10 characters)

### 6. **Mailchimp Merge Fields Configuration**
Based on your merge tag configuration, the app is set up to use:
- **First Name**: `FNAME`
- **Last Name**: `LNAME` 
- **Phone**: `PHONE`
- **Age**: `AGE`
- **Interests**: `MMERGE5`
- **Source**: `SOURCE`

## 🚀 **HOW TO RUN**

### Development Mode
```bash
# 1. Make sure you're using Node.js 20+
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"

# 2. Update .env file with your Mailchimp credentials

# 3. Start development server
npm run dev

# 4. Open http://localhost:5173/ in your browser
```

### Production Build
```bash
npm run build
npm run preview
```

## 🔍 **TESTING THE APPLICATION**

### 1. **Form Functionality**
- Fill out the form with test data
- Submit the form
- Check browser console for any errors
- Verify Mailchimp contact creation (if credentials are set)

### 2. **Development Mode**
- Currently uses `submitFormDev()` which simulates API calls
- Logs form data to console
- Returns success without actual Mailchimp integration

### 3. **Production Mode**
- Uses actual Mailchimp API when environment variables are set
- Creates/updates contacts in your Mailchimp audience
- Adds appropriate tags based on interests and source

## ⚠️ **COMMON ISSUES & SOLUTIONS**

### Issue: "FormSubmission import error"
- ✅ **Fixed**: Moved interface to separate types.ts file
- ✅ **Fixed**: Added proper type-only imports

### Issue: "Node.js version incompatible"
- ✅ **Fixed**: Upgraded to Node.js 20.19.5

### Issue: "process.env undefined"
- ✅ **Fixed**: Added @types/node dependency
- ✅ **Fixed**: Created .env file

### Issue: "crypto.hash is not a function"
- ✅ **Fixed**: Updated to proper ES module crypto import

## 📝 **NEXT STEPS**

1. **Update .env file** with your actual Mailchimp credentials
2. **Test the form** with real data
3. **Verify Mailchimp integration** by checking your audience
4. **Deploy to production** when ready

## 🛠 **TECHNICAL STACK**

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: CSS (App.css, index.css)
- **Email Marketing**: Mailchimp API
- **HTTP Client**: Axios
- **Development**: ESLint, TypeScript compiler
