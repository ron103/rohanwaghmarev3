import { CaseStudyView } from "@/components/case-study";
import { workNav, workPages } from "@/content/stories";
import type { CaseStudy } from "@/content/work";

/** A Work page (a company's main story or one of its others), with Work's nav and reading order. */
export function WorkCaseView({ c, parent, href }: { c: CaseStudy; parent: string; href: string }) {
  const i = workPages.findIndex((p) => p.href === href);
  const next = workPages[(i + 1) % workPages.length];

  return (
    <CaseStudyView
      c={c}
      nav={{ items: workNav, current: parent, currentHref: href, label: "Case studies" }}
      next={{ href: next.href, eyebrow: "next case study", title: `${next.c.company} · ${next.c.title.join("")}` }}
      meta={[
        { label: "Company", value: c.company },
        c.team ? { label: "Team", value: c.team } : { label: "Scope", value: c.scope },
        { label: "Role", value: c.role },
        { label: "Timeline", value: c.timeline },
      ]}
    />
  );
}
