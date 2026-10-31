"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export type Tool = { name: string; core?: boolean };

/**
 * Tool chips that fall into a box with real physics (matter-js) when the
 * section scrolls into view. Mouse users can grab and throw them; touch users
 * can tap to shake the box. Reduced motion shows a plain wrapped list.
 */
export function ToolShelf({ tools }: { tools: Tool[] }) {
  const box = useRef<HTMLDivElement>(null);
  const chips = useRef<(HTMLSpanElement | null)[]>([]);
  const shake = useRef<() => void>(() => {});
  const [mode, setMode] = useState<"static" | "physics">("static");
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = box.current;
    if (!el) return;
    let cleanup = () => {};
    let started = false;

    const io = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting || started) return;
        started = true;
        io.disconnect();
        const Matter = (await import("matter-js")).default;
        const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = Matter;

        const W = el.clientWidth;
        const H = el.clientHeight;
        const engine = Engine.create({ gravity: { x: 0, y: 1.1 } });
        const wall = { isStatic: true, render: { visible: false } };
        Composite.add(engine.world, [
          Bodies.rectangle(W / 2, H + 50, W * 2, 100, wall),
          Bodies.rectangle(-50, H / 2, 100, H * 4, wall),
          Bodies.rectangle(W + 50, H / 2, 100, H * 4, wall),
        ]);

        // Seeded so the drop looks the same each visit.
        let seed = 11;
        const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

        const bodies = chips.current.map((chip, i) => {
          const w = chip?.offsetWidth ?? 80;
          const h = chip?.offsetHeight ?? 34;
          const b = Bodies.rectangle(w / 2 + rand() * (W - w), -60 - i * 38, w, h, {
            chamfer: { radius: h / 2 },
            restitution: 0.32,
            friction: 0.4,
            frictionAir: 0.012,
            angle: (rand() - 0.5) * 0.9,
          });
          return b;
        });
        Composite.add(engine.world, bodies);

        const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        if (fine) {
          const mouse = Mouse.create(el);
          // Let the page keep scrolling over the box.
          const m = mouse as unknown as { mousewheel: EventListener; element: HTMLElement };
          m.element.removeEventListener("wheel", m.mousewheel);
          m.element.removeEventListener("mousewheel", m.mousewheel);
          m.element.removeEventListener("DOMMouseScroll", m.mousewheel);
          const mc = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.18, damping: 0.1 } });
          Composite.add(engine.world, mc);
          Events.on(mc, "startdrag", () => setDragging(true));
          Events.on(mc, "enddrag", () => setDragging(false));
        }

        shake.current = () => {
          for (const b of bodies) Body.applyForce(b, b.position, { x: (rand() - 0.5) * 0.04, y: -0.05 * b.mass });
        };

        setMode("physics");
        let raf = 0;
        let last = performance.now();
        const tick = (now: number) => {
          Engine.update(engine, Math.min(32, now - last));
          last = now;
          bodies.forEach((b, i) => {
            const chip = chips.current[i];
            if (!chip) return;
            const w = chip.offsetWidth;
            const h = chip.offsetHeight;
            chip.style.transform = `translate(${b.position.x - w / 2}px, ${b.position.y - h / 2}px) rotate(${b.angle}rad)`;
          });
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        cleanup = () => {
          cancelAnimationFrame(raf);
          Engine.clear(engine);
        };
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cleanup();
    };
  }, []);

  return (
    <div className="grid gap-3">
      <div
        ref={box}
        onClick={() => mode === "physics" && !window.matchMedia("(pointer: fine)").matches && shake.current()}
        className={clsx(
          "relative h-[230px] select-none overflow-hidden rounded-[20px] bg-card shadow-[inset_0_0_0_1px_var(--color-line)]",
          mode === "physics" ? (dragging ? "cursor-grabbing" : "cursor-grab") : "p-5",
        )}
        aria-label="Tools I use"
        role="list"
      >
        <div className={mode === "static" ? "flex flex-wrap content-end gap-2" : undefined}>
          {tools.map((t, i) => (
            <span
              key={t.name}
              role="listitem"
              ref={(n) => {
                chips.current[i] = n;
              }}
              className={clsx(
                "whitespace-nowrap rounded-full px-3.5 py-1.5 font-mono text-[13px] shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_10px_-6px_rgba(0,0,0,0.25)]",
                mode === "physics" ? "absolute left-0 top-0 will-change-transform" : "inline-block",
                t.core ? "bg-blue text-white" : "bg-white text-ink-2",
              )}
              style={mode === "physics" ? { transform: "translate(-999px,-999px)" } : undefined}
            >
              {t.name}
            </span>
          ))}
        </div>
      </div>
      <p className="font-mono text-[12px] text-faint">
        {mode === "physics" ? "grab one and throw it · blue ones I use daily" : "blue ones I use daily"}
      </p>
    </div>
  );
}
