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
  photo: "/Lokesh.jpg",
  /**
   * No date in here on purpose. "Graduating May 2026" was true when it was
   * written and false by August, and it renders in three places at once —
   * Contact, the Open Graph card and the assistant's context — so a date here
   * goes stale everywhere at the same time.
   */
  seeking: "Open to full-time SDE roles",
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
researchers, and e-commerce platforms with real users on them. I finished my
M.S. in Computer Science at Virginia Tech in May 2026.

I like systems that scale and code the next person can read, and I'm looking
for a full-time SDE role.`,
};

export const stats = [
  { value: 3, suffix: "+", label: "Years Experience" },
  { value: 4.0, suffix: "/4.0", label: "Virginia Tech GPA" },
  { value: 25000, suffix: "+", label: "Users Served" },
  { value: 15, suffix: "+", label: "Production Systems" },
];

/**
 * The superset, not a copy of any one résumé.
 *
 * The résumé gets tailored per application — a stack emphasised here, one
 * dropped there — so this holds everything defensible in an interview. Someone
 * who reads a tailored résumé and then opens the site should find more than it
 * said, never something different from it.
 */
export const skills = {
  languages: [
    "Python",
    "JavaScript",
    "TypeScript",
    "Java",
    "SQL",
    "C",
    "C++",
    "HTML5",
    "CSS3",
  ],
  frontend: [
    "React.js",
    "Next.js",
    "Redux Toolkit",
    "React Query",
    "Tailwind CSS",
    "Socket.io",
    "Plotly Dash",
    "Framer Motion",
  ],
  backend: [
    "Node.js",
    "Express.js",
    "Java/Spring Boot",
    "Spring Security",
    "FastAPI",
    "Flask",
    "REST APIs",
    "GraphQL",
    "Microservices",
    "Distributed Systems",
    "System Design",
    "JWT/OAuth2",
    "PySpark",
  ],
  ai: [
    "LangChain",
    "LangGraph",
    "RAG Pipelines",
    "FAISS",
    "OpenAI API",
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
    "API Gateway",
    "AWS ALB",
    "CloudWatch",
    "Kubernetes",
    "Docker",
    "Kafka",
    "Terraform",
    "GitHub Actions",
    "Apache Airflow",
    "Microsoft Azure",
    "Azure DevOps",
    "OpenTelemetry",
    "Prometheus",
    "Grafana",
    "Linux",
  ],
  databases: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Firebase"],
  tools: [
    "Jest",
    "PyTest",
    "TDD",
    "Git",
    "Agile/Scrum",
    "Jira",
    "Google Earth Engine",
  ],
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
    publication:
      "https://www.pubs.ext.vt.edu/content/pubs_ext_vt_edu/en/author/k/konduru-varma-lokesh.resource.html",
  },
  {
    id: "03",
    image: "/projects/fraud-detection.png",
    title: "AI-Powered Fraud Detection Platform",
    client: "Marine Corps Community Services (MCCS)",
    period: "Sept 2024 – Dec 2025",
    description:
      "Production fraud detection system processing 10K+ transactions with GenAI investigation assistant using RAG pipelines, semantic chunking, and MCP tool calling.",
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
    live: "https://novaclinic-d4zz.onrender.com/",
  },
];

/**
 * The same facts as the résumé, in a different sentence.
 *
 * The résumé gets tailored per application, so copying its wording here means
 * the site quietly goes stale every time a line is rewritten for a job
 * description — and reads as a paste of whichever version was sent. The
 * numbers are exact, because they are facts and identical in every version; the
 * phrasing is not, because it is framing.
 *
 * `links` carry the references the résumé itself points at.
 */
export const experience = [
  {
    role: "Software Engineer",
    company: "Virginia Tech",
    logo: "/logos/virginia-tech.svg",
    logoWidth: 225,
    logoHeight: 44,
    period: "Sept 2024 – May 2026",
    location: "Virginia, USA",
    // The work published out of this role, alongside the tool itself. Both
    // extension publications live behind one author page, and the SPIE paper is
    // research from the same lab.
    links: [
      { label: "Website", href: "https://datl-chandel.github.io/Agroclimate" },
      {
        label: "VT Publications",
        href: "https://www.pubs.ext.vt.edu/content/pubs_ext_vt_edu/en/author/k/konduru-varma-lokesh.resource.html",
      },
      { label: "SPIE Paper", href: "https://doi.org/10.1117/12.3094626" },
    ],
    bullets: [
      "Cut bug turnaround by 40% with a full-stack platform — React and TypeScript on Next.js SSR, PostgreSQL behind it, Jest across both unit and integration paths.",
      "Took 65% off deployment time by containerising the services with Docker and Kubernetes on EC2, and moving releases onto GitHub Actions with Terraform describing the infrastructure.",
      "Shipped 5+ geospatial analytics tools on Google Earth Engine APIs, with Firebase telemetry and Prometheus and Grafana watching them — 20% better issue resolution.",
      "Made the geospatial pipeline 40% more efficient with an async Python and FastAPI backend, Redis in front of PostgreSQL.",
      "Built an AI advisory assistant into the Node.js and Express APIs: LangChain, LangGraph and FAISS, RAG retrieval and MCP tool calling for recommendations in real time.",
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
    links: [
      {
        label: "GitHub",
        href: "https://github.com/LokeshVarma-Konduru/MCCS-E-commerce-Fraud-Detection",
      },
    ],
    bullets: [
      "Scaled fraud detection past 10,000 transactions by splitting it into Node.js and Express microservices, with MongoDB and Redis serving fraud scores and lookups in real time.",
      "Cut fraud signal latency by 40% — Kafka event streaming on Kubernetes, CloudWatch and OpenTelemetry for distributed tracing, S3 holding the model artifacts.",
      "Cut manual review time by 30% with a GenAI investigation assistant: LangChain, LangGraph and FAISS running RAG pipelines and MCP tool calling over the fraud signals.",
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
      "Shipped 4 production platforms — events, bookings, hostel and food management — on React with TypeScript, Node.js and Express, MongoDB, behind JWT and OAuth2.",
      "Built a real-time ordering platform on Socket.io and Kafka with Razorpay payments and Redis-backed sessions: 30% better booking efficiency, half the response latency.",
      "Cut paperwork by 60% for 25,000+ users with an RFID hostel management system — indexed MongoDB queries and event-driven access control.",
      "Gave those 25,000+ users zero-downtime releases, running the microservices on EC2 behind an ALB and API Gateway with GitHub Actions and Jest in the pipeline.",
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
      "Improved data visibility 40% for telecom and CPG clients with Python, Flask and Plotly Dash dashboards behind Azure AD SSO, deployed through Azure DevOps.",
      "Kept 10M+ airline records clean with distributed pipelines in PySpark, Kafka and Apache Airflow, checked by PyTest at unit and integration level.",
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
