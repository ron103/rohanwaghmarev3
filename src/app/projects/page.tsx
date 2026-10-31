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
        lede="Each one has a terminal. It plays a demo first, then it's yours: try help, run, or next."
      />
      <Showcase projects={projects} />
    </Page>
  );
}
