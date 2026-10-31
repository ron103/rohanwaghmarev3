import Link from "next/link";
import { Page, PageHeader } from "@/components/page";

export default function NotFound() {
  return (
    <Page className="grid max-w-[860px] gap-8">
      <PageHeader
        eyebrow="404 · hallucination detected"
        title="The model made up this URL."
        lede="It sounded confident, but this page doesn't exist."
      />
      <Link href="/" className="w-fit rounded-full bg-card px-4 py-2 text-[14px] font-medium text-ink-2 transition-colors hover:bg-blue-fill hover:text-blue">
        ↻ Regenerate (go home)
      </Link>
    </Page>
  );
}
