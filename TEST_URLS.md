# Test URLs for TAG Application

## 🚀 **Your Application is Running At:**
**http://localhost:5173/**

## 🧪 **Test URLs with Pre-filled Data**

### **Complete Test Data URL:**
```
http://localhost:5173/?email=test@example.com&name=Juan%20Perez&phone=+34682123456&age=25&interests=teatro
```

### **Individual Test URLs:**

#### **1. Theatre Interest:**
```
http://localhost:5173/?email=maria@example.com&name=Maria%20Garcia&phone=+34682111111&age=28&interests=teatro
```

#### **2. Cinema Interest:**
```
http://localhost:5173/?email=pedro@example.com&name=Pedro%20Lopez&phone=+34682222222&age=32&interests=cine
```

#### **3. Both Theatre & Cinema:**
```
http://localhost:5173/?email=ana@example.com&name=Ana%20Martinez&phone=+34682333333&age=26&interests=teatro-cine
```

#### **4. Minimal Data (Email Only):**
```
http://localhost:5173/?email=minimal@example.com
```

#### **5. Name + Email Only:**
```
http://localhost:5173/?email=simple@example.com&name=Carlos%20Ruiz
```

## 📝 **URL Parameter Reference**

| Parameter | Description | Example Values |
|-----------|-------------|----------------|
| `email` | User's email address | `test@example.com` |
| `name` | Full name (URL encoded) | `Juan%20Perez` |
| `phone` | Phone number | `+34682123456` |
| `age` | Age as string | `25` |
| `interests` | Interest selection | `teatro`, `cine`, `teatro-cine` |

## 🔧 **How to Create Custom Test URLs**

1. **Base URL**: `http://localhost:5173/?`
2. **Add parameters**: `param=value&param2=value2`
3. **URL encode spaces**: Use `%20` for spaces in names
4. **Valid interests**: `teatro`, `cine`, `teatro-cine`

### **Example Custom URL:**
```
http://localhost:5173/?email=myemail@test.com&name=My%20Test%20Name&phone=123456789&age=30&interests=cine
```

## ✅ **What Happens When You Submit**

1. **Form Data** is sent to Mailchimp API
2. **Contact** is created/updated in your audience (`0318e55dfd`)
3. **Tags** are added based on interests and source
4. **Merge Fields** are populated with form data
5. **Success Message** is displayed

## 🎯 **Testing Checklist**

- [ ] Open a test URL
- [ ] Verify form fields are pre-filled
- [ ] Submit the form
- [ ] Check browser console for any errors
- [ ] Verify success message appears
- [ ] Check your Mailchimp audience for new contact

## 🔍 **Debug Information**

If you need to debug:
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Submit the form
4. Check for any error messages
5. Look for API response logs

## 📧 **Mailchimp Integration Details**

- **API Key**: `[Your Mailchimp API Key]`
- **Server**: `us3`
- **Audience ID**: `[Your Mailchimp List ID]`
- **Merge Fields Used**: FNAME, LNAME, PHONE, AGE, SOURCE, MMERGE5
- **Tags Added**: form_submission, interest_[type], source_email_campaign
