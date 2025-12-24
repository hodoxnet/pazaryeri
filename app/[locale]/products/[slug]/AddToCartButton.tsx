"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button";
import { QuantitySelector } from "@/components/molecules/QuantitySelector";
import { useCartStore } from "@/stores/cart";
import type { Product, ProductVariant } from "@/types/product";

interface AddToCartButtonProps {
  product: Product;
  variant: ProductVariant;
}

export function AddToCartButton({ product, variant }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, isInCart } = useCartStore();
  const t = useTranslations("product");

  const inCart = isInCart(variant.id);

  const handleAddToCart = () => {
    addItem({
      variantId: variant.id,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      price: variant.price,
      originalPrice: variant.originalPrice,
      quantity,
      imageUrl: variant.thumbnails[0]?.url,
      options: variant.options,
      stock: variant.stock,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <QuantitySelector
        value={quantity}
        onChange={setQuantity}
        max={variant.stock}
      />
      <Button
        onClick={handleAddToCart}
        disabled={variant.stock === 0}
        leftIcon={
          added ? (
            <Check className="h-4 w-4" />
          ) : (
            <ShoppingCart className="h-4 w-4" />
          )
        }
        className="min-w-[160px]"
      >
        {added ? "Eklendi!" : t("addToCart")}
      </Button>
    </div>
  );
}
