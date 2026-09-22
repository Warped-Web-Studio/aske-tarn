import { useId } from "react";
import { levels, solids } from "@/content/models/salt-archive";
import { sectionShapes } from "@/lib/drawing";
import { formatLevel } from "@/lib/format";
import styles from "./SectionDrawing.module.css";

/** Crop of the section, in model metres: x from, width; y top (height), height. */
const VIEW = { x: -46, width: 106, top: 12.4, height: 23 };
const shapes = sectionShapes(solids, -1.2);

/**
 * Long section A–A through The Salt Archive, generated from the model.
 * Levels are HTML so they stay legible at every size.
 */
export function SectionDrawing({ className, title }: { className?: string; title?: string }) {
  const id = useId();
  const earth = `${id}-earth`;
  const water = `${id}-water`;
  const top = (y: number) => `${((VIEW.top - y) / VIEW.height) * 100}%`;

  return (
    <div className={`${styles.drawing} ${className ?? ""}`} data-reveal>
      <svg
        viewBox={`${VIEW.x} ${-VIEW.top} ${VIEW.width} ${VIEW.height}`}
        className={styles.svg}
        role="img"
        aria-label={
          title ??
          "Long section through The Salt Archive: public rooms above the ground line, two levels of vaults below it inside a concrete tank, surrounded by earth."
        }
      >
        <defs>
          <pattern id={earth} width="1.1" height="1.1" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="1.1" className={styles.hatch} />
          </pattern>
          <pattern id={water} width="3" height="0.9" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0.2" x2="1.6" y2="0.2" className={styles.hatch} />
          </pattern>
        </defs>

        {shapes.map((shape, index) => (
          <path
            key={index}
            d={shape.d}
            pathLength={1}
            className={`${styles[shape.kind]} ${styles[shape.group]}`}
            fill={shape.kind === "cut" && shape.group !== "building" ? `url(#${shape.group === "earth" ? earth : water})` : undefined}
            style={{ "--p": index / shapes.length } as React.CSSProperties}
          />
        ))}

        <line x1={VIEW.x} x2={VIEW.x + VIEW.width} y1={0} y2={0} className={styles.ground} pathLength={1} />
      </svg>

      <ol className={styles.levels} aria-hidden="true">
        {levels.map((level) => (
          <li key={level.name} style={{ top: top(level.y) }} data-annotate>
            <span className={styles.levelValue}>{formatLevel(level.y)}</span>
            <span className={styles.levelName}>{level.name}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
