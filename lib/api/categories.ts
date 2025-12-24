import type { Category } from "@/types/product";
import categoriesData from "@/mock/categories.json";

export async function getCategories(): Promise<Category[]> {
  return categoriesData.categories as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { categories } = categoriesData;

  // Search in main categories
  const mainCategory = categories.find((c) => c.slug === slug);
  if (mainCategory) return mainCategory as Category;

  // Search in children
  for (const category of categories) {
    if (category.children) {
      const child = category.children.find((c) => c.slug === slug);
      if (child) return child as Category;
    }
  }

  return null;
}

export async function getCategoryById(id: number): Promise<Category | null> {
  const { categories } = categoriesData;

  const mainCategory = categories.find((c) => c.id === id);
  if (mainCategory) return mainCategory as Category;

  for (const category of categories) {
    if (category.children) {
      const child = category.children.find((c) => c.id === id);
      if (child) return child as Category;
    }
  }

  return null;
}

export async function getTopCategories(limit = 10): Promise<Category[]> {
  const { categories } = categoriesData;
  return categories.slice(0, limit) as Category[];
}
