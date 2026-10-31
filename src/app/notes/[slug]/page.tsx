import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import clsx from "clsx";
import { Page, Placeholder } from "@/components/page";
import { TokenBar } from "@/components/notes/token-bar";
import { EmbeddingFigure } from "@/components/notes/embedding-figure";
import { getNote, notes, tokenCount, type Block } from "@/content/notes";

export function generateStaticParams() {
  return notes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: PageProps<"/notes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const n = getNote(slug);
  return { title: n?.title ?? "Notes", description: n?.dek };
}

function BlockView({ b }: { b: Block }) {
  if (b.kind === "h") return <h2 className="mt-6 font-serif text-[26px] font-light tracking-[-0.01em]">{b.text}</h2>;
  if (b.kind === "figure")
    return (
      <figure className="my-4 grid gap-3">
        {b.figure === "embeddings" ? <EmbeddingFigure /> : <Placeholder label="figure · coming soon" className="aspect-[16/8]" />}
        <figcaption className="text-[13.5px] text-faint">{b.caption}</figcaption>
      </figure>
    );
  return (
    <p className="text-[17px] leading-[1.75] text-ink-2">
      {b.runs.map((r, i) =>
        r.mark ? (
          <span key={i} className="mark">
            {r.text}
          </span>
        ) : (
          <span key={i}>{r.text}</span>
        ),
      )}
    </p>
  );
}

function NoteSkeleton() {
  return (
    <div aria-hidden="true" className="grid gap-5 md:col-start-2">
      <span className="h-4 w-32 rounded-full bg-card" />
      <span className="h-14 w-full max-w-[640px] rounded-[14px] bg-card" />
      <span className="h-5 w-full max-w-[560px] rounded-full bg-card" />
    </div>
  );
}

export default function NotePage({ params }: PageProps<"/notes/[slug]">) {
  return (
    <Page className="grid gap-12 pt-[calc(env(safe-area-inset-top,0px)+120px)] md:grid-cols-[220px_minmax(0,1fr)] md:gap-[72px] md:pt-[200px]">
      <Suspense fallback={<NoteSkeleton />}>
        <NoteContent params={params} />
      </Suspense>
    </Page>
  );
}

async function NoteContent({ params }: { params: PageProps<"/notes/[slug]">["params"] }) {
  const { slug } = await params;
  const n = getNote(slug);
  if (!n) notFound();
  const total = tokenCount(n);

  return (
    <>
      <aside className="grid content-start gap-8 md:sticky md:top-[28vh] md:self-start">
        <nav aria-label="Notes" className="hidden md:block">
          <ul className="grid gap-4">
            {notes.map((x) => (
              <li key={x.slug}>
                <Link
                  href={`/notes/${x.slug}`}
                  prefetch
                  aria-current={x.slug === n.slug ? "page" : undefined}
                  className={clsx("grid gap-0.5 leading-tight transition-colors", x.slug === n.slug ? "text-ink" : "text-faint hover:text-blue")}
                >
                  <span className="text-[15px] font-medium">{x.title}</span>
                  <span className="text-[12.5px] opacity-80">{x.topic}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <TokenBar total={total} target="note-body" />
      </aside>

      <article className="grid min-w-0 max-w-[680px] content-start gap-6">
        <header className="grid gap-4">
          <p className="font-mono text-[12px] text-muted">
            {n.topic} · {n.date} · ~{Math.max(1, Math.round(total / 220))} min
          </p>
          <h1 className="font-serif text-[clamp(36px,5vw,56px)] font-semibold leading-[1.05] tracking-[-0.015em]">{n.title}</h1>
          <p className="text-[18px] leading-relaxed text-muted">{n.dek}</p>
        </header>
        <div id="note-body" className="grid gap-5 border-t border-line pt-8">
          {n.blocks.map((b, i) => (
            <BlockView key={i} b={b} />
          ))}
        </div>
        <p className="mt-10 rounded-[14px] bg-card px-4 py-3 text-[14px] text-muted">
          This is a draft. If you&apos;ve hit the same problem, I&apos;d love to compare notes.
        </p>
      </article>
    </>
  );
}
