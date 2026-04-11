# Travel Guide System

This repository contains **three services**:

1. `client` → React + Vite frontend
2. `server` → Node.js + Express + MongoDB API (feedback, login, itineraries)
3. `API` → Flask + ML API (recommendations, budget split)

## How the system works

- Frontend calls Node API for:
  - `/feedback`
  - `/login`
  - `/itinerary`, `/itineraries/:userId`
- Frontend calls Flask API for:
  - `/recomend/:city/:liked`
  - `/budget/:budget/:days`
- Firebase Auth is used in frontend for registration/login state.

## Prerequisites

- Node.js 18+
- Python 3.10+ (recommended)
- MongoDB Atlas connection string

## 1) Local setup

### A. Server (Node API)

```bash
cd server
npm install
copy .env.example .env
```

Update `server/.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Run:

```bash
npm start
```

### B. Python API (Flask + ML)

```bash
cd API
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Run:

```bash
python main.py
```

Default Flask port is `5001`.

### C. Frontend (React)

```bash
cd client
npm install
copy .env.example .env
```

Update `client/.env` if needed:

```env
VITE_NODE_API_URL=http://localhost:5000
VITE_ML_API_URL=http://localhost:5001
```

Run:

```bash
npm run dev
```

Open the URL shown by Vite (usually `http://localhost:5173`).

---

## 2) Publish frontend on Vercel

Yes, you can publish this project on Vercel.

### Recommended architecture

- Deploy `client` on Vercel.
- Deploy `server` and `API` on Render/Railway/Fly.io (or any backend host).
- Point frontend env vars to those public backend URLs.

### Steps

1. Push code to GitHub.
2. In Vercel, create a new project and set **Root Directory** to `client`.
3. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add environment variables in Vercel project settings:
   - `VITE_NODE_API_URL=https://your-node-api-domain`
   - `VITE_ML_API_URL=https://your-flask-api-domain`
5. Deploy.

`client/vercel.json` is included for SPA route rewrites.

## Important note about hosting everything on Vercel

- Frontend on Vercel: ✅ easy and recommended.
- Current Node + Flask services on Vercel: ⚠️ not recommended without refactor to serverless functions and startup/runtime optimization.

## Quick health checks

- Node API: `http://localhost:5000/` should respond.
- Flask API:
  - `http://localhost:5001/budget/1000/3`
  - `http://localhost:5001/recomend/Dhaka/Hill`

If both work and frontend `.env` is correct, the app should run end-to-end.
