import { Checkout } from "@/components/checkout/checkout";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Checkout",
  description: "Paga tu pedido pendiente de Café Canela.",
  path: "/checkout",
});

export default function CheckoutPage(): ReactNode {
  return <Checkout />;
}
