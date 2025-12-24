import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCategories } from "@/lib/api/categories";
import { CategoryCard } from "@/components/molecules/CategoryCard";

interface CategoriesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: CategoriesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    title: t("allCategories"),
    description: "Tüm kategorileri keşfedin",
  };
}

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("common");
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          {t("allCategories")}
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {categories.map((category, index) => (
          <CategoryCard key={category.id} category={category} index={index} />
        ))}
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Tüm Kategoriler",
            description: "Pazaryeri kategorileri",
            mainEntity: {
              "@type": "ItemList",
              itemListElement: categories.map((cat, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: cat.name,
                url: `/${locale}/categories/${cat.slug}`,
              })),
            },
          }),
        }}
      />
    </div>
  );
}
