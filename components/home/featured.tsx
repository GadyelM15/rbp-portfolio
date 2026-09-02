import Image from "next/image";
import type { ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";

const ITEMS = [
  {
    image: "/frappe.avif",
    title: "Frappé Canela",
    description: "Nuestra receta insignia con canela molida artesanal",
    price: "$72",
  },
  {
    image: "/coldbrew.avif",
    title: "Cold Brew 18h",
    description: "Extracción lenta en frío, dulce y sedoso",
    price: "$65",
  },
  {
    image: "/mocha.avif",
    title: "Café Mocha",
    description: "Chocolate belga y espresso con crema batida",
    price: "$70",
  },
  {
    image: "/chilaquiles.avif",
    title: "Chilaquiles de la Casa",
    description: "Verdes o rojos con pollo, crema y queso fresco",
    price: "$125",
  },
];

export function Featured(): ReactNode {
  return (
    <section className="w-full py-20 sm:py-28">
      <div className="mx-auto max-w-275 px-6 sm:px-10">
        <FadeIn className="mb-10 flex flex-col gap-2">
          <h2 className="font-serif text-[1.75rem] font-medium tracking-tight sm:text-[2.25rem]">
            Lo especial
          </h2>
          <p className="max-w-[40ch] text-base text-foreground/55 sm:text-lg">
            Cuatro razones para volver cada semana.
          </p>
        </FadeIn>

        <div className="-mx-6 flex gap-4 overflow-x-auto px-6 pb-4 snap-x snap-mandatory scrollbar-hide sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {ITEMS.map((item, i) => (
            <FadeIn
              key={item.title}
              delay={Math.min(i * 0.08, 0.24)}
              className="w-[72vw] min-w-[260px] max-w-[320px] shrink-0 snap-start sm:w-auto sm:min-w-0 sm:max-w-none"
            >
              <article className="group overflow-hidden rounded-2xl border border-foreground/5 bg-muted">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 72vw, (max-width: 1024px) 45vw, 22vw"
                  />
                </div>
                <div className="flex flex-col gap-1.5 p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-[15px] font-medium">{item.title}</h3>
                    <span className="shrink-0 text-xs font-medium text-foreground/40">
                      {item.price}
                    </span>
                  </div>
                  <p className="text-[13px] leading-snug text-foreground/50">
                    {item.description}
                  </p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
