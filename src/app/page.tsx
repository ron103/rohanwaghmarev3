import Link from "next/link";
import { Page, Placeholder, SectionLabel } from "@/components/page";
import { ProfileCard } from "@/components/profile-card";
import { StreamingTagline } from "@/components/home/streaming-tagline";
import { BadgePile } from "@/components/home/badge-pile";
import { WorkCard } from "@/components/home/work-card";
import { QuoteCard, type Quote } from "@/components/home/quote-card";
import { TilePop } from "@/components/tile-pop";

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

// Placeholder pull quotes until the notes are written.
const notes: { meta: string; quotes: Quote[] }[] = [
  {
    meta: "Distillation · draft",
    quotes: [
      [{ text: "The teacher model was confidently wrong." }, { text: "4,000 human labels fixed it.", mark: true }],
      [{ text: "Distillation copies the teacher's mistakes" }, { text: "with perfect confidence.", mark: true }],
    ],
  },
  {
    meta: "Retrieval · draft",
    quotes: [
      [{ text: "Concatenating fields into one vector" }, { text: "poisons the embedding.", mark: true }],
      [{ text: "Recall went from 61% to 88%" }, { text: "by embedding less, not more.", mark: true }],
    ],
  },
  {
    meta: "Agents in prod · draft",
    quotes: [
      [{ text: "Every agent write" }, { text: "needs a human's name on it.", mark: true }],
      [{ text: "An agent you can't audit" }, { text: "is a demo, not a product.", mark: true }],
    ],
  },
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
          <StreamingTagline />
          <dl className="mt-12 grid gap-5 sm:grid-cols-3 md:mt-14">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="text-[16px] font-semibold text-ink-2">{m.label}</dt>
                <dd className="text-[16px] text-muted">{m.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-12">
            <BadgePile />
          </div>
        </div>
        <ProfileCard />
      </section>

      {/* Work */}
      <section className="grid grid-cols-1 gap-6 pt-8 md:pt-16">
        <SectionLabel count={1}>Work</SectionLabel>
        <WorkCard />
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
              <TilePop className="aspect-[16/10] rounded-[12px]">
                <Placeholder label="preview video" className="size-full rounded-[12px]" />
              </TilePop>
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
          {notes.map((n, i) => (
            <QuoteCard key={n.meta} quotes={n.quotes} meta={n.meta} href="/notes" offset={i * 1400} />
          ))}
        </div>
      </section>
    </Page>
  );
}
