"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { formatLevel } from "@/lib/format";
import type { SectionScene } from "./scene";
import styles from "./SectionStudy.module.css";

type Level = { y: number; name: string };

type SectionStudyProps = {
  levels: readonly Level[];
  range: { top: number; bottom: number };
  /** Server-rendered section drawing: shown until WebGL is ready, and kept if it never is. */
  poster: ReactNode;
  heading: ReactNode;
  caption: ReactNode;
};

/** Where the cut rests when the chapter isn't scroll-driven: just above the entrance floor. */
const RESTING_CUT = 2.6;

export function SectionStudy({ levels, range, poster, heading, caption }: SectionStudyProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const levelsRef = useRef<HTMLOListElement>(null);
  const sceneRef = useRef<SectionScene | null>(null);
  const cutRef = useRef(range.top);
  const [status, setStatus] = useState<"idle" | "ready" | "failed">("idle");
  const sliderId = useId();

  // Reflect the cut in the DOM directly: the readout, level states, slider.
  function applyCut(y: number) {
    cutRef.current = y;
    sceneRef.current?.setCut(y);
    if (readoutRef.current) readoutRef.current.textContent = formatLevel(y);
    if (sliderRef.current) {
      sliderRef.current.value = String(y);
      sliderRef.current.setAttribute("aria-valuetext", `Cut at ${formatLevel(y)} metres`);
    }
    const items = levelsRef.current?.children;
    if (items) {
      // The level being shown in plan is the highest floor at or below the cut.
      const shown = levels.findIndex((level) => level.y <= y);
      Array.from(items).forEach((item, index) => {
        item.setAttribute("data-state", index < shown ? "removed" : index === shown ? "current" : "below");
      });
    }
  }

  const scrubbing = () =>
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

  // Scroll drives the cut while the chapter is on screen.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (!scrubbing()) {
      applyCut(RESTING_CUT);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      applyCut(range.top - progress * (range.top - range.bottom));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    let listening = false;
    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !listening) {
        window.addEventListener("scroll", onScroll, { passive: true });
        listening = true;
        update();
      } else if (!entry.isIntersecting && listening) {
        window.removeEventListener("scroll", onScroll);
        listening = false;
      }
    });
    visibility.observe(track);
    update();

    return () => {
      visibility.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- range and levels are static props
  }, []);

  // Load three.js only as the chapter approaches.
  useEffect(() => {
    const track = trackRef.current;
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!track || !canvas || !stage) return;

    let cancelled = false;
    let resizeObserver: ResizeObserver | undefined;

    const load = async () => {
      try {
        const [{ createSectionScene }, model] = await Promise.all([
          import("./scene"),
          import("@/content/models/salt-archive"),
        ]);
        if (cancelled) return;
        const narrow = window.innerWidth < 768;
        const scene = createSectionScene(canvas, model.solids, {
          shadows: !narrow,
          pixelRatio: Math.min(window.devicePixelRatio || 1, narrow ? 1.5 : 1.75),
          bounds: model.modelBounds,
        });
        sceneRef.current = scene;
        resizeObserver = new ResizeObserver(([entry]) => {
          const { width, height } = entry.contentRect;
          scene.resize(Math.round(width), Math.round(height));
        });
        resizeObserver.observe(stage);
        scene.setCut(cutRef.current);
        setStatus("ready");
      } catch {
        if (!cancelled) setStatus("failed");
      }
    };

    const approach = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        approach.disconnect();
        void load();
      },
      { rootMargin: "80% 0px" },
    );

    // Never compete with the page's first paint: start watching only once
    // the page has loaded and the main thread is idle.
    const hasIdle = "requestIdleCallback" in window;
    let idleHandle = 0;
    const watch = () => {
      const observe = () => approach.observe(track);
      idleHandle = hasIdle ? window.requestIdleCallback(observe, { timeout: 2000 }) : window.setTimeout(observe, 200);
    };
    if (document.readyState === "complete") watch();
    else window.addEventListener("load", watch, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", watch);
      if (hasIdle) window.cancelIdleCallback(idleHandle);
      else window.clearTimeout(idleHandle);
      approach.disconnect();
      resizeObserver?.disconnect();
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  // The slider scrubs the same scroll position, so the two never disagree.
  function onSlide(value: number) {
    const track = trackRef.current;
    if (!track || !scrubbing()) {
      applyCut(value);
      return;
    }
    const travel = track.offsetHeight - window.innerHeight;
    const progress = (range.top - value) / (range.top - range.bottom);
    const trackTop = track.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: trackTop + progress * travel, behavior: "instant" });
  }

  return (
    <div className={styles.study}>
      <div className={`sheet ${styles.header}`}>{heading}</div>
      <div ref={trackRef} className={styles.track}>
        <div className={styles.stage} data-status={status}>
          <div ref={stageRef} className={styles.viewport}>
            <div className={styles.poster}>{poster}</div>
            <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
          </div>

          <div className={styles.panel}>
            <p className="label text-slate">Cutting plane</p>
            <p className={styles.readout} aria-hidden="true">
              <span ref={readoutRef}>{formatLevel(range.top)}</span>
            </p>
            <ol ref={levelsRef} className={styles.levels} aria-label="Levels">
              {levels.map((level) => (
                <li key={level.name} data-state="below">
                  <span className={styles.levelValue}>{formatLevel(level.y)}</span>
                  <span>{level.name}</span>
                </li>
              ))}
            </ol>
            <label htmlFor={sliderId} className={styles.sliderLabel}>
              <span className="label">Section plane height</span>
            </label>
            <input
              ref={sliderRef}
              id={sliderId}
              className={styles.slider}
              type="range"
              min={range.bottom}
              max={range.top}
              step={0.05}
              defaultValue={range.top}
              onChange={(event) => onSlide(Number(event.currentTarget.value))}
            />
            <div className={styles.caption}>{caption}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
