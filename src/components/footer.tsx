"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { site } from "@/lib/site";
import { copyEmail } from "./say-hi";
import { GitHubIcon, LinkedInIcon, XIcon } from "./icons";
import { StatusLine } from "./status";

type Node = { x: number; y: number; glow: number };

/**
 * Night graph: a loose mesh of nodes. Nodes near the pointer light up and their
 * edges brighten. A click sends a "message" that hops outward edge by edge.
 */
function useNodeGraph(canvasRef: React.RefObject<HTMLCanvasElement | null>, hostRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let nodes: Node[] = [];
    let edges: [number, number][] = [];
    let pulses: { frontier: number[]; seen: Set<number>; tick: number }[] = [];
    const pointer = { x: -999, y: -999 };
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;

    // Deterministic jitter so the mesh looks the same on every visit.
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

    const build = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed = 7;
      const gap = 46;
      nodes = [];
      for (let y = gap / 2; y < h; y += gap)
        for (let x = gap / 2; x < w; x += gap) nodes.push({ x: x + (rand() - 0.5) * 26, y: y + (rand() - 0.5) * 26, glow: 0 });
      edges = [];
      for (let i = 0; i < nodes.length; i++)
        for (let j = i + 1; j < nodes.length; j++)
          if (Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) < 58 && rand() < 0.5) edges.push([i, j]);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        const d = Math.hypot(n.x - pointer.x, n.y - pointer.y);
        const target = d < 130 ? 1 - d / 130 : 0;
        n.glow += (target - n.glow) * 0.12;
      }
      for (const p of pulses) {
        p.tick++;
        if (p.tick % 5 !== 0) continue;
        const next: number[] = [];
        for (const i of p.frontier)
          for (const [a, b] of edges) {
            const n = a === i ? b : b === i ? a : -1;
            if (n >= 0 && !p.seen.has(n) && Math.random() < 0.72) {
              p.seen.add(n);
              next.push(n);
              nodes[n].glow = 1;
            }
          }
        p.frontier = next;
      }
      pulses = pulses.filter((p) => p.frontier.length);

      ctx.lineWidth = 1;
      for (const [a, b] of edges) {
        const g = Math.max(nodes[a].glow, nodes[b].glow);
        ctx.strokeStyle = `rgba(140,152,255,${0.06 + g * 0.55})`;
        ctx.beginPath();
        ctx.moveTo(nodes[a].x, nodes[a].y);
        ctx.lineTo(nodes[b].x, nodes[b].y);
        ctx.stroke();
      }
      for (const n of nodes) {
        ctx.fillStyle = n.glow > 0.05 ? `rgba(140,152,255,${0.35 + n.glow * 0.65})` : "rgba(233,234,243,0.22)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.3 + n.glow * 1.8, 0, Math.PI * 2);
        ctx.fill();
        n.glow *= 0.985;
      }
      if (visible && !reduce) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };
    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      if ((e.target as Element).closest("a,button")) return;
      Object.assign(pointer, local(e));
      if (reduce) start();
    };
    const onLeave = () => Object.assign(pointer, { x: -999, y: -999 });
    const onDown = (e: PointerEvent) => {
      if ((e.target as Element).closest("a,button")) return;
      const { x, y } = local(e);
      let best = 0;
      let bd = Infinity;
      nodes.forEach((n, i) => {
        const d = Math.hypot(n.x - x, n.y - y);
        if (d < bd) [bd, best] = [d, i];
      });
      nodes[best].glow = 1;
      pulses.push({ frontier: [best], seen: new Set([best]), tick: 0 });
      if (reduce) start();
    };

    build();
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else cancelAnimationFrame(raf);
    });
    io.observe(host);
    const ro = new ResizeObserver(() => {
      build();
      start();
    });
    ro.observe(canvas);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
    };
  }, [canvasRef, hostRef]);
}

const social = "grid size-9 place-items-center rounded-[10px] text-night-ink/60 transition-colors duration-150 hover:bg-white/10 hover:text-night-blue";

export function Footer() {
  const hostRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useNodeGraph(canvasRef, hostRef);

  return (
    <footer
      ref={hostRef}
      className="sticky bottom-0 z-0 h-[var(--footer-h)] overflow-hidden bg-night text-night-ink"
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full" />
      <div className="pointer-events-none relative mx-auto flex h-full max-w-[1440px] flex-col justify-end gap-6 px-[var(--gutter)] pb-[calc(env(safe-area-inset-bottom,0px)+96px)] md:pb-10">
        <p className="font-mono text-[12px] text-night-ink/50">$ say-hi --to rohan</p>
        <button
          type="button"
          onClick={copyEmail}
          data-cursor="copy email"
          aria-label={`Copy email ${site.email}`}
          className="group pointer-events-auto w-fit text-left font-serif text-[clamp(30px,6.2vw,76px)] font-medium leading-[1.02] tracking-[-0.015em] [overflow-wrap:anywhere]"
        >
          {[...site.email].map((ch, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="inline-block transition-[translate,color] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-2 hover:text-night-blue"
            >
              {ch}
            </span>
          ))}
        </button>
        <div className="pointer-events-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <a className={social} href={site.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <LinkedInIcon className="size-[17px]" />
            </a>
            <a className={social} href={site.links.x} target="_blank" rel="noreferrer" aria-label="X">
              <XIcon className="size-[15px]" />
            </a>
            <a className={social} href={site.links.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <GitHubIcon className="size-[17px]" />
            </a>
            <Link className={social} href={site.links.resume} aria-label="Resume">
              <FileText className="size-[17px]" strokeWidth={1.6} />
            </Link>
          </div>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[12px] text-night-ink/55">
            <StatusLine />
            <span>© 2026</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
