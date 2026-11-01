"use client";

import { Search } from "lucide-react";
import { openPalette } from "./command-palette";

/** Top-bar entry point for the ⌘K palette (desktop; phones use Say hi → Search). */
export function PaletteButton() {
  return (
    <button
      type="button"
      onClick={openPalette}
      aria-label="Search (⌘K)"
      data-cursor="search everything"
      className="hidden h-9 items-center gap-2 rounded-full px-3 font-mono text-[11.5px] text-muted shadow-[inset_0_0_0_1px_var(--color-line)] transition-[background-color,color,scale] hover:bg-blue-fill hover:text-blue active:scale-[0.96] md:inline-flex"
    >
      <Search className="size-3.5" strokeWidth={1.8} />
      ⌘K
    </button>
  );
}
