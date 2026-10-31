"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Check, Link2, Printer } from "lucide-react";
import { toast } from "sonner";
import clsx from "clsx";

const LOG = [
  "$ pdflatex resume.tex",
  "This is pdfTeX, Version 3.141592653",
  "(./resume.tex  LaTeX2e <2026-06-01>",
  "(charter.sty) (titlesec.sty) (enumitem.sty) (hyperref.sty)",
  "[1] Overfull \\hbox (0.0pt too wide) — none, it fits",
  "Output written on resume.pdf (1 page, 64512 bytes).",
];

/**
 * Plays a short LaTeX compile log, then reveals the typeset sheet. Shows once
 * per browser session; reduced motion skips straight to the sheet.
 */
export function ResumeView({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("resume-compiled") === "1";
    } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      const id = window.setTimeout(() => setReady(true), 0);
      return () => window.clearTimeout(id);
    }
    const timers = LOG.map((_, i) => window.setTimeout(() => setLines(i + 1), 120 + i * 190));
    timers.push(
      window.setTimeout(() => {
        setReady(true);
        try {
          sessionStorage.setItem("resume-compiled", "1");
        } catch {}
      }, 120 + LOG.length * 190 + 250),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Link copied");
    } catch {
      toast("Couldn't copy the link");
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center gap-2 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-[14px] font-medium text-white transition-[scale] active:scale-[0.97]"
        >
          <Printer className="size-4" strokeWidth={1.8} /> Save as PDF
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-card px-4 text-[14px] font-medium text-ink-2 transition-[background-color,color,scale] hover:bg-blue-fill hover:text-blue active:scale-[0.97]"
        >
          <Link2 className="size-4" strokeWidth={1.8} /> Copy link
        </button>
        <span className={clsx("ml-1 inline-flex items-center gap-1.5 font-mono text-[12px] transition-colors", ready ? "text-ok" : "text-faint")}>
          {ready ? <Check className="size-3.5" /> : <i className="size-1.5 animate-[caret_1s_steps(1)_infinite] rounded-full bg-faint" />}
          {ready ? "compiled · 1 page" : "compiling…"}
        </span>
      </div>

      <div className="relative">
        {!ready && (
          <pre
            aria-hidden="true"
            className="absolute inset-x-0 top-0 z-10 overflow-hidden rounded-[18px] bg-night p-5 font-mono text-[12px] leading-relaxed text-night-ink/80 print:hidden"
          >
            {LOG.slice(0, lines).map((l, i) => (
              <div key={i} className={i === 0 ? "text-night-blue" : i === LOG.length - 1 ? "text-[#7fd6a3]" : undefined}>
                {l}
              </div>
            ))}
          </pre>
        )}
        <div
          className={clsx(
            "print-area transition-[opacity,translate,filter] duration-700 ease-[var(--ease-out-soft)]",
            ready ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0 blur-[2px]",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
