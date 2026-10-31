import type { Metadata } from "next";
import { Page, PageHeader, Placeholder } from "@/components/page";

export const metadata: Metadata = { title: "Notes" };

export default function Notes() {
  return (
    <Page className="grid max-w-[860px] gap-14">
      <PageHeader eyebrow="notes" title="Short essays on building with LLMs." lede="Each note gets an interactive figure and a token-count reading bar in phase 4." />
      <Placeholder label="embedding-space figure · phase 4" className="aspect-[16/9]" />
    </Page>
  );
}
