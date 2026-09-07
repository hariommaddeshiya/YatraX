# 🚀 YatraX Deployment Guide

This guide details how **YatraX** is built and deployed as a unified full-stack application (React 18 + Vite + Three.js + Node.js Express + Socket.IO).

---

## 🏗️ Architecture & Deployment Model

YatraX is architected as a **1-Service Unified Full-Stack App**:
- **Frontend**: Vite React SPA (`/client/dist`) pre-compiled with PWA service workers and Three.js 360 photosphere support.
- **Backend**: Express.js HTTP & Socket.IO server (`/server/index.js`) serving both the REST APIs (`/api/*`) and static client production assets with SPA fallback routing (`/*`).
- **Database**: Zero mandatory database configuration required. Automatic fallback in-memory state engine if `MONGODB_URI` is not supplied.

---

## ⚡ 1. Render Deployment (Recommended - Automatic Blueprint)

YatraX includes a native [`render.yaml`](./render.yaml) blueprint file for 1-click zero-config deployment.

1. Go to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** ➔ **Blueprint** (or **Web Service**).
3. Connect repository: `https://github.com/hariommaddeshiya/YatraX`.
4. Render automatically reads `render.yaml`:
   - **Runtime**: `Node`
   - **Branch**: `main`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
5. Optional Environment Variable:
   - `MONGODB_URI`: *(Optional: MongoDB Atlas connection string)*
6. Click **Apply** / **Deploy**.
   Your live application will be available at `https://yatrax.onrender.com`.

---

## ⚡ 2. Local Production Server Run

To run and verify the production build on your local machine:

```bash
# 1. Build client bundle
npm run build-client

# 2. Start unified server
npm start
```
The full application (frontend + backend + WebSockets) will be live at:
👉 `http://localhost:5000`

---

## 🌐 3. Alternative: Separate Frontend (Vercel) + Backend (Render / Railway)

If you prefer hosting frontend and backend on separate platforms:

### Backend (Render / Railway):
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- Note your API URL (e.g. `https://yatrax-api.onrender.com`).

### Frontend (Vercel):
- **Root Directory**: `client`
- **Framework**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variable**: `VITE_API_URL` = `https://yatrax-api.onrender.com`

---

## 🧪 Post-Deployment Verification

Verify the following key routes once deployed:
- ✅ **Home**: `/`
- ✅ **360° Heritage Sanctuaries**: `/heritage`
- ✅ **Multi-Modal Planner**: `/planner`
- ✅ **Dynamic Budget & Route**: `/trip`
- ✅ **Tourist Safety Radar**: `/safety`
- ✅ **Health Check**: `/api/health`
