export const personal = {
  name: "Lokesh Varma Konduru",
  role: "Software Engineer",
  email: "lokesh.v.konduru@gmail.com",
  phone: "+1 571-244-4062",
  linkedin: "https://linkedin.com/in/lokeshvarmakonduru",
  github: "https://github.com/LokeshVarma-Konduru",
  handshake: "https://app.joinhandshake.com/profiles/lokeshvarmak",
  /**
   * A fixed path, so updating the résumé is only ever overwriting this file —
   * no code change, nothing to break. The name a visitor's browser saves it
   * under comes from `resumeFilename` on the download link instead.
   */
  resumeUrl: "/resume.pdf",
  resumeFilename: "Lokesh_Varma_Konduru_Resume.pdf",
  location: "Virginia, USA",
  seeking: "Full-time SDE roles · Graduating May 2026",
  taglines: [
    "Full-Stack Engineer",
    "AI Systems Builder",
    "Cloud & Backend Engineer",
  ],
  // Kept short on purpose: the stats row carries the numbers and the Skills
  // section right below carries the stack, so repeating either here only makes
  // the part that is actually about him harder to find.
  about: `I'm a software engineer. For the last three years I've built the parts
of a product people never see — the services, the pipelines, the infrastructure
that has to stay up while everything else changes.

That's meant fraud detection for a government client, climate tools for
researchers, and e-commerce platforms with real users on them. Right now I'm
finishing my M.S. in Computer Science at Virginia Tech.

I like systems that scale and code the next person can read. Open to full-time
SDE roles starting May 2026.`,
};

export const stats = [
  { value: 3, suffix: "+", label: "Years Experience" },
  { value: 4.0, suffix: "/4.0", label: "Virginia Tech GPA" },
  { value: 25000, suffix: "+", label: "Users Served" },
  { value: 4, suffix: "", label: "Production Systems" },
];

export const skills = {
  frontend: [
    "React.js",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Redux Toolkit",
    "React Query",
    "Tailwind CSS",
    "HTML5",
    "CSS3",
    "Framer Motion",
  ],
  backend: [
    "Node.js",
    "Express.js",
    "Python",
    "FastAPI",
    "Flask",
    "Java",
    "Spring Boot",
    "Socket.io",
    "REST APIs",
    "GraphQL",
  ],
  ai: [
    "LangChain",
    "LangGraph",
    "RAG Pipelines",
    "FAISS",
    "OpenAI Embeddings",
    "Prompt Engineering",
    "AI Agents",
    "MCP Tool Calling",
    "GPT-4o",
    "Claude",
    "Gemini",
  ],
  cloud: [
    "AWS EC2",
    "Amazon S3",
    "Kubernetes",
    "Docker",
    "Kafka",
    "GitHub Actions",
    "Terraform",
    "CI/CD Pipelines",
    "OpenTelemetry",
    "CloudWatch",
  ],
  databases: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Firebase"],
};

export const projects = [
  // Order is the running order on the page, and `id` is the position in it —
  // the wheel shows it as "01 / 04" — so the numbers move with the projects
  // rather than staying attached to them. The image paths do stay attached,
  // since each placeholder was drawn for its own project.
  {
    id: "01",
    image: "/projects/bookstore.png",
    title: "AI-Powered Bookstore E-Commerce",
    client: "Virginia Tech",
    period: "Feb 2025 – May 2025",
    description:
      "Full-stack bookstore platform with catalog, cart, and checkout workflows, plus a LangChain-powered recommendation assistant using FAISS semantic search for personalized book discovery.",
    featured: false,
    tech: [
      "React",
      "Spring Boot",
      "Spring Security",
      "MySQL",
      "LangChain",
      "FAISS",
    ],
    metrics: [
      "Sub-200ms API response times",
      "200+ book catalog with personalized recommendations",
      "JWT/OAuth2 with Spring Security",
      "Redis session caching",
    ],
    github:
      "https://github.com/LokeshVarma-Konduru/E-Commerce-Bookstore-Platform",
    live: "https://e-commerce-bookstore-platform.vercel.app/",
  },
  {
    id: "02",
    image: "/projects/agroclimate.png",
    title: "Agroclimate Viewer & Planner App",
    client: "Virginia Tech Research",
    period: "Sept 2024 – May 2026",
    description:
      "Consolidated 5+ Google Earth Engine analytics tools into one React platform with Firebase user telemetry, backed by an internal FastAPI analytics dashboard with Prometheus/Grafana observability.",
    featured: false,
    tech: [
      "React",
      "TypeScript",
      "Google Earth Engine",
      "Firebase",
      "FastAPI",
      "PostgreSQL",
    ],
    metrics: [
      "5+ GEE analytics tools consolidated into one platform",
      "Firebase telemetry tracking real user activity",
      "40% improvement in processing efficiency (FastAPI, Redis, asyncio)",
      "20% improvement in issue resolution via Prometheus/Grafana observability",
    ],
    github: "https://github.com/DATL-Chandel/Agroclimate",
    live: "https://datl-chandel.github.io/Agroclimate",
    publication: "",
  },
  {
    id: "03",
    image: "/projects/fraud-detection.png",
    title: "AI-Powered Fraud Detection Platform",
    client: "Marine Corps Community Services (MCCS)",
    period: "Sept 2024 – Dec 2025",
    description:
      "Production fraud detection system processing 10K+ transactions with GenAI investigation assistant using RAG pipelines, semantic chunking, and MCP tool calling.",
    note: "3-semester capstone · Team of 5 · Real government client",
    featured: true,
    tech: ["React", "Node.js", "Kafka", "MongoDB", "LangChain", "Kubernetes"],
    metrics: [
      "10,000+ transactions processed",
      "30% reduction in manual fraud review time",
      "40% reduction in fraud signal processing latency",
      "GenAI RAG agent with MCP tool calling",
    ],
    github:
      "https://github.com/LokeshVarma-Konduru/MCCS-E-commerce-Fraud-Detection",
    live: "",
  },
  {
    id: "04",
    image: "/projects/nova-clinic.png",
    title: "Nova Clinic — Appointment Management Platform",
    client: "Virginia Tech",
    period: "Feb 2026 – May 2026",
    description:
      "JWT-authenticated REST APIs over HTTPS built with Python/FastAPI and MySQL, with a responsive HTML5/CSS frontend for appointment management and zero-downtime production deployment.",
    featured: false,
    tech: ["Python", "FastAPI", "MySQL", "HTML5/CSS", "JWT"],
    metrics: [
      "Zero downtime during production deployment",
      "JWT-authenticated REST APIs over HTTPS",
      "Normalized MySQL schema with role-based access control",
      "JWT claim-based data privacy permissions",
    ],
    github: "https://github.com/LokeshVarma-Konduru/NovaClinic",
    live: "",
  },
];

export const experience = [
  {
    role: "Software Engineer",
    company: "Virginia Tech",
    logo: "/logos/virginia-tech.svg",
    logoWidth: 225,
    logoHeight: 44,
    period: "Sept 2024 – May 2026",
    location: "Virginia, USA",
    bullets: [
      "Cut bug turnaround time by 40% by building a full-stack platform with React/TypeScript, Next.js SSR, and PostgreSQL, backed by Jest unit and integration test coverage.",
      "Reduced deployment time by 65% by containerizing services with Docker and Kubernetes on AWS EC2 and automating CI/CD pipelines via GitHub Actions with Terraform IaC.",
      "Improved issue resolution by 20% by shipping 5+ geospatial analytics tools using Google Earth Engine APIs on a React/Tailwind platform with Firebase telemetry and Prometheus/Grafana observability.",
      "Boosted geospatial data processing efficiency by 40% by building an async Python/FastAPI backend with Redis caching and PostgreSQL, improving overall pipeline throughput.",
      "Engineered an AI-powered advisory assistant by integrating LangChain, LangGraph, and FAISS into Node.js/Express REST APIs, implementing RAG pipelines and MCP tool calling to deliver real-time contextual recommendations.",
    ],
  },
  {
    role: "Software Engineer (Contract)",
    company: "Marine Corps Community Services (MCCS)",
    logo: "/logos/mccs.png",
    logoWidth: 962,
    logoHeight: 290,
    period: "Sept 2024 – Dec 2025",
    location: "Remote",
    note: "3-semester capstone · Team of 5 · Real government client",
    bullets: [
      "Scaled fraud detection to handle 10K+ transactions by architecting microservices with Node.js/Express, MongoDB, and Redis for real-time fraud score and transaction lookups.",
      "Reduced fraud signal processing latency by 40% by orchestrating Kafka event streaming on Kubernetes with CloudWatch and OpenTelemetry distributed tracing, and S3 for model artifact storage.",
      "Reduced manual fraud review time by 30% by building a GenAI fraud investigation assistant with LangChain, LangGraph, and FAISS, implementing RAG pipelines and MCP tool calling for intelligent fraud signal analysis.",
    ],
  },
  {
    role: "Software Engineer",
    company: "DuoDecimal Tech LLP",
    logo: "/logos/duodecimal.png",
    logoWidth: 200,
    logoHeight: 200,
    period: "July 2023 – July 2024",
    location: "India",
    bullets: [
      "Delivered 4 production platforms — events, bookings, hostel, and food management — using React/TypeScript, Node.js/Express, and MongoDB with JWT/OAuth2 authentication.",
      "Improved booking efficiency by 30% and cut response latency by 50% by building a real-time ordering platform with Socket.io and Kafka, integrating Razorpay payment processing and Redis-backed session caching.",
      "Reduced manual paperwork by 60% for 25,000+ users by developing an RFID-integrated hostel management system with Node.js/Express and MongoDB indexed queries and event-driven access control.",
      "Enabled zero-downtime releases for 25,000+ users by deploying microservices on AWS EC2 behind ALB, routing through API Gateway with GitHub Actions CI/CD and automated Jest testing.",
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "MindGraph Technologies",
    logo: "/logos/mindgraph.png",
    logoWidth: 200,
    logoHeight: 200,
    period: "Jan 2023 – June 2023",
    location: "India",
    bullets: [
      "Improved data visibility by 40% for Telecom and CPG clients by building dashboards with Python/Flask and Plotly Dash, integrating Azure AD SSO and deploying on Microsoft Azure with DevOps CI/CD.",
      "Ensured data quality and reliability across 10M+ airline records by designing distributed pipelines with PySpark, Kafka, and Apache Airflow, with automated PyTest unit and integration testing.",
    ],
  },
];

export const education = [
  {
    school: "Virginia Tech",
    degree: "M.S. in Computer Science",
    gpa: "4.0/4.0",
    location: "Virginia, USA",
    period: "Aug 2024 – May 2026",
  },
  {
    school: "Mahindra University",
    degree: "B.Tech. in Computer Science",
    gpa: "8.28/10",
    location: "India",
    period: "Jul 2019 – May 2023",
  },
];
