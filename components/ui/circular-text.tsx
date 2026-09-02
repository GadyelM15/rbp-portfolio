"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { ReactNode } from "react";

type CircularTextProps = {
  text: string;
  spinDuration?: number;
  className?: string;
};

export function CircularText({
  text,
  spinDuration = 20,
  className = "",
}: CircularTextProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const characters = Array.from(text);

  return (
    <motion.div
      aria-hidden="true"
      className={`circular-text ${className}`}
      animate={prefersReducedMotion ? false : { rotate: 360 }}
      transition={{
        duration: isHovered ? spinDuration / 4 : spinDuration,
        ease: "linear",
        repeat: Infinity,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      {...(prefersReducedMotion ? {} : { whileHover: { scale: 1.05 } })}
    >
      {characters.map((character, index) => {
        const angle = (360 / characters.length) * index;

        return (
          <span
            className="circular-text__character"
            key={`${character}-${index}`}
            style={{
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(var(--circular-text-radius) * -1))`,
            }}
          >
            {character}
          </span>
        );
      })}
      <span className="circular-text__center">✦</span>
    </motion.div>
  );
}