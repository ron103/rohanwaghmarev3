import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CaseNav } from "@/components/work/case-nav";
import { Pipeline } from "@/components/work/pipeline";
import { TraceCompare } from "@/components/work/trace-compare";
import { AnnotatedCode } from "@/components/work/annotated-code";
import { OrgLogo } from "@/components/org-logo";
import { Placeholder } from "@/components/page";
import { ToolGrid } from "@/components/projects/visuals/tool-grid";
import { SchemaEvolution } from "@/components/projects/visuals/schema-evolution";
import { SentimentChart } from "@/components/projects/visuals/sentiment-chart";
import { WatchDemo } from "@/components/projects/visuals/watch-demo";
import { MarketFunnel } from "@/components/projects/visuals/market-funnel";
import { PaperScatter } from "@/components/projects/visuals/paper-scatter";
import type { CaseStudy, Section } from "@/content/work";

const NAV_LABELS: Record<string, string> = {
  problem: "The problem",
  built: "What I built",
  data: "The data",
  speed: "Before → after",
  serving: "Serving",
  shipped: "Shipping",
  retrieval: "Retrieval",
};

function SectionBody({ s, c }: { s: Section; c: CaseStudy }) {
  switch (s.kind) {
    case "pipeline":
      return <Pipeline views={c.views} />;
    case "trace":
      return c.trace ? <TraceCompare trace={c.trace} /> : null;
    case "code":
      return <AnnotatedCode file={s.code.file} lines={s.code.lines} />;
    case "list":
      return (
        <ul className="grid gap-3 sm:grid-cols-3">
          {s.items.map((it) => (
            <li key={it.title} className="grid content-start gap-1.5 rounded-[16px] bg-card p-4">
              <span className="text-[15px] font-semibold text-ink-2">{it.title}</span>
              <span className="text-[14px] leading-relaxed text-muted">{it.text}</span>
            </li>
          ))}
        </ul>
      );
    case "toolgrid":
      return <ToolGrid />;
    case "schema":
      return <SchemaEvolution />;
    case "sentiment":
      return <SentimentChart />;
    case "watch":
      return <WatchDemo />;
    case "funnel":
      return <MarketFunnel />;
    case "papers":
      return <PaperScatter />;
    case "placeholder":
      return <Placeholder label={s.label} className="aspect-[16/7]" />;
    default:
      return null;
  }
}

/** Shown on client navigations while a case study streams in. */
export function CaseSkeleton() {
  return (
    <div aria-hidden="true" className="grid gap-6 md:col-start-2">
      <span className="h-5 w-40 rounded-full bg-card" />
      <span className="h-16 w-full max-w-[760px] rounded-[14px] bg-card" />
      <span className="h-16 w-3/4 max-w-[560px] rounded-[14px] bg-card" />
      <span className="mt-4 h-5 w-full max-w-[620px] rounded-full bg-card" />
    </div>
  );
}

export const caseGridClass =
  "grid gap-12 pt-[calc(env(safe-area-inset-top,0px)+120px)] md:grid-cols-[200px_minmax(0,1fr)] md:gap-[72px] md:pt-[200px]";

/**
 * The long-form template shared by /work and /projects: header with stats,
 * numbered sections with their interactive pieces, and a link to the next one.
 */
export function CaseStudyView({
  c,
  all,
  basePath,
  navLabel,
  meta,
  nextLabel,
  links,
}: {
  c: CaseStudy;
  all: CaseStudy[];
  basePath: string;
  navLabel: string;
  meta: { label: string; value: string }[];
  nextLabel: string;
  links?: { label: string; href: string }[];
}) {
  const next = all[(all.indexOf(c) + 1) % all.length];

  return (
    <>
      <CaseNav
        items={all.map(({ slug, company, role, logo }) => ({ slug, company, role, logo }))}
        current={c.slug}
        sections={c.sections.map((s) => ({ id: s.id, label: NAV_LABELS[s.id] ?? s.title }))}
        basePath={basePath}
        label={navLabel}
      />

      <article className="grid min-w-0 max-w-[880px] gap-24 md:gap-32">
        <header className="grid gap-8">
          <p className="flex flex-wrap items-center gap-2 text-[15px] font-semibold text-ink-2">
            {c.logo && <OrgLogo org={c.logo} size={22} />}
            {c.company}
            {c.badge && <span className="rounded-[4px] bg-ink/5 px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted">{c.badge}</span>}
            {links?.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="ml-1 font-mono text-[12px] font-medium text-blue underline decoration-dotted underline-offset-4"
              >
                {l.label} ↗
              </a>
            ))}
          </p>
          <h1 className="font-serif text-[clamp(40px,6.4vw,72px)] font-semibold leading-[1.03] tracking-[-0.015em]">
            {c.title[0]}
            <span className="mark">{c.title[1]}</span>
            {c.title[2]}
          </h1>
          <p className="max-w-[62ch] text-[17px] leading-relaxed text-muted">{c.lede}</p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-6 sm:grid-cols-4">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="text-[12.5px] text-faint">{m.label}</dt>
                <dd className="text-[14px] font-medium text-ink-2">{m.value}</dd>
              </div>
            ))}
          </dl>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-6 pt-4 sm:grid-cols-4">
            {c.stats.map((s) => (
              <div key={s.caption} className="flex flex-col">
                {/* The "before" value sits on its own line; every stat keeps the line so numbers align. */}
                <span className="mb-1 h-4 font-mono text-[13px] leading-4 text-faint">
                  {s.from && (
                    <>
                      <s>{s.from}</s> <span className="text-blue">→</span>
                    </>
                  )}
                </span>
                <dd className="whitespace-nowrap font-mono text-[clamp(28px,3.4vw,40px)] leading-none tracking-[-0.03em] text-ink">{s.value}</dd>
                <dt className="mt-2 text-[13px] text-muted">{s.caption}</dt>
              </div>
            ))}
          </dl>
        </header>

        {c.sections.map((s, i) => (
          <section key={s.id} id={s.id} className="grid scroll-mt-32 gap-6">
            <div className="grid max-w-[640px] gap-3">
              <span className="font-mono text-[12px] text-blue">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="font-serif text-[clamp(28px,3.6vw,40px)] font-light leading-[1.1] tracking-[-0.015em]">{s.title}</h2>
              {s.body.map((p) => (
                <p key={p} className="text-[16px] leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </div>
            <SectionBody s={s} c={c} />
          </section>
        ))}

        <Link
          href={`${basePath}/${next.slug}`}
          prefetch
          data-cursor={nextLabel}
          className="group flex items-center justify-between gap-6 rounded-[20px] bg-card px-6 py-6 transition-colors hover:bg-card-2 md:px-8"
        >
          <span className="grid gap-1">
            <span className="font-mono text-[12px] text-faint">{nextLabel}</span>
            <span className="font-serif text-[clamp(22px,2.6vw,30px)] font-light">
              {next.company} · {next.title.join("")}
            </span>
          </span>
          <ArrowRight className="size-5 shrink-0 text-muted transition-[translate,color] group-hover:translate-x-1 group-hover:text-blue" />
        </Link>
      </article>
    </>
  );
}
