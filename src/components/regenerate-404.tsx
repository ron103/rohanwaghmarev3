"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, RotateCw } from "lucide-react";

const guesses = [
  { href: "/", text: "You probably wanted the home page." },
  { href: "/work/sap", text: "Maybe the case study about replacing GPT with models we own?" },
  { href: "/about", text: "Perhaps you were looking for who I am." },
  { href: "/projects", text: "Could be the projects page, the one with terminals." },
  { href: "/notes/embed-less", text: "Possibly the note about embedding less to find more." },
  { href: "/resume", text: "Or you just wanted the resume. Fair." },
];

/** The 404's Regenerate: streams a fresh guess at what you meant, with a link to go there. */
export function Regenerate404() {
  const [n, setN] = useState(0);
  const [shown, setShown] = useState(Infinity);
  const words = guesses[n].text.split(" ");

  useEffect(() => {
    if (shown >= words.length) return;
    const id = window.setTimeout(() => setShown((s) => s + 1), 60 + Math.random() * 80);
    return () => window.clearTimeout(id);
  }, [shown, words.length]);

  const regenerate = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setN((i) => (i + 1) % guesses.length);
    setShown(reduce ? Infinity : 0);
  };
  const done = shown >= words.length;

  return (
    <div className="grid gap-5">
      <div className="grid gap-3 rounded-[16px] bg-card p-5">
        <p className="font-mono text-[11.5px] text-faint">regenerated response {n + 1}/{guesses.length}</p>
        <p className="min-h-[2lh] font-serif text-[clamp(22px,2.6vw,28px)] font-light leading-snug" aria-live="polite">
          {words.slice(0, shown).join(" ")}
          {!done && <i className="ml-1 inline-block h-[0.8em] w-[0.38em] animate-[caret_1s_steps(1)_infinite] bg-blue align-baseline" />}
        </p>
        {done && (
          <Link href={guesses[n].href} className="inline-flex w-fit items-center gap-1.5 text-[14.5px] font-medium text-ink-2 transition-colors hover:text-blue">
            Go to {guesses[n].href} <ArrowRight className="size-4" />
          </Link>
        )}
      </div>
      <button
        type="button"
        onClick={regenerate}
        data-cursor="regenerate"
        className="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-4 py-2 text-[14px] font-medium text-white transition-[scale] active:scale-[0.97]"
      >
        <RotateCw className="size-4" strokeWidth={1.8} /> Regenerate
      </button>
    </div>
  );
}
