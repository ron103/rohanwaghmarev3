import type { Metadata } from "next";
import { Page, PageHeader, Placeholder, SectionLabel } from "@/components/page";

export const metadata: Metadata = { title: "About" };

const sections = ["Story", "Experience", "Tools", "Education", "Ask Rohan"];

export default function About() {
  return (
    <Page className="grid gap-12 md:grid-cols-[200px_minmax(0,1fr)] md:gap-[72px]">
      <nav aria-label="On this page" className="hidden md:block">
        <ul className="sticky top-[45vh] grid gap-2 text-[15px] text-faint">
          {sections.map((s, i) => (
            <li key={s} className={i === 0 ? "flex items-center gap-2 text-ink" : ""}>
              {s}
              {i === 0 && <span aria-hidden="true" className="size-[7px] rotate-45 rounded-[2px] bg-blue" />}
            </li>
          ))}
        </ul>
      </nav>
      <div className="grid max-w-[640px] gap-16">
        <PageHeader
          eyebrow="about"
          title={<>My name is <span className="mark">Rohan</span>. I build AI that ships.</>}
          lede="Placeholder story. Drag the portrait in phase 2 and this text rewraps around it."
        />
        <Placeholder label="draggable portrait + reflowing story · phase 2" className="h-[320px]" />
        <section className="grid gap-5">
          <SectionLabel>Experience</SectionLabel>
          <Placeholder label="git log --graph timeline · phase 2" className="h-[280px]" />
        </section>
        <section className="grid gap-5">
          <SectionLabel>Tools</SectionLabel>
          <Placeholder label="physics tool shelf · phase 2" className="h-[220px]" />
        </section>
        <section className="grid gap-5">
          <SectionLabel>Ask Rohan</SectionLabel>
          <Placeholder label="streaming Q&A · phase 2" className="h-[200px]" />
        </section>
      </div>
    </Page>
  );
}
