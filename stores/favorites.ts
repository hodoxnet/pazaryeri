"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Collection {
  id: string;
  name: string;
  createdAt: string;
}

interface FavoritesState {
  collections: Record<string, Collection>;
  productIdsByCollection: Record<string, Set<string>>;
  allProductIds: Set<string>;

  addToFavorites: (productId: string, collectionId?: string) => void;
  removeFromFavorites: (productId: string, collectionId?: string) => void;
  toggleFavorite: (productId: string, collectionId?: string) => void;
  isFavorite: (productId: string) => boolean;
  createCollection: (name: string) => string;
  deleteCollection: (collectionId: string) => void;
  renameCollection: (collectionId: string, name: string) => void;
  getCollectionProducts: (collectionId: string) => string[];
  getAllFavorites: () => string[];
}

const DEFAULT_COLLECTION_ID = "default";

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      collections: {
        [DEFAULT_COLLECTION_ID]: {
          id: DEFAULT_COLLECTION_ID,
          name: "Favorilerim",
          createdAt: new Date().toISOString(),
        },
      },
      productIdsByCollection: {
        [DEFAULT_COLLECTION_ID]: new Set<string>(),
      },
      allProductIds: new Set<string>(),

      addToFavorites: (productId, collectionId = DEFAULT_COLLECTION_ID) => {
        set((state) => {
          const newProductIds = new Set(state.allProductIds);
          newProductIds.add(productId);

          const collectionProducts = new Set(
            state.productIdsByCollection[collectionId] || []
          );
          collectionProducts.add(productId);

          return {
            allProductIds: newProductIds,
            productIdsByCollection: {
              ...state.productIdsByCollection,
              [collectionId]: collectionProducts,
            },
          };
        });
      },

      removeFromFavorites: (productId, collectionId) => {
        set((state) => {
          if (collectionId) {
            const collectionProducts = new Set(
              state.productIdsByCollection[collectionId] || []
            );
            collectionProducts.delete(productId);

            const isInOtherCollections = Object.entries(
              state.productIdsByCollection
            ).some(
              ([id, products]) =>
                id !== collectionId && products.has(productId)
            );

            const newAllProductIds = new Set(state.allProductIds);
            if (!isInOtherCollections) {
              newAllProductIds.delete(productId);
            }

            return {
              allProductIds: newAllProductIds,
              productIdsByCollection: {
                ...state.productIdsByCollection,
                [collectionId]: collectionProducts,
              },
            };
          }

          const newAllProductIds = new Set(state.allProductIds);
          newAllProductIds.delete(productId);

          const newProductIdsByCollection = { ...state.productIdsByCollection };
          Object.keys(newProductIdsByCollection).forEach((id) => {
            const products = new Set(newProductIdsByCollection[id]);
            products.delete(productId);
            newProductIdsByCollection[id] = products;
          });

          return {
            allProductIds: newAllProductIds,
            productIdsByCollection: newProductIdsByCollection,
          };
        });
      },

      toggleFavorite: (productId, collectionId = DEFAULT_COLLECTION_ID) => {
        const { isFavorite, addToFavorites, removeFromFavorites } = get();
        if (isFavorite(productId)) {
          removeFromFavorites(productId, collectionId);
        } else {
          addToFavorites(productId, collectionId);
        }
      },

      isFavorite: (productId) => {
        return get().allProductIds.has(productId);
      },

      createCollection: (name) => {
        const id = `collection-${Date.now()}`;
        set((state) => ({
          collections: {
            ...state.collections,
            [id]: {
              id,
              name,
              createdAt: new Date().toISOString(),
            },
          },
          productIdsByCollection: {
            ...state.productIdsByCollection,
            [id]: new Set<string>(),
          },
        }));
        return id;
      },

      deleteCollection: (collectionId) => {
        if (collectionId === DEFAULT_COLLECTION_ID) return;

        set((state) => {
          const { [collectionId]: _, ...restCollections } = state.collections;
          const { [collectionId]: removedProducts, ...restProductIds } =
            state.productIdsByCollection;

          const newAllProductIds = new Set<string>();
          Object.values(restProductIds).forEach((products) => {
            products.forEach((id) => newAllProductIds.add(id));
          });

          return {
            collections: restCollections,
            productIdsByCollection: restProductIds,
            allProductIds: newAllProductIds,
          };
        });
      },

      renameCollection: (collectionId, name) => {
        set((state) => ({
          collections: {
            ...state.collections,
            [collectionId]: {
              ...state.collections[collectionId],
              name,
            },
          },
        }));
      },

      getCollectionProducts: (collectionId) => {
        return Array.from(get().productIdsByCollection[collectionId] || []);
      },

      getAllFavorites: () => {
        return Array.from(get().allProductIds);
      },
    }),
    {
      name: "favorites-storage",
      partialize: (state) => ({
        collections: state.collections,
        productIdsByCollection: Object.fromEntries(
          Object.entries(state.productIdsByCollection).map(([k, v]) => [
            k,
            Array.from(v),
          ])
        ),
        allProductIds: Array.from(state.allProductIds),
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as {
          collections: Record<string, Collection>;
          productIdsByCollection: Record<string, string[]>;
          allProductIds: string[];
        };

        return {
          ...currentState,
          collections: persisted?.collections || currentState.collections,
          productIdsByCollection: Object.fromEntries(
            Object.entries(
              persisted?.productIdsByCollection ||
                currentState.productIdsByCollection
            ).map(([k, v]) => [k, new Set(v)])
          ),
          allProductIds: new Set(
            persisted?.allProductIds || currentState.allProductIds
          ),
        };
      },
    }
  )
);
