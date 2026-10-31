"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import clsx from "clsx";
import { OrgLogo, type Org } from "../org-logo";

export type Commit = {
  hash: string;
  refs?: string[];
  when: string;
  company: string;
  logo?: Org;
  role: string;
  place: string;
  diff: string[];
};

/**
 * Experience rendered like `git log --graph`. The branch line draws itself as
 * you scroll; each commit opens to show its "diff" (what changed while there).
 */
export function GitLog({ commits }: { commits: Commit[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const [open, setOpen] = useState<string | null>(commits[0]?.hash ?? null);

  return (
    <ol ref={ref} className="relative grid gap-1">
      {/* Track + the drawn branch line */}
      <span aria-hidden="true" className="absolute bottom-6 left-[11px] top-6 w-px bg-line" />
      <motion.span
        aria-hidden="true"
        className="absolute bottom-6 left-[11px] top-6 w-px origin-top bg-blue"
        style={{ scaleY: reduce ? 1 : progress }}
      />
      {commits.map((c, i) => {
        const isOpen = open === c.hash;
        const head = i === 0;
        return (
          <li key={c.hash} className="relative grid grid-cols-[24px_minmax(0,1fr)] gap-4">
            <span aria-hidden="true" className="relative z-[1] mt-[22px] grid size-[23px] place-items-center">
              <span className={clsx("block rounded-full border-2 bg-white", head ? "size-3.5 border-blue" : "size-3 border-ink-2")} />
            </span>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : c.hash)}
              data-cursor={isOpen ? "collapse diff" : "show diff"}
              className="grid w-full gap-1 rounded-[12px] px-3 py-3.5 text-left transition-colors duration-150 hover:bg-card/70"
            >
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[12px]">
                <span className={head ? "text-blue" : "text-faint"}>{c.hash}</span>
                {c.refs?.map((r) => (
                  <span key={r} className="rounded-full bg-blue-fill px-2 py-px text-[11px] text-blue">
                    {r}
                  </span>
                ))}
                <span className="ml-auto text-faint">{c.when}</span>
              </span>
              <span className="flex items-center gap-2 text-[16px] font-semibold text-ink-2">
                {c.logo && <OrgLogo org={c.logo} size={20} />}
                {c.company} <span className="font-normal text-muted">· {c.role}</span>
              </span>
              <span className="text-[13.5px] text-faint">{c.place}</span>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.span
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="block overflow-hidden"
                  >
                    <span className="mt-2 grid gap-1 rounded-[10px] bg-card/80 p-3 font-mono text-[12.5px] leading-relaxed text-ink-2">
                      {c.diff.map((d) => (
                        <span key={d} className="grid grid-cols-[14px_minmax(0,1fr)]">
                          <span className="text-ok">+</span>
                          <span>{d}</span>
                        </span>
                      ))}
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
