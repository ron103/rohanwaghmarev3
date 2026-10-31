"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Box, Briefcase, House, NotebookPen, User } from "lucide-react";
import { isActive } from "./top-bar";

const items = [
  { href: "/", label: "Home", Icon: House },
  { href: "/about", label: "About", Icon: User },
  { href: "/work", label: "Work", Icon: Briefcase },
  { href: "/projects", label: "Projects", Icon: Box },
  { href: "/notes", label: "Notes", Icon: NotebookPen },
];

export function MobileDock() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+12px)] z-50 flex justify-center md:hidden"
    >
      <div className="flex items-center gap-1 rounded-full bg-white/80 p-1.5 shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.8),0_0_0_0.5px_rgba(0,0,0,0.08),0_10px_30px_-8px_rgba(0,0,0,0.25)] backdrop-blur-xl backdrop-saturate-[1.8]">
        {items.map(({ href, label, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={clsx(
                "grid size-11 place-items-center rounded-full transition-[background-color,color,scale] duration-150 active:scale-90",
                active ? "bg-blue-fill text-blue" : "text-ink-2",
              )}
            >
              <Icon className="size-[19px]" strokeWidth={1.7} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
