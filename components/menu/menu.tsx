"use client";

import { ShoppingBag, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState, useSyncExternalStore } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { FadeIn } from "@/components/ui/motion-primitives";
import {
  getPendingOrderServerSnapshot,
  type PendingOrder,
  readPendingOrder,
  savePendingOrder,
  subscribeToPendingOrder,
} from "@/lib/orders";
import {
  MENU_CATEGORIES,
  MENU_SIZE_LABELS,
  type MenuItem,
  type MenuSize,
} from "./menu-data";
import { MenuList } from "./menu-list";

type CartItem = {
  id: string;
  name: string;
  size: MenuSize;
  quantity: number;
  unitPrice: number;
};

const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 0,
});

const formatCurrency = (value: number): string => currency.format(value);

export function Menu(): ReactNode {
  const router = useRouter();
  const pendingOrder = useSyncExternalStore(
    subscribeToPendingOrder,
    readPendingOrder,
    getPendingOrderServerSnapshot
  );
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<PendingOrder | null>(
    null
  );
  const [orderStatus, setOrderStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [orderMessage, setOrderMessage] = useState("");
  const [open, setOpen] = useState(false);
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      if (event) {
        event.preventDefault();
      }
      return;
    }
    setOpen(false);
  };

  const addItem = (item: MenuItem, size: MenuSize, quantity: number): void => {
    if (pendingOrder) {
      setIsCartOpen(true);
      return;
    }
    setOpen(true);

    const unitPrice = item[size];
    if (unitPrice === null) return;

    const id = `${item.name}-${size}`;
    setOrderStatus("idle");
    setOrderMessage("");
    setIsCartOpen(false);
    setCartItems((current) => {
      const existing = current.find((cartItem) => cartItem.id === id);
      if (!existing) {
        return [...current, { id, name: item.name, size, quantity, unitPrice }];
      }

      return current.map((cartItem) =>
        cartItem.id === id
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      );
    });
  };

  const removeItem = (id: string): void => {
    setCartItems((current) => current.filter((item) => item.id !== id));
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  useEffect(() => {
    if (!confirmedOrder) return;

    const id = window.setTimeout(() => router.push("/"), 6500);
    return () => window.clearTimeout(id);
  }, [confirmedOrder, router]);

  const confirmOrder = (): void => {
    if (cartItems.length === 0 || orderStatus === "sending") return;

    const payload = {
      items: cartItems.map((item) => ({
        product: item.name,
        size: item.size,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      total: totalPrice,
    };

    setOrderStatus("sending");
    setOrderMessage("");

    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("No se pudo confirmar el pedido.");

        const data = (await response.json()) as PendingOrder;
        savePendingOrder(data);
        setOrderStatus("success");
        setOrderMessage("");
        setConfirmedOrder(data);
        setCartItems([]);
        setIsCartOpen(false);
      })
      .catch(() => {
        setOrderStatus("error");
        setOrderMessage("No se pudo confirmar el pedido. Intenta de nuevo.");
      });
  };

  return (
    <section id="menu" className="relative w-full py-8 sm:py-12">
      <Snackbar open={open} autoHideDuration={1500} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="standard"
          sx={{ width: '50%' }}
        >
          Agregado!
        </Alert>
      </Snackbar>
      <div className="mx-auto w-full max-w-275 px-6 sm:px-10">
        <div className="flex flex-col gap-16 sm:gap-20">
          {MENU_CATEGORIES.map((category) => (
            <FadeIn
              key={category.id}
              className="flex scroll-mt-28 flex-col gap-5"
            >
              <section id={category.id} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <h2 className="font-serif text-[1.75rem] leading-[1.1] font-medium tracking-tight sm:text-[2.25rem]">
                    {category.title}
                  </h2>
                  <p className="text-foreground/55 max-w-[52ch] text-[15px] leading-[1.45] tracking-tight sm:text-[17px]">
                    {category.description}
                  </p>
                </div>
                <MenuList
                  category={category}
                  disabled={Boolean(pendingOrder)}
                  onAddItem={addItem}
                />
              </section>
            </FadeIn>
          ))}

          <p className="text-foreground/40 text-center text-[13px]">
            Precios en MXN · Menú sujeto a disponibilidad.
          </p>
        </div>
      </div>

      <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="focus-ring bg-foreground text-background inline-flex items-center gap-3 rounded-full px-4 py-3 text-sm font-bold shadow-2xl shadow-black/20 transition hover:opacity-90"
        >
          <span className="bg-background/12 relative inline-flex h-9 w-9 items-center justify-center rounded-full">
            <ShoppingBag className="h-4 w-4" />
            {totalItems > 0 ? (
              <span className="bg-accent text-accent-foreground absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] leading-none font-bold">
                {totalItems}
              </span>
            ) : pendingOrder ? (
              <span className="bg-accent text-accent-foreground absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] leading-none font-bold">
                {pendingOrder.itemCount}
              </span>
            ) : null}
          </span>
          <span className="hidden sm:inline">
            {pendingOrder
              ? pendingOrder.orderId
              : totalItems === 0
                ? "Ver pedido"
                : "Confirmar pedido"}
          </span>
          <span className="font-serif text-lg leading-none">
            {formatCurrency(pendingOrder?.total ?? totalPrice)}
          </span>
        </button>
      </div>

      {isCartOpen ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/35 px-4 pb-4 backdrop-blur-sm sm:items-center sm:pb-0">
          <div className="bg-background text-foreground border-foreground/8 w-full max-w-md rounded-2xl border p-4 shadow-2xl sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold tracking-tight">
                  {pendingOrder ? "Pedido actual" : "Resumen del pedido"}
                </h2>
                <p className="text-foreground/45 text-[13px]">
                  {pendingOrder
                    ? `${pendingOrder.orderId} · pendiente de pago`
                    : totalItems === 0
                      ? "Agrega productos antes de confirmar."
                      : `${totalItems} producto${totalItems === 1 ? "" : "s"}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                aria-label="Cerrar resumen del pedido"
                className="focus-ring bg-muted text-foreground/55 hover:text-foreground inline-flex h-9 w-9 items-center justify-center rounded-full transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex max-h-[45vh] flex-col gap-2 overflow-y-auto pr-1">
              {pendingOrder ? (
                pendingOrder.items.map((item) => (
                  <div
                    key={`${item.product}-${item.size}`}
                    className="bg-muted flex items-start justify-between gap-3 rounded-xl p-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm leading-tight font-semibold">
                        {item.quantity}x {item.product}
                      </p>
                      <p className="text-foreground/45 mt-1 text-xs">
                        {MENU_SIZE_LABELS[item.size]} ·{" "}
                        {formatCurrency(item.unitPrice)} c/u
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                ))
              ) : cartItems.length === 0 ? (
                <p className="bg-muted text-foreground/50 rounded-xl p-4 text-sm leading-snug">
                  Selecciona tamaño y cantidad en cualquier producto del menú.
                </p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-muted flex items-start justify-between gap-3 rounded-xl p-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm leading-tight font-semibold">
                        {item.quantity}x {item.name}
                      </p>
                      <p className="text-foreground/45 mt-1 text-xs">
                        {MENU_SIZE_LABELS[item.size]} ·{" "}
                        {formatCurrency(item.unitPrice)} c/u
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Eliminar ${item.name} del pedido`}
                      className="focus-ring bg-background text-foreground/45 hover:text-foreground inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="border-foreground/8 mt-4 flex items-center justify-between border-t pt-4">
              <span className="text-foreground/50 text-sm">Total</span>
              <span className="font-serif text-2xl font-semibold tracking-tight">
                {formatCurrency(pendingOrder?.total ?? totalPrice)}
              </span>
            </div>
            {pendingOrder ? (
              <button
                type="button"
                onClick={() => router.push("/checkout")}
                className="focus-ring bg-foreground text-background mt-4 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition hover:opacity-90"
              >
                Pagar pedido actual
              </button>
            ) : (
              <button
                type="button"
                onClick={confirmOrder}
                disabled={cartItems.length === 0 || orderStatus === "sending"}
                className="focus-ring bg-foreground text-background mt-4 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
              >
                {orderStatus === "sending" ? "Enviando..." : "Enviar pedido"}
              </button>
            )}
            {orderMessage ? (
              <p
                className={`mt-3 text-center text-[13px] ${
                  orderStatus === "error"
                    ? "text-red-500"
                    : "text-foreground/55"
                }`}
              >
                {orderMessage}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {confirmedOrder ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm">
          <div className="bg-background text-foreground border-foreground/8 w-full max-w-lg rounded-2xl border p-5 shadow-2xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-accent text-xs font-bold tracking-[0.16em] uppercase">
                  Pedido confirmado
                </p>
                <h2 className="mt-1 font-serif text-3xl leading-none font-semibold tracking-tight">
                  {confirmedOrder.orderId}
                </h2>
                <p className="text-foreground/50 mt-2 text-sm leading-snug">
                  Guardamos este pedido pendiente en este navegador para que no
                  se pierda si recargas el celular.
                </p>
                <p className="text-foreground/40 mt-1 text-xs">
                  Te llevaremos al inicio en unos segundos.
                </p>
              </div>
              <span className="bg-accent text-accent-foreground inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
                <ShoppingBag className="h-5 w-5" />
              </span>
            </div>

            <div className="mt-5 flex max-h-[34vh] flex-col gap-2 overflow-y-auto pr-1">
              {confirmedOrder.items.map((item) => (
                <div
                  key={`${item.product}-${item.size}`}
                  className="bg-muted flex items-start justify-between gap-3 rounded-xl p-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm leading-tight font-semibold">
                      {item.quantity}x {item.product}
                    </p>
                    <p className="text-foreground/45 mt-1 text-xs">
                      {MENU_SIZE_LABELS[item.size]} ·{" "}
                      {formatCurrency(item.unitPrice)} c/u
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold">
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-foreground/8 mt-5 flex items-center justify-between border-t pt-4">
              <span className="text-foreground/50 text-sm">
                {confirmedOrder.itemCount} producto
                {confirmedOrder.itemCount === 1 ? "" : "s"}
              </span>
              <span className="font-serif text-2xl font-semibold tracking-tight">
                {formatCurrency(confirmedOrder.total)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="focus-ring bg-foreground text-background mt-5 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-bold transition hover:opacity-90"
            >
              Ir a inicio
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
