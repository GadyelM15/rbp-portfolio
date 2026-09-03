import { Hero } from "@/components/hero/hero";
import { PendingOrderNotice } from "@/components/home/pending-order";
import { createMetadata, siteConfig } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Home",
  description: `Welcome to ${siteConfig.name}. ${siteConfig.description}`,
  path: "/",
});

export default function HomePage(): ReactNode {
  return (
    <main id="main-content" className="flex h-[100svh] overflow-hidden">
      <Hero />
      <PendingOrderNotice />
    </main>
  );
}
