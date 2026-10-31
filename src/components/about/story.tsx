import { Portrait } from "../portrait";

export type Segment = { text: string; mark?: boolean };
export type Paragraph = Segment[];

const SIZE = 132;

/** The About story, wrapping around a round portrait (CSS shape-outside). */
export function Story({ paragraphs }: { paragraphs: Paragraph[] }) {
  return (
    <div className="text-[16.5px] leading-[28px] text-ink-2 [&>p+p]:mt-[14px] after:block after:clear-both">
      <span
        className="float-right mb-2 ml-5 mt-1 rounded-full shadow-[0_0_0_4px_#fff,0_0_0_5px_var(--color-line),0_14px_30px_-14px_rgba(0,0,0,0.35)] [shape-margin:14px] [shape-outside:circle(50%)]"
        style={{ width: SIZE, height: SIZE }}
      >
        <Portrait size={SIZE} />
      </span>
      {paragraphs.map((p, i) => (
        <p key={i}>
          {p.map((s, j) =>
            s.mark ? (
              <span key={j} className="mark">
                {s.text}
              </span>
            ) : (
              <span key={j}>{s.text}</span>
            ),
          )}
        </p>
      ))}
    </div>
  );
}
