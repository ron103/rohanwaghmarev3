import Image from "next/image";
import clsx from "clsx";
import photo from "../../public/rohan.webp";

/**
 * Rohan's photo, cropped to a circle around the face. The source is a 3:4
 * portrait, so it is zoomed toward the face instead of showing the whole frame.
 */
export function Portrait({ size, className, priority }: { size: number; className?: string; priority?: boolean }) {
  return (
    <span className={clsx("relative block overflow-hidden rounded-full bg-[#5a3a26]", className)} style={{ width: size, height: size }}>
      <Image
        src={photo}
        alt="Rohan Waghmare"
        placeholder="blur"
        priority={priority}
        sizes={`${size * 2}px`}
        className="absolute inset-0 size-full origin-[48%_30%] scale-[1.5] object-cover object-[50%_18%]"
      />
    </span>
  );
}
