# Entrée Express Landing Page

## 📄 Description

Full-featured landing page for the Express Entry immigration program. Includes:
- Hero section with program overview
- Benefits section
- Process steps (6 steps)
- Services section
- Embedded form for prospect evaluation

## 🔗 Live URL

`https://team.imigoimmigration.com/landing/entree-express`

## 📝 Usage

This component is used in the CRM's routing system. It accepts:
- `formId` parameter (defaults to 'entree-express')
- UTM parameters: `utm_source`, `utm_medium`, `utm_campaign`, `agent`

## 🎨 Features

- Fully responsive (mobile, tablet, desktop)
- Embedded form (PublicForm component)
- UTM parameter tracking
- Agent assignment support

## 📦 Dependencies

- React Router (`useParams`, `useSearchParams`)
- PublicForm component (from CRM)
- CRM styling and infrastructure

## 🚀 Deployment

This page is deployed as part of the main CRM application. For standalone deployment, use the iframe embed code from the CRM's Forms section.

