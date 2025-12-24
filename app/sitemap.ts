import { MetadataRoute } from "next";
import productsData from "@/mock/products.json";
import categoriesData from "@/mock/categories.json";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["tr", "en"];

  // Static pages
  const staticPages = ["", "/products", "/favorites", "/cart"];
  const staticRoutes = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${BASE_URL}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: page === "" ? 1 : 0.8,
    }))
  );

  // Product pages
  const productRoutes = locales.flatMap((locale) =>
    productsData.products.map((product) => ({
      url: `${BASE_URL}/${locale}/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))
  );

  // Category pages
  const categoryRoutes = locales.flatMap((locale) =>
    categoriesData.categories.map((category) => ({
      url: `${BASE_URL}/${locale}/categories/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  );

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
