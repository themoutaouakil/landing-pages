# IMIGO Landing Pages Repository

This repository contains all landing pages used by IMIGO Immigration CRM. Each landing page is a standalone, deployable React application.

## 📁 Structure

- `entree-express/` - Main landing page for Express Entry program (✅ Deployable)
- `ambassador/` - Ambassador program landing page (📝 Coming soon)

## 🚀 Deployment on Hostinger

### For Entrée Express Landing Page:

1. **Navigate to the landing page directory:**
   ```bash
   cd entree-express
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Upload to Hostinger:**
   - Upload the contents of the `dist/` folder to your Hostinger hosting
   - Make sure `index.html` is in the root directory of your hosting
   - Set the document root to the folder containing `index.html`

5. **Configure Hostinger:**
   - Enable static file serving
   - Set up your domain/subdomain to point to the uploaded files

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

## ⚠️ Important

- The landing pages embed forms from the CRM via iframe
- The CRM must be accessible at `https://team.imigoimmigration.com` for forms to work
- UTM parameters are automatically passed from the landing page URL to the form iframe
