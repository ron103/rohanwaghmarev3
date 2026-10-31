import { ViewTransition, type ReactNode } from "react";
import clsx from "clsx";
import { NodeMark } from "./icons";

/** Wraps a route's content so navigations fade/blur between pages. */
export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <div className={clsx("mx-auto w-full max-w-[1440px] px-[var(--gutter)]", className)}>{children}</div>
    </ViewTransition>
  );
}

/** Small section label: node mark, name, optional count. */
export function SectionLabel({ children, count }: { children: ReactNode; count?: number }) {
  return (
    <h2 className="flex items-center gap-2 text-[15px] font-medium text-muted">
      <NodeMark className="size-3.5 text-muted" />
      {children}
      {count !== undefined && <span className="font-mono text-[12px] text-faint">({count})</span>}
    </h2>
  );
}

/** Striped box that marks content still to be written. */
export function Placeholder({ label, className, children }: { label: string; className?: string; children?: ReactNode }) {
  return (
    <div className={clsx("placeholder-stripes relative grid place-items-center overflow-hidden rounded-[16px] shadow-[inset_0_0_0_1px_var(--color-line)]", className)}>
      <span className="rounded-full bg-white/85 px-3 py-1 font-mono text-[11.5px] text-muted shadow-[0_0_0_1px_var(--color-line)]">
        {label}
      </span>
      {children}
    </div>
  );
}

/** Simple top-of-page heading for inner pages. */
export function PageHeader({ eyebrow, title, lede }: { eyebrow: string; title: ReactNode; lede?: ReactNode }) {
  return (
    <header className="grid max-w-[760px] gap-5 pt-[calc(env(safe-area-inset-top,0px)+120px)] md:pt-[200px]">
      <p className="font-mono text-[12px] tracking-[0.03em] text-muted">{eyebrow}</p>
      <h1 className="font-serif text-[clamp(38px,5.6vw,68px)] font-semibold leading-[1.04] tracking-[-0.015em]">{title}</h1>
      {lede && <p className="max-w-[60ch] text-[16.5px] leading-relaxed text-muted">{lede}</p>}
    </header>
  );
}
