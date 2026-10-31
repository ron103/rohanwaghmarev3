import Image from "next/image";
import clsx from "clsx";

export type Org = "sap" | "mihin" | "binghamton" | "mit-adt";

const logos: Record<Org, { src: string; alt: string; w: number; h: number; tile: string }> = {
  sap: { src: "/logos/sap.svg", alt: "SAP", w: 24, h: 14, tile: "bg-white p-[3px]" },
  mihin: { src: "/logos/mihin.png", alt: "MiHIN", w: 192, h: 192, tile: "rounded-full" },
  binghamton: { src: "/logos/binghamton.png", alt: "Binghamton University", w: 104, h: 104, tile: "" },
  "mit-adt": { src: "/logos/mit-adt.png", alt: "MIT ADT University", w: 73, h: 74, tile: "rounded-full bg-white" },
};

/** Small square logo tile for a company or school. */
export function OrgLogo({ org, size = 20, className }: { org: Org; size?: number; className?: string }) {
  const l = logos[org];
  return (
    <span
      className={clsx(
        "inline-grid shrink-0 place-items-center overflow-hidden rounded-[6px] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]",
        l.tile,
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image src={l.src} alt={l.alt} width={l.w} height={l.h} draggable={false} className="size-full object-contain" />
    </span>
  );
}
