import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Page } from "@/components/page";
import { CaseSkeleton, caseGridClass } from "@/components/case-study";
import { WorkCaseView } from "@/components/work/work-case-view";
import { getStory, stories } from "@/content/stories";

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.parent, story: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]/[story]">): Promise<Metadata> {
  const { slug, story } = await params;
  const s = getStory(slug, story);
  return { title: s ? `${s.company}: ${s.storyLabel}` : "Work", description: s?.lede };
}

export default function StoryPage({ params }: PageProps<"/work/[slug]/[story]">) {
  return (
    <Page className={caseGridClass}>
      <Suspense fallback={<CaseSkeleton />}>
        <StoryContent params={params} />
      </Suspense>
    </Page>
  );
}

async function StoryContent({ params }: { params: PageProps<"/work/[slug]/[story]">["params"] }) {
  const { slug, story } = await params;
  const s = getStory(slug, story);
  if (!s) notFound();
  return <WorkCaseView c={s} parent={slug} href={`/work/${slug}/${s.slug}`} />;
}
