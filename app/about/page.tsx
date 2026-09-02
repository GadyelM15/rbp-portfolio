import Image from "next/image";
import { ContactCard } from "@/components/contact/contact-card";
import { FadeIn } from "@/components/ui/motion-primitives";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

const VALUES = [
  {
    title: "Café de especialidad",
    description:
      "Granos selectos de Oaxaca y Chiapas, tostados en pequeños lotes cada semana.",
  },
  {
    title: "Repostería artesanal",
    description:
      "Pan y postres horneados cada mañana con recetas de la casa.",
  },
  {
    title: "Ingredientes locales",
    description:
      "Proveedores de la región y productos frescos de temporada.",
  },
  {
    title: "Espacio para todos",
    description:
      "Desde reuniones de trabajo hasta tardes con amigos y familia.",
  },
];

export const metadata: Metadata = createMetadata({
  title: "Nosotros",
  description: "Conoce la historia de Café Canela.",
  path: "/about",
});

export default function AboutPage(): ReactNode {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <section className="relative flex h-[50svh] min-h-[360px] w-full items-end overflow-hidden">
        <Image
          src="/coffee2.avif"
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
              Nuestra Historia
            </h1>
            <p className="max-w-[36ch] text-base text-white/60 sm:text-lg">
              Pasión por el café, dedicación en cada detalle.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto w-full max-w-200 px-6 py-20 sm:px-10 sm:py-28">
        <FadeIn className="flex flex-col gap-8">
          <h2 className="font-serif text-[1.75rem] font-medium tracking-tight sm:text-[2.25rem]">
            Hola, somos{" "}
            <span className="border-b-2 border-accent pb-0.5">Café Canela</span>
          </h2>
          <div className="space-y-6 text-[17px] leading-[1.75] tracking-tight text-foreground/70 sm:text-[18px]">
            <p>
              Somos{" "}
              <strong className="font-semibold text-foreground">
                la cafetería más apasionada por servirte con amor y dedicación
              </strong>
              .
            </p>
            <p>
              Nuestra pasión por el café comenzó cuando nos dimos cuenta de la
              importancia de cada detalle en la experiencia del cliente. Esto nos
              llevó a adoptar{" "}
              <strong className="font-semibold text-foreground">
                un enfoque centrado en el cliente
              </strong>{" "}
              como nuestra filosofía, equilibrando calidad, creatividad y
              dedicación.
            </p>
            <p>
              Actualmente dirigimos la cafetería con un equipo pequeño pero
              apasionado, siempre buscando oportunidades para{" "}
              <strong className="font-semibold text-foreground">
                crear experiencias memorables
              </strong>{" "}
              y{" "}
              <strong className="font-semibold text-foreground">
                ofrecer productos de la más alta calidad
              </strong>
              .
            </p>
          </div>
        </FadeIn>
      </section>

      <section className="mx-auto w-full max-w-200 px-6 pb-20 sm:px-10 sm:pb-28">
        <FadeIn className="flex flex-col gap-10">
          <h2 className="font-serif text-[1.75rem] font-medium tracking-tight sm:text-[2.25rem]">
            Lo que nos define
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {VALUES.map((value) => (
              <div key={value.title} className="flex flex-col gap-2">
                <h3 className="text-[15px] font-semibold tracking-tight">
                  {value.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-foreground/55">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      <ContactCard />
      <div className="h-16 sm:h-24" />
    </main>
  );
}
