/**
 * Maps a skill name from `lib/data.ts` to its logo under `public/logos/tech`.
 *
 * Logos are rendered as CSS masks rather than images, so the file's own colours
 * are discarded and the mark takes the current text colour. That keeps the whole
 * wall monochrome in both themes and holds to the single-accent rule in PLAN.md
 * section 4 — a colour-per-brand logo wall would put a dozen hues on the page.
 *
 * Skills with no brand behind them (RAG Pipelines, CI/CD, Prompt Engineering)
 * are absent on purpose and fall back to a text badge.
 */
export const techLogos: Record<string, string> = {
  // Frontend
  "React.js": "react",
  "Next.js": "nextjs",
  TypeScript: "typescript",
  JavaScript: "javascript",
  "Redux Toolkit": "redux",
  "React Query": "react-query",
  "Tailwind CSS": "tailwindcss",
  HTML5: "html5",
  CSS3: "css",
  "Framer Motion": "motion",

  // Backend
  "Node.js": "nodejs",
  "Express.js": "express",
  Python: "python",
  FastAPI: "fastapi",
  Flask: "flask",
  Java: "java",
  "Spring Boot": "spring",
  "Socket.io": "socketio",
  GraphQL: "graphql",

  // AI
  LangChain: "langchain",
  LangGraph: "langchain",
  "OpenAI Embeddings": "openai",
  "GPT-4o": "openai",
  Claude: "claude",
  Gemini: "gemini",

  // Cloud
  "AWS EC2": "aws",
  "Amazon S3": "aws",
  SageMaker: "aws",
  CloudWatch: "aws",
  Kubernetes: "kubernetes",
  Docker: "docker",
  Kafka: "kafka",
  "GitHub Actions": "github",
  Terraform: "terraform",

  // Databases
  PostgreSQL: "postgresql",
  MongoDB: "mongodb",
  MySQL: "mysql",
  Redis: "redis",
  Firebase: "firebase",
};

export function logoFor(skill: string): string | undefined {
  const slug = techLogos[skill];
  return slug ? `/logos/tech/${slug}.svg` : undefined;
}
