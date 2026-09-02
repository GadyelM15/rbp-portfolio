import { Hero } from "@/components/hero/hero";
import { Featured } from "@/components/home/featured";
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
    <main id="main-content" className="flex flex-1 flex-col">
      <Hero />
      <Featured />
      <div className="h-16 sm:h-24" />
    </main>
  );
}
