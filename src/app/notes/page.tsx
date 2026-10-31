import type { Metadata } from "next";
import { Page, PageHeader } from "@/components/page";
import { QuoteCard } from "@/components/home/quote-card";
import { notes } from "@/content/notes";

export const metadata: Metadata = { title: "Notes" };

export default function Notes() {
  return (
    <Page className="grid gap-14">
      <PageHeader
        eyebrow="notes"
        title={
          <>
            Short essays on <span className="mark">building with LLMs</span>.
          </>
        }
        lede="Things I learned the hard way, with figures you can poke."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {notes.map((n) => (
          <QuoteCard key={n.slug} quotes={[n.quote]} meta={`${n.topic} · ${n.title}`} href={`/notes/${n.slug}`} />
        ))}
      </div>
    </Page>
  );
}
