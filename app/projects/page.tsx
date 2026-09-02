import Image from "next/image";
import { Menu } from "@/components/menu/menu";
import { FadeIn } from "@/components/ui/motion-primitives";
import { ScrollExpand } from "@/components/ui/scroll-expand";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Featured } from "@/components/home/featured";

export const metadata: Metadata = createMetadata({
  title: "Menú",
  description: "Descubre nuestra selección de cafés, bebidas y platillos.",
  path: "/projects",
});

export default function ProjectsPage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <section className="relative flex h-[50svh] min-h-[360px] w-full items-end overflow-hidden">
        <Image
          src="/coffee1.avif"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="relative z-10 w-full px-6 pb-10 sm:px-10 sm:pb-14">
          <FadeIn className="mx-auto flex max-w-275 flex-col gap-3">
            <h1 className="font-serif text-[clamp(2.5rem,8vw,5rem)] leading-[0.95] font-medium tracking-tight text-white">
              Nuestro Menú
            </h1>
            <p className="max-w-[36ch] text-base text-white/60 sm:text-lg">
              Café de especialidad, bebidas artesanales y platillos preparados
              con ingredientes frescos.
            </p>
          </FadeIn>
        </div>
      </section>
      <ScrollExpand
        src="/coffee5.avif"
        initialText="Cada detalle"
        finalText="Hace la diferencia"
      />
      <Featured />
      <Menu />
      <div className="h-16 sm:h-24" />
    </main>
  );
}
