"use client";

import { cn } from "@/lib/utils/cn";
import { formatPrice, formatDiscount } from "@/lib/utils/format";

interface PriceProps {
  price: number;
  originalPrice?: number;
  locale?: string;
  currency?: string;
  size?: "sm" | "md" | "lg";
  showDiscount?: boolean;
  className?: string;
}

const sizes = {
  sm: { price: "text-sm", original: "text-xs" },
  md: { price: "text-lg", original: "text-sm" },
  lg: { price: "text-2xl", original: "text-base" },
};

export function Price({
  price,
  originalPrice,
  locale = "tr-TR",
  currency = "TRY",
  size = "md",
  showDiscount = true,
  className,
}: PriceProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discount = hasDiscount ? formatDiscount(originalPrice, price) : 0;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span
        className={cn(
          "font-bold text-foreground",
          sizes[size].price
        )}
      >
        {formatPrice(price, locale, currency)}
      </span>

      {hasDiscount && (
        <>
          <span
            className={cn(
              "text-muted-foreground line-through",
              sizes[size].original
            )}
          >
            {formatPrice(originalPrice, locale, currency)}
          </span>

          {showDiscount && discount > 0 && (
            <span
              className={cn(
                "rounded bg-red-100 px-1.5 py-0.5 font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400",
                sizes[size].original
              )}
            >
              %{discount}
            </span>
          )}
        </>
      )}
    </div>
  );
}
