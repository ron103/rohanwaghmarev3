"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { OrgLogo, type Org } from "../org-logo";

export type NavItem = { slug: string; company: string; role: string; logo?: Org; href: string; stories?: { href: string; label: string }[] };
type SectionLink = { id: string; label: string };

/**
 * Left index for case studies: every company, with the current one expanded
 * into its stories (when it has several) and the current story into its
 * sections. The section under the middle of the screen is marked.
 */
export function CaseNav({
  items,
  current,
  currentHref,
  sections,
  label,
}: {
  items: NavItem[];
  current: string;
  currentHref: string;
  sections: SectionLink[];
  label: string;
}) {
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
    <nav aria-label={label} className="sticky top-[28vh] hidden self-start md:block">
      <ul className="grid gap-4">
        {items.map((it) => {
          const open = it.slug === current;
          return (
            <li key={it.slug}>
              <Link
                href={it.href}
                prefetch
                aria-current={open ? "page" : undefined}
                className={clsx("grid leading-tight transition-colors", open ? "text-ink" : "text-faint hover:text-blue")}
              >
                <span className="flex items-center gap-2 text-[15px] font-medium">
                  {it.logo && <OrgLogo org={it.logo} size={16} className={open ? undefined : "opacity-60 grayscale"} />}
                  {it.company}
                </span>
                <span className={clsx("text-[12.5px]", open ? "text-muted" : "text-faint/80")}>{it.role}</span>
              </Link>
              {open &&
                (it.stories ? (
                  <ul className="mt-3 grid gap-2 border-l border-line pl-3">
                    {it.stories.map((st) => {
                      const here = st.href === currentHref;
                      return (
                        <li key={st.href}>
                          <Link
                            href={st.href}
                            prefetch
                            aria-current={here ? "page" : undefined}
                            className={clsx("text-[13.5px] font-medium transition-colors", here ? "text-ink" : "text-faint hover:text-blue")}
                          >
                            {st.label}
                          </Link>
                          {here && <Sections sections={sections} active={active} />}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <Sections sections={sections} active={active} className="mt-3 border-l border-line pl-3" />
                ))}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function Sections({ sections, active, className }: { sections: SectionLink[]; active?: string; className?: string }) {
  return (
    <ul className={clsx("grid gap-1.5", className ?? "mt-2 pl-3")}>
      {sections.map((s) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className={clsx("flex items-center gap-2 text-[13px] transition-colors", active === s.id ? "text-ink" : "text-faint hover:text-blue")}
          >
            {s.label}
            {active === s.id && <span aria-hidden="true" className="size-[6px] rotate-45 rounded-[1.5px] bg-blue" />}
          </a>
        </li>
      ))}
    </ul>
  );
}
