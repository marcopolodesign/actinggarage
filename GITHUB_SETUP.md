# 🐙 GitHub Repository Setup

## 📋 **Steps to Upload to GitHub:**

### **1. Create Repository on GitHub.com**
1. Go to [github.com](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. **Repository name**: `tag-form` (or your preferred name)
4. **Description**: "TAG Acting Garage Form with Mailchimp Integration"
5. **Make it Public** (or Private if you prefer)
6. **Don't initialize** with README, .gitignore, or license (we already have these)
7. Click "Create repository"

### **2. Get Your Repository URL**
After creating, GitHub will show you a URL like:
```
https://github.com/YOUR_USERNAME/tag-form.git
```

### **3. Push Your Code**
Run these commands (replace `YOUR_USERNAME` with your actual GitHub username):

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/tag-form.git

# Push your code to GitHub
git push -u origin main
```

### **4. Connect to Vercel (Optional)**
Once your code is on GitHub:
1. Go to your Vercel dashboard
2. Click on your project
3. Go to "Settings" → "Git"
4. Connect your GitHub repository
5. Enable automatic deployments

## 🎯 **Benefits of GitHub Integration:**

- **Version Control**: Track all your code changes
- **Collaboration**: Share with team members
- **Auto-Deployments**: Vercel can auto-deploy on every push
- **Backup**: Your code is safely stored in the cloud
- **Issues & Pull Requests**: Track bugs and feature requests

## 📁 **Repository Contents:**

Your repository will include:
- ✅ React frontend (src/)
- ✅ Backend API server (server.cjs)
- ✅ Vercel configuration (vercel.json)
- ✅ Environment setup (DEPLOYMENT.md, SETUP_REQUIREMENTS.md)
- ✅ Test URLs and documentation
- ✅ Package configuration (package.json)

## 🔄 **Future Updates:**

Once connected:
```bash
# Make changes to your code
git add .
git commit -m "Description of changes"
git push origin main

# Vercel will automatically deploy the changes!
```

## 🆘 **Need Help?**

If you run into issues:
1. Make sure you're logged into GitHub
2. Check that the repository name doesn't already exist
3. Verify you have push permissions to the repository
4. Contact me if you need assistance with the commands
