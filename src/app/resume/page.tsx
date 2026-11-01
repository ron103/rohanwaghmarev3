import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { Page, PageHeader } from "@/components/page";
import { ResumeView } from "@/components/resume/resume-view";
import { resume } from "@/content/resume";

export const metadata: Metadata = { title: "Resume" };

// Drop the real PDF at public/rohan-waghmare-resume.pdf and a Download button appears.
const PDF = "/rohan-waghmare-resume.pdf";
const hasPdf = existsSync(join(process.cwd(), "public", PDF));

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-2">
      <h2 className="border-b border-ink/70 pb-0.5 text-[11.5px] font-bold uppercase tracking-[0.06em]">{title}</h2>
      {children}
    </section>
  );
}

function Row({ left, right, italic }: { left: React.ReactNode; right: React.ReactNode; italic?: boolean }) {
  return (
    <div className={`flex flex-wrap items-baseline justify-between gap-x-4 ${italic ? "italic" : "font-semibold"}`}>
      <span>{left}</span>
      <span className="text-right">{right}</span>
    </div>
  );
}

export default function Resume() {
  return (
    <Page className="grid max-w-[980px] gap-10">
      <div className="print:hidden">
        <PageHeader eyebrow="resume" title="The one-page version." lede="Typeset from the same source as my PDF. Save it as a PDF from your browser." />
      </div>
      <ResumeView pdf={hasPdf ? PDF : undefined}>
        {/* The sheet: letter-size proportions, serif body like the LaTeX original. */}
        <article className="mx-auto grid w-full max-w-[816px] gap-4 bg-white px-[clamp(20px,6vw,56px)] py-[clamp(24px,6vw,52px)] font-serif text-[12.5px] leading-[1.45] text-ink shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_30px_60px_-30px_rgba(0,0,0,0.35)] print:max-w-none print:gap-3 print:px-[0.4in] print:py-[0.4in] print:text-[11px] print:shadow-none">
          <header className="grid gap-1 text-center">
            <h1 className="text-[26px] font-bold leading-tight">{resume.name}</h1>
            <p className="text-[14px]">{resume.headline}</p>
            <p className="text-[11.5px] text-ink-2">{resume.contact.join("  ·  ")}</p>
          </header>

          <Section title="Summary">
            <p>{resume.summary}</p>
          </Section>

          <Section title="Experience">
            <div className="grid gap-3">
              {resume.experience.map((e) => (
                <div key={e.org} className="grid gap-0.5">
                  <Row left={e.org} right={e.when} />
                  <Row left={e.role} right={e.where} italic />
                  <ul className="mt-1 grid list-disc gap-1 pl-4">
                    {e.bullets.map(([tag, text]) => (
                      <li key={tag}>
                        <b>[{tag}]</b> {text}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Projects">
            <div className="grid gap-2">
              {resume.projects.map((p) => (
                <div key={p.name} className="grid gap-0.5">
                  <p>
                    <b>{p.name}</b> <i className="text-ink-2">| {p.stack}</i>
                  </p>
                  <ul className="grid list-disc pl-4">
                    <li>{p.text}</li>
                  </ul>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Education">
            <div className="grid gap-2">
              {resume.education.map((e) => (
                <div key={e.school} className="grid gap-0.5">
                  <Row left={e.school} right={e.when} />
                  <Row left={e.degree} right={e.where} italic />
                </div>
              ))}
            </div>
          </Section>

          <Section title="Technical Skills">
            <div className="grid gap-0.5">
              {resume.skills.map(([k, v]) => (
                <p key={k}>
                  <b>{k}</b> {v}
                </p>
              ))}
            </div>
          </Section>
        </article>
      </ResumeView>
    </Page>
  );
}
