import { NextResponse } from "next/server";

type PaymentPayload = {
  orderId?: string;
  cardLast4?: string;
  amount?: number;
};

export async function POST(request: Request): Promise<NextResponse> {
  const payload = (await request.json()) as PaymentPayload;

  if (!payload.orderId || typeof payload.amount !== "number") {
    return NextResponse.json(
      { message: "El pago no contiene un pedido válido." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    paymentId: `PAY-${Date.now().toString(36).toUpperCase()}`,
    orderId: payload.orderId,
    status: "paid",
    amount: payload.amount,
    cardLast4: payload.cardLast4 ?? "",
    paidAt: new Date().toISOString(),
  });
}
