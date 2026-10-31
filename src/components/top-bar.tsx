"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { nav } from "@/lib/site";
import { DoodleLogo } from "./icons";
import { SayHi } from "./say-hi";
import { StatusPill } from "./status";

export function isActive(pathname: string, href: string) {
  return href === "/"
    ? pathname === "/"
    : pathname === href || pathname.startsWith(href + "/");
}

export function TopBar() {
  const pathname = usePathname();
  const [tucked, setTucked] = useState(false);
  const last = useRef(0);

  // Tuck away while scrolling down, come back on any scroll up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 120) setTucked(false);
      else if (y > last.current + 4) setTucked(true);
      else if (y < last.current - 4) setTucked(false);
      last.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-tucked={tucked || undefined}
      className="top-bar fixed inset-x-0 top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center px-[var(--gutter)] pb-4 pt-[calc(env(safe-area-inset-top,0px)+20px)]"
    >
      <div className="top-bar-glass" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <Link
        href="/"
        aria-label="Home"
        data-cursor="home"
        className="group w-fit rounded-full"
      >
        <DoodleLogo className="avatar-bloom size-11 transition-transform duration-300 ease-[var(--ease-pop)] group-hover:-rotate-6 group-active:scale-95" />
      </Link>

      <div className="flex justify-center">
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "flex h-9 items-center gap-2 rounded-[10px] px-3 text-[15px] transition-[color,background-color,scale] duration-200 ease-out active:scale-[0.96]",
                  active
                    ? "text-ink"
                    : "text-muted hover:bg-blue-fill hover:text-blue",
                )}
              >
                {active && (
                  <span
                    aria-hidden="true"
                    className="size-[7px] rotate-45 rounded-[2px] bg-blue"
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center justify-end gap-3">
        <StatusPill className="hidden lg:flex" />
        <SayHi />
      </div>
    </header>
  );
}
