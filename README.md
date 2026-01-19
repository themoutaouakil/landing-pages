# IMIGO Landing Pages Repository

This repository contains all landing pages used by IMIGO Immigration CRM. Each landing page is a standalone, deployable React application.

## 📁 Structure

- `entree-express/` - Main landing page for Express Entry program (✅ Deployable)
- `ambassador/` - Ambassador program landing page (📝 Coming soon)

## 🚀 Deployment on Hostinger

### ⚠️ Important: Root Directory Configuration

**If Hostinger shows "No output directory found after build":**

Hostinger needs to know:
1. **Root Directory:** `entree-express` (the folder containing package.json)
2. **Output Directory:** `build` (relative to root directory)

### Configuration Steps:

1. **In Hostinger Dashboard:**
   - Go to **Deployment Settings**
   - Set **Root Directory** to: `entree-express`
   - Set **Output Directory** to: `build`
   - Set **Build Command** to: `npm run build`
   - Set **Install Command** to: `npm install`
   - Set **Framework** to: `Vite` or `Other`

2. **Alternative: Use Build Script**
   - Set **Build Command** to: `bash build.sh`
   - This script handles directory navigation automatically

### Manual Deployment (If Automatic Fails):

1. **Build locally:**
   ```bash
   cd entree-express
   npm install
   npm run build
   ```

2. **Upload to Hostinger:**
   - Upload the contents of `entree-express/build/` folder
   - Make sure `index.html` is in the root of your hosting directory

## 📝 Notes

- Each landing page is a standalone React application using Vite
- Forms are embedded via iframe from the CRM (`https://team.imigoimmigration.com/form/...`)
- All UTM parameters (utm_source, utm_medium, utm_campaign, agent) are automatically captured and passed to the form
- No backend required - these are static React applications

## 🔗 Related

- Main CRM Repository: `https://github.com/themoutaouakil/imigo`
- CRM Landing Pages Feature: `/landing-pages` route in CRM
- Live CRM: `https://team.imigoimmigration.com`

## 🛠️ Development

Each landing page can be developed independently:

```bash
cd entree-express
npm install
npm run dev  # Start development server
npm run build  # Build for production
```

## ⚠️ Troubleshooting

See `entree-express/HOSTINGER-DEPLOY.md` for detailed troubleshooting steps.

## 🔧 Build Script

A `build.sh` script is provided at the repository root for Hostinger compatibility. It:
- Navigates to the correct directory
- Installs dependencies
- Builds the application
- Verifies the build output
