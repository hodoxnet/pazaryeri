import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProducts } from "@/lib/api/products";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import type { SortBy } from "@/types/product";

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: string;
    page?: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: t("products"),
    description: "Tüm ürünleri keşfedin",
  };
}

export default async function ProductsPage({
  params,
  searchParams,
}: ProductsPageProps) {
  const { locale } = await params;
  const search = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations("product");

  const { data: products, pagination } = await getProducts({
    search: search.search,
    categoryId: search.category ? parseInt(search.category) : undefined,
    sortBy: search.sort ? (parseInt(search.sort) as SortBy) : undefined,
    page: search.page ? parseInt(search.page) : 1,
    limit: 12,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          {search.search ? `"${search.search}" için sonuçlar` : "Tüm Ürünler"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t("showingResults", { count: pagination.total })}
        </p>
      </div>

      {/* Filters & Sort */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <select
            className="rounded-lg border border-input bg-background px-4 py-2 text-sm"
            defaultValue={search.sort || "0"}
          >
            <option value="0">{t("sortOptions.newest")}</option>
            <option value="2">{t("sortOptions.priceAsc")}</option>
            <option value="3">{t("sortOptions.priceDesc")}</option>
            <option value="4">{t("sortOptions.popular")}</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid products={products} />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (page) => (
              <a
                key={page}
                href={`?page=${page}${search.search ? `&search=${search.search}` : ""}`}
                className={`flex h-10 w-10 items-center justify-center rounded-lg border ${
                  page === pagination.page
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-muted"
                }`}
              >
                {page}
              </a>
            )
          )}
        </div>
      )}

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: products.map((product, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Product",
                name: product.name,
                url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/${locale}/products/${product.slug}`,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
