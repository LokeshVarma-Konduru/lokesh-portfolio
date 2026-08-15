/**
 * Maps a skill name from `lib/data.ts` to its logo under `public/logos/tech`.
 *
 * Logos keep their brand colours: a recruiter recognises the React blue or the
 * Python yellow long before they read the label, which is the whole reason for
 * showing marks instead of text. This is a deliberate exception to the
 * single-accent rule in PLAN.md section 4 — brand marks are not page accent.
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

/**
 * Brands whose registered colour is black or near-black — Simple Icons lists
 * Next.js at #000000, Express at #0A0A0A, GitHub at #181717, Kafka at #231F20
 * and Socket.IO at #010101, and OpenAI is no longer carried there at all.
 * Drawn as an image each of these is a black blob on the dark background, so
 * they render as CSS masks instead and take the current text colour.
 */
const monochromeLogos = new Set([
  "express",
  "github",
  "kafka",
  "nextjs",
  "openai",
  "socketio",
]);

export type TechLogo = { src: string; mono: boolean };

export function logoFor(skill: string): TechLogo | undefined {
  const slug = techLogos[skill];
  if (!slug) return undefined;
  return { src: `/logos/tech/${slug}.svg`, mono: monochromeLogos.has(slug) };
}
