"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { Button } from "@/components/atoms/Button";
import { useFavoritesStore } from "@/stores/favorites";
import productsData from "@/mock/products.json";
import type { Product } from "@/types/product";

export default function FavoritesPage() {
  const t = useTranslations("favorites");
  const tc = useTranslations("common");
  const { getAllFavorites } = useFavoritesStore();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const favoriteIds = getAllFavorites();
    const products = productsData.products.filter((p) =>
      favoriteIds.includes(String(p.id))
    ) as Product[];
    setFavoriteProducts(products);
  }, [getAllFavorites]);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-foreground">{t("title")}</h1>

      {favoriteProducts.length > 0 ? (
        <ProductGrid products={favoriteProducts} />
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            {t("empty")}
          </h2>
          <p className="mb-6 text-muted-foreground">{t("emptyDesc")}</p>
          <Link href="/products">
            <Button>{tc("products")}</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
