import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function HeroCtas(): ReactNode {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href="/projects"
        className="focus-ring group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
      >
        Ver Menú
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
      <Link
        href="/about"
        className="focus-ring inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10"
      >
        Nuestra Historia
      </Link>
    </div>
  );
}
