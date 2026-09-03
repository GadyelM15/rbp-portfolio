import { NextResponse } from "next/server";

import type { PendingOrder } from "@/lib/orders";

type OrderItem = {
  product: string;
  size: "chico" | "mediano" | "grande";
  quantity: number;
  unitPrice: number;
};

type OrderPayload = {
  items?: OrderItem[];
  total?: number;
};

const ORDER_COUNTER_KEY = Symbol.for("cafe-canela.order-counter");

type OrderCounterGlobal = typeof globalThis & {
  [ORDER_COUNTER_KEY]?: number;
};

const getNextOrderId = (): string => {
  const store = globalThis as OrderCounterGlobal;
  store[ORDER_COUNTER_KEY] = (store[ORDER_COUNTER_KEY] ?? 0) + 1;
  return `CC-${store[ORDER_COUNTER_KEY].toString().padStart(5, "0")}`;
};

export async function POST(request: Request): Promise<NextResponse> {
  const payload = (await request.json()) as OrderPayload;

  if (!payload.items?.length || typeof payload.total !== "number") {
    return NextResponse.json(
      { message: "El pedido no tiene productos válidos." },
      { status: 400 }
    );
  }

  const items = payload.items.map((item) => ({
    ...item,
    subtotal: item.quantity * item.unitPrice,
  }));

  const order: PendingOrder = {
    orderId: getNextOrderId(),
    status: "pending",
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    total: payload.total,
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json(order);
}
