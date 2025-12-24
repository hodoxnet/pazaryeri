"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/atoms/Button";
import { Price } from "@/components/atoms/Price";
import { QuantitySelector } from "@/components/molecules/QuantitySelector";
import { useCartStore } from "@/stores/cart";
import { formatPrice } from "@/lib/utils/format";

export default function CartPage() {
  const t = useTranslations("cart");
  const tc = useTranslations("common");
  const [mounted, setMounted] = useState(false);

  const {
    items,
    removeItem,
    updateQuantity,
    toggleSelect,
    selectAll,
    getTotalPrice,
    getSelectedPrice,
    getSelectedCount,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItems = Object.values(items);
  const allSelected = cartItems.length > 0 && cartItems.every((i) => i.selected);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-32 rounded bg-muted" />
          <div className="mt-8 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-foreground">{t("title")}</h1>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <ShoppingCart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            {t("empty")}
          </h2>
          <p className="mb-6 text-muted-foreground">{t("emptyDesc")}</p>
          <Link href="/products">
            <Button>{t("continueShopping")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-foreground">{t("title")}</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {/* Select All */}
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => selectAll(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            <span className="text-sm text-foreground">Tümünü Seç</span>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.variantId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex gap-4 rounded-lg border border-border bg-card p-4"
                >
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => toggleSelect(item.variantId)}
                    className="mt-2 h-4 w-4 rounded border-border"
                  />

                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/products/${item.productSlug}`}
                      className="font-medium text-foreground hover:text-primary"
                    >
                      {item.productName}
                    </Link>

                    {item.options && item.options.length > 0 && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.options.map((o) => `${o.title}: ${o.value}`).join(", ")}
                      </p>
                    )}

                    <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(q) => updateQuantity(item.variantId, q)}
                        max={item.stock}
                      />

                      <Price
                        price={item.price * item.quantity}
                        originalPrice={
                          item.originalPrice
                            ? item.originalPrice * item.quantity
                            : undefined
                        }
                        size="md"
                      />
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.variantId)}
                    className="flex-shrink-0 text-muted-foreground hover:text-red-500"
                    aria-label={t("remove")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Sipariş Özeti
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Seçili Ürünler ({getSelectedCount()})
                </span>
                <span className="font-medium">
                  {formatPrice(getSelectedPrice())}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("shipping")}</span>
                <span className="font-medium text-green-600">Ücretsiz</span>
              </div>

              <div className="border-t border-border pt-3">
                <div className="flex justify-between text-base font-semibold">
                  <span>{t("total")}</span>
                  <span className="text-primary">
                    {formatPrice(getSelectedPrice())}
                  </span>
                </div>
              </div>
            </div>

            <Button className="mt-6 w-full" size="lg" disabled={getSelectedCount() === 0}>
              {t("checkout")}
            </Button>

            <Link href="/products" className="mt-4 block text-center">
              <Button variant="ghost" className="w-full">
                {t("continueShopping")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
