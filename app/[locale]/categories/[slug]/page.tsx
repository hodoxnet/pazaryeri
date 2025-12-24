import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCategoryBySlug } from "@/lib/api/categories";
import { getProducts } from "@/lib/api/products";
import { ProductGrid } from "@/components/organisms/ProductGrid";

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: category.name,
    description: `${category.name} kategorisindeki ürünleri keşfedin`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("product");
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const { data: products, pagination } = await getProducts({
    categoryId: category.id,
    limit: 12,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">{category.name}</h1>
        <p className="mt-2 text-muted-foreground">
          {t("showingResults", { count: pagination.total })}
        </p>
      </div>

      <ProductGrid products={products} />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: category.name,
            description: `${category.name} kategorisindeki ürünler`,
          }),
        }}
      />
    </div>
  );
}
