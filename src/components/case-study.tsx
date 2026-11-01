import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CaseNav, type NavItem } from "@/components/work/case-nav";
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
import { LockRace } from "@/components/work/visuals/lock-race";
import { KgQuery } from "@/components/work/visuals/kg-query";
import { ContextMeter } from "@/components/work/visuals/context-meter";
import { RetrievalCompare } from "@/components/work/visuals/retrieval-compare";
import { SeqParallel } from "@/components/work/visuals/seq-parallel";
import type { CaseStudy, MoreItem, Section } from "@/content/work";

const NAV_LABELS: Record<string, string> = {
  problem: "The problem",
  built: "What I built",
  data: "The data",
  speed: "Before → after",
  serving: "Serving",
  shipped: "Shipping",
  retrieval: "Retrieval",
  more: "More",
  locks: "Locking",
  kg: "Knowledge graph",
  trust: "Accountability",
  context: "Compaction",
  sp: "Sequence parallelism",
  recompress: "Recompression",
  fair: "Fair comparison",
};

/** Smaller projects from the same role: stats, two short paragraphs, the stack. */
function MoreCards({ items }: { items: MoreItem[] }) {
  return (
    <ul className={items.length > 1 ? "grid gap-4 md:grid-cols-2" : "grid gap-4"}>
      {items.map((it) => (
        <li key={it.title} className="grid content-start gap-5 rounded-[20px] bg-card p-6 md:p-7">
          <h3 className="font-serif text-[clamp(22px,2.4vw,26px)] font-light leading-[1.15] tracking-[-0.01em] text-ink">{it.title}</h3>
          <dl className="flex flex-wrap gap-x-8 gap-y-4">
            {it.stats.map((st) => (
              <div key={st.caption} className="flex flex-col">
                <dd className="flex items-baseline gap-2 whitespace-nowrap font-mono text-[26px] leading-none tracking-[-0.02em] text-ink">
                  {st.from && (
                    <>
                      <s className="text-[16px] text-faint">{st.from}</s>
                      <span className="text-[16px] text-blue">→</span>
                    </>
                  )}
                  {st.value}
                </dd>
                <dt className="mt-1.5 text-[12.5px] text-muted">{st.caption}</dt>
              </div>
            ))}
          </dl>
          <div className="grid gap-3">
            {it.text.map((p) => (
              <p key={p} className="text-[15px] leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </div>
          <ul className="flex flex-wrap gap-1.5">
            {it.stack.map((t) => (
              <li key={t} className="rounded-full bg-white px-2.5 py-0.5 font-mono text-[11.5px] text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line)]">
                {t}
              </li>
            ))}
          </ul>
          {it.href && (
            <Link
              href={it.href}
              prefetch
              data-cursor="read the story"
              className="group/more inline-flex w-fit items-center gap-1.5 text-[15px] font-medium text-ink-2 transition-colors hover:text-blue"
            >
              Read the story <ArrowRight className="size-4 transition-[translate] group-hover/more:translate-x-0.5" />
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

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
    case "locks":
      return <LockRace />;
    case "kg":
      return <KgQuery />;
    case "context":
      return <ContextMeter />;
    case "retrieval":
      return <RetrievalCompare />;
    case "sp":
      return <SeqParallel />;
    case "more":
      return <MoreCards items={s.items} />;
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
  nav,
  meta,
  next,
  links,
}: {
  c: CaseStudy;
  nav: { items: NavItem[]; current: string; currentHref: string; label: string };
  meta: { label: string; value: string }[];
  next: { href: string; eyebrow: string; title: string };
  links?: { label: string; href: string }[];
}) {
  return (
    <>
      <CaseNav
        items={nav.items}
        current={nav.current}
        currentHref={nav.currentHref}
        sections={c.sections.map((s) => ({ id: s.id, label: NAV_LABELS[s.id] ?? s.title }))}
        label={nav.label}
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
          href={next.href}
          prefetch
          data-cursor={next.eyebrow}
          className="group flex items-center justify-between gap-6 rounded-[20px] bg-card px-6 py-6 transition-colors hover:bg-card-2 md:px-8"
        >
          <span className="grid gap-1">
            <span className="font-mono text-[12px] text-faint">{next.eyebrow}</span>
            <span className="font-serif text-[clamp(22px,2.6vw,30px)] font-light">{next.title}</span>
          </span>
          <ArrowRight className="size-5 shrink-0 text-muted transition-[translate,color] group-hover:translate-x-1 group-hover:text-blue" />
        </Link>
      </article>
    </>
  );
}
