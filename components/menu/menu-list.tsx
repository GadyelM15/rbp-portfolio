import type { ReactNode } from "react";

import type { MenuCategory } from "./menu-data";

const formatPrice = (value: number | null): string =>
  value === null ? "—" : `$${value}`;

export function MenuList({
  category,
}: {
  category: MenuCategory;
}): ReactNode {
  const hasSizes = category.items.some(
    (i) => i.mediano !== null || i.grande !== null,
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-foreground/5">
      {hasSizes && (
        <div className="flex items-center justify-end gap-3 border-b border-foreground/5 px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-foreground/40 sm:gap-6">
          <span className="w-10 text-right sm:w-14">Ch</span>
          <span className="w-10 text-right sm:w-14">Med</span>
          <span className="w-10 text-right sm:w-14">Gr</span>
          <span className="w-10 text-right sm:w-14">Cal</span>
        </div>
      )}
      <div className="divide-y divide-foreground/5">
        {category.items.map((item) => (
          <div
            key={item.name}
            className="flex items-baseline justify-between gap-4 px-5 py-4"
          >
            <div className="min-w-0">
              <span className="block text-[15px] font-medium">{item.name}</span>
              {item.description && (
                <span className="mt-0.5 block text-[13px] text-foreground/45">
                  {item.description}
                </span>
              )}
            </div>
            {hasSizes ? (
              <div className="flex shrink-0 gap-3 sm:gap-6">
                <span className="w-10 text-right text-[13px] text-foreground/70 sm:w-14 sm:text-sm">
                  {formatPrice(item.chico)}
                </span>
                <span className="w-10 text-right text-[13px] text-foreground/70 sm:w-14 sm:text-sm">
                  {formatPrice(item.mediano)}
                </span>
                <span className="w-10 text-right text-[13px] text-foreground/70 sm:w-14 sm:text-sm">
                  {formatPrice(item.grande)}
                </span>
                <span className="w-10 text-right text-[13px] text-foreground/70 sm:w-14 sm:text-sm">
                  {item.calories}
                </span>
              </div>
            ) : (
              <span className="shrink-0 text-sm font-medium text-foreground/60">
                {formatPrice(item.chico)}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
