import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Page } from "@/components/page";
import { CaseSkeleton, caseGridClass } from "@/components/case-study";
import { caseStudies, getCaseStudy } from "@/content/work";
import { WorkCaseView } from "@/components/work/work-case-view";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  return { title: c ? `${c.company} case study` : "Work", description: c?.lede };
}

export default function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  return (
    <Page className={caseGridClass}>
      <Suspense fallback={<CaseSkeleton />}>
        <CaseStudyContent params={params} />
      </Suspense>
    </Page>
  );
}

async function CaseStudyContent({ params }: { params: PageProps<"/work/[slug]">["params"] }) {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) notFound();

  return <WorkCaseView c={c} parent={c.slug} href={`/work/${c.slug}`} />;
}
