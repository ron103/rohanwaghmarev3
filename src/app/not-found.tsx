import { Page, PageHeader } from "@/components/page";
import { Regenerate404 } from "@/components/regenerate-404";

export default function NotFound() {
  return (
    <Page className="grid max-w-[760px] gap-10">
      <PageHeader
        eyebrow="404 · hallucination detected"
        title={
          <>
            The model <span className="mark">made up</span> this URL.
          </>
        }
        lede="It sounded confident, but this page doesn't exist. Let it try again."
      />
      <Regenerate404 />
    </Page>
  );
}
