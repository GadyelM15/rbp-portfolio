import Image from "next/image";
import type { ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";
import { ScrollVelocity } from "@/components/ui/scroll-velocity";
import { HeroCtas } from "./hero-ctas";

export function Hero(): ReactNode {
  return (
    <section className="relative flex h-[100svh] w-full items-end overflow-hidden">
      <Image
        src="/grains.jpg"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/100 via-black/80 to-transparent" />

      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 bg-contain bg-center bg-no-repeat opacity-90"
        style={{ backgroundImage: "url(/logo.svg)" }}
      />

      <div className="relative z-10 w-full px-6 pb-10 sm:px-10 sm:pb-16 md:pb-20">
        <FadeIn className="mx-auto flex max-w-275 flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50 sm:text-sm">
              Restaurant & Cafetería
            </p>
            <h1 className="font-serif text-[clamp(3.5rem,10vw,8rem)] leading-[0.9] font-medium tracking-tight text-white">
              Café
              <br />
              Canela
            </h1>
            <ScrollVelocity
              texts={["Café, comida y buenos momentos en un solo lugar"]}
              velocity={20}
              numCopies={6}
            />
          </div>
          <HeroCtas />
        </FadeIn>
      </div>
      
    </section>
  );
}
