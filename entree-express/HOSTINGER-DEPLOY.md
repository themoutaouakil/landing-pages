# Hostinger Deployment Guide

## ⚠️ If you see "No output directory found after build"

This error usually means Hostinger can't find the build output. Follow these steps:

### Step 1: Verify Build Output

After running `npm run build`, check that the `build/` folder exists:

```bash
ls -la build/
```

You should see:
- `index.html`
- `assets/` folder with JavaScript files

### Step 2: Hostinger Configuration

In your Hostinger dashboard:

1. **Go to Deployment Settings**
2. **Set the following:**
   - **Root Directory:** `entree-express` (or leave empty if deploying from repo root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`
   - **Framework:** `Vite` or `Other`

### Step 3: Manual Override (If Automatic Detection Fails)

If Hostinger still can't find the build directory:

1. **Option A: Change Output Directory in Hostinger**
   - In Hostinger settings, manually set output directory to: `build`
   - Or try: `entree-express/build`

2. **Option B: Use Different Output Directory**
   - Edit `vite.config.js` and change `outDir: 'build'` to `outDir: 'dist'`
   - Then set Hostinger output directory to: `dist`

3. **Option C: Deploy Build Folder Manually**
   - Run `npm run build` locally
   - Upload the contents of the `build/` folder via FTP/File Manager
   - Point Hostinger document root to the uploaded folder

### Step 4: Verify Build Location

The build command creates files in:
- ✅ `build/index.html` (main entry point)
- ✅ `build/assets/` (JavaScript and CSS files)

Make sure Hostinger is looking in the correct location relative to your repository root.

### Common Issues:

1. **Wrong Root Directory:** If your repo root is `landing-pages/`, and the app is in `entree-express/`, set root directory to `entree-express`

2. **Build Not Running:** Check Hostinger build logs to ensure `npm run build` actually runs

3. **Path Issues:** The output directory path should be relative to the root directory you set

### Quick Fix Script

If you have SSH access, you can verify the build:

```bash
cd entree-express
npm install
npm run build
ls -la build/  # Should show index.html and assets/
```

If `build/` exists but Hostinger can't find it, the issue is in Hostinger's configuration, not the build process.

