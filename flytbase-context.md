# FlytBase Context Pack
*Compiled 14 Aug 2026 from flytbase.com, lifeatflytbase.com, docs.flytbase.com. Load this as project knowledge / CLAUDE.md before the hackathon starts.*

---

## 1. One-line positioning

FlytBase is an **enterprise "Physical AI" platform for drone autonomy at large sites**. It unifies drones, docks, robots, sensors and cameras into a single intelligence layer, turning site data into physical action.

Note the 2026 repositioning: they no longer sell "drone software." They sell **operational infrastructure** and **Physical AI**. Use their vocabulary.

**Old brand names you may see in older material:** FlytNow (the ops platform), "Internet of Drones." Mostly retired — use "FlytBase platform."

---

## 2. Scale numbers (memorize these — they're the credibility currency)

| Metric | Value |
|---|---|
| Deployments | 400+ globally |
| Countries | 70+ |
| Flight hours | 300k+ per month |
| Media files captured | 1.1M+ per month |
| Missions/day (global fleet) | ~4,210 |
| Platform uptime | 98–99.4% |
| Pilot ratio | 1 pilot : up to 6 docks |
| Years operating | 13+ |
| Enterprise integrations | 40+ (via "Flinks") |
| AI agents live | 10 |
| HQ | California, US · Engineering base: Pune, India |

**Outcome claims they publish:** 50% reduction in unplanned downtime · 70% cost savings vs manual inspection · 40% fewer security incidents · ROI within 12 months.

---

## 3. Product architecture — the 4-step story

They tell it as **Collect → Understand → Act → Learn**:

1. **Collect** — every device on site (drones, docks, cameras, access control, robot dogs, humanoids) feeds one unified data stream instead of siloed systems.
2. **Understand** — AI agents read signals in real time: perimeter intrusion, thermal hotspots, gas leaks, crowd density, license plates, asset defects.
3. **Act** — a finding auto-dispatches a drone to verify, and the alert routes into the customer's existing stack: Genetec, Milestone, SAP, Maximo, ESRI + 38 more.
4. **Learn** — every operator correction is saved to the exact coordinates where the miss happened; future flights apply it. Accuracy compounds per site.

### Named components
- **Platform / console** — mission planning, live telemetry, video wall, deconfliction, payload + gimbal control
- **Flinks** — the integration/connector layer (VMS, CAD, SCADA, GIS, alarm systems)
- **Flex** — purpose-built add-ons extending drone ops
- **Verkos** — the AI agent brand: live video insights, post-mission forensic search (~295ms retrieval via chat), auto-generated reports
- **Edge Kit** — hardware module that turns a docking station into a fully automated operation
- **Managed Services** — FlytBase runs the entire program end-to-end for you
- **AI-R**, **Apps**, **Drone API**, **BVLOS Assistance Program**

### AI agent suite (10 agents, hundreds of prebuilt events)
General Security (34 events) · Public Safety (30) · Mining Site Management (30) · Construction Site Monitoring (29) · Electric Utilities (26) · Maritime Ports (26) · Highway Inspection (19) · Solar Farm Management (16) · Refinery Inspection (16) · Railroad Operations (13)

**Killer differentiator:** custom detections written in plain language ("cows", "damaged mounting structure", "vehicle stopped at Gate 3 for over a minute"). No retrain, no engineering ticket. Plus a *perception check* that runs before each flight — evaluates lens, altitude, light — and tells the operator to switch lens or fly closer if conditions would hurt reliability.

---

## 4. Verticals (12)

Public Safety · Oil & Gas · Mining · Solar · Construction · Electric Utilities · Data Centers · Transportation & Highways · Maritime Ports · Security Service Providers · Railroad Operations · Corrections & Detention

---

## 5. Named customers & case studies

| Customer | Vertical | Before → After |
|---|---|---|
| **Statnett** (Norway grid) | Utilities | $2M/yr helicopter inspections, crews suspended over 420kV lines → docks at substations, LiDAR drones, BVLOS across 7km. 230 substations, 13,000 km grid |
| **Terabase** | Solar construction | 50 sites = 50+ full-time pilots, 4-day processing → 1 pilot : 6 docks, 20–30 missions/site/day, <18hr processing. 80% lower pilot cost, 80 docks |
| **National Police Authority** | Public safety | 43 isolated forces, 11-min response → CAD-triggered dispatch under 3 min. 80% faster, 350 docks |
| **Aerospace manufacturer** | Manufacturing security | 518 guards, 9 undetected critical incidents → 8 autonomous drones, all 9 incidents caught. 55% cost reduction, 180 sites |
| **F50 Oil & Gas operator** | Refinery | 96 min to get eyes on incident → airborne in 20 seconds. 250+ tanks, 13 refineries, 96% faster |
| **Port authority** | Maritime | Dark-fleet vessels undetectable → live AIS overlaid on drone visuals, spoofed AIS auto-flagged. 700 flights/mo |
| **SQM / Adentu** | Mining | 678 km² mine turned into autonomous inspection zone |

Other logos: Anglo American, CSX, Dole, Xcel Energy, Origin Energy, Pampa Energía.

---

## 6. Competitive landscape

### vs DJI FlightHub 2 (their main comparison page)
Their framing: *"FlightHub 2 manages your drones. FlytBase runs your program."* FlightHub is a drone management tool, fine at 1–2 sites in a pure DJI stack. FlytBase is infrastructure for 10+ sites, multi-vendor, multi-jurisdiction.

| Capability | FlightHub 2 | FlytBase |
|---|---|---|
| One-to-many pilot ops | Not available | Up to 1:6 |
| Vertical AI agents | Not available | 10 live |
| Solution engineering | Standard support | Dedicated SE |
| Hardware | DJI only | Multi-vendor (DJI Dock 1/2/3, Hextronics, Nokia) |
| Integrations | Limited | 40+ via Flinks |

Real switching reasons they publish: FlightHub not cost-effective at scale · VMS integration failed, RTSP worked immediately on FlytBase · insufficient enterprise support for on-prem · data residency blocked it outright · no automated alarm-triggered dispatch · reliability/payload dropouts · DJI cut free streaming minutes and broke the economics · FlightHub can show a feed but cannot act.

### vs Percepto
They have a dedicated `/percepto-alternative` page. Percepto = vertically integrated (their own drone + dock hardware). FlytBase's counter is hardware agnosticism and no lock-in.

### Others to know
Skydio (Dock + X10, big in US public safety, NDAA-compliant), Zipline (delivery, not adjacent), Nightingale, Asylon, Airobotics/Ondas, Hextronics (dock maker — partner not competitor), DroneDeploy / Pix4D / Strayos (data processing, sit downstream).

---

## 7. The five buyer objections (their own framing)

They literally publish the objection list under "Every question your IT, legal, and procurement team will ask":

1. **IT — where does our data live?** → Four modes: on-premise (air-gapped), private cloud, EU sovereign, AWS/Azure.
2. **Legal — security/regulatory?** → SOC 2 Type II, ISO 27001, GDPR, NIS 2.0 ready. Dedicated solution architect runs the compliance review.
3. **Operations — we already own DJI, do we start over?** → No. Runs DJI Dock 1/2/3 natively plus Hextronics, Nokia.
4. **Finance — pilot headcount and run cost?** → 1:6 ratio; Terabase runs 1:5 across 50+ farms.
5. **Regulatory — BVLOS approval, who helps?** → Dedicated SE experienced with SORA, LUC, nationwide BVLOS frameworks.
6. **Procurement — implementation and failure handling?** → On-call onboarding, dedicated Project Success Manager + Forward Deployment Engineer, incident RCA reports, custom SLAs.

Also the four "scale challenges" they lead with: BVLOS path · ROI framework · data-to-intelligence · IT & compliance/NDAA.

---

## 8. Go-to-market motion

- **Pricing is quote-only.** No public tiers. Their pricing page is a 7-step qualification form asking: what led you here (reduce inspection cost / safety & compliance / security monitoring / modernize asset management), industry & use case, integration complexity, fleet requirements, compliance standards. Deliverable is custom pricing + ROI analysis + integration assessment + implementation timeline. *That form is a ready-made discovery script — use its questions.*
- **Demo is the CTA everywhere.** 30 minutes, scoped to your operation.
- **Channel-heavy.** Solution providers, dock manufacturers, Flinks ecosystem partners, BVLOS advisory partners, segmented by region (Americas, APAC, Africa, Middle East, Europe).
- **Content engine:** blog, playbooks (gated PDFs), webinars, glossary, case studies, FlytBase TV, FlytBase Academy (courses), Partner Resource Center.
- **NestGen** — their flagship online summit on Physical AI, positioned as the world's largest. Major top-of-funnel motion.
- **Land-and-expand:** the whole FlightHub comparison is built around "you started at 1 site, now you have 10."

---

## 9. Company culture / what they're hiring for

From lifeatflytbase.com and aiatflytbase.com:

- AI-native from day one, not AI-retrofitted. "AI isn't a tool we reach for when we're stuck. It's the first resource we turn to."
- "We don't ask *who* can do something. We ask *how fast* an AI + a person can."
- One person is expected to execute what would otherwise need a team.
- High-agency, high-velocity.
- Their hackathon format (from the creatives edition, 8 Aug): state-of-the-art showcase → challenge revealed on the day → build all day with FlytBase team and leadership circulating → showcase. Standouts move to a hiring conversation same day.

**Implication:** they are grading *workflow*, not just artifact. Show the machine you built, not just what it produced.

---

## 10. Key links

- Platform: flytbase.com/platform · AI agents: /ai-agents · Flinks: /flinks · Flex: /flex
- Pricing qualification form: /pricing
- Comparisons: /compare/flighthub-2 · /percepto-alternative
- Case studies: /case-studies · Playbooks: /playbooks · Glossary: /glossary
- Docs: docs.flytbase.com · API: /drone-api · Releases: releases.flytbase.com
- Trust center: /trust · Data security: /data-security
- Supported hardware: /supported-hardware · Partners: /partner
- Console: console.flytbase.com · Status: flytbase.instatus.com

---

## 11. Vocabulary to use (and avoid)

**Use:** Physical AI · drone autonomy platform · large sites · operational infrastructure · sovereign by design · one-to-many operations · pilot ratio · Flinks · Verkos · BVLOS · SORA / LUC · NDAA compliance · data residency · dock · edge kit · deconfliction · perception check · site pointers

**Avoid:** "drone software," "UAV solution," "FlytNow" (retired), "we can help you leverage synergies." Their copy is blunt and specific — match it.
