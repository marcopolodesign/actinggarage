# TAG - The Acting Garage Form

A React + Vite application for collecting user interests and form submissions, integrated with Mailchimp.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your Mailchimp credentials in `.env.local`:
   ```
   REACT_APP_MAILCHIMP_API_KEY=your_api_key_here
   REACT_APP_MAILCHIMP_SERVER_PREFIX=us3
   REACT_APP_MAILCHIMP_LIST_ID=your_list_id_here
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## 📧 Mailchimp Integration Setup

### 1. Create Custom Fields in Mailchimp

Go to **Audience → Settings → Audience fields and *|MERGE|* tags** and add these custom fields:

- **Age** (Text) → Merge tag: `MMERGE3`
- **Comments** (Text) → Merge tag: `MMERGE4` 
- **Interests** (Text) → Merge tag: `MMERGE5`
- **Source** (Text) → Merge tag: `MMERGE6`

### 2. Create Tags in Mailchimp

Go to **Audience → Manage contacts → Tags** and create these tags:

- `form_submission`
- `interest_teatro`
- `interest_cine` 
- `interest_teatro_cine`
- `source_email_campaign`

### 3. Set up Automation (Optional)

Create an automation workflow in Mailchimp:

1. **Trigger:** Tag added (`form_submission`)
2. **Action:** Send welcome email or add to specific segment
3. **Condition:** Based on interest tags

## 🔗 URL Parameters

The form accepts these URL parameters:

- `email` - User's email address (from Mailchimp)
- `name` - User's first name (from Mailchimp)
- `source` - Campaign source (e.g., `email_campaign`)
- `utm_source` - UTM tracking
- `utm_medium` - UTM tracking  
- `utm_campaign` - UTM tracking

## 📱 Mobile Responsive

The form automatically adapts to mobile devices:
- **Desktop:** Two-column layout (form left, branding right)
- **Mobile:** Single column (form on top, branding below)

## 🎨 Design Features

- **Anton font** with 500 weight and -0.5px letter-spacing
- **Golden yellow** (#f4b03e) and **dark** (#1a1a1a) color scheme
- **Form validation** and error handling
- **Success page** after submission
- **Interest selection** (Teatro, Cine, Teatro & Cine)

## 🚀 Deployment

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Deploy to your hosting service** (Vercel, Netlify, etc.)

3. **Update email template** with your domain:
   - Replace `tagplaceholder.com` with your actual domain
   - Test the links in Mailchimp

## 📊 Data Flow

1. **User clicks email link** → Redirects to form with parameters
2. **Form pre-fills** with name from URL parameters
3. **User submits form** → Data sent to Mailchimp API
4. **Mailchimp updates** contact with new tags and merge fields
5. **Success page** shown to user

## 🔧 API Integration

The form integrates with Mailchimp to:
- **Update existing contacts** with new information
- **Add tags** based on interests selected
- **Track source** of the form submission
- **Store custom fields** (age, comments, interests)

## 📝 Environment Variables

```bash
# Required
REACT_APP_MAILCHIMP_API_KEY=your_api_key
REACT_APP_MAILCHIMP_SERVER_PREFIX=us3
REACT_APP_MAILCHIMP_LIST_ID=your_list_id

# Optional
REACT_APP_API_URL=https://your-domain.com/api
```

## 🎯 Next Steps

1. **Test the form** with sample data
2. **Set up Mailchimp automation** for new submissions
3. **Deploy to production** and update email template
4. **Monitor form submissions** in Mailchimp dashboard