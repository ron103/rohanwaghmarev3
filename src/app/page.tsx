import Link from "next/link";
import { Page, Placeholder, SectionLabel } from "@/components/page";
import { ProfileCard } from "@/components/profile-card";

const meta = [
  { label: "Currently", value: "Software Developer, AI @SAP Labs" },
  { label: "Previously", value: "MiHIN, Binghamton Tech Collective" },
  { label: "Studied", value: "MS CS, Binghamton University" },
];

const projects = [
  { title: "Agentic Tool Orchestrator", line: "An agent router across 191 tools in 7 services." },
  { title: "TB detection", line: "92% on TBX11K with ResNet-50. Published at IEEE." },
  { title: "Polymarket bot", line: "A trading agent for prediction markets." },
];

const notes = [
  { quote: "The teacher model was confidently wrong. 4,000 human labels fixed it.", meta: "Distillation · draft" },
  { quote: "Concatenating fields into one vector poisons the embedding.", meta: "Retrieval · draft" },
  { quote: "Every agent write needs a human's name on it.", meta: "Agents in prod · draft" },
];

export default function Home() {
  return (
    <Page>
      {/* Hero */}
      <section className="grid gap-10 pb-16 pt-[calc(env(safe-area-inset-top,0px)+120px)] md:grid-cols-[minmax(0,1fr)_320px] md:gap-[72px] md:pb-24 md:pt-[224px]">
        <div className="min-w-0">
          <h1 className="font-serif text-[clamp(40px,5.4vw,64px)] font-semibold leading-[1.04] tracking-[-0.015em]">
            Hi, I&apos;m Rohan
          </h1>
          {/* Phase 1: this line streams in token by token with a Regenerate button. */}
          <p className="font-serif text-[clamp(34px,4.9vw,58px)] font-light leading-[1.06] tracking-[-0.015em] text-faint">
            I turn 90-second pipelines into 11-second ones.
          </p>
          <dl className="mt-14 grid gap-5 sm:grid-cols-3 md:mt-[72px]">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="text-[16px] font-semibold text-ink-2">{m.label}</dt>
                <dd className="text-[16px] text-muted">{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <ProfileCard />
      </section>

      {/* Work */}
      <section className="grid grid-cols-1 gap-6 pt-8 md:pt-16">
        <SectionLabel count={1}>Work</SectionLabel>
        <Link
          href="/work/sap"
          data-cursor="open case study"
          className="group grid gap-8 rounded-[20px] bg-card p-6 transition-colors duration-200 hover:bg-card-2 md:grid-cols-2 md:gap-10 md:px-10 md:pb-10 md:pt-8"
        >
          <div className="grid content-start gap-3">
            <p className="flex items-center gap-2 text-[15px] font-semibold text-ink-2">
              SAP Labs US
              <span className="rounded-[4px] bg-ink/5 px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted">LLM · 2026</span>
            </p>
            <h3 className="font-serif text-[clamp(28px,3vw,34px)] font-light leading-[1.08] tracking-[-0.015em]">
              Replacing a GPT pipeline with <span className="mark">models we own</span>.
            </h3>
            <p className="text-muted">Two QLoRA adapters on DeepSeek-R1 14B, served through vLLM.</p>
            <dl className="mt-4 flex flex-wrap gap-x-9 gap-y-4">
              <div>
                <dd className="flex items-baseline gap-2 font-mono text-[26px] tracking-[-0.02em]">
                  <s className="text-[18px] text-faint">90s</s>
                  <span className="text-[18px] text-blue">→</span>11s
                </dd>
                <dt className="text-[12.5px] text-muted">p95 latency</dt>
              </div>
              <div>
                <dd className="font-mono text-[26px] tracking-[-0.02em]">10×</dd>
                <dt className="text-[12.5px] text-muted">cheaper inference</dt>
              </div>
              <div>
                <dd className="font-mono text-[26px] tracking-[-0.02em]">98%</dd>
                <dt className="text-[12.5px] text-muted">accuracy</dt>
              </div>
            </dl>
            <span className="mt-4 text-[15px] font-medium text-ink-2 transition-colors group-hover:text-blue">Read the case study →</span>
          </div>
          <Placeholder label="trace waterfall · phase 1" className="aspect-[16/10] w-full" />
        </Link>
      </section>

      {/* Projects */}
      <section className="grid grid-cols-1 gap-6 pt-28 md:pt-40">
        <SectionLabel count={projects.length}>Projects</SectionLabel>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {projects.map((p) => (
            <Link
              key={p.title}
              href="/projects"
              data-cursor="open project"
              className="grid min-w-0 grid-cols-1 rounded-[16px] bg-card p-1 transition-colors duration-200 hover:bg-card-2"
            >
              <Placeholder label="preview video" className="aspect-[16/10] rounded-[12px]" />
              <div className="px-4 pb-4 pt-3.5">
                <h3 className="font-serif text-[26px] font-light tracking-[-0.01em]">{p.title}</h3>
                <p className="truncate text-[15px] text-muted">{p.line}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Notes */}
      <section className="grid grid-cols-1 gap-6 pt-28 md:pt-40">
        <SectionLabel count={notes.length}>Notes</SectionLabel>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {notes.map((n) => (
            <Link
              key={n.meta}
              href="/notes"
              data-cursor="read note"
              className="grid min-h-[260px] content-between gap-8 rounded-[16px] p-5 shadow-[inset_0_0_0_1px_var(--color-line)] transition-[background-color] duration-200 hover:bg-card/60"
            >
              <q className="font-serif text-[clamp(24px,2.3vw,28px)] font-light leading-[1.22] [quotes:none]">{n.quote}</q>
              <span className="text-[14px] font-medium text-faint">{n.meta}</span>
            </Link>
          ))}
        </div>
      </section>
    </Page>
  );
}
