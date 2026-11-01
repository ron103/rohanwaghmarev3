"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FileText, Hand, Info, Mail, Search } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";
import { GitHubIcon, LinkedInIcon } from "./icons";
import { site } from "@/lib/site";
import { openPalette } from "./command-palette";
import { play } from "@/lib/sound";

export async function copyEmail() {
  try {
    await navigator.clipboard.writeText(site.email);
    play("pop");
    toast("Email copied", { description: site.email });
  } catch {
    toast("Couldn't copy", { description: site.email });
  }
}

const tile =
  "grid h-12 place-items-center rounded-[10px] bg-card/70 text-muted transition-[background-color,color,scale] duration-150 ease-out hover:bg-blue-fill hover:text-blue active:scale-[0.96]";
const row =
  "flex w-full items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-left text-[14px] text-ink-2 transition-colors duration-150 hover:bg-blue-fill hover:text-blue";

export function SayHi({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={clsx("relative", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((o) => !o)}
        data-cursor="say hi"
        className={clsx(
          "inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-[14px] font-medium transition-[background-color,color,scale] duration-150 ease-out active:scale-[0.96]",
          open ? "bg-blue-fill text-blue" : "bg-card text-ink-2 hover:bg-blue-fill hover:text-blue",
        )}
      >
        <Hand className="size-4" strokeWidth={1.8} />
        Say hi
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Say hi"
          className="absolute right-0 top-[calc(100%+8px)] z-[70] w-[208px] origin-top-right animate-[pop-in_.18s_var(--ease-out-soft)] rounded-[14px] bg-white p-1.5 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_16px_40px_-14px_rgba(0,0,0,0.25)]"
        >
          <div className="relative grid grid-cols-2 gap-1.5">
            <a className={tile} href={site.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <LinkedInIcon className="size-[17px]" />
            </a>
            <a className={tile} href={site.links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <GitHubIcon className="size-[17px]" />
            </a>
            <Link className={tile} href={site.links.resume} aria-label="Resume" onClick={() => setOpen(false)}>
              <FileText className="size-[17px]" strokeWidth={1.6} />
            </Link>
            <button
              type="button"
              onClick={copyEmail}
              aria-label="Copy email"
              className="absolute left-1/2 top-1/2 grid size-[46px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink-2 shadow-[0_0_0_4px_#fff,0_0_0_5px_var(--color-line)] transition-[color,scale] duration-150 hover:text-blue active:scale-[0.94]"
            >
              <Mail className="size-[18px]" strokeWidth={1.6} />
            </button>
          </div>
          <div className="mx-1 my-1.5 h-px bg-line" />
          <Link href={site.links.resume} className={row} onClick={() => setOpen(false)}>
            <FileText className="size-4" strokeWidth={1.6} /> Resume
          </Link>
          <button
            type="button"
            className={row}
            onClick={() => {
              setOpen(false);
              openPalette();
            }}
          >
            <Search className="size-4" strokeWidth={1.6} /> Search
            <kbd className="ml-auto font-mono text-[11px] text-faint">⌘K</kbd>
          </button>
          <Link href="/site-info" className={row} onClick={() => setOpen(false)}>
            <Info className="size-4" strokeWidth={1.6} /> Site info
          </Link>
        </div>
      )}
    </div>
  );
}
