"use client";

import { useEffect, useState } from "react";
import { BookOpen, Briefcase, FileText, GraduationCap, Hand, MessageCircle, Wrench, type LucideIcon } from "lucide-react";
import clsx from "clsx";

const icons: Record<string, LucideIcon> = {
  story: Hand,
  experience: Briefcase,
  tools: Wrench,
  education: GraduationCap,
  ask: MessageCircle,
  resume: FileText,
  notes: BookOpen,
};

/** Sticky left index for long pages. Highlights whichever section is mid-screen. */
export function SectionNav({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [sections]);

  return (
    <nav aria-label="On this page" className="sticky top-[38vh] hidden self-start md:block">
      <ul className="grid gap-1">
        {sections.map((s) => {
          const Icon = icons[s.id] ?? Hand;
          const on = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={on ? "true" : undefined}
                className={clsx(
                  "flex items-center gap-2.5 rounded-[8px] py-1 text-[15px] transition-colors duration-200",
                  on ? "text-ink" : "text-faint hover:text-blue",
                )}
              >
                <Icon className="size-4" strokeWidth={1.7} />
                {s.label}
                {on && <span aria-hidden="true" className="size-[7px] rotate-45 rounded-[2px] bg-blue" />}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
