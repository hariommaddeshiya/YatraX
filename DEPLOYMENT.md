# 🚀 SafarAI Deployment Guide: GitHub ➔ Render

This guide provides step-by-step instructions to push the project to **GitHub** and deploy it live on **Render** (as a **1-Click Full-Stack Web Service** or as **2 Separate Services**).

---

## 🔑 Environment Variables Requirement (.env)

| Variable Name | Required? | Location | Description |
|---|---|---|---|
| `PORT` | ❌ *Auto-set by Render* | Server | Port for Express & Socket.IO (Defaults to 5000 locally) |
| `NODE_ENV` | ❌ *Optional* | Server | Set to `production` in Render |
| `MONGODB_URI` | ❌ *Optional* | Server | MongoDB Connection URL. **If omitted, SafarAI runs seamlessly on its built-in in-memory fallback store with zero setup required!** |
| `VITE_API_URL` | ❌ *Optional* | Client | Only needed if deploying Frontend and Backend as 2 separate URLs (e.g. Vercel + Render). For 1-Click unified Render deployment, leave blank. |

> [!TIP]
> **Zero Mandatory Third-Party API Keys Required!**  
> SafarAI utilizes **Open-Meteo API** (live real-time weather) and **OpenStreetMap Overpass API** (geospatial POIs), which are open-access and require no paid secret keys!

---

## 📦 Step 1: Push Code to GitHub

Open a terminal or command prompt inside the project folder (`d:\SIH 2026`):

```bash
# 1. Initialize git repository (if not already done)
git init

# 2. Add all files
git add .

# 3. Commit the code
git commit -m "Initial commit: SafarAI Full-Stack Eco-Tourism Platform (SIH 2026)"

# 4. Set main branch
git branch -M main

# 5. Link your remote GitHub repository
# (Replace with your actual GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 6. Push to GitHub
git push -u origin main
```

---

## 🌐 Step 2: Deploy on Render

### Option A: 1-Click Unified Full-Stack Deployment (Recommended & Easiest)
Deploy both the React frontend and Node.js Express/Socket.IO backend as a single unified Web Service on Render.

1. Go to [dashboard.render.com](https://dashboard.render.com/) and click **New +** ➔ **Web Service**.
2. Connect your GitHub repository.
3. Configure the settings:
   - **Name**: `safarai-tourism` (or your preferred name)
   - **Region**: `Singapore` / `Frankfurt` (or closest to you)
   - **Branch**: `main`
   - **Root Directory**: *(Leave empty / root)*
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
   - **Instance Type**: `Free`
4. Under **Environment Variables**, add:
   - `NODE_ENV`: `production`
   - *(Optional)* `MONGODB_URI`: `mongodb+srv://...` (if using MongoDB Atlas)
5. Click **Deploy Web Service**!
6. Render will automatically build the React Vite bundle, start the Express server, and serve the full application at `https://safarai-tourism.onrender.com`.

---

### Option B: Separate Backend (Render) + Frontend (Vercel / Render Static Site)

#### 1. Backend on Render:
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `CORS_ORIGIN`: `*`
- Copy the backend URL (e.g. `https://safarai-api.onrender.com`).

#### 2. Frontend on Vercel or Render Static Site:
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: `https://safarai-api.onrender.com` (your backend Render URL)

---

## 🧪 Post-Deployment Verification Checklist

Once deployed, visit your live URL and test:
- [x] **Homepage (`/`)**: Verify cultural hero section and destination cards load.
- [x] **Smart Planner (`/planner`)**: Click "Load SIH Judge Preset" and generate an itinerary.
- [x] **Cost Engine (`/trip`)**: Test transport mode switching and verify complete multi-category budget calculation.
- [x] **360° Heritage (`/heritage`)**: Open Taj Mahal / Varanasi 360° Three.js sphere view.
- [x] **Safety Radar (`/safety`)**: Verify interactive Leaflet map and geofence zones.
- [x] **SIH Demo Room (`/admin/demo`)**: Test the 5 one-click simulation buttons.
- [x] **Emergency SOS**: Click the top SOS button to verify distress modal.
