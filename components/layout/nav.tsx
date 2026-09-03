"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU_CATEGORIES } from "@/components/menu/menu-data";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: readonly NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Menú", href: "/projects" },
  { label: "Nosotros", href: "/about" },
];

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function NavThemeToggle(): ReactNode {
  const mounted = useIsMounted();
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = mounted && resolvedTheme === "dark";

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const next = isDark ? "light" : "dark";

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const supportsViewTransitions =
      typeof document !== "undefined" &&
      typeof document.startViewTransition === "function";

    if (!supportsViewTransitions || prefersReducedMotion) {
      setTheme(next);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy)
    );

    const root = document.documentElement;
    root.style.setProperty("--theme-cx", `${cx}px`);
    root.style.setProperty("--theme-cy", `${cy}px`);
    root.style.setProperty("--theme-r", `${radius}px`);
    root.dataset.themeAnim = "1";

    const transition = document.startViewTransition(() => {
      setTheme(next);
    });

    transition.finished.finally(() => {
      delete root.dataset.themeAnim;
    });
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        mounted
          ? isDark
            ? "Switch to light theme"
            : "Switch to dark theme"
          : "Toggle theme"
      }
      aria-pressed={mounted ? isDark : undefined}
      className="focus-ring bg-background ring-foreground/8 relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full ring-1 transition-colors"
    >
      <span aria-hidden="true" className="relative h-4 w-4">
        <Sun
          className={`text-foreground absolute inset-0 h-4 w-4 transition-all duration-300 ${
            mounted && isDark
              ? "scale-100 rotate-0 opacity-100"
              : "scale-0 -rotate-90 opacity-0"
          }`}
        />
        <Moon
          className={`text-foreground absolute inset-0 h-4 w-4 transition-all duration-300 ${
            mounted && !isDark
              ? "scale-100 rotate-0 opacity-100"
              : "scale-0 rotate-90 opacity-0"
          }`}
        />
      </span>
    </button>
  );
}

export function Nav(): ReactNode {
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const categoryRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pillRect, setPillRect] = useState<{
    x: number;
    width: number;
  } | null>(null);
  const [hasMeasured, setHasMeasured] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [activeMenuCategory, setActiveMenuCategory] = useState(
    MENU_CATEGORIES[0]?.id ?? ""
  );
  const isMenuPage =
    pathname === "/projects" || pathname.startsWith("/projects/");
  const showMenuCategories = isMenuPage && isMenuVisible;

  const activeIndex = NAV_ITEMS.findIndex((item) =>
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  useLayoutEffect(() => {
    const list = listRef.current;
    const activeEl = activeIndex >= 0 ? itemRefs.current[activeIndex] : null;
    if (!list || !activeEl) {
      setPillRect(null);
      return;
    }
    const listRect = list.getBoundingClientRect();
    const itemRect = activeEl.getBoundingClientRect();
    setPillRect({
      x: itemRect.left - listRect.left,
      width: itemRect.width,
    });
  }, [activeIndex, pathname]);

  useEffect(() => {
    if (!pillRect) return;
    const id = requestAnimationFrame(() => setHasMeasured(true));
    return () => cancelAnimationFrame(id);
  }, [pillRect]);

  useEffect(() => {
    if (!isMenuPage) return;

    const updateMenuVisibility = (): void => {
      const menu = document.getElementById("menu");
      if (!menu) return;

      const stickyLine = 88;
      const rect = menu.getBoundingClientRect();
      setIsMenuVisible(rect.top <= stickyLine && rect.bottom > stickyLine);
    };

    const id = requestAnimationFrame(updateMenuVisibility);
    window.addEventListener("scroll", updateMenuVisibility, { passive: true });
    window.addEventListener("resize", updateMenuVisibility);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("scroll", updateMenuVisibility);
      window.removeEventListener("resize", updateMenuVisibility);
    };
  }, [isMenuPage]);

  useEffect(() => {
    if (!isMenuPage) return;

    const updateActiveCategory = (): void => {
      const viewportLine = 120;
      let nextCategory = MENU_CATEGORIES[0]?.id ?? "";

      for (const category of MENU_CATEGORIES) {
        const section = document.getElementById(category.id);
        if (!section) continue;

        const rect = section.getBoundingClientRect();
        if (rect.top <= viewportLine) {
          nextCategory = category.id;
        }
      }

      setActiveMenuCategory(nextCategory);
    };

    updateActiveCategory();
    window.addEventListener("scroll", updateActiveCategory, { passive: true });
    window.addEventListener("resize", updateActiveCategory);

    return () => {
      window.removeEventListener("scroll", updateActiveCategory);
      window.removeEventListener("resize", updateActiveCategory);
    };
  }, [isMenuPage]);

  useEffect(() => {
    if (!showMenuCategories) return;

    categoryRefs.current[activeMenuCategory]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeMenuCategory, showMenuCategories]);

  return (
    <>
      <motion.nav
        aria-label="Primary"
        animate={{
          opacity: showMenuCategories ? 0 : 1,
          y: showMenuCategories ? -18 : 0,
        }}
        transition={{ duration: 0.25 }}
        className={`fixed top-6 left-1/2 z-50 -translate-x-1/2 ${
          showMenuCategories ? "pointer-events-none" : ""
        }`}
      >
        <div className="bg-background border-foreground/8 flex items-center gap-1 rounded-full border p-1.5 shadow-sm">
          <ul ref={listRef} className="relative flex items-center gap-1">
            {pillRect && (
              <motion.span
                aria-hidden="true"
                initial={false}
                animate={{ x: pillRect.x, width: pillRect.width }}
                transition={
                  hasMeasured
                    ? { type: "spring", stiffness: 380, damping: 32 }
                    : { duration: 0 }
                }
                style={{ left: 0, top: 0, bottom: 0 }}
                className="bg-foreground/5 ring-foreground/8 absolute rounded-full ring-1"
              />
            )}
            {NAV_ITEMS.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <li
                  key={item.href}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className="relative"
                >
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className="focus-ring relative inline-flex cursor-pointer items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-300"
                  >
                    <span
                      className={
                        isActive
                          ? "text-foreground relative z-10"
                          : "text-foreground/60 hover:text-foreground relative z-10"
                      }
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <NavThemeToggle />
        </div>
      </motion.nav>

      {isMenuPage ? (
        <motion.nav
          aria-label="Categorías del menú"
          initial={false}
          animate={{
            opacity: showMenuCategories ? 1 : 0,
            y: showMenuCategories ? 0 : -18,
          }}
          transition={{ duration: 0.25 }}
          className={`fixed top-6 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-275 -translate-x-1/2 ${
            showMenuCategories ? "" : "pointer-events-none"
          }`}
        >
          <div className="border-foreground/8 bg-background/95 overflow-hidden rounded-full border p-1.5 shadow-sm backdrop-blur">
            <div className="scrollbar-hide flex items-center gap-1 overflow-x-auto scroll-smooth">
              {MENU_CATEGORIES.map((category) => {
                const isActive = activeMenuCategory === category.id;

                return (
                  <a
                    key={category.id}
                    ref={(element) => {
                      categoryRefs.current[category.id] = element;
                    }}
                    href={`#${category.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`focus-ring shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-foreground text-background"
                        : "text-foreground/55 hover:text-foreground"
                    }`}
                  >
                    {category.title}
                  </a>
                );
              })}
            </div>
          </div>
        </motion.nav>
      ) : null}
    </>
  );
}
