import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Page } from "@/components/page";
import { CaseSkeleton, CaseStudyView, caseGridClass } from "@/components/case-study";
import { getProject, projects } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  return { title: p ? p.company : "Projects", description: p?.lede };
}

export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Page className={caseGridClass}>
      <Suspense fallback={<CaseSkeleton />}>
        <ProjectContent params={params} />
      </Suspense>
    </Page>
  );
}

async function ProjectContent({ params }: { params: PageProps<"/projects/[slug]">["params"] }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  return (
    <CaseStudyView
      c={p}
      all={projects}
      basePath="/projects"
      navLabel="Projects"
      nextLabel="next project"
      links={p.links}
      meta={[
        { label: "Project", value: p.role },
        { label: "Timeline", value: p.timeline },
        { label: "Stack", value: p.scope },
        { label: "Status", value: p.status ?? "Shipped" },
      ]}
    />
  );
}
