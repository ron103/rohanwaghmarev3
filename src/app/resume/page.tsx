import type { Metadata } from "next";
import { Page, PageHeader, Placeholder } from "@/components/page";

export const metadata: Metadata = { title: "Resume" };

export default function Resume() {
  return (
    <Page className="grid max-w-[860px] gap-14">
      <PageHeader eyebrow="resume" title="The one-page version." />
      <Placeholder label="PDF view with a compiling animation · phase 4" className="aspect-[8.5/11] max-w-[640px]" />
    </Page>
  );
}
