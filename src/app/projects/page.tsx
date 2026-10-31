import type { Metadata } from "next";
import { Page, PageHeader, Placeholder } from "@/components/page";

export const metadata: Metadata = { title: "Projects" };

const projects = ["Agentic Tool Orchestrator", "TB detection", "Polymarket bot", "Coming soon"];

export default function Projects() {
  return (
    <Page className="grid gap-12 md:grid-cols-[240px_minmax(0,1fr)] md:gap-[72px]">
      <div className="grid content-start gap-10">
        <PageHeader eyebrow="projects" title="Things I build to think." />
        <ul className="grid gap-4">
          {projects.map((p, i) => (
            <li key={p} className={i === 0 ? "text-[15px] font-medium text-ink" : "text-[15px] text-faint"}>{p}</li>
          ))}
        </ul>
      </div>
      <Placeholder label="live preview + typeable terminal · phase 4" className="min-h-[420px] md:mt-[200px]" />
    </Page>
  );
}
