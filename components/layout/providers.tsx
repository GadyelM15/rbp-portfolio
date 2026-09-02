"use client";

import { ReducedMotionProvider } from "@/lib/motion";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }): ReactNode {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ReducedMotionProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </ReducedMotionProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
