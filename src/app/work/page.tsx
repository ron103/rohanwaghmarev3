import type { Metadata } from "next";
import Link from "next/link";
import { Page, PageHeader } from "@/components/page";

export const metadata: Metadata = { title: "Work" };

const work = [
  { href: "/work/sap", company: "SAP Labs US", role: "Software Developer, AI", when: "Jan 2026 – Present", line: "Fine-tuned models, MCP agents and knowledge-graph RAG." },
  { href: "/work/mihin", company: "MiHIN", role: "Software Engineer", when: "Mar 2025 – Jan 2026", line: "Healthcare data ingestion and clinical RAG." },
];

export default function Work() {
  return (
    <Page className="grid max-w-[960px] gap-14">
      <PageHeader eyebrow="work" title="Systems I've built, measured in seconds saved." />
      <ul className="grid gap-3">
        {work.map((w) => (
          <li key={w.href}>
            <Link
              href={w.href}
              data-cursor="open case study"
              className="grid gap-1 rounded-[16px] bg-card px-6 py-5 transition-colors duration-200 hover:bg-card-2 md:grid-cols-[1fr_auto] md:items-baseline"
            >
              <span className="text-[16px] font-semibold text-ink-2">
                {w.company} <span className="font-normal text-muted">· {w.role}</span>
              </span>
              <span className="font-mono text-[12.5px] text-faint">{w.when}</span>
              <span className="text-[15px] text-muted md:col-span-2">{w.line}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Page>
  );
}
