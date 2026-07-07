export const personal = {
  name: "Lokesh Varma Konduru",
  role: "Software Engineer",
  email: "lokeshvarmak@vt.edu",
  phone: "+1 571-244-4062",
  linkedin: "https://linkedin.com/in/lokeshvarmakonduru",
  github: "https://github.com/LokeshVarma-Konduru",
  resumeUrl: "/resume.pdf",
  location: "Virginia, USA",
  seeking: "Full-time SDE roles · Graduating May 2026",
  taglines: [
    "Full-Stack Engineer",
    "AI Systems Builder",
    "Node.js + React Developer",
    "Cloud & Backend Engineer",
  ],
  about: `Software Engineer with 3+ years building full-stack platforms,
cloud-native microservices, and production-grade AI systems. Currently
completing my M.S. in Computer Science at Virginia Tech with a 4.0 GPA.

I work across the entire stack — React/TypeScript frontends, Node.js/Express
backends, AWS infrastructure, and GenAI pipelines with RAG and LangChain.
I care about systems that scale, code that is maintainable, and products that
actually ship.

Open to full-time SDE roles starting May 2026.`,
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
    "SageMaker",
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
  {
    id: "01",
    title: "AI-Powered Fraud Detection Platform",
    client: "Marine Corps Community Services (MCCS)",
    period: "Sept 2024 – Dec 2025",
    description:
      "Production fraud detection system processing 10K+ transactions with GenAI investigation assistant using RAG pipelines, semantic chunking, and MCP tool calling.",
    note: "3-semester capstone · Team of 5 · Real government client",
    featured: true,
    tech: ["React", "Node.js", "Kafka", "AWS SageMaker", "LangChain", "MongoDB"],
    metrics: [
      "10,000+ transactions processed",
      "30% reduction in manual fraud review time",
      "Real-time Kafka event streaming",
      "GenAI RAG agent with MCP tool calling",
    ],
    github: "",
    live: "",
  },
  {
    id: "02",
    title: "Agri-Tech Analytics & Advisory Platform",
    client: "Virginia Tech Research",
    period: "Sept 2024 – May 2026",
    description:
      "Full-stack geospatial analytics platform with production GenAI advisory assistant, 5+ analytics tools, and AWS deployment with real-time observability.",
    featured: false,
    tech: ["React", "Node.js", "AWS", "GPT-4o", "LangChain", "Google Earth Engine"],
    metrics: [
      "5+ analytics tools in one platform",
      "40% improvement in processing efficiency",
      "20% improvement in issue resolution",
      "Production RAG with hybrid vector retrieval",
    ],
    github: "",
    live: "",
    publication: "",
  },
  {
    id: "03",
    title: "AI-Powered Bookstore E-Commerce",
    client: "Virginia Tech (Personal Project)",
    period: "Feb 2025 – May 2025",
    description:
      "Full-stack bookstore platform with GenAI RAG recommendation assistant for semantic book search, personalized recommendations, and AI-assisted product discovery.",
    featured: false,
    tech: ["React", "Spring Boot", "MySQL", "LangChain", "FAISS", "Claude"],
    metrics: [
      "Semantic search via RAG + FAISS",
      "JWT/OAuth2 authentication",
      "Redis caching layer",
      "Hybrid retrieval with OpenAI embeddings",
    ],
    github: "",
    live: "",
  },
];

export const experience = [
  {
    role: "Software Engineer",
    company: "Virginia Tech",
    period: "Sept 2024 – May 2026",
    location: "Virginia, USA",
    bullets: [
      "Architected full-stack agri-tech platform: React/TypeScript + Node.js/Express + PostgreSQL, deployed on AWS EC2 with Docker/Kubernetes and GitHub Actions CI/CD.",
      "Built production GenAI advisory assistant with GPT-4o, LangChain, FAISS, RAG pipelines, semantic chunking, and MCP tool calling.",
      "Developed geospatial app with Python/FastAPI + Google Earth Engine, improving processing efficiency by 40%.",
    ],
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
      "Orchestrated microservices on AWS EC2 with Kafka event streaming, SageMaker ML inference, CloudWatch observability, and OpenTelemetry tracing.",
    ],
  },
  {
    role: "Software Engineer",
    company: "DuoDecimal Tech LLP",
    period: "July 2023 – July 2024",
    location: "India",
    bullets: [
      "Built conference booking platform: React + Node.js/Express + Socket.io + Redis + Kafka — improving booking efficiency by 30%, reducing latency by 50%.",
      "Developed hostel management system with RFID integration for 25,000+ users, reducing manual paperwork by 60%.",
      "Deployed microservices on AWS EC2 behind ALB load balancer with API Gateway and automated GitHub Actions CI/CD.",
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "MindGraph Technologies",
    period: "Jan 2023 – June 2023",
    location: "India",
    bullets: [
      "Built Telecom and CPG client dashboards using Python/Flask + Plotly Dash, deployed on Azure with Azure DevOps CI/CD — improving data visibility by 40%.",
      "Designed distributed pipelines processing 10M+ airline records using PySpark, Spark SQL, Kafka, and Apache Airflow.",
    ],
  },
];

export const education = {
  school: "Virginia Tech",
  degree: "Master's in Computer Science",
  gpa: "4.0/4.0",
  location: "Virginia, USA",
  graduation: "May 2026",
};
