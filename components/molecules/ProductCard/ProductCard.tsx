"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { useFavoritesStore } from "@/stores/favorites";
import { formatPrice, formatDiscount } from "@/lib/utils/format";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  className?: string;
  isLocal?: boolean;
}

export function ProductCard({ product, className, isLocal = false }: ProductCardProps) {
  const [mounted, setMounted] = useState(false);
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const variant = product.variants[0];
  const thumbnail = variant?.thumbnails[0];

  // Hydration tamamlandıktan sonra favori durumunu kontrol et
  useEffect(() => {
    setMounted(true);
  }, []);

  const isFav = mounted ? isFavorite(String(product.id)) : false;

  const hasDiscount =
    variant?.originalPrice && variant.originalPrice > variant.price;
  const discountPercent = hasDiscount
    ? formatDiscount(variant.originalPrice!, variant.price)
    : 0;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(String(product.id));
  };

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300",
        "hover:shadow-xl hover:shadow-black/5 hover:border-primary/20",
        className
      )}
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50">
          {thumbnail ? (
            <Image
              src={thumbnail.url}
              alt={thumbnail.alt || product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Badges Container */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {/* Discount Badge */}
            {hasDiscount && discountPercent > 0 && (
              <span className="inline-flex items-center rounded-lg bg-gradient-to-r from-red-500 to-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg shadow-red-500/25">
                %{discountPercent}
              </span>
            )}

            {/* Local Badge */}
            {isLocal && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg shadow-emerald-500/25">
                <MapPin className="h-3 w-3" />
                Yerli
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className={cn(
              "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300",
              "bg-white/90 backdrop-blur-md shadow-lg",
              "hover:scale-110 active:scale-95",
              isFav
                ? "text-red-500"
                : "text-gray-400 hover:text-red-500"
            )}
            aria-label={isFav ? "Favorilerden çıkar" : "Favorilere ekle"}
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-all duration-300",
                isFav && "fill-current scale-110"
              )}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Product Name */}
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">
            {product.name}
          </h3>

          {/* Price Section */}
          {variant && (
            <div className="mt-3 space-y-1">
              {/* Main Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold tracking-tight text-foreground">
                  {formatPrice(variant.price)}
                </span>
              </div>

              {/* Original Price & Discount */}
              {hasDiscount && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground line-through decoration-red-400">
                    {formatPrice(variant.originalPrice!)}
                  </span>
                  <span className="rounded-md bg-red-50 px-1.5 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-950 dark:text-red-400">
                    {discountPercent}% indirim
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Stock & Shipping */}
          <div className="mt-3 flex items-center gap-2">
            {variant && variant.stock > 0 ? (
              <>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Stokta
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">Ücretsiz kargo</span>
              </>
            ) : (
              <span className="flex items-center gap-1 text-xs font-medium text-red-500">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                Stokta Yok
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
