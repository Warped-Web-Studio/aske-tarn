import Image from "next/image";
import { ViewTransition, type ReactNode } from "react";
import type { Photo } from "@/lib/types";
import styles from "@/components/drawing/drawing.module.css";

type CutImageProps = {
  photo: Photo;
  /** Responsive `sizes`, derived from the grid span the frame occupies. */
  sizes: string;
  /** CSS aspect-ratio of the frame. Omit when the parent sizes the frame. */
  aspect?: string;
  className?: string;
  /** The page's LCP image: preloaded, high priority, never hidden. */
  preload?: boolean;
  /** Shared-element name carried across routes. */
  morph?: string;
  parallax?: boolean;
  reveal?: boolean;
  quality?: 60 | 75 | 85;
  index?: number;
  children?: ReactNode;
};

/**
 * A photograph in a frame. By default it is revealed by the "cut": the
 * frame opens upward from its base, and the photograph settles inside it.
 */
export function CutImage({
  photo,
  sizes,
  aspect,
  className,
  preload = false,
  morph,
  parallax = false,
  reveal = true,
  quality = 75,
  index = 0,
  children,
}: CutImageProps) {
  const frame = (
    <div
      className={`${styles.frame} ${parallax ? "parallax" : ""} ${className ?? ""}`}
      style={{ aspectRatio: aspect, "--i": index } as React.CSSProperties}
      data-reveal={reveal && !preload ? "cut" : undefined}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        quality={quality}
        placeholder="blur"
        preload={preload}
        fetchPriority={preload ? "high" : undefined}
        style={{ objectPosition: photo.focus }}
      />
      {children}
    </div>
  );

  if (!morph) return frame;

  return (
    <ViewTransition name={morph} share="morph" default="none">
      {frame}
    </ViewTransition>
  );
}
