# Entrée Express Landing Page

## 📄 Description

Standalone landing page for the Express Entry immigration program. This is a deployable React application that can be hosted on Hostinger or any static hosting service.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 📦 Deployment on Hostinger

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload to Hostinger:**
   - Upload the contents of the `dist/` folder to your Hostinger hosting
   - Make sure `index.html` is in the root directory

3. **Configure Hostinger:**
   - Set the document root to the folder containing `index.html`
   - Enable static file serving

## 🔗 Form Integration

The form is embedded via iframe from the CRM:
- **Form URL:** `https://team.imigoimmigration.com/form/entree-express`
- **UTM Parameters:** Automatically passed from the landing page URL to the iframe

## 📝 Features

- Fully responsive (mobile, tablet, desktop)
- Embedded form via iframe (from CRM)
- UTM parameter tracking
- Agent assignment support
- SEO optimized

## 🎨 Customization

Edit `LandingPageWithForm.jsx` to customize:
- Content sections
- Colors and styling
- Form iframe URL
- Footer information

## 📦 Dependencies

- React 18.2.0
- React Router DOM 6.20.0
- Vite 5.0.8

## ⚠️ Notes

- The form is embedded from the CRM, so it requires the CRM to be accessible
- UTM parameters are automatically passed to the form iframe
- All styling is inline for easy customization
