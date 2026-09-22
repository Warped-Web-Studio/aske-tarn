import type { ElementType } from "react";

type SetLinesProps = {
  as?: ElementType;
  lines: readonly string[];
  className?: string;
  id?: string;
  /** Delay the reveal by this many stagger steps. */
  index?: number;
  /** Set false when an ancestor already carries `data-reveal`. */
  reveal?: boolean;
};

/**
 * Type set line by line: each line rises out of its own mask.
 * Line breaks are authored, not measured, so the typography is designed
 * rather than accidental — and nothing needs to run on the client.
 */
export function SetLines({ as: Tag = "h2", lines, className, id, index = 0, reveal = true }: SetLinesProps) {
  return (
    <Tag
      id={id}
      className={className}
      data-reveal={reveal ? "" : undefined}
      style={{ "--i": index } as React.CSSProperties}
    >
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} data-line style={{ "--line": lineIndex } as React.CSSProperties}>
          <span>
            {line}
            {lineIndex < lines.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}
