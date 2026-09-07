# SPIDER-SYNC | FlytBase Autonomous Fleet Delivery Hub

A modern, minimalist Linear-grade project delivery & customer onboarding portal built with React, Vite, Tailwind CSS, and WebSockets real-time sync.

---

## ⚡ Quick Deployment Guide

### Option 1: Deploy to Vercel (Recommended - 1 Click / 30 Seconds)
1. Install Vercel CLI (or connect your GitHub repo at [vercel.com](https://vercel.com)):
   ```bash
   npm i -g vercel
   vercel
   ```
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Done! Vercel will give you a live production URL instantly (e.g., `https://spider-sync.vercel.app`).

---

### Option 2: Deploy to Netlify
1. Run Netlify deploy:
   ```bash
   npx netlify-cli deploy --prod --dir=dist
   ```
   Or drag-and-drop the `dist/` folder into [app.netlify.com/drop](https://app.netlify.com/drop).

---

### Option 3: Run Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌟 Unique Standout Features

1. **Spotlight Command Palette (`Cmd+K` / `Ctrl+K`)**:
   - Instant search across projects, milestones, tickets, view switches, and AI prompts.

2. **StarkPort Live Radar & Telemetry Simulator**:
   - Interactive 2D drone fleet radar showing real-time BVLOS coordinates, battery %, speeds, and signal latency.

3. **AI C-Suite Executive Briefing Generator**:
   - 1-click generation of stakeholder progress reports with Markdown / PDF download.

4. **Multi-Tenant Dual View**:
   - Real-time side-by-side synchronized view contrasting **Internal Ops** (private keys, margins, unedited logs) vs **Customer Portal** (sanitized deliverables, public roadmap, SOW vault).

5. **AI Unstructured Text Ingestor ("Web-Crawler")**:
   - Transforms messy Slack messages, email replies, and call logs into structured project status entries automatically.

6. **WebSockets Multi-Tab Sync Engine**:
   - Live synchronization across open browser windows with zero page reloads.

7. **5-Category Issue Taxonomy & Role-Based Auth**:
   - `Bug`, `Feature Request`, `Question`, `Support`, `Implementation`
   - Switch personas between *Peter Parker (Lead Delivery)*, *Gwen Stacy (Solutions Arch)*, *Miles Morales (Field Ops)*, and *Tony Stark (Customer VP)*.
