/**
 * The assistant's knowledge of Lokesh, built from `lib/data.ts`.
 *
 * This used to be a second hand-written copy of the résumé, and it drifted:
 * SageMaker came off the résumé and out of the site, and the assistant went on
 * telling people about it until someone noticed. Anything the page states is
 * derived here instead, so the two cannot disagree.
 *
 * What is written by hand below is only what has nowhere else to live — the
 * positioning, and the roles he does and does not want. Those belong to the
 * assistant rather than to the page.
 */

import { education, experience, personal, projects, skills } from "@/lib/data";

/** Framing the page never says out loud, and the assistant needs to know. */
const POSITIONING = `Full-Stack Software Engineer with 3+ years of experience across
distributed systems, real-time architectures, and cloud infrastructure. Has shipped
production applications and backend microservices in agri-tech, fraud detection, and
e-commerce, and integrates AI features into production systems rather than building
models from scratch.`;

const SEEKING = `Full-time SDE roles, available now — he finished his M.S. at Virginia
Tech in May 2026. Open to full-stack, backend, or AI-integrated engineering roles. NOT
looking for ML Engineer or Data Scientist roles.

The MCCS role was a three-semester university capstone with a real government client,
built by a team of five with a professor mentoring.

Some projects also appear in the work history — the fraud detection platform is the
MCCS role, and the Agroclimate app came out of the Virginia Tech role. That is the
same work described twice, not two separate efforts.`;

const list = (items: readonly string[]) => items.join(", ");

const experienceBlock = experience
  .map((role, index) => {
    const header = `${index + 1}. ${role.role} — ${role.company} (${role.period}, ${role.location})`;
    const note = "note" in role && role.note ? `\n- ${role.note}` : "";
    const bullets = role.bullets.map((bullet) => `- ${bullet}`).join("\n");
    return `${header}${note}\n${bullets}`;
  })
  .join("\n\n");

const projectsBlock = projects
  .map(
    (project, index) =>
      `${index + 1}. ${project.title} — ${project.client}, ${project.period}
   Stack: ${list(project.tech)}
   ${project.description}
   Highlights: ${list(project.metrics)}
   ${
     [
       project.github && `Source: ${project.github}`,
       project.live && `Live: ${project.live}`,
     ]
       .filter(Boolean)
       .join(" | ") || "No public links."
   }`,
  )
  .join("\n\n");

const educationBlock = education
  .map(
    (entry, index) =>
      `${index + 1}. ${entry.school} | ${entry.degree} | GPA: ${entry.gpa} | ${entry.period}`,
  )
  .join("\n");

const skillsBlock = [
  `Languages: ${list(skills.languages)}`,
  `Frontend: ${list(skills.frontend)}`,
  `Backend: ${list(skills.backend)}`,
  `Databases & Caching: ${list(skills.databases)}`,
  `AI Integration: ${list(skills.ai)}`,
  `Cloud & DevOps: ${list(skills.cloud)}`,
  `Testing & Tools: ${list(skills.tools)}`,
].join("\n");

export const ragContext = `
${personal.name.toUpperCase()}
Email: ${personal.email}
Phone: ${personal.phone}
LinkedIn: ${personal.linkedin}
GitHub: ${personal.github}
Location: ${personal.location}

SUMMARY:
${POSITIONING}

${personal.about}

EDUCATION:
${educationBlock}

WORK EXPERIENCE:

${experienceBlock}

PROJECTS:

${projectsBlock}

SKILLS:
${skillsBlock}

WHAT LOKESH IS LOOKING FOR:
${SEEKING}
`;
