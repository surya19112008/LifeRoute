# LifeRoute — Emergency Organ Donor & Transit Coordination

> **LifeRoute** is a mission-critical, citizen-focused mobile application designed for instant emergency organ donor verification, digital donor identification, and real-time organ transit green corridor telemetry coordination.

---

## Key Features

- **Digital Donor ID Card**: Instant clinical overview displaying donor blood group with Rh factor, legal anatomical gift declaration under NOTTO/THOTA directives, and designated emergency next-of-kin contacts.
- **Paramedic Optical QR Scanner**: High-contrast, optical QR code designed for instant offline scanning by first responders, emergency medical technicians (EMTs), and hospital trauma units.
- **Offline-First Disaster-Ready Vault**: Built on native browser IndexedDB with automatic fallback and state integrity checksums—operational even with zero network connectivity or cellular tower outages.
- **Live Transit Hub & Green Corridors**: Real-time vehicle convoy tracking, cold-chain perfusion box telemetry (temperature, battery, speed, ETA to operating room), and green corridor traffic dispatch.
- **LifeRoute AI Assistant**: Grounded emergency protocol assistant powered by the Gemini API for medical directives, organ preservation windows, and legal next-of-kin consensus guidelines.

---

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 8
- **Styling**: Tailwind CSS 4
- **Animations & Motion**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Storage**: Native IndexedDB (`LifeRoute_EmergencyDB`) + localStorage mirror
- **Mapping & Telemetry**: Google Maps Platform JavaScript SDK (`@vis.gl/react-google-maps`)

---

## Getting Started Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ or 20+ recommended)
- `npm` or `pnpm` or `bun`

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Copy the example environment configuration:

```bash
cp .env.example .env
```

Open `.env` and configure your API keys if using external features:

```env
# Optional: Required only if using live Gemini AI assistant features
GEMINI_API_KEY="your-gemini-api-key"

# Optional: Required for interactive Google Maps rendering (graceful SVG fallback included)
VITE_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### 4. Build for Production

```bash
npm run build
```

The production-optimized static files will be placed in the `dist/` directory.

---

## Deployment Guide

### Deploying to Vercel (Recommended)

Vercel is pre-configured via the included [`vercel.json`](./vercel.json).

1. Push your project to GitHub.
2. Sign in to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Vercel automatically detects **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. (Optional) Add your Environment Variables (`GEMINI_API_KEY`, `VITE_GOOGLE_MAPS_API_KEY`) under **Environment Variables**.
6. Click **"Deploy"**. Your app is live with SSL in seconds!

---

### Deploying to Render

Render is pre-configured via the included [`render.yaml`](./render.yaml).

#### Option A: 1-Click Blueprint (Using render.yaml)
1. Push your repository to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com/) -> **New** -> **Blueprint**.
3. Connect your repository. Render will automatically read `render.yaml` and set up the static service.

#### Option B: Manual Static Site
1. Go to [Render Dashboard](https://dashboard.render.com/) -> **New** -> **Static Site**.
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Name**: `liferoute-emergency-card`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Redirects/Rewrites**:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
5. Click **"Create Static Site"**.
