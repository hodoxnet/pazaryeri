"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItemData {
  variantId: number;
  productId: number;
  productName: string;
  productSlug: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  selected: boolean;
  imageUrl?: string;
  options?: { title: string; value: string }[];
  stock: number;
}

interface CartState {
  items: Record<number, CartItemData>;

  addItem: (item: Omit<CartItemData, "selected">) => void;
  removeItem: (variantId: number) => void;
  updateQuantity: (variantId: number, quantity: number) => void;
  toggleSelect: (variantId: number) => void;
  selectAll: (selected: boolean) => void;
  clearCart: () => void;

  getItem: (variantId: number) => CartItemData | undefined;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSelectedItems: () => CartItemData[];
  getSelectedPrice: () => number;
  getSelectedCount: () => number;
  isInCart: (variantId: number) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items[item.variantId];
          if (existingItem) {
            const newQuantity = Math.min(
              existingItem.quantity + item.quantity,
              item.stock
            );
            return {
              items: {
                ...state.items,
                [item.variantId]: {
                  ...existingItem,
                  quantity: newQuantity,
                },
              },
            };
          }

          return {
            items: {
              ...state.items,
              [item.variantId]: {
                ...item,
                selected: true,
              },
            },
          };
        });
      },

      removeItem: (variantId) => {
        set((state) => {
          const { [variantId]: _, ...rest } = state.items;
          return { items: rest };
        });
      },

      updateQuantity: (variantId, quantity) => {
        set((state) => {
          const item = state.items[variantId];
          if (!item) return state;

          if (quantity <= 0) {
            const { [variantId]: _, ...rest } = state.items;
            return { items: rest };
          }

          const validQuantity = Math.min(quantity, item.stock);
          return {
            items: {
              ...state.items,
              [variantId]: {
                ...item,
                quantity: validQuantity,
              },
            },
          };
        });
      },

      toggleSelect: (variantId) => {
        set((state) => {
          const item = state.items[variantId];
          if (!item) return state;

          return {
            items: {
              ...state.items,
              [variantId]: {
                ...item,
                selected: !item.selected,
              },
            },
          };
        });
      },

      selectAll: (selected) => {
        set((state) => {
          const updatedItems: Record<number, CartItemData> = {};
          Object.entries(state.items).forEach(([id, item]) => {
            updatedItems[Number(id)] = { ...item, selected };
          });
          return { items: updatedItems };
        });
      },

      clearCart: () => {
        set({ items: {} });
      },

      getItem: (variantId) => {
        return get().items[variantId];
      },

      getTotalItems: () => {
        return Object.values(get().items).reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      },

      getTotalPrice: () => {
        return Object.values(get().items).reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      getSelectedItems: () => {
        return Object.values(get().items).filter((item) => item.selected);
      },

      getSelectedPrice: () => {
        return Object.values(get().items)
          .filter((item) => item.selected)
          .reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getSelectedCount: () => {
        return Object.values(get().items)
          .filter((item) => item.selected)
          .reduce((sum, item) => sum + item.quantity, 0);
      },

      isInCart: (variantId) => {
        return variantId in get().items;
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
