import type { Metadata } from "next";
import { Page, PageHeader } from "@/components/page";

export const metadata: Metadata = { title: "Site info" };

const colophon = {
  name: "rohanwaghmarev3",
  type: ["Fraunces", "Google Sans Flex", "Geist Mono"],
  built_with: ["Next.js 16", "React 19", "Tailwind CSS 4", "Motion", "Sonner"],
  texture: "SVG fractal noise, multiplied at 16% over white",
  inspired_by: "anushriya.com",
};

export default function SiteInfo() {
  return (
    <Page className="grid max-w-[860px] gap-10">
      <PageHeader eyebrow="site info" title="How this site is made." />
      <pre className="overflow-x-auto rounded-[16px] bg-card p-6 font-mono text-[13px] leading-relaxed text-ink-2">
        {JSON.stringify(colophon, null, 2)}
      </pre>
    </Page>
  );
}
