"use client";

import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button";
import { useFavoritesStore } from "@/stores/favorites";
import { cn } from "@/lib/utils/cn";

interface FavoriteButtonProps {
  productId: number;
}

export function FavoriteButton({ productId }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const t = useTranslations("product");

  const isFav = isFavorite(String(productId));

  const handleClick = () => {
    toggleFavorite(String(productId));
  };

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      leftIcon={
        <Heart
          className={cn("h-4 w-4", isFav && "fill-red-500 text-red-500")}
        />
      }
    >
      {isFav ? t("removeFromFavorites") : t("addToFavorites")}
    </Button>
  );
}
