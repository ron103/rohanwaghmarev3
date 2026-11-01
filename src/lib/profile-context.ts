import { resume } from "@/content/resume";
import { caseStudies } from "@/content/work";
import { projects } from "@/content/projects";
import { notes } from "@/content/notes";
import { qas } from "@/content/qa";
import { site } from "@/lib/site";

/**
 * Everything "Ask me" is allowed to know, flattened to plain text. Built from
 * the same content files the site renders, so answers never drift from pages.
 * Deterministic (no timestamps) so it caches as a stable prompt prefix.
 */
export function profileContext() {
  const lines: string[] = [];
  lines.push(`# ${resume.name} — ${resume.headline}`);
  lines.push(`Location: ${site.location}. Email: ${site.email}. GitHub: ${site.links.github}. LinkedIn: ${site.links.linkedin}.`);
  lines.push(`Summary: ${resume.summary}`);

  lines.push("\n## Experience");
  for (const e of resume.experience) {
    lines.push(`### ${e.org} — ${e.role}, ${e.where} (${e.when})`);
    for (const [tag, text] of e.bullets) lines.push(`- [${tag}] ${text}`);
  }

  lines.push("\n## Case studies on the site");
  for (const c of caseStudies) {
    lines.push(`### ${c.company}: ${c.title.join("")} (${c.timeline})`);
    lines.push(c.lede);
    lines.push(`Stats: ${c.stats.map((s) => `${s.from ? `${s.from} -> ` : ""}${s.value} ${s.caption}`).join("; ")}`);
    for (const s of c.sections) {
      lines.push(`- ${s.title} ${s.body.join(" ")}`);
      if (s.kind === "list") for (const it of s.items) lines.push(`  - ${it.title}: ${it.text}`);
    }
  }

  lines.push("\n## Projects");
  for (const p of projects) {
    lines.push(`### ${p.company}${p.status ? ` (${p.status})` : ""}`);
    lines.push(p.description);
    lines.push(`Stack: ${p.stack.join(", ")}. ${p.stats.map((m) => `${m.value} ${m.caption}`).join("; ")}`);
  }

  lines.push("\n## Notes (essays)");
  for (const n of notes) lines.push(`- ${n.title}: ${n.dek}`);

  lines.push("\n## Education");
  for (const e of resume.education) lines.push(`- ${e.school}: ${e.degree} (${e.when})`);

  lines.push("\n## Skills");
  for (const [k, v] of resume.skills) lines.push(`- ${k}: ${v}`);

  lines.push("\n## Answers Rohan has written himself");
  for (const qa of qas) lines.push(`Q: ${qa.q}\nA: ${qa.a}`);

  return lines.join("\n");
}

export const SYSTEM_PROMPT = `You answer questions from visitors on Rohan Waghmare's portfolio website, speaking as Rohan in the first person.

How to answer:
- Use only the facts in the profile below. If something isn't covered, say you don't have that written down yet and suggest emailing ${site.email}.
- Keep answers short: two to four plain sentences, no markdown, no lists, no headings.
- Sound like a friendly engineer talking, not a resume. Prefer concrete numbers from the profile when they help.
- If asked for something unrelated to Rohan (writing code, general questions, other people), say briefly that this box only answers questions about Rohan and his work.
- Never invent employers, dates, numbers, or opinions that aren't in the profile.

<profile>
${profileContext()}
</profile>`;
