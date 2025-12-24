"use client";

import { ProductCard } from "@/components/molecules/ProductCard";
import { ProductGridSkeleton } from "@/components/atoms/Skeleton";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils/cn";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  className?: string;
  localProductIds?: number[];
}

// Yerli ürün ID'leri - gerçek API'de bu bilgi ürün verisinde gelir
const DEFAULT_LOCAL_PRODUCT_IDS = [6, 7, 12];

export function ProductGrid({
  products,
  isLoading = false,
  className,
  localProductIds = DEFAULT_LOCAL_PRODUCT_IDS,
}: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Ürün bulunamadı</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:gap-6",
        className
      )}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isLocal={localProductIds.includes(product.id)}
        />
      ))}
    </div>
  );
}
