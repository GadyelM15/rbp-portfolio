import type { MenuSize } from "@/components/menu/menu-data";

export const PENDING_ORDER_STORAGE_KEY = "cafe-canela-pending-order";
export const PENDING_ORDER_CHANGE_EVENT = "pending-order-change";

export type PendingOrderItem = {
  product: string;
  size: MenuSize;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type PendingOrder = {
  orderId: string;
  status: "pending";
  items: PendingOrderItem[];
  itemCount: number;
  total: number;
  createdAt: string;
};

let lastStoredPendingOrder: string | null = null;
let lastParsedPendingOrder: PendingOrder | null = null;

export const readPendingOrder = (): PendingOrder | null => {
  try {
    const stored = window.localStorage.getItem(PENDING_ORDER_STORAGE_KEY);
    if (stored === lastStoredPendingOrder) return lastParsedPendingOrder;

    lastStoredPendingOrder = stored;
    lastParsedPendingOrder = stored
      ? (JSON.parse(stored) as PendingOrder)
      : null;

    return lastParsedPendingOrder;
  } catch {
    lastStoredPendingOrder = null;
    lastParsedPendingOrder = null;
    return null;
  }
};

export const subscribeToPendingOrder = (callback: () => void): (() => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener(PENDING_ORDER_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(PENDING_ORDER_CHANGE_EVENT, callback);
  };
};

export const savePendingOrder = (order: PendingOrder): void => {
  const stored = JSON.stringify(order);
  window.localStorage.setItem(PENDING_ORDER_STORAGE_KEY, stored);
  lastStoredPendingOrder = stored;
  lastParsedPendingOrder = order;
  window.dispatchEvent(new Event(PENDING_ORDER_CHANGE_EVENT));
};

export const clearPendingOrder = (): void => {
  window.localStorage.removeItem(PENDING_ORDER_STORAGE_KEY);
  lastStoredPendingOrder = null;
  lastParsedPendingOrder = null;
  window.dispatchEvent(new Event(PENDING_ORDER_CHANGE_EVENT));
};

export const getPendingOrderServerSnapshot = (): null => null;
