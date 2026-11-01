"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import clsx from "clsx";

export type QA = { q: string; a: string };

/** Questions people tend to ask, with answers I wrote. One open at a time. */
export function Faq({ qas }: { qas: QA[] }) {
  const [open, setOpen] = useState(0);
  const reduce = useReducedMotion();

  return (
    <ul className="grid gap-2">
      {qas.map((x, i) => {
        const isOpen = open === i;
        return (
          <li key={x.q} className={clsx("rounded-[16px] transition-colors duration-200", isOpen ? "bg-card" : "bg-card/50 hover:bg-card")}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[16px] font-medium text-ink-2"
            >
              {x.q}
              <Plus className={clsx("size-4 shrink-0 text-muted transition-transform duration-200", isOpen && "rotate-45 text-blue")} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.26, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-[15.5px] leading-relaxed text-muted">{x.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
