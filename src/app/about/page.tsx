import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Download, FileText, Mail } from "lucide-react";
import { Page } from "@/components/page";
import { GoldenGateIcon, GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons";
import { SectionNav } from "@/components/about/section-nav";
import { StoryReflow, type Paragraph } from "@/components/about/story-reflow";
import { GitLog, type Commit } from "@/components/about/git-log";
import { ToolShelf, type Tool } from "@/components/about/tool-shelf";
import { AskRohan, type QA } from "@/components/about/ask-rohan";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "About" };

const sections = [
  { id: "story", label: "Story" },
  { id: "experience", label: "Experience" },
  { id: "tools", label: "Tools" },
  { id: "education", label: "Education" },
  { id: "ask", label: "Ask me" },
  { id: "resume", label: "Resume" },
];

// Placeholder story drawn from the resume. Rohan will rewrite it in his own words.
const story: Paragraph[] = [
  [
    { text: "I got into AI through a chest X-ray. In undergrad I trained a ResNet to spot tuberculosis, " },
    { text: "hit 92% on TBX11K", mark: true },
    { text: ", and co-wrote an IEEE paper about it. That was the first time a model I built felt like it could matter to someone." },
  ],
  [
    { text: "Since then I've cared less about demos and more about " },
    { text: "systems that survive production", mark: true },
    { text: ". At MiHIN I moved half a million healthcare records through AWS pipelines and built retrieval that took physician-note mapping from four hours to ten minutes." },
  ],
  [
    { text: "At SAP Labs I replaced a three-hop GPT pipeline with two fine-tuned adapters. It got " },
    { text: "ten times cheaper and eight times faster", mark: true },
    { text: ", and the data never leaves our servers. I also build MCP agents that let non-engineers change production systems, with every write traced back to a real person." },
  ],
  [
    { text: "Outside work I build small things to learn, like a trading bot for prediction markets, and I'd rather " },
    { text: "ship a scrappy version on Friday", mark: true },
    { text: " than polish a plan for a month." },
  ],
];

const commits: Commit[] = [
  {
    hash: "a1f3c9e",
    refs: ["HEAD -> main"],
    when: "Jan 2026 – now",
    company: "SAP Labs US",
    role: "Software Developer, AI",
    place: "Palo Alto, CA",
    diff: [
      "QLoRA adapters on DeepSeek-R1 14B: 10× cheaper, p95 90s → 11s, 98% accuracy",
      "FastMCP agents: cross-system updates from 1.5 days to 5 minutes",
      "Knowledge-graph RAG over MCP for 5,000+ developers, query time down 92%",
      "SFT data pipeline for a Qwen3 model: 12,300+ examples from agent traces",
    ],
  },
  {
    hash: "7be21d0",
    when: "Mar 2025 – Jan 2026",
    company: "MiHIN",
    role: "Software Engineer",
    place: "Binghamton, NY",
    diff: [
      "AWS ingestion for 500K+ records from 10+ healthcare orgs, 40% faster",
      "Clinical RAG: physician note to EHR mapping from 4 hours to 10 minutes",
      "Retrieval recall@20 from 61% to 88% by separating text from filters",
    ],
  },
  {
    hash: "3c90a4f",
    when: "Aug 2024 – Mar 2025",
    company: "Binghamton Tech Collective",
    role: "Software Engineer",
    place: "Binghamton, NY",
    diff: ["Shop Bing student marketplace: 100+ users in two weeks, 200+ listings", "Cut fake sign-ups 95% with .edu verification"],
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

// Placeholder answers in Rohan's voice. Edit freely.
const qas: QA[] = [
  {
    q: "What do you work on at SAP?",
    keywords: ["sap", "work on", "job", "current", "now"],
    a: "I build production GenAI on the platform side: fine-tuned models that replaced an external GPT pipeline, MCP agents that update two systems of record from a chat, and a knowledge-graph search that thousands of developers use every day.",
  },
  {
    q: "Why fine-tune instead of calling GPT?",
    keywords: ["fine", "tune", "gpt", "why", "qlora", "cost"],
    a: "Cost, speed, and where the data goes. Two small adapters beat a three-hop GPT chain: 10 times cheaper, p95 down from 90 seconds to 11, and nothing leaves our infrastructure. The real unlock was a 4,000-row human-labeled gold set, not the model.",
  },
  {
    q: "What's your favorite bug?",
    keywords: ["bug", "favorite", "favourite", "mistake"],
    a: "A preprocessing step was silently stripping tool calls from 99.6% of assistant turns before training. We'd have trained an agent that never uses tools. A boring test suite caught it, which is why I like boring test suites.",
  },
  {
    q: "Are you open to new roles?",
    keywords: ["hire", "hiring", "open", "role", "job", "opportunit"],
    a: "I'm always happy to talk about hard AI systems problems. Email me with what you're building and what's broken, and I'll reply.",
  },
  {
    q: "What do you do for fun?",
    keywords: ["fun", "hobby", "hobbies", "weekend", "free time"],
    a: "Side projects, mostly. Lately a prediction-market trading bot. Also long walks around the Bay, and too much chai.",
  },
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
            My name is <span className="mark">Rohan</span>. I build AI systems, and I ship them.
          </h1>
          <ul className="flex flex-wrap gap-2">
            <li className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-[13.5px] text-ink-2">
              <GoldenGateIcon animate={false} className="h-3.5 w-6" /> Bay Area
            </li>
            <li className="rounded-full bg-card px-3 py-1.5 text-[13.5px] text-ink-2">Software Developer, AI · SAP Labs</li>
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
          <StoryReflow paragraphs={story} />
        </section>

        {/* Experience */}
        <section id="experience" className="grid scroll-mt-32 gap-6">
          <h2 className="font-serif text-[26px] font-light text-muted">
            experience <span className="font-mono text-[13px] text-faint">git log --graph</span>
          </h2>
          <GitLog commits={commits} />
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
              <span className="text-[16px] font-semibold text-ink-2">Binghamton University, SUNY</span>
              <span className="font-mono text-[12.5px] text-faint">2023 – 2025</span>
              <span className="text-[15px] text-muted">Master of Science, Computer Science</span>
            </li>
            <li className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4">
              <span className="text-[16px] font-semibold text-ink-2">MIT ADT University, Pune</span>
              <span className="font-mono text-[12.5px] text-faint">2019 – 2023</span>
              <span className="text-[15px] text-muted">B.Tech, Computer Science</span>
            </li>
          </ul>
        </section>

        {/* Ask */}
        <section id="ask" className="grid scroll-mt-32 gap-6">
          <h2 className="font-serif text-[26px] font-light text-muted">ask me</h2>
          <AskRohan qas={qas} />
        </section>

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
            My favorite projects started with someone saying &ldquo;this is too slow&rdquo; or &ldquo;we can&apos;t trust this yet.&rdquo; If that
            sounds like your problem, say hi.
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
            <a className={social} href={site.links.x} target="_blank" rel="noreferrer" aria-label="X">
              <XIcon className="size-[15px]" />
            </a>
          </div>
        </section>
      </div>
    </Page>
  );
}
