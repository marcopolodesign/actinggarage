# 🚀 Vercel Deployment Guide

## 📋 **Prerequisites**

1. **GitHub Account** (free)
2. **Vercel Account** (free)
3. **Your project code** pushed to GitHub

## 🔧 **Step 1: Push to GitHub**

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit with TAG form and Mailchimp integration"

# Create repository on GitHub (go to github.com and create new repo)
# Then add remote and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## 🌐 **Step 2: Deploy to Vercel**

### **Option A: Deploy via Vercel Dashboard (Recommended)**

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign in with GitHub**
3. **Click "New Project"**
4. **Import your GitHub repository**
5. **Configure the project:**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### **Option B: Deploy via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (choose your account)
# - Link to existing project? No
# - Project name? tag-form (or your preferred name)
# - In which directory is your code? ./
```

## 🔐 **Step 3: Set Environment Variables**

In your Vercel dashboard:

1. **Go to your project**
2. **Click "Settings" tab**
3. **Click "Environment Variables"**
4. **Add these variables:**

```
MAILCHIMP_API_KEY = your_mailchimp_api_key_here
MAILCHIMP_SERVER = us3
MAILCHIMP_LIST_ID = your_list_id_here
```

5. **Click "Save"**
6. **Redeploy your project** (click "Deployments" → "Redeploy")

## 🎯 **Step 4: Test Your Live Site**

After deployment, you'll get a URL like:
```
https://your-project-name.vercel.app
```

### **Test URLs:**

```
https://your-project-name.vercel.app/?email=test@example.com&name=Test%20User&phone=123456789&age=25&interests=teatro
```

## 📁 **Project Structure for Vercel**

```
/Users/mataldao/Local/TAG/
├── src/                    # React frontend
├── server.cjs             # Backend API
├── vercel.json            # Vercel configuration
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
└── dist/                  # Built frontend (auto-generated)
```

## 🔄 **Automatic Deployments**

- **Every push to main branch** = automatic deployment
- **Pull requests** = preview deployments
- **Custom domains** can be added in Vercel dashboard

## 🐛 **Troubleshooting**

### **If deployment fails:**

1. **Check build logs** in Vercel dashboard
2. **Ensure all dependencies** are in `package.json`
3. **Verify environment variables** are set
4. **Check `vercel.json`** configuration

### **If form doesn't work:**

1. **Check environment variables** in Vercel
2. **Verify API routes** are working: `https://your-site.vercel.app/api/health`
3. **Check browser console** for errors
4. **Test Mailchimp API** directly

## 📊 **Performance Features**

Vercel provides:
- **Global CDN** (fast loading worldwide)
- **Automatic HTTPS**
- **Serverless functions** for your API
- **Preview deployments** for testing
- **Analytics** (optional)

## 💰 **Costs**

- **Hobby Plan**: Free (perfect for this project)
- **Includes**: Unlimited personal projects, 100GB bandwidth
- **Limits**: 100 serverless function executions per day

## 🎉 **You're Live!**

Once deployed, you'll have:
- ✅ **Live form** at your Vercel URL
- ✅ **Working Mailchimp integration**
- ✅ **Automatic deployments** on code changes
- ✅ **Professional HTTPS URL**
- ✅ **Global CDN** for fast loading

## 📞 **Support**

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Community**: https://github.com/vercel/vercel/discussions
- **Status Page**: https://vercel-status.com
