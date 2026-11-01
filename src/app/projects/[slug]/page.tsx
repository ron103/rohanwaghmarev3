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

  const next = projects[(projects.indexOf(p) + 1) % projects.length];
  return (
    <CaseStudyView
      c={p}
      nav={{
        items: projects.map(({ slug, company, role }) => ({ slug, company, role, href: `/projects/${slug}` })),
        current: p.slug,
        currentHref: `/projects/${p.slug}`,
        label: "Projects",
      }}
      next={{ href: `/projects/${next.slug}`, eyebrow: "next project", title: `${next.company} · ${next.title.join("")}` }}
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
