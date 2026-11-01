"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import clsx from "clsx";
import { OrgLogo, type Org } from "../org-logo";

export type Role = {
  id: string;
  when: string;
  company: string;
  logo?: Org;
  role: string;
  team?: string;
  place: string;
  highlights: string[];
};

/**
 * Experience as a timeline. The line draws itself as you scroll; each role
 * opens to show what I did there.
 */
export function Timeline({ roles }: { roles: Role[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const [open, setOpen] = useState<string | null>(roles[0]?.id ?? null);

  return (
    <ol ref={ref} className="relative grid gap-1">
      {/* Track + the drawn branch line */}
      <span aria-hidden="true" className="absolute bottom-6 left-[11px] top-6 w-px bg-line" />
      <motion.span
        aria-hidden="true"
        className="absolute bottom-6 left-[11px] top-6 w-px origin-top bg-blue"
        style={{ scaleY: reduce ? 1 : progress }}
      />
      {roles.map((c, i) => {
        const isOpen = open === c.id;
        const head = i === 0;
        return (
          <li key={c.id} className="relative grid grid-cols-[24px_minmax(0,1fr)] gap-4">
            <span aria-hidden="true" className="relative z-[1] mt-[22px] grid size-[23px] place-items-center">
              <span className={clsx("block rounded-full border-2 bg-white", head ? "size-3.5 border-blue" : "size-3 border-ink-2")} />
            </span>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : c.id)}
              data-cursor={isOpen ? "collapse" : "show highlights"}
              className="grid w-full gap-1 rounded-[12px] px-3 py-3.5 text-left transition-colors duration-150 hover:bg-card/70"
            >
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex items-center gap-2 text-[16px] font-semibold text-ink-2">
                  {c.logo && <OrgLogo org={c.logo} size={20} />}
                  {c.company}
                </span>
                <span className={clsx("ml-auto font-mono text-[12px]", head ? "text-blue" : "text-faint")}>{c.when}</span>
              </span>
              <span className="text-[15px] text-muted">
                {c.role}
                {c.team && <span className="text-ink-2"> · {c.team}</span>}
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
                    <span className="mt-3 grid gap-2 text-[14.5px] leading-relaxed text-ink-2">
                      {c.highlights.map((d) => (
                        <span key={d} className="grid grid-cols-[16px_minmax(0,1fr)]">
                          <span aria-hidden="true" className="mt-[9px] block size-[5px] rounded-full bg-blue" />
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
