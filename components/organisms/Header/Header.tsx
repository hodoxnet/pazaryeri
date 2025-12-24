"use client";

import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart, Heart, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SearchBar } from "@/components/molecules/SearchBar";
import { LanguageSwitcher } from "@/components/molecules/LanguageSwitcher";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
import { Button } from "@/components/atoms/Button";
import { useCartStore } from "@/stores/cart";
import { useFavoritesStore } from "@/stores/favorites";
import { cn } from "@/lib/utils/cn";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("common");
  const cartItemCount = useCartStore((s) => s.getTotalItems());
  const favoritesCount = useFavoritesStore((s) => s.allProductIds.size);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold text-primary"
          >
            <span className="text-2xl">🛒</span>
            <span className="hidden sm:inline">Pazaryeri</span>
          </Link>

          {/* Search - Desktop */}
          <div className="hidden flex-1 justify-center lg:flex">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSwitcher />
            <ThemeToggle />

            <Link href="/favorites">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label={t("favorites")}
              >
                <Heart className="h-5 w-5" />
                {mounted && favoritesCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {favoritesCount > 9 ? "9+" : favoritesCount}
                  </span>
                )}
              </Button>
            </Link>

            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label={t("cart")}
              >
                <ShoppingCart className="h-5 w-5" />
                {mounted && cartItemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Search - Mobile */}
        <div className="pb-3 lg:hidden">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border bg-background lg:hidden"
          >
            <nav className="container mx-auto px-4 py-4">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="block rounded-lg px-4 py-2 hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("home")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="block rounded-lg px-4 py-2 hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("products")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    className="block rounded-lg px-4 py-2 hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("categories")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/favorites"
                    className="block rounded-lg px-4 py-2 hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("favorites")}
                  </Link>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
