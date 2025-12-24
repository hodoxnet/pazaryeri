import type { Product, ProductListParams } from "@/types/product";
import type { PaginatedResponse } from "@/types/api";
import productsData from "@/mock/products.json";

export async function getProducts(
  params?: ProductListParams
): Promise<PaginatedResponse<Product>> {
  // Using mock data for development
  const { products } = productsData;

  let filtered = [...products] as Product[];

  // Apply filters
  if (params?.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
    );
  }

  if (params?.categoryId) {
    filtered = filtered.filter((p) => p.parentCategoryId === params.categoryId);
  }

  // Apply sorting
  if (params?.sortBy !== undefined) {
    switch (params.sortBy) {
      case 0: // Newest
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 1: // Oldest
        filtered.sort((a, b) => a.id - b.id);
        break;
      case 2: // Price Asc
        filtered.sort((a, b) => a.variants[0].price - b.variants[0].price);
        break;
      case 3: // Price Desc
        filtered.sort((a, b) => b.variants[0].price - a.variants[0].price);
        break;
    }
  }

  // Apply pagination
  const page = params?.page || 1;
  const limit = params?.limit || 12;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = filtered.slice(start, end);

  return {
    data: paginated,
    pagination: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
      hasMore: end < filtered.length,
    },
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { products } = productsData;
  const product = products.find((p) => p.slug === slug);
  return (product as Product) || null;
}

export async function getProductById(id: number): Promise<Product | null> {
  const { products } = productsData;
  const product = products.find((p) => p.id === id);
  return (product as Product) || null;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const { products } = productsData;
  return products.slice(0, limit) as Product[];
}

export async function getRelatedProducts(
  productId: number,
  categoryId: number,
  limit = 4
): Promise<Product[]> {
  const { products } = productsData;
  return products
    .filter((p) => p.id !== productId && p.parentCategoryId === categoryId)
    .slice(0, limit) as Product[];
}
