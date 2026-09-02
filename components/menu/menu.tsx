import type { ReactNode } from "react";

import { FadeIn } from "@/components/ui/motion-primitives";
import { MENU_CATEGORIES } from "./menu-data";
import { MenuList } from "./menu-list";

export function Menu(): ReactNode {
  return (
    <section className="relative w-full py-16 sm:py-24">
      <div className="mx-auto flex w-full max-w-275 flex-col gap-16 px-6 sm:gap-20 sm:px-10">
        {MENU_CATEGORIES.map((category) => (
          <FadeIn key={category.id} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <h2 className="font-serif text-[1.75rem] leading-[1.1] font-medium tracking-tight sm:text-[2.25rem]">
                {category.title}
              </h2>
              <p className="max-w-[52ch] text-[15px] leading-[1.45] tracking-tight text-foreground/55 sm:text-[17px]">
                {category.description}
              </p>
            </div>
            <MenuList category={category} />
          </FadeIn>
        ))}

        <p className="text-center text-[13px] text-foreground/40">
          Precios en MXN · Menú sujeto a disponibilidad.
        </p>
      </div>
    </section>
  );
}
