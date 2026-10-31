import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Page } from "@/components/page";
import { CaseNav } from "@/components/work/case-nav";
import { Pipeline } from "@/components/work/pipeline";
import { TraceCompare } from "@/components/work/trace-compare";
import { AnnotatedCode } from "@/components/work/annotated-code";
import { caseStudies, getCaseStudy, type CaseStudy, type Section } from "@/content/work";
import { OrgLogo } from "@/components/org-logo";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  return { title: c ? `${c.company} case study` : "Work", description: c?.lede };
}

function navLabel(s: Section) {
  const map: Record<string, string> = {
    problem: "The problem",
    built: "What I built",
    data: "The data",
    speed: "Before → after",
    serving: "Serving",
    shipped: "Shipping",
    retrieval: "Retrieval",
  };
  return map[s.id] ?? s.title;
}

function SectionBody({ s, c }: { s: Section; c: CaseStudy }) {
  switch (s.kind) {
    case "pipeline":
      return <Pipeline before={c.pipelines.before} after={c.pipelines.after} />;
    case "trace":
      return <TraceCompare trace={c.trace} />;
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
    default:
      return null;
  }
}

/** Shown on client navigations while the case study streams in. */
function CaseSkeleton() {
  return (
    <div aria-hidden="true" className="grid gap-6 md:col-start-2">
      <span className="h-5 w-40 rounded-full bg-card" />
      <span className="h-16 w-full max-w-[760px] rounded-[14px] bg-card" />
      <span className="h-16 w-3/4 max-w-[560px] rounded-[14px] bg-card" />
      <span className="mt-4 h-5 w-full max-w-[620px] rounded-full bg-card" />
    </div>
  );
}

export default function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  return (
    <Page className="grid gap-12 pt-[calc(env(safe-area-inset-top,0px)+120px)] md:grid-cols-[200px_minmax(0,1fr)] md:gap-[72px] md:pt-[200px]">
      <Suspense fallback={<CaseSkeleton />}>
        <CaseStudyContent params={params} />
      </Suspense>
    </Page>
  );
}

async function CaseStudyContent({ params }: { params: PageProps<"/work/[slug]">["params"] }) {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) notFound();

  const next = caseStudies[(caseStudies.indexOf(c) + 1) % caseStudies.length];
  const meta = [
    { label: "Company", value: c.company },
    { label: "Role", value: c.role },
    { label: "Timeline", value: c.timeline },
    { label: "Scope", value: c.scope },
  ];

  return (
    <>
      <CaseNav
        items={caseStudies.map(({ slug, company, role, logo }) => ({ slug, company, role, logo }))}
        current={c.slug}
        sections={c.sections.map((s) => ({ id: s.id, label: navLabel(s) }))}
      />

      <article className="grid min-w-0 max-w-[880px] gap-24 md:gap-32">
        {/* Header */}
        <header className="grid gap-8">
          <p className="flex items-center gap-2 text-[15px] font-semibold text-ink-2">
            <OrgLogo org={c.logo} size={22} />
            {c.company}
            {c.badge && <span className="rounded-[4px] bg-ink/5 px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted">{c.badge}</span>}
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
          href={`/work/${next.slug}`}
          prefetch
          data-cursor="next case study"
          className="group flex items-center justify-between gap-6 rounded-[20px] bg-card px-6 py-6 transition-colors hover:bg-card-2 md:px-8"
        >
          <span className="grid gap-1">
            <span className="font-mono text-[12px] text-faint">next case study</span>
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
