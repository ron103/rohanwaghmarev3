import type { Metadata } from "next";
import { Page, PageHeader, Placeholder, SectionLabel } from "@/components/page";

export const metadata: Metadata = { title: "MiHIN" };

export default function CaseStudy() {
  return (
    <Page className="grid gap-12 md:grid-cols-[200px_minmax(0,1fr)] md:gap-[72px]">
      <nav aria-label="Case study sections" className="hidden md:block">
        <ul className="sticky top-[40vh] grid gap-2 text-[14px] text-faint">
          {["Overview", "The problem", "What I built", "Results"].map((s, i) => (
            <li key={s} className={i === 0 ? "text-ink" : ""}>{s}</li>
          ))}
        </ul>
      </nav>
      <div className="grid max-w-[780px] gap-16">
        <PageHeader eyebrow="MiHIN · case study" title="Getting 500K records out of ten hospitals' systems." lede="Placeholder overview. Real copy and numbers arrive in phase 3." />
        <Placeholder label="interactive pipeline diagram · phase 3" className="aspect-[16/9]" />
        <section className="grid gap-5">
          <SectionLabel>Before → after</SectionLabel>
          <Placeholder label="latency slider + trace replay · phase 3" className="h-[260px]" />
        </section>
      </div>
    </Page>
  );
}
