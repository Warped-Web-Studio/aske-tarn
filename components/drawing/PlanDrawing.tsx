import { roomArea, rooms, solids } from "@/content/models/salt-archive";
import { planShapes, rectPath } from "@/lib/drawing";
import { formatArea } from "@/lib/format";
import styles from "./PlanDrawing.module.css";

const shapes = planShapes(solids, 1);

/** Crop of the plan, in metres. North (+z) is up in landscape. */
const LANDSCAPE = { x: -38, y: -11, w: 76, h: 22 };

/**
 * Ground-floor plan, cut at +1.00. The room schedule is the accessible
 * content; hovering or focusing a room — in the schedule or the drawing —
 * lights it in both. Pure CSS (:has), generated per room.
 */
export function PlanDrawing() {
  const highlight = rooms
    .map(
      ({ id }) =>
        `.${styles.plan}:has([data-room="${id}"]:is(:hover,:focus-visible)) [data-room="${id}"]{--on:1}`,
    )
    .join("");

  return (
    <div className={styles.plan} data-reveal>
      <style>{highlight}</style>

      <div className={styles.sheet}>
        {(["landscape", "portrait"] as const).map((orientation) => (
          <svg
            key={orientation}
            className={`${styles.svg} ${styles[orientation]}`}
            viewBox={
              orientation === "landscape"
                ? `${LANDSCAPE.x} ${LANDSCAPE.y} ${LANDSCAPE.w} ${LANDSCAPE.h}`
                : `${LANDSCAPE.y} ${LANDSCAPE.x} ${LANDSCAPE.h} ${LANDSCAPE.w}`
            }
            role="img"
            aria-label="Ground-floor plan of The Salt Archive. Rooms are listed in the schedule."
          >
            <g transform={orientation === "portrait" ? "rotate(90)" : undefined}>
              {rooms.map((room) => (
                <path key={room.id} d={rectPath(room.rect)} className={styles.room} data-room={room.id} />
              ))}
              {shapes.map((shape, index) => (
                <path key={index} d={shape.d} className={styles[shape.kind]} pathLength={1} />
              ))}
              {/* The south facade is glazed between its piers. */}
              <line x1={-35.3} x2={35.3} y1={8.55} y2={8.55} className={styles.glazing} />
            </g>
          </svg>
        ))}

        <div className={styles.north} aria-hidden="true">
          <svg viewBox="0 0 24 32" width="24" height="32">
            <path d="M12 2 L20 28 L12 22 L4 28 Z" fill="none" stroke="currentColor" />
            <path d="M12 2 L12 22 L4 28 Z" fill="currentColor" />
          </svg>
          <span>N</span>
        </div>

        <div className={styles.scale} aria-hidden="true">
          <span className={styles.scaleBar} />
          <span className={styles.scaleLabels}>
            <span>0</span>
            <span>5</span>
            <span>10 m</span>
          </span>
        </div>
      </div>

      <table className={styles.schedule}>
        <caption className="sr-only">Ground-floor rooms and areas</caption>
        <thead>
          <tr>
            <th scope="col">No.</th>
            <th scope="col">Room</th>
            <th scope="col">Area</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, index) => (
            <tr key={room.id} data-room={room.id} tabIndex={0} data-annotate style={{ "--a": index } as React.CSSProperties}>
              <td>G.{String(index + 1).padStart(2, "0")}</td>
              <th scope="row">{room.name}</th>
              <td>{formatArea(roomArea(room))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
