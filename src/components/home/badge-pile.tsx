"use client";

import { useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import clsx from "clsx";
import { GoldenGateIcon, NodeMark } from "../icons";

type Badge = {
  id: string;
  label: string;
  href: string;
  x: number; // 0..1 across the free width of the pile
  w: number; // badge width in px
  y: number; // px from top
  tilt: number;
  round?: boolean;
  className: string;
  face: ReactNode;
};

// Placeholder art. Each one gets real illustration later.
const badges: Badge[] = [
  {
    id: "sap",
    label: "SAP Labs badge. Opens the SAP case study.",
    href: "/work/sap",
    x: 0,
    w: 164,
    y: 22,
    tilt: -7,
    className: "h-[104px] w-[164px]",
    face: (
      <div className="grid h-full grid-rows-[auto_1fr_auto] p-3 text-left">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9.5px] font-semibold tracking-[0.12em] text-blue">SAP LABS US</span>
          <span className="h-1.5 w-7 rounded-full bg-card-2" />
        </div>
        <div className="flex items-center gap-2.5">
          <span className="placeholder-stripes size-9 rounded-full" />
          <span className="grid leading-tight">
            <b className="text-[13px] font-semibold text-ink">Rohan W.</b>
            <span className="text-[10.5px] text-muted">AI · Palo Alto</span>
          </span>
        </div>
        <span className="font-mono text-[8.5px] tracking-[0.08em] text-faint">EMP · 2026</span>
      </div>
    ),
  },
  {
    id: "bing",
    label: "Binghamton student ID. Opens the About page.",
    href: "/about",
    x: 0.3,
    w: 156,
    y: 4,
    tilt: 5,
    className: "h-[100px] w-[156px]",
    face: (
      <div className="grid h-full grid-rows-[auto_1fr] text-left">
        <div className="bg-[#0b5a43] px-3 py-1.5 font-mono text-[9px] font-semibold tracking-[0.1em] text-white">BINGHAMTON · MS CS</div>
        <div className="grid content-center gap-1 px-3">
          <b className="font-serif text-[18px] font-medium leading-none text-ink">Class of &apos;25</b>
          <span className="text-[10.5px] text-muted">Computer Science</span>
        </div>
      </div>
    ),
  },
  {
    id: "ieee",
    label: "IEEE paper. Opens Projects.",
    href: "/projects",
    x: 0.6,
    w: 124,
    y: 30,
    tilt: -3,
    className: "h-[112px] w-[124px]",
    face: (
      <div className="grid h-full content-start gap-1.5 p-3 text-left">
        <span className="font-mono text-[9px] font-semibold tracking-[0.12em] text-muted">IEEE · 2023</span>
        <b className="font-serif text-[13.5px] font-medium leading-[1.15] text-ink">TB detection via transfer learning</b>
        <span className="mt-1 grid gap-1">
          <i className="h-1 w-full rounded bg-card-2" />
          <i className="h-1 w-4/5 rounded bg-card-2" />
          <i className="h-1 w-3/5 rounded bg-card-2" />
        </span>
      </div>
    ),
  },
  {
    id: "graph",
    label: "Node sticker. Opens Notes.",
    href: "/notes",
    x: 0.86,
    w: 86,
    y: 0,
    tilt: 9,
    round: true,
    className: "size-[86px]",
    face: (
      <div className="grid h-full place-items-center bg-blue-fill">
        <NodeMark className="size-9 text-ink" />
      </div>
    ),
  },
  {
    id: "bridge",
    label: "Golden Gate sticker. Opens the About page.",
    href: "/about",
    x: 1,
    w: 78,
    y: 96,
    tilt: -12,
    round: true,
    className: "size-[78px]",
    face: (
      <div className="grid h-full place-items-center bg-[#fbeae4]">
        <GoldenGateIcon animate={false} className="h-6 w-10" />
      </div>
    ),
  },
];

function Sticker({ badge, bounds, z, onFront }: { badge: Badge; bounds: React.RefObject<HTMLDivElement | null>; z: number; onFront: () => void }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dragged = useRef(false);
  const [peeling, setPeeling] = useState(false);

  const peel = () => {
    if (peeling) return;
    if (reduce) return router.push(badge.href);
    setPeeling(true);
    onFront();
    animate(x, x.get() + 70, { duration: 0.5, ease: [0.55, 0, 0.75, 0] });
    animate(y, y.get() - 240, { duration: 0.5, ease: [0.55, 0, 0.75, 0] });
    window.setTimeout(() => router.push(badge.href), 480);
  };

  return (
    <motion.button
      type="button"
      aria-label={badge.label}
      data-cursor="drag me, or click"
      drag={!peeling}
      dragConstraints={bounds}
      dragElastic={0.18}
      dragTransition={{ bounceStiffness: 320, bounceDamping: 18 }}
      onPointerDown={onFront}
      onDragStart={() => (dragged.current = true)}
      onClick={() => {
        if (dragged.current) {
          dragged.current = false;
          return;
        }
        peel();
      }}
      onKeyDown={(e) => {
        const step = e.shiftKey ? 40 : 12;
        const moves: Record<string, [number, number]> = {
          ArrowLeft: [-step, 0],
          ArrowRight: [step, 0],
          ArrowUp: [0, -step],
          ArrowDown: [0, step],
        };
        const m = moves[e.key];
        if (!m) return;
        e.preventDefault();
        x.set(x.get() + m[0]);
        y.set(y.get() + m[1]);
      }}
      initial={reduce ? false : { opacity: 0, scale: 0.6, rotate: badge.tilt - 18 }}
      animate={peeling ? { opacity: 0, rotate: badge.tilt + 28, scale: 1.08 } : { opacity: 1, scale: 1, rotate: badge.tilt }}
      transition={peeling ? { duration: 0.45, delay: 0.1 } : { type: "spring", stiffness: 260, damping: 18, delay: 0.25 + badges.indexOf(badge) * 0.07 }}
      whileDrag={{ scale: 1.06, rotate: badge.tilt * 0.4, cursor: "grabbing" }}
      style={{ x, y, left: `calc((100% - ${badge.w}px) * ${badge.x})`, top: badge.y, zIndex: z, touchAction: "none" }}
      className={clsx(
        "badge group absolute cursor-grab overflow-hidden bg-white p-1.5 [translate:0_0] hover:[translate:0_-4px] [transition:translate_.28s_var(--ease-out-soft),box-shadow_.3s] shadow-[0_1px_2px_rgba(0,0,0,0.08),0_6px_16px_-8px_rgba(0,0,0,0.28)] outline-offset-4 hover:shadow-[0_2px_4px_rgba(0,0,0,0.08),0_16px_28px_-12px_rgba(0,0,0,0.35)]",
        badge.round ? "rounded-full" : "rounded-[18px]",
        badge.className,
      )}
    >
      <span className={clsx("block h-full overflow-hidden shadow-[inset_0_0_0_1px_var(--color-line)]", badge.round ? "rounded-full" : "rounded-[12px]")}>
        {badge.face}
      </span>
      <span aria-hidden="true" className={clsx("badge-curl", badge.round && "badge-curl-round")} />
    </motion.button>
  );
}

/** A small pile of tilted badges you can drag around, toss, or peel off to open a page. */
export function BadgePile() {
  const bounds = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState(badges.map((b) => b.id));

  return (
    <div ref={bounds} className="relative h-[200px] w-full max-w-[560px]" aria-label="Badges" role="group">
      {badges.map((b) => (
        <Sticker
          key={b.id}
          badge={b}
          bounds={bounds}
          z={order.indexOf(b.id) + 1}
          onFront={() => setOrder((o) => [...o.filter((id) => id !== b.id), b.id])}
        />
      ))}
    </div>
  );
}
