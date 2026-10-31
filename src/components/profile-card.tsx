"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { site, pacificTime, statusFor } from "@/lib/site";
import { GitHubIcon, GoldenGateIcon, LinkedInIcon, XIcon } from "./icons";
import { usePacificNow } from "./status";

const iconLink =
  "group/tip relative grid size-8 place-items-center rounded-[8px] text-muted transition-colors duration-150 hover:text-blue";

function Tip({ children }: { children: string }) {
  return (
    <span className="pointer-events-none invisible absolute left-0 top-[calc(100%+4px)] whitespace-nowrap text-[12.5px] text-muted group-hover/tip:visible group-focus-visible/tip:visible">
      {children}
    </span>
  );
}

/** The Golden Gate glyph. Click opens a tiny card with Pacific time and the status line. */
function BridgeButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const now = usePacificNow();

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-label={site.location}
        data-cursor="what's rohan up to?"
        onClick={() => setOpen((o) => !o)}
        className="group/tip relative grid h-8 w-10 place-items-center rounded-[8px] transition-[background-color,scale] duration-150 hover:bg-[#fbeae4] active:scale-95"
      >
        <GoldenGateIcon className="h-[18px] w-[30px]" />
        {!open && <Tip>{site.location}</Tip>}
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Local time"
          className="absolute left-0 top-[calc(100%+8px)] z-20 w-[244px] origin-top-left animate-[pop-in_.18s_var(--ease-out-soft)] rounded-[14px] bg-white p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_16px_40px_-14px_rgba(0,0,0,0.25)]"
        >
          <p className="font-mono text-[11.5px] text-muted">Bay Area · Pacific time</p>
          <p className="mt-1 font-serif text-[30px] font-light leading-none tabular-nums">{now ? pacificTime(now) : "--:--"}</p>
          <p className="mt-3 text-[13.5px] leading-snug text-ink-2">{now ? statusFor(now) : " "}</p>
        </div>
      )}
    </div>
  );
}

export function ProfileCard() {
  return (
    <aside className="grid content-center gap-3 border-t border-line pt-8 md:border-l md:border-t-0 md:pl-10 md:pt-0">
      {/* Photo placeholder: swap for <Image src="/rohan.jpg" ... /> when the picture arrives. */}
      <button
        type="button"
        data-cursor="hi, that's me"
        aria-label="Rohan's photo (placeholder)"
        className="avatar-bloom placeholder-stripes grid size-[112px] place-items-center rounded-full text-center font-mono text-[10.5px] leading-tight text-faint shadow-[0_0_0_4px_#fff,0_0_0_5px_var(--color-line),0_10px_24px_-12px_rgba(0,0,0,0.3)] transition-transform duration-300 ease-[var(--ease-pop)] hover:-rotate-[4deg] hover:scale-[1.03]"
      >
        your photo
        <br />
        goes here
      </button>
      <h2 className="mt-3 text-[16px] font-semibold text-ink-2">Glad you found this</h2>
      <p className="max-w-[34ch] text-[15.5px] leading-[1.55] text-muted">
        I build AI systems that are fast enough to ship and honest enough to trust.
      </p>
      <div className="mt-2 flex items-center gap-2">
        <BridgeButton />
        <i aria-hidden="true" className="mx-1 h-4 w-px bg-line" />
        <a className={iconLink} href={site.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <LinkedInIcon className="size-[17px]" />
          <Tip>LinkedIn</Tip>
        </a>
        <a className={iconLink} href={site.links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
          <GitHubIcon className="size-[17px]" />
          <Tip>GitHub</Tip>
        </a>
        <a className={iconLink} href={site.links.x} target="_blank" rel="noreferrer" aria-label="X">
          <XIcon className="size-[15px]" />
          <Tip>X</Tip>
        </a>
        <Link className={iconLink} href={site.links.resume} aria-label="Resume">
          <FileText className="size-[17px]" strokeWidth={1.6} />
          <Tip>Resume</Tip>
        </Link>
      </div>
    </aside>
  );
}
