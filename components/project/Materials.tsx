import Image from "next/image";
import type { Material } from "@/lib/types";
import styles from "./project.module.css";

/** Standard drawing hatches, chosen by what the material is. */
function hatchFor(name: string): string {
  const n = name.toLowerCase();
  if (/(oak|larch|algarrobo|timber)/.test(n)) return styles.hatchTimber;
  if (/(granite|stone|calcarenite)/.test(n)) return styles.hatchStone;
  if (/(steel|bronze|zinc)/.test(n)) return styles.hatchMetal;
  if (/(glass|laylight)/.test(n)) return styles.hatchGlass;
  if (/(earth|lime|plaster|wash)/.test(n)) return styles.hatchEarth;
  return styles.hatchConcrete;
}

export function Materials({ materials }: { materials: readonly Material[] }) {
  return (
    <section className={`sheet ${styles.materials}`} aria-labelledby="materials-title">
      <div className={styles.materialsHead}>
        <p className="label text-slate">Schedule</p>
        <h2 id="materials-title" className={styles.narrativeTitle}>
          Materials
        </h2>
      </div>
      <ul className={styles.materialList}>
        {materials.map((material, index) => (
          <li key={material.code} className={styles.material} data-reveal style={{ "--i": index } as React.CSSProperties}>
            <span className={styles.materialRule} data-draw aria-hidden="true" />
            <p className={`label ${styles.materialCode}`} data-annotate>
              {material.code}
            </p>
            <div className={styles.swatch} data-annotate>
              {material.photo ? (
                <Image
                  src={material.photo.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 12vw, 30vw"
                  quality={85}
                  style={{ objectPosition: material.photo.focus }}
                  placeholder="blur"
                />
              ) : (
                <span className={`${styles.hatch} ${hatchFor(material.name)}`} />
              )}
            </div>
            <h3 className={styles.materialName} data-annotate>
              {material.name}
            </h3>
            <p className={styles.materialSpec} data-annotate style={{ "--a": 1 } as React.CSSProperties}>
              {material.spec}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
