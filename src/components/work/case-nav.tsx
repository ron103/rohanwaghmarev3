"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";

type Item = { slug: string; company: string; role: string };

/**
 * Left index for case studies: every company, with the current one expanded
 * into its sections. The section under the middle of the screen is marked.
 */
export function CaseNav({ items, current, sections }: { items: Item[]; current: string; sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [sections]);

  return (
    <nav aria-label="Case studies" className="sticky top-[28vh] hidden self-start md:block">
      <ul className="grid gap-4">
        {items.map((it) => {
          const open = it.slug === current;
          return (
            <li key={it.slug}>
              <Link
                href={`/work/${it.slug}`}
                prefetch
                aria-current={open ? "page" : undefined}
                className={clsx("grid leading-tight transition-colors", open ? "text-ink" : "text-faint hover:text-blue")}
              >
                <span className="text-[15px] font-medium">{it.company}</span>
                <span className={clsx("text-[12.5px]", open ? "text-muted" : "text-faint/80")}>{it.role}</span>
              </Link>
              {open && (
                <ul className="mt-3 grid gap-1.5 border-l border-line pl-3">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className={clsx(
                          "flex items-center gap-2 text-[13.5px] transition-colors",
                          active === s.id ? "text-ink" : "text-faint hover:text-blue",
                        )}
                      >
                        {s.label}
                        {active === s.id && <span aria-hidden="true" className="size-[6px] rotate-45 rounded-[1.5px] bg-blue" />}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
