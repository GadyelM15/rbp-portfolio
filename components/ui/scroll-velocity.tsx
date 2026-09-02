"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import type { ReactNode } from "react";

type ScrollVelocityProps = {
  texts: ReactNode[];
  velocity?: number;
  numCopies?: number;
};

export function ScrollVelocity({
  texts,
  velocity = 20,
  numCopies = 6,
}: ScrollVelocityProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityOffset = useTransform(
    smoothVelocity,
    [-1000, 1000],
    [-velocity, velocity],
  );

  return (
    <div className="scroll-velocity" aria-hidden="true">
      <motion.div
        className="scroll-velocity__velocity"
        style={{ x: prefersReducedMotion ? 0 : velocityOffset }}
      >
        <div className="scroll-velocity__track">
          {Array.from({ length: numCopies }, (_, copyIndex) => (
            <span className="scroll-velocity__copy" key={copyIndex}>
              {texts.map((text, textIndex) => (
                <span className="scroll-velocity__text" key={textIndex}>
                  {text}
                </span>
              ))}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}