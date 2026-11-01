import type { Metadata } from "next";
import { Page, PageHeader } from "@/components/page";
import { Showcase } from "@/components/projects/showcase";
import { projects } from "@/content/projects";

export const metadata: Metadata = { title: "Projects" };

export default function Projects() {
  return (
    <Page className="grid gap-14">
      <PageHeader
        eyebrow="projects"
        title={
          <>
            Things I build to <span className="mark">think</span>.
          </>
        }
        lede="Each one comes with the diagram of how it works. Press Run, click a step, or read the whole story."
      />
      <Showcase projects={projects} />
    </Page>
  );
}
