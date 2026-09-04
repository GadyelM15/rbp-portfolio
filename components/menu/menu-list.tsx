"use client";

import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useState, type ReactNode } from "react";

import {
  MENU_SIZE_LABELS,
  type MenuCategory,
  type MenuItem,
  type MenuSize,
} from "./menu-data";

const formatPrice = (value: number | null): string =>
  value === null ? "—" : `$${value}`;

const SIZES: readonly MenuSize[] = ["chico", "mediano", "grande"];

const getAvailableSizes = (item: MenuItem): MenuSize[] =>
  SIZES.filter((size) => item[size] !== null);

type MenuListProps = {
  category: MenuCategory;
  disabled?: boolean;
  onAddItem: (item: MenuItem, size: MenuSize, quantity: number) => void;
};

function MenuItemCard({
  categoryImage,
  disabled = false,
  item,
  onAddItem,
}: {
  categoryImage: string;
  disabled?: boolean;
  item: MenuItem;
  onAddItem: MenuListProps["onAddItem"];
}): ReactNode {
  const availableSizes = getAvailableSizes(item);
  const [selectedSize, setSelectedSize] = useState<MenuSize>(
    availableSizes[0] ?? "chico"
  );
  const [quantity, setQuantity] = useState(1);
  const selectedPrice = item[selectedSize];
  const needsSize = availableSizes.length > 1;
  const image = item.image ?? categoryImage;
  return (
    <article className="border-foreground/5 group relative isolate flex min-h-[17.5rem] flex-col justify-between overflow-hidden rounded-2xl border bg-neutral-950 p-3 text-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-white/20 sm:min-h-[20rem] sm:p-5">
      <Image
        src={image}
        alt=""
        fill
        className="-z-20 object-cover transition duration-700 group-hover:scale-105"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 22vw"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
      <div className="absolute inset-0 -z-10 bg-black/10 backdrop-blur-[1px]" />

      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-[14px] leading-tight font-semibold tracking-tight sm:text-[17px]">
              {item.name}
            </h3>
            {item.description ? (
              <p className="mt-1 text-[12px] leading-snug text-white/72 sm:text-[14px]">
                {item.description}
              </p>
            ) : null}
          </div>
          <span className="shrink-0 rounded-full bg-white/12 px-2 py-1 text-[11px] font-semibold text-white/75 ring-1 ring-white/12 backdrop-blur sm:text-xs">
            {item.calories} cal
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {availableSizes.map((size) => {
            const price = item[size];
            const isSelected = selectedSize === size;

            return (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                aria-pressed={isSelected}
                className={`focus-ring rounded-full px-2.5 py-1.5 text-[11px] font-semibold transition sm:text-xs ${
                  isSelected
                    ? "bg-white text-neutral-950"
                    : "bg-white/12 text-white/75 ring-1 ring-white/12 hover:text-white"
                }`}
              >
                <span>{needsSize ? MENU_SIZE_LABELS[size] : "Único"}</span>
                <span className="ml-1 opacity-70">{formatPrice(price)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-fit items-center rounded-full bg-white/12 p-1 ring-1 ring-white/12 backdrop-blur">
          <button
            type="button"
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            aria-label={`Quitar una unidad de ${item.name}`}
            className="focus-ring inline-flex h-7 w-7 items-center justify-center rounded-full text-white/65 transition hover:text-white"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-7 text-center text-sm font-semibold tabular-nums">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((current) => current + 1)}
            aria-label={`Agregar una unidad de ${item.name}`}
            className="focus-ring inline-flex h-7 w-7 items-center justify-center rounded-full text-white/65 transition hover:text-white"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => onAddItem(item, selectedSize, quantity)}
          disabled={disabled || selectedPrice === null}
          className="focus-ring bg-accent text-accent-foreground inline-flex items-center justify-center rounded-full px-3 py-2 text-[12px] font-bold shadow-lg shadow-black/20 transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-sm"
        >
          {disabled ? "Pendiente" : "Agregar"}
        </button>
      </div>
    </article>
  );
}

export function MenuList({
  category,
  disabled = false,
  onAddItem,
}: MenuListProps): ReactNode {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
      {category.items.map((item) => (
        <MenuItemCard
          key={item.name}
          categoryImage={category.image}
          disabled={disabled}
          item={item}
          onAddItem={onAddItem}
        />
      ))}
    </div>
  );
}
