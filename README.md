# 🏛️ AI Government Assistant – Intelligent Citizen Service Platform

> **Powered by Google Gemini AI · RAG Architecture · Firebase · React + Vite**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://vercel.com)
[![Firebase](https://img.shields.io/badge/Database-Firebase%20Firestore-orange?style=flat&logo=firebase)](https://firebase.google.com)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%20RAG-blue?style=flat&logo=google)](https://ai.google.dev)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61dafb?style=flat&logo=react)](https://react.dev)

---

## 🌐 Live Demo

**Frontend:** [https://ai-government-assistant.vercel.app](https://ai-government-assistant.vercel.app)

---

## 🚀 What is GovAssist AI?

GovAssist AI is a production-ready, full-stack AI platform built to help every Indian citizen discover, verify, and apply for government schemes — without misinformation or hallucinations.

### Core Architecture

```
User Query ➔ Intent Detection ➔ Entity Recognition
          ➔ Search Firestore ➔ Search MyScheme API ➔ Search data.gov.in
          ➔ Merge + Rank Results ➔ Gemini Generation ➔ Cited Response
```

> ⚠️ **The AI NEVER answers from LLM memory.** Every answer is grounded in verified government data fetched at runtime via strict function-calling RAG.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **Verified AI Chatbot** | Google Gemini RAG pipeline with function-calling. Zero hallucination. |
| 🏛️ **2,000+ Schemes** | Live-synced from myScheme.gov.in & data.gov.in |
| 📄 **OCR Document Vault** | Upload Aadhaar, Income Certificate; auto-validates & generates checklist |
| 📍 **GIS Center Locator** | Find nearest CSC, Aadhaar Seva Kendra, MeeSeva, RTO, Passport office |
| 📊 **Application Tracker** | Real-time status: Submitted → Verified → Under Review → Approved |
| ✅ **Eligibility Checker** | AI-powered instant eligibility scoring per scheme |
| 🔔 **Smart Notifications** | Policy alert feed synced with government portals |
| 🛡️ **Admin Control Panel** | Scheme management, sync monitoring, user telemetry |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite 5**
- **Tailwind CSS 3** (dark cover slate design system)
- **React Router v6** (client-side routing)
- **TanStack React Query** (server state management)
- **Zustand** (client state)
- **Framer Motion** (animations)
- **Firebase SDK 10** (auth + Firestore client)

### Backend
- **Node.js 18** + **Express 4**
- **Google Gemini AI** (`@google/generative-ai` with function-calling)
- **Firebase Admin SDK 12** (Firestore, Storage, Auth)
- **Pinecone** (vector similarity search for RAG)
- **Winston** (structured logging)
- **Helmet + Rate Limiter** (security hardening)

---

## 📁 Project Structure

```
GovernmentAgent/
├── api/                   # Vercel serverless entry point
│   └── index.js
├── frontend/              # React + Vite SPA
│   ├── src/
│   │   ├── pages/         # Landing, Dashboard, Schemes, Chat, OCR, Profile
│   │   ├── components/    # SchemeCard, ChatMessage, Modals, GIS
│   │   ├── layouts/       # MainLayout, AdminLayout, AuthLayout
│   │   ├── store/         # Zustand auth + chat stores
│   │   └── styles/        # Tailwind index.css design tokens
│   └── vite.config.js
├── backend/               # Express REST API
│   └── src/
│       ├── controllers/   # ai, schemes, auth, ocr, gis, applications
│       ├── services/      # ai.service, scheme.service, ocr.service, gis.service
│       ├── repositories/  # scheme.repository (Firestore + MyScheme + data.gov.in)
│       ├── routes/        # /api/v1 route definitions
│       └── middleware/    # auth, rate-limit, error handler
├── vercel.json            # Vercel deployment config
└── package.json           # Root dependencies (for Vercel serverless)
```

---

## 🏃 Local Development

### Prerequisites
- Node.js 18+
- npm 9+
- Firebase project (Firestore enabled)
- Google Gemini API key

### 1. Clone

```bash
git clone https://github.com/venkateshwarreddy25/AI-Research-Engine.git
cd AI-Research-Engine
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in your keys in .env
npm install
npm run dev
# Runs on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 🌐 Vercel Deployment

The project is configured for **zero-config Vercel deployment**:

1. Push to GitHub (this repo)
2. Import project in [Vercel Dashboard](https://vercel.com/new)
3. Set **Root Directory** to `/` (monorepo root)
4. Add **Environment Variables** in Vercel Dashboard:

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Firebase Admin SDK email |
| `FIREBASE_PRIVATE_KEY` | Firebase Admin SDK private key |
| `JWT_ACCESS_SECRET` | JWT signing secret (min 32 chars) |
| `JWT_REFRESH_SECRET` | JWT refresh secret (min 32 chars) |
| `NODE_ENV` | `production` |
| `ALLOWED_ORIGINS` | Your Vercel deployment URL |

---

## 📱 Responsive Design

Fully responsive across all devices:
- 📱 Mobile (320px – 480px)
- 📲 Tablet (481px – 1024px)
- 💻 Laptop (1025px – 1440px)
- 🖥️ Desktop (1441px – 2560px)
- 📺 Ultra-wide (2561px+)

---

## 🔒 Security

- JWT authentication with refresh token rotation
- HTTP-only cookies
- Helmet security headers
- CORS strict origin control
- Rate limiting per IP
- Input sanitization (XSS + NoSQL injection prevention)

---

## 📜 License

MIT License — © 2026 GovAssist AI · Built for citizens of India.
