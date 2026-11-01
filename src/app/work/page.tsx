import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Page, PageHeader } from "@/components/page";
import { caseStudies } from "@/content/work";
import { OrgLogo } from "@/components/org-logo";

export const metadata: Metadata = { title: "Work" };

export default function Work() {
  return (
    <Page className="grid max-w-[1040px] gap-14">
      <PageHeader
        eyebrow="work"
        title={
          <>
            Systems I&apos;ve built, measured in <span className="mark">seconds saved</span>.
          </>
        }
        lede="Each case study has a pipeline you can run and a trace you can scrub, so you can see where the time went."
      />
      <ul className="grid gap-4">
        {caseStudies.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/work/${c.slug}`}
              prefetch
              data-cursor="open case study"
              className="group grid gap-6 rounded-[20px] bg-card p-6 transition-colors duration-200 hover:bg-card-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:p-8"
            >
              <div className="grid gap-2">
                <p className="flex flex-wrap items-center gap-x-2 text-[15px] font-semibold text-ink-2">
                  {c.logo && <OrgLogo org={c.logo} size={20} />}
                  {c.company}
                  <span className="font-normal text-muted">· {c.role}</span>
                  <span className="font-mono text-[12px] font-normal text-faint">{c.timeline}</span>
                </p>
                <h2 className="font-serif text-[clamp(26px,3vw,34px)] font-light leading-[1.1] tracking-[-0.015em]">
                  {c.title[0]}
                  <span className="mark">{c.title[1]}</span>
                  {c.title[2]}
                </h2>
                <p className="max-w-[60ch] text-[15px] text-muted">{c.lede}</p>
              </div>
              <div className="flex items-end gap-8">
                {c.stats.slice(0, 2).map((s) => (
                  <div key={s.caption} className="grid gap-1">
                    <span className="flex items-baseline gap-1.5 font-mono text-[26px] leading-none tracking-[-0.02em]">
                      {s.from && <s className="text-[15px] text-faint">{s.from}</s>}
                      {s.from && <span className="text-[15px] text-blue">→</span>}
                      {s.value}
                    </span>
                    <span className="text-[12.5px] text-muted">{s.caption}</span>
                  </div>
                ))}
                <ArrowRight className="mb-1 size-5 shrink-0 text-muted transition-[translate,color] group-hover:translate-x-1 group-hover:text-blue" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Page>
  );
}
