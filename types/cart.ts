import type { ProductVariant, Product } from "./product";

export interface CartItem {
  variantId: number;
  productId: number;
  quantity: number;
  selected: boolean;
  variant: ProductVariant;
  product: Pick<Product, "id" | "name" | "slug">;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  selectedItems: number;
  selectedPrice: number;
}

export interface AddToCartDto {
  variantId: number;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}
