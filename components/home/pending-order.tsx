"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useSyncExternalStore, type ReactNode } from "react";

import { MENU_SIZE_LABELS } from "@/components/menu/menu-data";
import {
  getPendingOrderServerSnapshot,
  readPendingOrder,
  subscribeToPendingOrder,
} from "@/lib/orders";

const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 0,
});

const formatCurrency = (value: number): string => currency.format(value);

export function PendingOrderNotice(): ReactNode {
  const pendingOrder = useSyncExternalStore(
    subscribeToPendingOrder,
    readPendingOrder,
    getPendingOrderServerSnapshot
  );

  if (!pendingOrder) return null;

  return (
    <aside className="fixed right-4 bottom-24 z-50 w-[calc(100vw-2rem)] max-w-sm sm:right-6 sm:bottom-6">
      <div className="rounded-2xl border border-white/10 bg-black/78 p-4 text-white shadow-2xl shadow-black/30 backdrop-blur-md">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold tracking-[0.16em] text-white/55 uppercase">
              Pedido pendiente
            </p>
            <h2 className="mt-1 font-serif text-2xl leading-none font-semibold tracking-tight">
              {pendingOrder.orderId}
            </h2>
          </div>
          <span className="bg-accent text-accent-foreground inline-flex h-9 w-9 items-center justify-center rounded-full">
            <ShoppingBag className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-4 flex max-h-36 flex-col gap-2 overflow-y-auto pr-1">
          {pendingOrder.items.map((item) => (
            <div
              key={`${item.product}-${item.size}`}
              className="flex items-start justify-between gap-3 rounded-xl bg-white/10 p-3"
            >
              <div className="min-w-0">
                <p className="text-sm leading-tight font-semibold">
                  {item.quantity}x {item.product}
                </p>
                <p className="mt-1 text-xs text-white/50">
                  {MENU_SIZE_LABELS[item.size]}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold">
                {formatCurrency(item.subtotal)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-sm text-white/55">Total</span>
          <span className="font-serif text-xl font-semibold tracking-tight">
            {formatCurrency(pendingOrder.total)}
          </span>
        </div>
        <Link
          href="/checkout"
          className="focus-ring mt-4 inline-flex w-full items-center justify-center rounded-full bg-white px-4 py-2.5 text-sm font-bold text-neutral-950 transition hover:bg-white/90"
        >
          Pagar pedido actual
        </Link>
      </div>
    </aside>
  );
}
