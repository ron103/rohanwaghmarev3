import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Download, FileText, Mail } from "lucide-react";
import { Page } from "@/components/page";
import { GoldenGateIcon, GitHubIcon, LinkedInIcon } from "@/components/icons";
import { SectionNav } from "@/components/about/section-nav";
import { Story, type Paragraph } from "@/components/about/story";
import { Timeline, type Role } from "@/components/about/timeline";
import { ToolShelf, type Tool } from "@/components/about/tool-shelf";
import { site } from "@/lib/site";
import { OrgLogo } from "@/components/org-logo";

export const metadata: Metadata = { title: "About" };

const sections = [
  { id: "story", label: "Story" },
  { id: "experience", label: "Experience" },
  { id: "tools", label: "Tools" },
  { id: "education", label: "Education" },
  { id: "resume", label: "Resume" },
];

// Rohan's story, in his voice.
const story: Paragraph[] = [
  [
    { text: "The first person I ever helped with code was my dad. After that I taught myself to make games, which was fun until a chest X-ray changed the plan: I trained a model to spot tuberculosis, and for the first time " },
    { text: "something I'd built felt like it could help someone", mark: true },
    { text: ". I'm a software engineer at heart, and since then almost everything I build has a model somewhere inside it." },
  ],
  [
    { text: "I'm originally from Pune, India. I came to the US for an MS in Computer Science at Binghamton University, then worked as a software engineer at MiHIN, building healthcare data pipelines and search that helps clinicians map notes to records. Now I'm in the Bay Area on " },
    { text: "SAP's Research & Innovation team", mark: true },
    { text: ", fine-tuning our own models and building AI agents that work inside real systems." },
  ],
  [
    { text: "I love three things in roughly equal measure: learning, building and explaining. And this is the best time there has ever been for all three. With a good model beside you, almost any hard subject is about " },
    { text: "two weeks of focused study away", mark: true },
    { text: ". If you're curious, you're never stuck for long." },
  ],
  [
    { text: "Sometimes I think every invention in human history was leading up to this one: the moment we build something larger than ourselves. I get to help lay the bricks, systems that are faster, more efficient and more trustworthy than the ones before them, that the next few centuries will be built on. " },
    { text: "I'm exactly where I want to be.", mark: true },
  ],
];

const roles: Role[] = [
  {
    id: "sap",
    when: "Jan 2026 – now",
    company: "SAP",
    logo: "sap",
    role: "Software Developer",
    team: "Research & Innovation",
    place: "SAP Labs · Palo Alto, CA",
    highlights: [
      "QLoRA adapters on DeepSeek-R1 14B: 10× cheaper, p95 90s → 11s, 98% accuracy",
      "FastMCP agents: cross-system updates from 1.5 days to 5 minutes",
      "Knowledge-graph RAG over MCP for 5,000+ developers, query time down 92%",
      "Long-context SFT data for Gemma-4-12B: 279 agent runs into 16K, 32K and 64K datasets, trained with sequence parallelism on 8 B200s",
    ],
  },
  {
    id: "mihin",
    when: "Mar 2025 – Jan 2026",
    company: "MiHIN",
    logo: "mihin",
    role: "Software Engineer",
    place: "Binghamton, NY",
    highlights: [
      "AWS ingestion for 500K+ records from 10+ healthcare orgs, 40% faster",
      "Clinical RAG: physician note to EHR mapping from 4 hours to 10 minutes",
      "Retrieval recall@20 from 61% to 88% by separating text from filters",
    ],
  },
  {
    id: "btc",
    when: "Aug 2024 – Mar 2025",
    company: "Binghamton Tech Collective",
    logo: "binghamton",
    role: "Software Engineer",
    place: "Binghamton, NY",
    highlights: ["Shop Bing student marketplace: 100+ users in two weeks, 200+ listings", "Cut fake sign-ups 95% with .edu verification"],
  },
];

const tools: Tool[] = [
  { name: "Python", core: true },
  { name: "PyTorch", core: true },
  { name: "vLLM", core: true },
  { name: "LangGraph", core: true },
  { name: "MCP", core: true },
  { name: "TypeScript" },
  { name: "SQL" },
  { name: "SPARQL" },
  { name: "QLoRA" },
  { name: "Hugging Face" },
  { name: "RAG" },
  { name: "FastAPI" },
  { name: "React" },
  { name: "PostgreSQL" },
  { name: "Neo4j" },
  { name: "Docker" },
  { name: "Kubernetes" },
  { name: "ArgoCD" },
  { name: "Terraform" },
  { name: "AWS" },
  { name: "GCP" },
  { name: "OpenTelemetry" },
];


const social =
  "grid size-9 place-items-center rounded-[10px] text-muted transition-colors duration-150 hover:bg-blue-fill hover:text-blue";

export default function About() {
  return (
    <Page className="grid gap-12 pt-[calc(env(safe-area-inset-top,0px)+120px)] md:grid-cols-[200px_minmax(0,1fr)] md:gap-[72px] md:pt-[200px]">
      <SectionNav sections={sections} />

      <div className="grid min-w-0 max-w-[640px] gap-28 md:gap-36">
        {/* Story */}
        <section id="story" className="grid scroll-mt-32 gap-8">
          <h1 className="font-serif text-[clamp(32px,4.2vw,44px)] font-semibold leading-[1.1] tracking-[-0.015em]">
            My name is <span className="mark">Rohan</span>. Curiosity is my whole personality.
          </h1>
          <ul className="flex flex-wrap gap-2">
            <li className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-[13.5px] text-ink-2">
              <GoldenGateIcon animate={false} className="h-3.5 w-6" /> Bay Area
            </li>
            <li className="rounded-full bg-card px-3 py-1.5 text-[13.5px] text-ink-2">Software Developer · SAP Research &amp; Innovation</li>
            <li className="rounded-full bg-card px-3 py-1.5 text-[13.5px] text-ink-2">MS CS, Binghamton</li>
            <li>
              <a
                href="https://ieeexplore.ieee.org/document/10112352"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 rounded-full bg-card px-3 py-1.5 text-[13.5px] text-ink-2 transition-colors hover:bg-blue-fill hover:text-blue"
              >
                IEEE author <ArrowUpRight className="size-3.5" />
              </a>
            </li>
          </ul>
          <Story paragraphs={story} />
        </section>

        {/* Experience */}
        <section id="experience" className="grid scroll-mt-32 gap-6">
          <h2 className="font-serif text-[26px] font-light text-muted">
            experience
          </h2>
          <Timeline roles={roles} />
        </section>

        {/* Tools */}
        <section id="tools" className="grid scroll-mt-32 gap-6">
          <h2 className="font-serif text-[26px] font-light text-muted">tools</h2>
          <ToolShelf tools={tools} />
        </section>

        {/* Education */}
        <section id="education" className="grid scroll-mt-32 gap-6">
          <h2 className="font-serif text-[26px] font-light text-muted">education</h2>
          <ul className="grid gap-5">
            <li className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4">
              <span className="flex items-center gap-2 text-[16px] font-semibold text-ink-2">
                <OrgLogo org="binghamton" size={20} /> Binghamton University, SUNY
              </span>
              <span className="font-mono text-[12.5px] text-faint">2023 – 2025</span>
              <span className="text-[15px] text-muted">Master of Science, Computer Science</span>
            </li>
            <li className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4">
              <span className="flex items-center gap-2 text-[16px] font-semibold text-ink-2">
                <OrgLogo org="mit-adt" size={20} /> MIT ADT University, Pune
              </span>
              <span className="font-mono text-[12.5px] text-faint">2019 – 2023</span>
              <span className="text-[15px] text-muted">B.Tech, Computer Science</span>
            </li>
          </ul>
        </section>

        {/* FAQ: hidden for now. Restore with <Faq qas={qas} /> and the "faq" entry in `sections`. */}

        {/* Resume + sign-off */}
        <section id="resume" className="grid scroll-mt-32 gap-6">
          <h2 className="font-serif text-[26px] font-light text-muted">resume</h2>
          <div className="flex items-center gap-2">
            <Link
              href="/resume"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-card px-4 text-[14.5px] font-medium text-ink-2 transition-[background-color,color,scale] hover:bg-blue-fill hover:text-blue active:scale-[0.97]"
            >
              <FileText className="size-4" strokeWidth={1.7} /> Open resume <ArrowUpRight className="size-3.5" />
            </Link>
            <Link
              href="/resume"
              aria-label="Download resume"
              className="grid size-10 place-items-center rounded-full bg-card text-ink-2 transition-[background-color,color,scale] hover:bg-blue-fill hover:text-blue active:scale-[0.95]"
            >
              <Download className="size-4" strokeWidth={1.7} />
            </Link>
          </div>
          <p className="mt-16 max-w-[56ch] text-[16.5px] leading-relaxed text-ink-2">
            If you&apos;ve read this far, we&apos;d probably get along. Say hi.
          </p>
          <div className="-ml-[9px] flex items-center gap-1">
            <a className={social} href={`mailto:${site.email}`} aria-label="Email">
              <Mail className="size-[17px]" strokeWidth={1.6} />
            </a>
            <a className={social} href={site.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <LinkedInIcon className="size-[17px]" />
            </a>
            <a className={social} href={site.links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <GitHubIcon className="size-[17px]" />
            </a>
          </div>
        </section>
      </div>
    </Page>
  );
}
