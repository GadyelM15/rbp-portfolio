"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

type ScrollExpandProps = {
  src: string;
  alt?: string;
  initialText: string;
  finalText: string;
  className?: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function mapRange(
  value: number,
  inputStart: number,
  inputEnd: number,
  outputStart: number,
  outputEnd: number
): number {
  const amount = clamp((value - inputStart) / (inputEnd - inputStart), 0, 1);
  return outputStart + (outputEnd - outputStart) * amount;
}

export function ScrollExpand({
  src,
  alt = "",
  initialText,
  finalText,
  className = "",
}: ScrollExpandProps): ReactNode {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateProgress = (): void => {
      const section = sectionRef.current;
      if (!section) return;

      const sectionTop = window.scrollY + section.getBoundingClientRect().top;
      const distance = window.innerHeight * 1.2;
      const targetProgress = clamp(
        (window.scrollY - sectionTop) / distance,
        0,
        1
      );

      setScrollProgress(targetProgress);
    };

    const intervalId = window.setInterval(updateProgress, 33);

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const progress = scrollProgress;
  const frameWidth = `${mapRange(progress, 0, 0.72, 42, 100)}vw`;
  const frameHeight = `${mapRange(progress, 0, 0.72, 58, 100)}svh`;
  const frameRadius = mapRange(progress, 0, 0.72, 24, 0);
  const mediaScale = mapRange(progress, 0, 0.72, 1.35, 1);
  const scrimOpacity = mapRange(progress, 0.35, 0.8, 0.1, 0.5);
  const initialOpacity = mapRange(progress, 0, 0.28, 1, 0);
  const initialY = mapRange(progress, 0, 0.28, 0, -36);
  const finalOpacity = mapRange(progress, 0.58, 0.9, 0, 1);
  const finalY = mapRange(progress, 0.58, 0.9, 38, 0);

  return (
    <section
      ref={sectionRef}
      className={`relative h-[220svh] w-full ${className}`}
    >
      <div className="bg-background sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden">
        <motion.div
          className="relative overflow-hidden shadow-[0_24px_80px_rgb(0_0_0/0.22)]"
          style={{
            width: frameWidth,
            height: frameHeight,
            borderRadius: frameRadius,
          }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ scale: mediaScale }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10"
            style={{ opacity: scrimOpacity }}
          />
        </motion.div>

        <motion.p
          className="pointer-events-none absolute px-6 text-center font-serif text-[clamp(2.5rem,8vw,7rem)] leading-none font-medium tracking-tight text-white"
          style={{ opacity: initialOpacity, y: initialY }}
        >
          {initialText}
        </motion.p>

        <motion.p
          className="pointer-events-none absolute px-6 text-center font-serif text-[clamp(2.75rem,9vw,8rem)] leading-none font-medium tracking-tight text-white"
          style={{ opacity: finalOpacity, y: finalY }}
        >
          {finalText}
        </motion.p>
      </div>
    </section>
  );
}
