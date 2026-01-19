# Ambassador Program Landing Page

## 📄 Description

Landing page for the IMIGO Ambassador program. Includes:
- Hero section with program overview
- Video section (YouTube embed)
- How it works (3 steps)
- Role explanation (what you do / don't do)
- Benefits section
- FAQ section
- Registration form

## 🔗 Live URL

`https://team.imigoimmigration.com/landing/ambassador`

## 📝 Usage

This component is used in the CRM's routing system. It accepts:
- UTM parameters: `utm_source`, `utm_medium`, `utm_campaign`, `agent`
- `form_only=true` query parameter to show only the form

## 🎨 Features

- Fully responsive (mobile, tablet, desktop)
- Lazy-loaded YouTube video
- Form submission to agent requests service
- UTM parameter tracking
- Agent assignment support

## 📦 Dependencies

- React Router (`useSearchParams`)
- portefeuilleAgentService (from CRM)
- CRM styling and infrastructure

## 🚀 Deployment

This page is deployed as part of the main CRM application. For standalone deployment, use the iframe embed code from the CRM's Forms section.

