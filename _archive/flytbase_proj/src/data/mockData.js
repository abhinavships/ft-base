export const initialOwners = [
  {
    id: "owner-1",
    name: "Peter Parker",
    role: "Lead Drone Delivery Engineer",
    alias: "Spider-Prime",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    email: "peter.parker@spidersync.internal",
    badge: "Lead Delivery"
  },
  {
    id: "owner-2",
    name: "Gwen Stacy",
    role: "Autonomous Fleet Solutions Architect",
    alias: "Ghost-Spider",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    email: "gwen.stacy@spidersync.internal",
    badge: "Solutions Arch"
  },
  {
    id: "owner-3",
    name: "Miles Morales",
    role: "Field Flight Operations Specialist",
    alias: "Spin",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    email: "miles.morales@spidersync.internal",
    badge: "Field Ops"
  },
  {
    id: "owner-4",
    name: "Ned Leeds",
    role: "Tech Ops & Systems Integrations",
    alias: "Guy in the Chair",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    email: "ned.leeds@spidersync.internal",
    badge: "Systems"
  },
  {
    id: "owner-5",
    name: "Tony Stark",
    role: "Executive Hardware & Avionics Sponsor",
    alias: "Iron Man",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    email: "tony@starkindustries.com",
    badge: "Executive"
  }
];

export const initialProjects = [
  {
    id: "proj-1",
    name: "Stark Industries - Autonomous Drone Hangars & Sky-Corridors",
    client: "Stark Industries Aviation",
    clientLogo: "⚡",
    status: "in_progress", // open | in_progress | blocked | done
    health: "on_track",    // on_track | at_risk | blocked | completed
    progress: 68,
    startDate: "2026-07-01",
    targetDate: "2026-09-15",
    lastUpdated: "2026-08-15T09:30:00Z", // Today
    daysInactive: 0,
    owners: ["owner-1", "owner-2", "owner-5"],
    description: "Deployment of 24 FlytBase-powered automated drone-in-a-box docking stations across Stark Logistics Sector 4 with automated BVLOS battery hot-swapping.",
    customerSummary: "Phases 1 and 2 hardware installation complete. Fleet BVLOS flight corridor live telemetry testing currently underway in Queens testing grid.",
    internalNotes: "Tony requested high-speed telemetry feed directly to Jarvis. Firmware v4.2.1 patch resolved compass calibration drifts during storm test.",
    budget: "$420,000",
    milestones: [
      {
        id: "ms-1-1",
        title: "Site Survey & Sky-Corridor Airspace Clearance",
        status: "done",
        dueDate: "2026-07-15",
        customerVisible: true,
        completion: 100,
        tasks: [
          { id: "t-1-1-1", title: "FAA Part 107 BVLOS Waiver Submission", status: "done", assignee: "owner-1", customerVisible: true },
          { id: "t-1-1-2", title: "RF 5G Signal Mapping across Corridor Alpha", status: "done", assignee: "owner-4", customerVisible: true },
          { id: "t-1-1-3", title: "Internal Spectrum Interference Profiling", status: "done", assignee: "owner-2", customerVisible: false }
        ]
      },
      {
        id: "ms-1-2",
        title: "Docking Nest Hardware Deployment (12 Docks)",
        status: "done",
        dueDate: "2026-08-01",
        customerVisible: true,
        completion: 100,
        tasks: [
          { id: "t-1-2-1", title: "Install StarkPort Docking Pods 1-6", status: "done", assignee: "owner-3", customerVisible: true },
          { id: "t-1-2-2", title: "Install StarkPort Docking Pods 7-12", status: "done", assignee: "owner-3", customerVisible: true },
          { id: "t-1-2-3", title: "Emergency Manual Override Protocol Verification", status: "done", assignee: "owner-1", customerVisible: false }
        ]
      },
      {
        id: "ms-1-3",
        title: "FlytBase Cloud Fleet API & Autonomous Dispatch Integration",
        status: "in_progress",
        dueDate: "2026-08-25",
        customerVisible: true,
        completion: 70,
        tasks: [
          { id: "t-1-3-1", title: "FlytBase REST API webhook sync to Stark ERP", status: "done", assignee: "owner-4", customerVisible: true },
          { id: "t-1-3-2", title: "Real-time 4K Low Latency Video Streaming Relay", status: "in_progress", assignee: "owner-1", customerVisible: true },
          { id: "t-1-3-3", title: "Autonomous Geofence Fail-safe & Parachute Trigger", status: "in_progress", assignee: "owner-2", customerVisible: false },
          { id: "t-1-3-4", title: "Night-Vision Thermal Payload Calibration", status: "open", assignee: "owner-3", customerVisible: true }
        ]
      },
      {
        id: "ms-1-4",
        title: "Final Security Signoff & Customer Pilot Go-Live",
        status: "open",
        dueDate: "2026-09-15",
        customerVisible: true,
        completion: 0,
        tasks: [
          { id: "t-1-4-1", title: "24-Hour Continuous Automated Flight Trial", status: "open", assignee: "owner-1", customerVisible: true },
          { id: "t-1-4-2", title: "Operations Team Live Training Workshop", status: "open", assignee: "owner-2", customerVisible: true },
          { id: "t-1-4-3", title: "Executive Stakeholder Delivery Acceptance", status: "open", assignee: "owner-5", customerVisible: true }
        ]
      }
    ],
    issues: [
      {
        id: "iss-1",
        title: "Video Stream Latency spike under heavy rain simulation",
        category: "Bug", // Bug | Feature Request | Question | Support | Implementation
        priority: "High",
        status: "Investigating", // Open | Investigating | Resolved
        customerVisible: true,
        linkedMilestone: "ms-1-3",
        reportedBy: "Tony Stark",
        createdAt: "2026-08-14T11:00:00Z"
      },
      {
        id: "iss-2",
        title: "Add automated weather radar overlay to customer cockpit",
        category: "Feature Request",
        priority: "Medium",
        status: "Open",
        customerVisible: true,
        linkedMilestone: "ms-1-3",
        reportedBy: "Stark Ops",
        createdAt: "2026-08-13T16:20:00Z"
      },
      {
        id: "iss-3",
        title: "Private key rotation protocol for cloud telemetry endpoint",
        category: "Implementation",
        priority: "Medium",
        status: "Resolved",
        customerVisible: false,
        linkedMilestone: "ms-1-3",
        reportedBy: "Ned Leeds",
        createdAt: "2026-08-10T14:15:00Z"
      }
    ],
    documents: [
      {
        id: "doc-1",
        name: "Stark-FlytBase-Master-SOW-v2.pdf",
        type: "SOW",
        size: "4.2 MB",
        uploadedAt: "2026-07-02",
        customerVisible: true,
        url: "#"
      },
      {
        id: "doc-2",
        name: "FAA-Part107-BVLOS-Approval-Certificate.pdf",
        type: "FAA Clearance",
        size: "1.8 MB",
        uploadedAt: "2026-07-16",
        customerVisible: true,
        url: "#"
      },
      {
        id: "doc-3",
        name: "Telemetry-Architecture-Jarvis-Bridge.pdf",
        type: "Architecture",
        size: "8.1 MB",
        uploadedAt: "2026-08-04",
        customerVisible: true,
        url: "#"
      },
      {
        id: "doc-4",
        name: "Internal-Margin-Cost-Analysis-Q3.xlsx",
        type: "Financials",
        size: "450 KB",
        uploadedAt: "2026-08-05",
        customerVisible: false,
        url: "#"
      }
    ],
    updates: [
      {
        id: "upd-1-1",
        timestamp: "2026-08-15T09:30:00Z",
        author: "Peter Parker",
        source: "#Slack-Sync (Delivery-Stark)",
        sentiment: "positive",
        customerVisible: true,
        summary: "Weather stress tests passed with 99.4% dock docking accuracy in moderate wind conditions.",
        rawText: "Hey team, morning test run on StarkPort Pods 1-6 finished. Docking accuracy was solid at 99.4% despite 18 knot gusts. Streaming pipeline holding steady at 180ms latency.",
        tags: ["Docking", "Accuracy", "Telemetry"]
      },
      {
        id: "upd-1-2",
        timestamp: "2026-08-14T15:20:00Z",
        author: "Gwen Stacy",
        source: "#Email-Bridge (Jarvis Ops)",
        sentiment: "warning",
        customerVisible: true,
        summary: "Investigating rain video latency spikes on Corridor Alpha. Ned is applying WebRTC packet smoothing.",
        rawText: "Jarvis team noted a 400ms latency spike during artificial rain testing on Corridor Alpha. Logged as Bug ISS-1. Ned is tweaking the dynamic bitrate threshold in FlytBase Cloud.",
        tags: ["Latency", "Video", "Corridor Alpha"]
      },
      {
        id: "upd-1-3",
        timestamp: "2026-08-12T10:00:00Z",
        author: "Ned Leeds",
        source: "#Internal-Dev",
        sentiment: "positive",
        customerVisible: false,
        summary: "Private key rotation completed without downtime for Stark telemetry gateway.",
        rawText: "Private key rotation complete. Tested with 10k synthetic heartbeats, 0 dropped packets. Internal security signoff achieved.",
        tags: ["Security", "Telemetry"]
      }
    ]
  },
  {
    id: "proj-2",
    name: "Oscorp Bio-Logistics - Automated Cold-Chain Delivery Ring",
    client: "Oscorp Industries",
    clientLogo: "🧪",
    status: "blocked",
    health: "blocked",
    progress: 42,
    startDate: "2026-06-15",
    targetDate: "2026-08-30",
    lastUpdated: "2026-08-09T14:00:00Z", // 6 days ago -> Triggers Spider-Sense Stale Alert!
    daysInactive: 6,
    owners: ["owner-1", "owner-3"],
    description: "Ultra-fast thermal payload drone delivery connecting 8 Oscorp research labs across Manhattan with temperature monitoring sensors and fail-safe return-to-base.",
    customerSummary: "Docking pod integration completed. Flight route certification stalled awaiting Manhattan municipal sky-corridor permit clearance.",
    internalNotes: "Dr. Osborn's team has not responded to 3 consecutive emails regarding their building roof load clearance certification. Spider-Sense alert active.",
    budget: "$310,000",
    milestones: [
      {
        id: "ms-2-1",
        title: "Cold-Chain Thermal Payload Hardware Testing",
        status: "done",
        dueDate: "2026-07-05",
        customerVisible: true,
        completion: 100,
        tasks: [
          { id: "t-2-1-1", title: "Liquid Nitrogen Vaccine Carrier Pod Integration", status: "done", assignee: "owner-3", customerVisible: true },
          { id: "t-2-1-2", title: "Real-time Temperature Sensor Telemetry Feed", status: "done", assignee: "owner-1", customerVisible: true }
        ]
      },
      {
        id: "ms-2-2",
        title: "Manhattan Air Corridor & Rooftop Landing Zone Permits",
        status: "blocked",
        dueDate: "2026-08-10",
        customerVisible: true,
        completion: 40,
        tasks: [
          { id: "t-2-2-1", title: "Oscorp Tower 3 Helipad Dock Structural Signoff", status: "blocked", assignee: "owner-3", customerVisible: true },
          { id: "t-2-2-2", title: "NYC Air Traffic Clearance Protocol Submission", status: "blocked", assignee: "owner-1", customerVisible: true },
          { id: "t-2-2-3", title: "Legal Escalation: Unresponsive Oscorp Facility Liaison", status: "blocked", assignee: "owner-1", customerVisible: false }
        ]
      },
      {
        id: "ms-2-3",
        title: "FlytBase Autonomous Fleet Routing & Bio-Safety Controls",
        status: "open",
        dueDate: "2026-08-25",
        customerVisible: true,
        completion: 10,
        tasks: [
          { id: "t-2-3-1", title: "Emergency Bio-Containment Parachute Ejection", status: "open", assignee: "owner-3", customerVisible: true },
          { id: "t-2-3-2", title: "Fleet Dispatch UI Customization for Oscorp ChemOps", status: "open", assignee: "owner-1", customerVisible: true }
        ]
      }
    ],
    issues: [
      {
        id: "iss-4",
        title: "Rooftop structural vibration exceeds FAA safe docking thresholds",
        category: "Bug",
        priority: "High",
        status: "Open",
        customerVisible: true,
        linkedMilestone: "ms-2-2",
        reportedBy: "Miles Morales",
        createdAt: "2026-08-08T09:00:00Z"
      },
      {
        id: "iss-5",
        title: "Need custom sensor alerts when pod temp exceeds -20°C",
        category: "Feature Request",
        priority: "Medium",
        status: "Open",
        customerVisible: true,
        linkedMilestone: "ms-2-1",
        reportedBy: "Oscorp Lab Ops",
        createdAt: "2026-08-07T14:00:00Z"
      },
      {
        id: "iss-6",
        title: "Liaison contact changed without notification",
        category: "Support",
        priority: "High",
        status: "Open",
        customerVisible: false,
        linkedMilestone: "ms-2-2",
        reportedBy: "Peter Parker",
        createdAt: "2026-08-09T14:00:00Z"
      }
    ],
    documents: [
      {
        id: "doc-5",
        name: "Oscorp-ColdChain-Delivery-Spec.pdf",
        type: "Architecture",
        size: "3.5 MB",
        uploadedAt: "2026-06-20",
        customerVisible: true,
        url: "#"
      },
      {
        id: "doc-6",
        name: "Rooftop-Structural-Vibration-Survey.pdf",
        type: "Survey",
        size: "5.8 MB",
        uploadedAt: "2026-08-08",
        customerVisible: true,
        url: "#"
      }
    ],
    updates: [
      {
        id: "upd-2-1",
        timestamp: "2026-08-09T14:00:00Z",
        author: "Peter Parker",
        source: "#Email-Bridge (Oscorp Facilities)",
        sentiment: "blocker",
        customerVisible: true,
        summary: "Project blocked pending rooftop vibration dampening certification from Oscorp Tower engineering.",
        rawText: "Received inspection report. Oscorp Tower 3 roof vibration exceeds 1.4G tolerance. Docking stations cannot safely clamp until dampener plates are installed. Project halted.",
        tags: ["Blocker", "Vibration", "Safety"]
      }
    ]
  },
  {
    id: "proj-3",
    name: "Daily Bugle - Real-Time Aerial Newsfeed & Drone Fleet Onboarding",
    client: "Daily Bugle Media Corp",
    clientLogo: "📰",
    status: "in_progress",
    health: "at_risk",
    progress: 54,
    startDate: "2026-07-10",
    targetDate: "2026-09-01",
    lastUpdated: "2026-08-14T18:45:00Z",
    daysInactive: 1,
    owners: ["owner-1", "owner-4"],
    description: "Onboarding 8 high-mobility 8K optical zoom camera drones managed via FlytBase Cloud for rapid deployment breaking news journalism across 5 boroughs.",
    customerSummary: "Hardware delivered and initial flight controller integration completed. Working on 8K live low-latency stream compression and zoom stabilization.",
    internalNotes: "J. Jonah Jameson insists on catching high-altitude Spider-Man sightings. Peter secretly added optical filter that blurs web-shooters automatically.",
    budget: "$180,000",
    milestones: [
      {
        id: "ms-3-1",
        title: "Newsroom Fleet Controller Hardware Provisioning",
        status: "done",
        dueDate: "2026-07-28",
        customerVisible: true,
        completion: 100,
        tasks: [
          { id: "t-3-1-1", title: "Provision 8 DJI Matrice 350 RTK drones", status: "done", assignee: "owner-4", customerVisible: true },
          { id: "t-3-1-2", title: "Install FlytBase Edge Onboard SBC compute", status: "done", assignee: "owner-1", customerVisible: true }
        ]
      },
      {
        id: "ms-3-2",
        title: "8K Live Video Broadcast & Newsroom CMS Ingestion",
        status: "in_progress",
        dueDate: "2026-08-20",
        customerVisible: true,
        completion: 60,
        tasks: [
          { id: "t-3-2-1", title: "SRT Protocol Video Stream to Bugle Broadcast Center", status: "in_progress", assignee: "owner-4", customerVisible: true },
          { id: "t-3-2-2", title: "GPS EXIF Metadata watermark sync for photo rights", status: "in_progress", assignee: "owner-1", customerVisible: true },
          { id: "t-3-2-3", title: "Secret Blur Algorithm for Spider-Suit Signatures", status: "done", assignee: "owner-1", customerVisible: false }
        ]
      },
      {
        id: "ms-3-3",
        title: "Automated Dispatch on Emergency Police Band Signals",
        status: "open",
        dueDate: "2026-09-01",
        customerVisible: true,
        completion: 0,
        tasks: [
          { id: "t-3-3-1", title: "Police scanner audio trigger to auto-dispatch nearest drone", status: "open", assignee: "owner-4", customerVisible: true },
          { id: "t-3-3-2", title: "Pilot in Command Fail-Safe Control Transfer", status: "open", assignee: "owner-1", customerVisible: true }
        ]
      }
    ],
    issues: [
      {
        id: "iss-7",
        title: "Can we support simultaneous multi-camera angle switching during live stream?",
        category: "Question",
        priority: "Medium",
        status: "Open",
        customerVisible: true,
        linkedMilestone: "ms-3-2",
        reportedBy: "J. Jonah Jameson",
        createdAt: "2026-08-14T12:00:00Z"
      },
      {
        id: "iss-8",
        title: "Bugle field reporters need simpler tablet dispatch app UI",
        category: "Support",
        priority: "Low",
        status: "Investigating",
        customerVisible: true,
        linkedMilestone: "ms-3-1",
        reportedBy: "Robbie Robertson",
        createdAt: "2026-08-13T10:00:00Z"
      }
    ],
    documents: [
      {
        id: "doc-7",
        name: "DailyBugle-Fleet-Delivery-Contract.pdf",
        type: "SOW",
        size: "2.1 MB",
        uploadedAt: "2026-07-12",
        customerVisible: true,
        url: "#"
      },
      {
        id: "doc-8",
        name: "8K-Stream-Encoding-Benchmark-Report.pdf",
        type: "Architecture",
        size: "4.7 MB",
        uploadedAt: "2026-08-10",
        customerVisible: true,
        url: "#"
      }
    ],
    updates: [
      {
        id: "upd-3-1",
        timestamp: "2026-08-14T18:45:00Z",
        author: "Ned Leeds",
        source: "#Slack-Sync (Bugle-Delivery)",
        sentiment: "positive",
        customerVisible: true,
        summary: "SRT video bridge tested with 4 simultaneous drone video feeds to Bugle broadcast desk with 0.8s glass-to-glass delay.",
        rawText: "Broadcast test successful! Streamed 4 streams simultaneously from Times Square directly into Bugle master control switchboard. JJJ was impressed.",
        tags: ["Streaming", "SRT", "Video"]
      }
    ]
  },
  {
    id: "proj-4",
    name: "Wakanda Air Logistics - Vibranium-Shielded Drone Docking Hubs",
    client: "Wakanda Design Group & Logistics",
    clientLogo: "🐾",
    status: "done",
    health: "completed",
    progress: 100,
    startDate: "2026-05-01",
    targetDate: "2026-08-01",
    lastUpdated: "2026-08-02T11:00:00Z",
    daysInactive: 13,
    owners: ["owner-2"],
    description: "Full production deployment of 40 autonomous heavy-lift cargo drones powered by FlytBase Cloud Fleet OS with mag-lev ultra-quiet propulsion in Birnin Zana.",
    customerSummary: "All 40 docking stations installed, certified, and successfully transitioned into 24/7 full autonomous operational readiness.",
    internalNotes: "Flawless rollout. Shuri shared advanced battery telemetry algorithms that we can incorporate into standard FlytBase edge firmwares.",
    budget: "$950,000",
    milestones: [
      {
        id: "ms-4-1",
        title: "Phase 1: Docking Infrastructure & Mag-Lev Charging Grid",
        status: "done",
        dueDate: "2026-06-01",
        customerVisible: true,
        completion: 100,
        tasks: [
          { id: "t-4-1-1", title: "Deploy 40 Vibranium-Weave Weather Docks", status: "done", assignee: "owner-2", customerVisible: true },
          { id: "t-4-1-2", title: "Wireless Induction Fast-Charging Benchmark", status: "done", assignee: "owner-2", customerVisible: true }
        ]
      },
      {
        id: "ms-4-2",
        title: "Phase 2: FlytBase Cloud Mission Planning & Automated Dispatch",
        status: "done",
        dueDate: "2026-07-15",
        customerVisible: true,
        completion: 100,
        tasks: [
          { id: "t-4-2-1", title: "Custom Autonomous Routing across Great Mound Corridor", status: "done", assignee: "owner-2", customerVisible: true },
          { id: "t-4-2-2", title: "Quantum Telemetry Encryption Protocol Hook", status: "done", assignee: "owner-2", customerVisible: false }
        ]
      },
      {
        id: "ms-4-3",
        title: "Phase 3: Operational Handover & SLA Signoff",
        status: "done",
        dueDate: "2026-08-01",
        customerVisible: true,
        completion: 100,
        tasks: [
          { id: "t-4-3-1", title: "Full System Operational Handover to Royal Air Fleet", status: "done", assignee: "owner-2", customerVisible: true },
          { id: "t-4-3-2", title: "Post-Implementation Delivery Review & Success Certificate", status: "done", assignee: "owner-2", customerVisible: true }
        ]
      }
    ],
    issues: [
      {
        id: "iss-9",
        title: "All acceptance criteria verified and approved",
        category: "Implementation",
        priority: "Low",
        status: "Resolved",
        customerVisible: true,
        linkedMilestone: "ms-4-3",
        reportedBy: "Shuri",
        createdAt: "2026-07-30T10:00:00Z"
      }
    ],
    documents: [
      {
        id: "doc-9",
        name: "Wakanda-FlytBase-Final-Signoff-Certificate.pdf",
        type: "FAA Clearance",
        size: "1.2 MB",
        uploadedAt: "2026-08-01",
        customerVisible: true,
        url: "#"
      },
      {
        id: "doc-10",
        name: "MagLev-Docking-Hub-Specifications.pdf",
        type: "Architecture",
        size: "12.4 MB",
        uploadedAt: "2026-06-15",
        customerVisible: true,
        url: "#"
      }
    ],
    updates: [
      {
        id: "upd-4-1",
        timestamp: "2026-08-01T15:00:00Z",
        author: "Gwen Stacy",
        source: "#Email-Bridge (Royal Fleet Command)",
        sentiment: "positive",
        customerVisible: true,
        summary: "Project completed! 40 autonomous hubs live. Zero defects logged during 100-hour endurance test.",
        rawText: "Official sign-off received from Princess Shuri. System achieved 100% mission completion rate over 1,420 flight sorties in pilot phase.",
        tags: ["Complete", "Signoff", "Milestone"]
      }
    ]
  },
  {
    id: "proj-5",
    name: "Brooklyn Visions STEM - Autonomous Campus Lab Delivery Drones",
    client: "Brooklyn Visions Academy",
    clientLogo: "🎓",
    status: "open",
    health: "on_track",
    progress: 18,
    startDate: "2026-08-01",
    targetDate: "2026-10-15",
    lastUpdated: "2026-08-15T08:00:00Z",
    daysInactive: 0,
    owners: ["owner-3", "owner-1"],
    description: "Student STEM campus drone courier system transporting robotics components and science equipment between dorms, science labs, and workshop buildings.",
    customerSummary: "Kickoff completed. Safety geofencing boundaries mapped around campus buildings and quad trees.",
    internalNotes: "Miles is mentoring the student drone racing club on using FlytBase Python SDK for custom flight waypoint behaviors.",
    budget: "$65,000",
    milestones: [
      {
        id: "ms-5-1",
        title: "Campus Geofence Airspace Mapping & Safety Protocols",
        status: "in_progress",
        dueDate: "2026-08-28",
        customerVisible: true,
        completion: 60,
        tasks: [
          { id: "t-5-1-1", title: "3D LiDAR Scan of Campus Tree Canopies & Walkways", status: "done", assignee: "owner-3", customerVisible: true },
          { id: "t-5-1-2", title: "Pedestrian Collision Avoidance Sensor Test", status: "in_progress", assignee: "owner-1", customerVisible: true },
          { id: "t-5-1-3", title: "Campus Admin Safety Signoff Meeting", status: "open", assignee: "owner-3", customerVisible: true }
        ]
      },
      {
        id: "ms-5-2",
        title: "Student Mobile App Dispatch Portal Integration",
        status: "open",
        dueDate: "2026-09-20",
        customerVisible: true,
        completion: 0,
        tasks: [
          { id: "t-5-2-1", title: "QR Code Package Pickup Scanner at Lockers", status: "open", assignee: "owner-3", customerVisible: true },
          { id: "t-5-2-2", title: "Student ID Card NFC Authenticator", status: "open", assignee: "owner-1", customerVisible: true }
        ]
      }
    ],
    issues: [
      {
        id: "iss-10",
        title: "Need permission to mount RTK GPS base station on library clocktower",
        category: "Question",
        priority: "Medium",
        status: "Open",
        customerVisible: true,
        linkedMilestone: "ms-5-1",
        reportedBy: "Miles Morales",
        createdAt: "2026-08-14T14:30:00Z"
      }
    ],
    documents: [
      {
        id: "doc-11",
        name: "BrooklynVisions-Campus-Delivery-Charter.pdf",
        type: "SOW",
        size: "1.9 MB",
        uploadedAt: "2026-08-02",
        customerVisible: true,
        url: "#"
      }
    ],
    updates: [
      {
        id: "upd-5-1",
        timestamp: "2026-08-15T08:00:00Z",
        author: "Miles Morales",
        source: "#Slack-Sync (STEM-Robotics)",
        sentiment: "positive",
        customerVisible: true,
        summary: "3D LiDAR mapping of the main quad completed. Zero signal blindspots detected in dorm alleys.",
        rawText: "Finished the LiDAR flight over Brooklyn Visions campus. Data mapped into FlytBase Cloud. Quad trees are accounted for with 4-meter safety buffers.",
        tags: ["LiDAR", "Geofence", "Mapping"]
      }
    ]
  }
];

export const sampleUnstructuredUpdates = [
  {
    title: "Slack from Peter (Oscorp Blocker Resolution)",
    targetProjectId: "proj-2",
    rawText: "Hey Gwen & Miles, quick update on Oscorp! Just got off a call with Dr. Osborn's chief engineer. They agreed to install the vibration dampener plates on Tower 3 helipad this Thursday! Also the NYC Air Traffic team approved Corridor Beta. Let's move the milestone 'Manhattan Air Corridor & Rooftop Landing Zone Permits' to in_progress and resolve Issue ISS-4."
  },
  {
    title: "Email from Stark Aviation Liaison (Video Latency Fix)",
    targetProjectId: "proj-1",
    rawText: "To: Delivery Team <delivery@spidersync.internal>\nFrom: Friday (Stark AI) <friday@starkindustries.com>\nSubject: Corridor Alpha Telemetry Test - All Clear!\n\nPeter / Tony,\nRain simulation test round 3 is completed. The new WebRTC dynamic compression algorithm maintained latency at 120ms throughout the storm simulation. Issue ISS-1 is officially resolved! Ready to commence 24-hour flight trial."
  },
  {
    title: "Meeting Notes: Daily Bugle Police Dispatch Scanner",
    targetProjectId: "proj-3",
    rawText: "Daily Bugle Sync Call (Ned & JJJ):\n- JJJ wants emergency police scanner dispatch active by Friday.\n- Hardware on Matrice 350 drones is working smoothly.\n- Blocked on API token from NYPD open data portal. Raised support ticket for NYPD developer liaison."
  },
  {
    title: "Urgent Slack Alert: Severe Weather Sensor Drift on Stark Fleet",
    targetProjectId: "proj-1",
    rawText: "CRITICAL: Sensor drift detected on StarkPort Pods 9-11 during high-humidity night cycle. Milestone 'FlytBase Cloud Fleet API' is temporarily blocked until sensor firmware patch v4.3 is pushed. Flagged as Bug priority High."
  }
];
