# Lokesh Varma Konduru — Portfolio Website
## Complete Technical Design Plan for Claude Code

---

## IMPORTANT: READ THIS FIRST

This file is the single source of truth for building this portfolio.
Every decision — design, tech, content, components — is already made here.
Do NOT deviate from this plan without good reason.
Do NOT use placeholder content — all real content is provided in this file.
Build section by section in the order specified.
Ask before making any design decisions not covered here.

---

## 1. PROJECT OVERVIEW

**What we are building:**
A personal SDE portfolio website for Lokesh Varma Konduru — a Software Engineer with
3+ years of experience in full-stack development, cloud-native systems, and GenAI.

**Goal:**
Get Lokesh hired as a Software Development Engineer (SDE) at top tech companies.
Target roles: Full-Stack SDE, Backend SDE, Software Engineer — NOT ML Engineer.

**Target audience:**
- Recruiters at tech companies (they scan for 8 seconds)
- Hiring managers and tech leads (they look for depth and real production work)
- Fellow engineers (they appreciate code quality and smart design choices)

**Key differentiators Lokesh has over other candidates:**
- Production-grade GenAI/RAG pipelines (not just tutorial-level AI work)
- Real government client work (MCCS — 3 semester capstone with real deliverables)
- 4.0 GPA M.S. at Virginia Tech with published research
- Balanced full-stack — not a specialist, covers Frontend + Backend + DB + Cloud + AI
- Built systems at scale (25,000+ users, 10K+ transactions)

**What this portfolio must communicate:**
Lokesh builds real production systems. He is not a student doing tutorials.
He ships full-stack platforms with AI integration, cloud infrastructure, and measurable impact.

---

## 2. GITHUB REPOSITORY

```
https://github.com/LokeshVarma-Konduru/lokesh-portfolio
```

Work locally first. No Vercel deployment yet — we deploy after everything is built and tested.

---

## 3. TECH STACK — FINAL DECISIONS

```
Framework:        Next.js 14 (App Router) + TypeScript
Styling:          Tailwind CSS v4
Base UI:          shadcn/ui (already initialized with Nova preset)
Animation:        Framer Motion (already installed)
Component libs:   Aceternity UI + Magic UI (copy-paste, free components only)
Theme:            next-themes (dark default, light toggle available)
Icons:            Lucide React (already installed)
Command Palette:  cmdk (already installed)
Fonts:            Plus Jakarta Sans (headings) + Inter (body) — via next/font/google
AI Chat Widget:   Anthropic API (claude-sonnet-4-6) with RAG on resume data
Deployment:       Vercel (later)
```

**Already installed via npm:**
- framer-motion
- next-themes
- lucide-react
- cmdk
- shadcn/ui (Nova preset)

---

## 4. COLOR SYSTEM — STRICT, DO NOT ADD MORE COLORS

One accent color only. No gradients with multiple colors. No rainbow skill badges.
Professional = restraint.

```css
/* DARK MODE (default) */
--background:     #0A0A0A    /* near-black, not pure black */
--surface:        #111111    /* cards, section backgrounds */
--surface-hover:  #161616    /* card hover state */
--border:         #1F1F1F    /* subtle dividers, card borders */
--text-primary:   #FAFAFA    /* main text */
--text-muted:     #71717A    /* secondary text, dates, labels */
--accent:         #3B82F6    /* electric blue — use SPARINGLY */
--accent-hover:   #2563EB    /* accent on hover */
--accent-glow:    rgba(59,130,246,0.15)  /* glow behind accent elements */

/* LIGHT MODE */
--background:     #FAFAFA
--surface:        #FFFFFF
--surface-hover:  #F4F4F5
--border:         #E4E4E7
--text-primary:   #09090B
--text-muted:     #71717A
--accent:         #3B82F6
--accent-hover:   #2563EB
--accent-glow:    rgba(59,130,246,0.10)
```

**Accent color usage rules:**
- Hover states on links and buttons
- Active navigation item
- Skill badge borders (NOT filled — just border)
- The beam/spotlight effect in hero
- One primary CTA button
- Timeline line color
- NOWHERE else

---

## 5. TYPOGRAPHY

```
Heading font:  Plus Jakarta Sans — weights 600, 700, 800
Body font:     Inter — weights 400, 500
```

**Type scale:**
```
Hero name:         text-5xl md:text-7xl font-800  (Plus Jakarta Sans)
Section headings:  text-3xl md:text-4xl font-700  (Plus Jakarta Sans)
Card titles:       text-xl font-600               (Plus Jakarta Sans)
Body text:         text-base font-400             (Inter)
Muted/labels:      text-sm font-400               (Inter, text-muted color)
Badges:            text-xs font-500               (Inter)
```

**Font setup in layout.tsx:**
```typescript
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800']
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600']
})
```

---

## 6. SECTIONS — COMPLETE LIST AND ORDER

```
1. Navbar
2. Hero
3. About
4. Skills
5. Projects (called "Featured Work" in heading)
6. Experience
7. Contact
8. Footer
9. AI Chat Widget (floating, always visible)
10. Command Palette (Cmd+K, always available)
```

---

## 7. SECTION-BY-SECTION SPECIFICATIONS

---

### SECTION 1: NAVBAR

**Behavior:**
- Sticky top, starts transparent
- On scroll > 50px: adds backdrop-blur + border-bottom
- Smooth transition on scroll

**Layout:**
```
[ Lokesh ]                    [ About  Skills  Projects  Experience  Contact ]  [ Theme Toggle ]
```

**Mobile:**
- Hamburger icon (lucide Menu)
- Opens shadcn Sheet from right
- All nav links inside sheet
- Closes on link click

**Components:**
- Custom built with Tailwind
- shadcn Sheet for mobile
- next-themes ThemeToggle button (Sun/Moon icon from Lucide)

**Active link:** accent color, no underline

---

### SECTION 2: HERO

**Layout:** Full viewport height (min-h-screen), centered content

**Background:**
- Use Aceternity UI "Background Beams" component
- Dark beams on dark background — subtle, professional
- In light mode: hide beams, use plain background

**Content (center-aligned):**
```
[ Small label: "Software Engineer" in muted text ]

[ LOKESH VARMA KONDURU ]        ← huge, bold, Plus Jakarta Sans 800
                                ← Magic UI Blur Fade entrance animation

[ Full-Stack Engineer · AI Systems Builder · Node.js + React ]
                                ← Magic UI Word Rotate cycling through:
                                   "Full-Stack Engineer"
                                   "AI Systems Builder"
                                   "Node.js + React Developer"
                                   "Cloud & Backend Engineer"

[ One line: "Building production-grade systems at Virginia Tech and beyond." ]

[ Buttons row: ]
[ View My Work ↓ ]  [ GitHub ↑ ]  [ Resume PDF ↑ ]
  ↑ Magic UI          ↑ shadcn      ↑ shadcn
  Shimmer Button       outline       outline
```

**Scroll indicator:**
- Small animated chevron-down at bottom center
- Bounces gently with Framer Motion

**Entry animation:**
- Everything uses Magic UI Blur Fade
- Staggered: label → name → rotating text → description → buttons
- Delay between each: 0.1s

---

### SECTION 3: ABOUT

**Layout:** Two columns on desktop, stacked on mobile

**Left column (60%):**
```
[ Section label: "About" ]
[ Heading: "I build systems that ship." ]
[ 3-4 sentences about Lokesh ]
[ Link to LinkedIn ]
```

**Right column (40%):**
4 stat cards in a 2x2 grid:
```
[ 3+         ] [ 4.0/4.0  ]
[ Years Exp  ] [ VT GPA   ]

[ 25,000+    ] [ 4        ]
[ Users Served][ Production]
               [ Systems   ]
```

**Numbers:** Magic UI Number Ticker (count up on viewport entry)
**Card style:** surface background, border, slight border-radius
**Section entry:** Magic UI Blur Fade

**About text content:**
```
Software Engineer with 3+ years building full-stack platforms, 
cloud-native microservices, and production-grade AI systems. 
Currently completing my M.S. in Computer Science at Virginia Tech 
with a 4.0 GPA, where I also work as a Software Engineer building 
real tools for real users.

I work across the entire stack — React/TypeScript frontends, 
Node.js/Express backends, AWS infrastructure, and GenAI pipelines 
with RAG and LangChain. I care about systems that scale, code that 
is maintainable, and products that actually ship.

Looking for full-time SDE roles where I can contribute across the stack.
```

---

### SECTION 4: SKILLS

**Layout:** Bento Grid (asymmetric tiles)
**Component:** Aceternity UI Bento Grid

**Grid layout (desktop):**
```
[ Frontend — LARGE TILE        ] [ AI & GenAI — LARGE TILE      ]
[ Backend — MEDIUM TILE  ] [ Cloud & DevOps — MEDIUM TILE ] [ DB ]
```

**Each tile contains:**
- Tile title (e.g., "Frontend")
- Relevant Lucide icon
- Skill badges (shadcn Badge, outline variant, accent border)

**Tile content:**

Frontend tile:
```
Icon: Monitor
Skills: React.js, Next.js, TypeScript, JavaScript, Redux Toolkit,
        React Query, Tailwind CSS, HTML5, CSS3, Framer Motion
```

Backend tile:
```
Icon: Server
Skills: Node.js, Express.js, Python, FastAPI, Flask,
        Java, Spring Boot, Socket.io, REST APIs, GraphQL
```

AI & GenAI tile:
```
Icon: Brain (or Sparkles)
Skills: LangChain, LangGraph, RAG Pipelines, FAISS,
        OpenAI Embeddings, Prompt Engineering, AI Agents,
        MCP Tool Calling, GPT-4o, Claude, Gemini
```

Cloud & DevOps tile:
```
Icon: Cloud
Skills: AWS EC2, Amazon S3, SageMaker, Kubernetes,
        Docker, Kafka, GitHub Actions, Terraform,
        CI/CD Pipelines, OpenTelemetry, CloudWatch
```

Databases tile:
```
Icon: Database
Skills: PostgreSQL, MongoDB, MySQL, Redis, Firebase
```

**Important:** Skills shown here = skills Lokesh wants to work on.
Do NOT list every skill from resume. These are the ones selected.
No ML-only skills (no PyTorch, TensorFlow, scikit-learn).

---

### SECTION 5: PROJECTS (heading: "Featured Work")

**Layout:** 3 project cards, stacked vertically (not a grid)
Each card is wide, magazine-style — not a small square card.

**Component:** Aceternity UI Card Hover Effect
**Featured card:** MCCS gets Aceternity Moving Border

**Card layout (each):**
```
[ Project number: 01 ]
[ Project Title — large ]
[ One-line description ]
[ Tech stack badges (max 6 visible) ]
[ Key metrics — bold ]
[ GitHub link ]  [ Live link if available ]
```

**Projects in order:**

---

**PROJECT 01 — MCCS Fraud Detection Platform** ← FEATURED (Moving Border)
```
Title:       AI-Powered Fraud Detection Platform
Client:      Marine Corps Community Services (MCCS)
Period:      Sept 2024 – Dec 2025
Type:        Capstone Project + Contract (3 semesters, team of 5, real government client)
Description: Production fraud detection system processing 10K+ transactions with
             AI-powered investigation assistant using RAG pipelines.

Tech badges: React · Node.js · Kafka · AWS SageMaker · LangChain · MongoDB

Metrics:
  - 10,000+ transactions processed across microservices
  - 30% reduction in manual fraud review time
  - Real-time event streaming via Kafka
  - GenAI agent with RAG, semantic chunking, MCP tool calling

GitHub: [link to be added by Lokesh]
Note:   This was a real government client project, 3 full semesters,
        team of 5 engineers + professor mentor.
```

---

**PROJECT 02 — VT Agri-Tech Platform**
```
Title:       Agri-Tech Analytics & Advisory Platform
Client:      Virginia Tech (Research)
Period:      Sept 2024 – May 2026
Description: Full-stack geospatial analytics platform with GenAI advisory assistant,
             5+ analytics tools, and production AWS deployment.

Tech badges: React · Node.js · AWS · GPT-4o · LangChain · Google Earth Engine

Metrics:
  - 5+ analytics tools consolidated into one platform
  - 40% improvement in processing efficiency
  - 20% improvement in issue resolution
  - Production RAG pipeline with hybrid vector retrieval

Links: VT project URL + publication URL (Lokesh to add these)
```

---

**PROJECT 03 — Bookstore AI E-Commerce**
```
Title:       AI-Powered Bookstore E-Commerce Platform
Period:      Feb 2025 – May 2025
Association: Virginia Tech
Description: Full-stack bookstore platform with GenAI RAG recommendation assistant
             for semantic book search and personalized recommendations.

Tech badges: React · Spring Boot · MySQL · LangChain · FAISS · Claude

Metrics:
  - Semantic search + personalized recommendations via RAG
  - JWT/OAuth2 authentication
  - Redis caching for performance
  - Hybrid retrieval with OpenAI embeddings + semantic chunking

GitHub: https://github.com/LokeshVarma-Konduru (Lokesh to add specific repo link)
```

---

### SECTION 6: EXPERIENCE

**Component:** Aceternity UI Timeline
**Layout:** Vertical timeline with connecting line

**4 entries in order (newest first):**

---

**Entry 1: Virginia Tech**
```
Role:      Software Engineer
Period:    Sept 2024 – May 2026
Location:  Virginia, USA

Bullets (2-3 max, punchy):
• Architected full-stack agri-tech platform: React/TypeScript + Node.js/Express +
  PostgreSQL, deployed on AWS EC2 with Docker/Kubernetes and GitHub Actions CI/CD.
• Built production GenAI advisory assistant with GPT-4o, LangChain, FAISS vector DB,
  RAG pipelines, semantic chunking, and MCP tool calling.
• Developed geospatial application with Python/FastAPI + Google Earth Engine REST APIs,
  improving processing efficiency by 40%.
```

---

**Entry 2: Marine Corps Community Services (MCCS)**
```
Role:      Software Engineer (Contract)
Period:    Sept 2024 – Dec 2025
Location:  Remote

Note shown on card: "3-semester capstone · Team of 5 · Real government client"

Bullets:
• Architected AI-powered fraud detection platform: React + Node.js/Express +
  MongoDB + Redis, handling 10K+ transactions across microservices.
• Built GenAI fraud investigation assistant using Gemini, LangChain, LangGraph,
  FAISS, RAG pipelines, and MCP tool calling — reducing manual review time by 30%.
• Orchestrated microservices on AWS EC2 with Kafka event streaming, SageMaker
  ML inference, CloudWatch observability, and OpenTelemetry distributed tracing.
```

---

**Entry 3: DuoDecimal Tech LLP**
```
Role:      Software Engineer
Period:    July 2023 – July 2024
Location:  India

Bullets:
• Built conference booking and food ordering platform: React + Node.js/Express +
  Socket.io real-time + Redis + Kafka — improving booking efficiency by 30%,
  reducing response latency by 50%.
• Developed hostel and guest management system with RFID integration for 25,000+
  users, reducing manual paperwork by 60%.
• Deployed full-stack microservices on AWS EC2 behind ALB load balancer with
  API Gateway and automated GitHub Actions CI/CD pipelines.
```

---

**Entry 4: MindGraph Technologies**
```
Role:      Software Engineer Intern
Period:    Jan 2023 – June 2023
Location:  India

Bullets:
• Built client-facing dashboards with Python/Flask + Plotly Dash for Telecom and
  CPG clients, deployed on Azure with Azure DevOps CI/CD — improving data visibility by 40%.
• Designed distributed data pipelines processing 10M+ airline records using
  PySpark, Spark SQL, Kafka, and Apache Airflow with automated PyTest testing.
```

---

### SECTION 7: CONTACT

**Layout:** Centered, minimal

**Content:**
```
[ Section label: "Contact" ]
[ Heading: "Let's Build Something." ]
[ Subtext: "Open to full-time SDE roles. Graduating May 2026." ]

[ lokeshvarmak@vt.edu ]   ← Magic UI Shimmer Button or Moving Border button
                              clicking copies email or opens mailto

[ Icon links row: ]
[ LinkedIn icon ]  [ GitHub icon ]  [ Resume PDF download ]
  lucide             lucide           lucide Download icon

```

**No contact form** — keeps it clean and low friction.

---

### SECTION 8: FOOTER

```
[ Built by Lokesh Varma Konduru · 2026 ]
[ shadcn Separator above ]
[ Centered, muted text, small ]
```

---

### SECTION 9: AI CHAT WIDGET (Floating, always visible)

**Trigger:** Floating button, bottom-right corner
```
[ 💬 Ask about Lokesh ]   ← button label
```

**On click:** Slide-up chat panel (400px wide, 500px tall on desktop)

**Panel structure:**
```
[ Header: "Ask about Lokesh" + X close button ]
[ Suggested questions (shown before first message): ]
  • "What's Lokesh's backend experience?"
  • "Has he worked with AWS or cloud infra?"
  • "What projects has he shipped?"
  • "What's his experience with AI/GenAI?"
[ Chat message area ]
[ Input + Send button ]
```

**API setup:**
- Route: `/api/chat/route.ts`
- Model: `claude-sonnet-4-6`
- System prompt includes full resume text as context
- RAG approach: resume content injected into system prompt
- Streaming responses for better UX

**System prompt for AI widget:**
```
You are a helpful assistant answering questions about Lokesh Varma Konduru,
a Software Engineer with 3+ years of experience. Answer questions based ONLY
on the information provided below. Be concise, professional, and factual.
If asked something not in the data, say you don't have that information.

--- LOKESH'S INFORMATION ---
[Full resume content injected here at runtime from lib/rag-context.ts]
```

**Styling:**
- Surface background, border, border-radius
- Accent colored send button
- User messages: accent bubble right-aligned
- Assistant messages: surface bubble left-aligned
- Typing indicator while waiting for response

---

### SECTION 10: COMMAND PALETTE (Cmd+K)

**Library:** cmdk (already installed)
**Trigger:** Cmd+K (Mac) or Ctrl+K (Windows)
**Style:** shadcn-style modal, centered, dark overlay

**Commands available:**
```
Navigation:
  → Go to About
  → Go to Skills
  → Go to Projects
  → Go to Experience
  → Go to Contact

Links:
  → Open GitHub
  → Open LinkedIn
  → Download Resume

Actions:
  → Toggle theme (dark/light)
  → Open AI Chat
```

---

## 8. COMPONENT INSTALLATION COMMANDS

When building each section, install Aceternity/Magic UI components
by copying their source code directly (they are copy-paste libraries).

**Aceternity UI components needed:**
- Background Beams → Hero background
- Bento Grid → Skills section
- Card Hover Effect → Project cards
- Moving Border → MCCS featured project card
- Timeline → Experience section

**Magic UI components needed:**
- Blur Fade → Section entry animations throughout
- Word Rotate → Hero tagline
- Number Ticker → About section stats
- Shimmer Button → Hero primary CTA

**Get them from:**
- Aceternity: https://ui.aceternity.com/components
- Magic UI: https://magicui.design/docs/components

Copy the component code directly into `/components/ui/` folder.
Do not use npm install for these — they are copy-paste.

---

## 9. FILE STRUCTURE

```
lokesh-portfolio/
├── app/
│   ├── layout.tsx              ← fonts, ThemeProvider, metadata, global styles
│   ├── page.tsx                ← assembles all sections
│   ├── globals.css             ← CSS variables, base styles
│   └── api/
│       └── chat/
│           └── route.ts        ← Anthropic API endpoint for AI widget
│
├── components/
│   ├── ui/                     ← shadcn + Aceternity + Magic UI components
│   │   ├── button.tsx          ← already exists (shadcn)
│   │   ├── sheet.tsx           ← mobile nav
│   │   ├── badge.tsx           ← skill badges
│   │   ├── separator.tsx       ← footer
│   │   ├── background-beams.tsx    ← Aceternity
│   │   ├── bento-grid.tsx          ← Aceternity
│   │   ├── card-hover-effect.tsx   ← Aceternity
│   │   ├── moving-border.tsx       ← Aceternity
│   │   ├── timeline.tsx            ← Aceternity
│   │   ├── blur-fade.tsx           ← Magic UI
│   │   ├── word-rotate.tsx         ← Magic UI
│   │   ├── number-ticker.tsx       ← Magic UI
│   │   └── shimmer-button.tsx      ← Magic UI
│   │
│   ├── sections/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   ├── Experience.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   │
│   ├── ai-widget/
│   │   ├── ChatWidget.tsx      ← floating button + chat panel
│   │   └── ChatMessage.tsx     ← individual message bubble
│   │
│   └── command-palette/
│       └── CommandPalette.tsx  ← Cmd+K palette
│
├── lib/
│   ├── utils.ts                ← already exists (shadcn cn utility)
│   ├── data.ts                 ← ALL content in one place (see section 10)
│   └── rag-context.ts          ← resume text for AI widget system prompt
│
├── PLAN.md                     ← this file
└── package.json
```

---

## 10. DATA FILE — lib/data.ts

ALL content lives here. Components import from here.
Never hardcode content inside components.

```typescript
export const personal = {
  name: "Lokesh Varma Konduru",
  role: "Software Engineer",
  email: "lokeshvarmak@vt.edu",
  phone: "+1 571-244-4062",
  linkedin: "https://linkedin.com/in/lokeshvarmakonduru",
  github: "https://github.com/LokeshVarma-Konduru",
  resumeUrl: "/resume.pdf",   // place V1 resume PDF in /public/resume.pdf
  location: "Virginia, USA",
  seeking: "Full-time SDE roles · Graduating May 2026",
  taglines: [
    "Full-Stack Engineer",
    "AI Systems Builder",
    "Node.js + React Developer",
    "Cloud & Backend Engineer"
  ],
  about: `Software Engineer with 3+ years building full-stack platforms, 
cloud-native microservices, and production-grade AI systems. Currently 
completing my M.S. in Computer Science at Virginia Tech with a 4.0 GPA.

I work across the entire stack — React/TypeScript frontends, Node.js/Express 
backends, AWS infrastructure, and GenAI pipelines with RAG and LangChain. 
I care about systems that scale, code that is maintainable, and products that 
actually ship.

Open to full-time SDE roles starting May 2026.`
}

export const stats = [
  { value: 3, suffix: "+", label: "Years Experience" },
  { value: 4.0, suffix: "/4.0", label: "Virginia Tech GPA" },
  { value: 25000, suffix: "+", label: "Users Served" },
  { value: 4, suffix: "", label: "Production Systems" }
]

export const skills = {
  frontend: ["React.js", "Next.js", "TypeScript", "JavaScript", "Redux Toolkit",
             "React Query", "Tailwind CSS", "HTML5", "CSS3"],
  backend: ["Node.js", "Express.js", "Python", "FastAPI", "Flask",
            "Java", "Spring Boot", "Socket.io", "REST APIs"],
  ai: ["LangChain", "LangGraph", "RAG Pipelines", "FAISS",
       "OpenAI Embeddings", "Prompt Engineering", "AI Agents",
       "MCP Tool Calling", "GPT-4o", "Claude", "Gemini"],
  cloud: ["AWS EC2", "Amazon S3", "SageMaker", "Kubernetes",
          "Docker", "Kafka", "GitHub Actions", "Terraform",
          "CI/CD", "OpenTelemetry", "CloudWatch"],
  databases: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Firebase"]
}

export const projects = [
  {
    id: "01",
    title: "AI-Powered Fraud Detection Platform",
    client: "Marine Corps Community Services (MCCS)",
    period: "Sept 2024 – Dec 2025",
    description: "Production fraud detection system processing 10K+ transactions with GenAI investigation assistant using RAG pipelines, semantic chunking, and MCP tool calling.",
    note: "3-semester capstone · Team of 5 · Real government client",
    featured: true,
    tech: ["React", "Node.js", "Kafka", "AWS SageMaker", "LangChain", "MongoDB"],
    metrics: [
      "10,000+ transactions processed",
      "30% reduction in manual fraud review time",
      "Real-time Kafka event streaming",
      "GenAI RAG agent with MCP tool calling"
    ],
    github: "",   // Lokesh to fill in
    live: ""
  },
  {
    id: "02",
    title: "Agri-Tech Analytics & Advisory Platform",
    client: "Virginia Tech Research",
    period: "Sept 2024 – May 2026",
    description: "Full-stack geospatial analytics platform with production GenAI advisory assistant, 5+ analytics tools, and AWS deployment with real-time observability.",
    featured: false,
    tech: ["React", "Node.js", "AWS", "GPT-4o", "LangChain", "Google Earth Engine"],
    metrics: [
      "5+ analytics tools in one platform",
      "40% improvement in processing efficiency",
      "20% improvement in issue resolution",
      "Production RAG with hybrid vector retrieval"
    ],
    github: "",   // Lokesh to fill in
    live: "",     // VT project URL — Lokesh to fill in
    publication: ""  // VT publication URL — Lokesh to fill in
  },
  {
    id: "03",
    title: "AI-Powered Bookstore E-Commerce",
    client: "Virginia Tech (Personal Project)",
    period: "Feb 2025 – May 2025",
    description: "Full-stack bookstore platform with GenAI RAG recommendation assistant for semantic book search, personalized recommendations, and AI-assisted product discovery.",
    featured: false,
    tech: ["React", "Spring Boot", "MySQL", "LangChain", "FAISS", "Claude"],
    metrics: [
      "Semantic search via RAG + FAISS",
      "JWT/OAuth2 authentication",
      "Redis caching layer",
      "Hybrid retrieval with OpenAI embeddings"
    ],
    github: "",   // Lokesh to fill in
    live: ""
  }
]

export const experience = [
  {
    role: "Software Engineer",
    company: "Virginia Tech",
    period: "Sept 2024 – May 2026",
    location: "Virginia, USA",
    bullets: [
      "Architected full-stack agri-tech platform: React/TypeScript + Node.js/Express + PostgreSQL, deployed on AWS EC2 with Docker/Kubernetes and GitHub Actions CI/CD.",
      "Built production GenAI advisory assistant with GPT-4o, LangChain, FAISS, RAG pipelines, semantic chunking, and MCP tool calling.",
      "Developed geospatial app with Python/FastAPI + Google Earth Engine, improving processing efficiency by 40%."
    ]
  },
  {
    role: "Software Engineer (Contract)",
    company: "Marine Corps Community Services (MCCS)",
    period: "Sept 2024 – Dec 2025",
    location: "Remote",
    note: "3-semester capstone · Team of 5 · Real government client",
    bullets: [
      "Architected AI-powered fraud detection platform handling 10K+ transactions using React + Node.js/Express + MongoDB + Redis across microservices.",
      "Built GenAI fraud investigation assistant using Gemini, LangChain, LangGraph, FAISS, RAG pipelines, and MCP tool calling — reducing manual review by 30%.",
      "Orchestrated microservices on AWS EC2 with Kafka event streaming, SageMaker ML inference, CloudWatch observability, and OpenTelemetry tracing."
    ]
  },
  {
    role: "Software Engineer",
    company: "DuoDecimal Tech LLP",
    period: "July 2023 – July 2024",
    location: "India",
    bullets: [
      "Built conference booking platform: React + Node.js/Express + Socket.io + Redis + Kafka — improving booking efficiency by 30%, reducing latency by 50%.",
      "Developed hostel management system with RFID integration for 25,000+ users, reducing manual paperwork by 60%.",
      "Deployed microservices on AWS EC2 behind ALB load balancer with API Gateway and automated GitHub Actions CI/CD."
    ]
  },
  {
    role: "Software Engineer Intern",
    company: "MindGraph Technologies",
    period: "Jan 2023 – June 2023",
    location: "India",
    bullets: [
      "Built Telecom and CPG client dashboards using Python/Flask + Plotly Dash, deployed on Azure with Azure DevOps CI/CD — improving data visibility by 40%.",
      "Designed distributed pipelines processing 10M+ airline records using PySpark, Spark SQL, Kafka, and Apache Airflow."
    ]
  }
]

export const education = {
  school: "Virginia Tech",
  degree: "Master's in Computer Science",
  gpa: "4.0/4.0",
  location: "Virginia, USA",
  graduation: "May 2026"
}
```

---

## 11. RAG CONTEXT — lib/rag-context.ts

```typescript
export const ragContext = `
LOKESH VARMA KONDURU
Email: lokeshvarmak@vt.edu
Phone: +1 571-244-4062
LinkedIn: linkedin.com/in/lokeshvarmakonduru
GitHub: github.com/LokeshVarma-Konduru

SUMMARY:
Software Engineer with 3+ years of professional experience architecting full-stack 
platforms, cloud-native microservices, and production-grade GenAI systems. Currently 
pursuing M.S. in Computer Science at Virginia Tech (GPA: 4.0/4.0). Proficient in 
React, Node.js, Python, Java/Spring Boot, and AWS infrastructure. Skilled in designing 
LLM-powered RAG pipelines, AI agent workflows, and scalable distributed systems across 
agri-tech, fraud detection, and e-commerce domains.

EDUCATION:
Virginia Tech | Master's in Computer Science | GPA: 4.0/4.0 | Graduating May 2026

WORK EXPERIENCE:

1. Software Engineer — Virginia Tech (Sept 2024 – May 2026)
- Built full-stack platform: React/TypeScript + Next.js + Node.js/Express + PostgreSQL
- Deployed on AWS EC2 with Docker, Kubernetes, GitHub Actions CI/CD, Terraform
- Built GenAI advisory assistant: GPT-4o + LangChain + LangGraph + FAISS + RAG
- Built 5+ analytics tools using Google Earth Engine APIs
- Built Python/FastAPI geospatial application — improved processing efficiency by 40%

2. Software Engineer (Contract) — Marine Corps Community Services / MCCS (Sept 2024 – Dec 2025)
- This was a 3-semester university capstone project with a real government client (MCCS)
- Team of 5 engineers with a professor as mentor
- Built AI-powered fraud detection platform: React + Node.js/Express + MongoDB + Redis
- Handles 10K+ transactions across microservices
- Built GenAI fraud investigation assistant: Gemini + LangChain + LangGraph + FAISS + RAG
- Reduced manual fraud review time by 30%
- AWS EC2 + Kafka event streaming + SageMaker ML inference + OpenTelemetry

3. Software Engineer — DuoDecimal Tech LLP (July 2023 – July 2024)
- Built booking + food ordering platform: React + Node.js + Socket.io + Redis + Kafka
- Improved booking efficiency by 30%, reduced latency by 50%
- Built hostel management system for 25,000+ users, reduced paperwork by 60%
- AWS EC2 + ALB + API Gateway + GitHub Actions CI/CD

4. Software Engineer Intern — MindGraph Technologies (Jan 2023 – June 2023)
- Built dashboards using Python/Flask + Plotly Dash for Telecom and CPG clients
- Improved data visibility by 40%
- Processed 10M+ airline records with PySpark + Spark SQL + Kafka + Airflow

PROJECTS:
1. MCCS Fraud Detection Platform — React, Node.js, Kafka, SageMaker, LangChain
2. VT Agri-Tech Platform — React, Node.js, AWS, GPT-4o, LangChain, Google Earth Engine
3. Bookstore AI E-Commerce — React, Spring Boot, MySQL, LangChain, FAISS, Claude

SKILLS:
Languages: Python, JavaScript, TypeScript, Java, SQL, C, C++
Frontend: React.js, Next.js, TypeScript, Redux Toolkit, React Query, Tailwind CSS
Backend: Node.js, Express.js, Spring Boot, FastAPI, Flask, Socket.io
AI/GenAI: LangChain, LangGraph, RAG, FAISS, Pinecone, OpenAI Embeddings, GPT-4o, Claude, Gemini
Cloud: AWS EC2, S3, SageMaker, ALB, API Gateway, CloudWatch, Microsoft Azure
DevOps: Docker, Kubernetes, Kafka, Terraform, GitHub Actions, Apache Airflow, OpenTelemetry
Databases: PostgreSQL, MongoDB, MySQL, Redis, Firebase
Testing: Jest, PyTest, JUnit, TDD

WHAT LOKESH IS LOOKING FOR:
Full-time SDE roles starting May 2026. Open to full-stack, backend, or AI-integrated
engineering roles. NOT looking for ML Engineer or Data Scientist roles.
`
```

---

## 12. BUILD ORDER

Follow this exact order. Do not skip ahead.

```
Step 01: Setup fonts, ThemeProvider, metadata in layout.tsx
Step 02: Set up CSS variables in globals.css (all colors from section 4)
Step 03: Create lib/data.ts with all content (copy from section 10 above)
Step 04: Create lib/rag-context.ts (copy from section 11 above)
Step 05: Install shadcn components needed: badge, sheet, separator
Step 06: Copy Aceternity UI components into components/ui/
         - background-beams
         - bento-grid
         - card-hover-effect
         - moving-border
         - timeline
Step 07: Copy Magic UI components into components/ui/
         - blur-fade
         - word-rotate
         - number-ticker
         - shimmer-button
Step 08: Build Navbar.tsx
Step 09: Build Hero.tsx
Step 10: Build About.tsx
Step 11: Build Skills.tsx
Step 12: Build Projects.tsx
Step 13: Build Experience.tsx
Step 14: Build Contact.tsx
Step 15: Build Footer.tsx
Step 16: Assemble all sections in app/page.tsx
Step 17: Build AI Chat Widget (ChatWidget.tsx + ChatMessage.tsx + api/chat/route.ts)
Step 18: Build Command Palette (CommandPalette.tsx)
Step 19: Add custom cursor (small dot, scales on hover)
Step 20: Mobile responsiveness pass — test every section
Step 21: Performance pass — check for layout shift, slow images
Step 22: Final review — check colors match spec, no extra colors added
```

---

## 13. GLOBAL RULES FOR CLAUDE CODE

1. ALL content comes from `lib/data.ts` — never hardcode text in components
2. ONE accent color only: `#3B82F6` — do not add other colors
3. Dark mode is default — light mode via toggle
4. Every section entry uses Magic UI Blur Fade animation
5. Do not use 3D animations (no Three.js, no WebGL)
6. Do not use heavy particle effects
7. Keep animations subtle — professional, not flashy
8. Every component must be TypeScript (no .js files)
9. Use Tailwind classes only — no inline styles
10. Mobile-first — every section must work on 375px width
11. Plus Jakarta Sans for headings, Inter for body — always
12. When in doubt about a design decision, refer back to this file

---

## 14. STARTING PROMPT FOR CLAUDE CODE

When you open this project in Claude Code, use this exact prompt:

```
Read PLAN.md completely before doing anything.

This is my personal portfolio project. The PLAN.md file contains every decision 
already made — tech stack, colors, typography, sections, components, content, 
and build order.

Do not deviate from the plan. Do not add extra colors or components not listed.
All content is already written in the plan — no placeholders needed.

Start with Step 01 from the Build Order section.
Ask me before making any decision not covered in the plan.
```

---

*Last updated: Based on full planning session. All decisions are final.*
*GitHub: https://github.com/LokeshVarma-Konduru/lokesh-portfolio*
