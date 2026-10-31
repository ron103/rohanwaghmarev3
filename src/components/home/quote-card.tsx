"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";

/** A quote is a list of segments; marked segments get the highlighter sweep. */
export type Quote = { text: string; mark?: boolean }[];

const WORD_MS = 55;
const CYCLE_MS = 7000;

type MarkStyle = React.CSSProperties | undefined;

/**
 * Splits a quote into words and schedules the highlighter. Marks sweep after
 * the words have landed, piece by piece, so the stroke reads as one continuous
 * line across marked words and the gaps between them.
 */
function layout(q: Quote, animate: boolean) {
  const list = q.flatMap((seg) => seg.text.split(/\s+/).filter(Boolean).map((w) => ({ w, mark: !!seg.mark })));
  const sweep = (start: number, chars: number): [MarkStyle, number] => {
    const duration = Math.max(60, chars * 28);
    const style = animate
      ? {
          animationName: "quote-mark-in",
          animationDelay: `${start}ms`,
          animationDuration: `${duration}ms`,
          animationTimingFunction: "linear",
          animationFillMode: "forwards",
        }
      : { backgroundSize: "100% 40%" };
    return [style, start + duration];
  };
  const pieces: { w: string; mark: boolean; wordStyle: MarkStyle; gapStyle: MarkStyle }[] = [];
  list.reduce((clock, { w, mark }, n) => {
    let wordStyle: MarkStyle;
    let gapStyle: MarkStyle;
    if (mark) [wordStyle, clock] = sweep(clock, w.length);
    if (mark && list[n + 1]?.mark) [gapStyle, clock] = sweep(clock, 1);
    pieces.push({ w, mark, wordStyle, gapStyle });
    return clock;
  }, list.length * WORD_MS + 120);
  return pieces;
}

/**
 * Note card whose quote fades in word by word from a blur, then a highlighter
 * sweeps under the key phrase. Cycles through its quotes while on screen.
 */
export function QuoteCard({ quotes, meta, href, offset = 0 }: { quotes: Quote[]; meta: string; href: string; offset?: number }) {
  const [i, setI] = useState(0);
  const [animate, setAnimate] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);
  const hover = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || quotes.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    let id = 0;
    const start = window.setTimeout(() => {
      id = window.setInterval(() => {
        if (!visible || hover.current || document.visibilityState !== "visible") return;
        setAnimate(true);
        setI((n) => (n + 1) % quotes.length);
      }, CYCLE_MS);
    }, offset);
    return () => {
      io.disconnect();
      window.clearTimeout(start);
      window.clearInterval(id);
    };
  }, [quotes.length, offset]);

  const pieces = layout(quotes[i], animate);

  return (
    <Link
      ref={ref}
      href={href}
      data-cursor="read note"
      onPointerEnter={() => (hover.current = true)}
      onPointerLeave={() => (hover.current = false)}
      className="group grid min-h-[280px] min-w-0 content-between gap-8 rounded-[16px] p-5 shadow-[inset_0_0_0_1px_var(--color-line)] transition-[background-color] duration-200 hover:bg-card/60"
    >
      <q key={i} className="font-serif text-[clamp(24px,2.3vw,28px)] font-light leading-[1.22] [quotes:none]">
        {pieces.map(({ w, mark, wordStyle, gapStyle }, n) => (
          <Fragment key={n}>
            <span
              className={animate ? "inline-block animate-[word-in_.6s_var(--ease-out-soft)_both]" : "inline"}
              style={animate ? { animationDelay: `${n * WORD_MS}ms` } : undefined}
            >
              {mark ? (
                <span className="quote-mark" style={wordStyle}>
                  {w}
                </span>
              ) : (
                w
              )}
            </span>
            {n < pieces.length - 1 &&
              (gapStyle ? (
                <span className="quote-mark" style={gapStyle}>
                  {" "}
                </span>
              ) : (
                " "
              ))}
          </Fragment>
        ))}
      </q>
      <span className="flex items-center justify-between gap-3 text-[14px] font-medium text-faint">
        {meta}
        {quotes.length > 1 && (
          <span aria-hidden="true" className="flex gap-1">
            {quotes.map((_, n) => (
              <i key={n} className={`block h-1 rounded-full transition-all duration-300 ${n === i ? "w-4 bg-blue" : "w-1 bg-line"}`} />
            ))}
          </span>
        )}
      </span>
    </Link>
  );
}
